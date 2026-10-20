import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { uniqueSlug } from '../lib/slug.js';
import { emailSchema, httpUrlSchema, idSchema, textSchema } from '../lib/validation.js';

// What visitors may see: no `published` flag, no timestamps.
const publicFields = {
  id: true,
  name: true,
  slug: true,
  description: true,
  logoUrl: true,
  contactEmail: true,
} as const;

// ---------- Public routes (no auth, published clubs only) ----------

export const publicClubsRouter = Router();

publicClubsRouter.get('/', async (_req, res) => {
  const clubs = await prisma.club.findMany({
    where: { published: true },
    orderBy: { name: 'asc' },
    select: publicFields,
  });
  res.json(clubs);
});

publicClubsRouter.get('/:slug', async (req, res) => {
  const club = await prisma.club.findFirst({
    where: { slug: req.params.slug, published: true },
    select: publicFields,
  });
  if (!club) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  res.json(club);
});

// ---------- Admin routes (mounted behind requireAuth in app.ts) ----------

export const adminClubsRouter = Router();

const clubFields = z.object({
  name: textSchema(100),
  description: textSchema(5000),
  logoUrl: httpUrlSchema.nullish(),
  contactEmail: emailSchema.nullish(),
  published: z.boolean().optional(), // the database default is false
});
const createClubSchema = clubFields.strict();
const updateClubSchema = clubFields.partial().strict();

adminClubsRouter.get('/', async (_req, res) => {
  res.json(await prisma.club.findMany({ orderBy: { name: 'asc' } }));
});

adminClubsRouter.post('/', async (req, res) => {
  const data = createClubSchema.parse(req.body);
  const slug = await uniqueSlug(
    data.name,
    async (candidate) => (await prisma.club.count({ where: { slug: candidate } })) > 0,
  );
  res.status(201).json(await prisma.club.create({ data: { ...data, slug } }));
});

// The slug is not touched on update: public links keep working when the name changes.
adminClubsRouter.patch('/:id', async (req, res) => {
  const id = idSchema.parse(req.params.id);
  const data = updateClubSchema.parse(req.body);
  res.json(await prisma.club.update({ where: { id }, data }));
});

adminClubsRouter.delete('/:id', async (req, res) => {
  await prisma.club.delete({ where: { id: idSchema.parse(req.params.id) } });
  res.status(204).end();
});
