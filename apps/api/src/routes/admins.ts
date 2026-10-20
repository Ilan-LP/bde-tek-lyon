import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { Prisma } from '../generated/prisma/client.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { emailSchema, passwordSchema } from '../lib/validation.js';

// Mounted behind requireAuth in app.ts: every route here needs a logged-in admin.
// Never select `passwordHash` in a response.
export const adminsRouter = Router();

const publicFields = { id: true, email: true, createdAt: true } as const;

// True when PostgreSQL aborted a SERIALIZABLE transaction because of a concurrent one.
// With the pg driver adapter Prisma reports it as a DriverAdapterError whose cause has
// kind 'TransactionWriteConflict'; P2034 is the same error when it comes from the Prisma engine.
function isSerializationConflict(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) return error.code === 'P2034';
  const cause = (error as { cause?: { kind?: string } } | null)?.cause;
  return cause?.kind === 'TransactionWriteConflict';
}

const createAdminSchema = z.object({ email: emailSchema, password: passwordSchema });

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: passwordSchema,
});

adminsRouter.get('/', async (_req, res) => {
  const admins = await prisma.admin.findMany({
    select: publicFields,
    orderBy: { createdAt: 'asc' },
  });
  res.json(admins);
});

adminsRouter.post('/', async (req, res) => {
  const { email, password } = createAdminSchema.parse(req.body);

  try {
    const admin = await prisma.admin.create({
      data: { email, passwordHash: await hashPassword(password) },
      select: publicFields,
    });
    res.status(201).json(admin);
  } catch (error) {
    // P2002 = unique constraint violation (the email already exists).
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(409).json({ error: 'email_taken' });
      return;
    }
    throw error;
  }
});

// Declared before '/:id' routes so that "me" is never read as an id.
adminsRouter.patch('/me/password', async (req, res) => {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

  const admin = await prisma.admin.findUniqueOrThrow({ where: { id: req.admin!.id } });
  if (!(await verifyPassword(admin.passwordHash, currentPassword))) {
    res.status(403).json({ error: 'invalid_current_password' });
    return;
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });
  res.status(204).end();
});

adminsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;

  // Safety rule 1: an admin cannot delete themselves.
  if (id === req.admin!.id) {
    res.status(403).json({ error: 'cannot_delete_self' });
    return;
  }

  // Safety rule 2: the last remaining admin can never be deleted.
  // The count and the delete run in one SERIALIZABLE transaction: if two admins delete each
  // other at the same moment, PostgreSQL aborts one of them instead of letting both succeed
  // (which would leave zero admins).
  try {
    const outcome = await prisma.$transaction(
      async (tx) => {
        if (!(await tx.admin.findUnique({ where: { id } }))) return 'not_found';
        if ((await tx.admin.count()) <= 1) return 'last_admin';
        await tx.admin.delete({ where: { id } });
        return 'deleted';
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    if (outcome === 'not_found') res.status(404).json({ error: 'not_found' });
    else if (outcome === 'last_admin') res.status(409).json({ error: 'last_admin' });
    else res.status(204).end();
  } catch (error) {
    // Lost the race against another delete: the client can retry.
    if (isSerializationConflict(error)) {
      res.status(409).json({ error: 'conflict_retry' });
      return;
    }
    throw error;
  }
});
