import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { httpUrlSchema, idSchema, textSchema } from '../lib/validation.js';

// What visitors may see: no `published` flag, no timestamps.
// Partners have no slug: there is no page per partner, only a list.
const publicFields = {
  id: true,
  name: true,
  description: true,
  advantage: true,
  logoUrl: true,
  websiteUrl: true,
} as const;

// ---------- Public route (no auth, published partners only) ----------

export const publicPartnersRouter = Router();

publicPartnersRouter.get('/', async (_req, res) => {
  const partners = await prisma.partner.findMany({
    where: { published: true },
    orderBy: { name: 'asc' },
    select: publicFields,
  });
  res.json(partners);
});

// ---------- Admin routes (mounted behind requireAuth in app.ts) ----------

export const adminPartnersRouter = Router();

const partnerFields = z.object({
  name: textSchema(100),
  description: textSchema(5000),
  advantage: textSchema(500).nullish(), // the student perk
  logoUrl: httpUrlSchema.nullish(),
  websiteUrl: httpUrlSchema.nullish(),
  published: z.boolean().optional(), // the database default is false
});
const createPartnerSchema = partnerFields.strict();
const updatePartnerSchema = partnerFields.partial().strict();

adminPartnersRouter.get('/', async (_req, res) => {
  res.json(await prisma.partner.findMany({ orderBy: { name: 'asc' } }));
});

adminPartnersRouter.post('/', async (req, res) => {
  const data = createPartnerSchema.parse(req.body);
  res.status(201).json(await prisma.partner.create({ data }));
});

adminPartnersRouter.patch('/:id', async (req, res) => {
  const id = idSchema.parse(req.params.id);
  const data = updatePartnerSchema.parse(req.body);
  res.json(await prisma.partner.update({ where: { id }, data }));
});

adminPartnersRouter.delete('/:id', async (req, res) => {
  await prisma.partner.delete({ where: { id: idSchema.parse(req.params.id) } });
  res.status(204).end();
});
