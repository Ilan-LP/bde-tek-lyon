import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { uniqueSlug } from '../lib/slug.js';
import { httpUrlSchema, idSchema, isoDateSchema, textSchema } from '../lib/validation.js';

// What visitors may see: no `published` flag, no timestamps.
const publicFields = {
  id: true,
  title: true,
  slug: true,
  description: true,
  startsAt: true,
  endsAt: true,
  location: true,
  imageUrl: true,
  registrationUrl: true,
} as const;

// ---------- Public routes (no auth, published events only) ----------

export const publicEventsRouter = Router();

const listQuerySchema = z.object({
  past: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

// An event is over once its end (or its start, when it has no end) is behind us.
publicEventsRouter.get('/', async (req, res) => {
  const { past } = listQuerySchema.parse(req.query);
  const now = new Date();
  const isOver = [{ endsAt: { lt: now } }, { endsAt: null, startsAt: { lt: now } }];
  const isNotOver = [{ endsAt: { gte: now } }, { endsAt: null, startsAt: { gte: now } }];

  const events = await prisma.event.findMany({
    where: { published: true, OR: past ? isOver : isNotOver },
    orderBy: { startsAt: past ? 'desc' : 'asc' }, // upcoming: soonest first, past: latest first
    select: publicFields,
  });
  res.json(events);
});

publicEventsRouter.get('/:slug', async (req, res) => {
  const event = await prisma.event.findFirst({
    where: { slug: req.params.slug, published: true },
    select: publicFields,
  });
  if (!event) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  res.json(event);
});

// ---------- Admin routes (mounted behind requireAuth in app.ts) ----------

export const adminEventsRouter = Router();

const eventFields = z.object({
  title: textSchema(200),
  description: textSchema(5000),
  startsAt: isoDateSchema,
  endsAt: isoDateSchema.nullish(),
  location: textSchema(200),
  imageUrl: httpUrlSchema.nullish(),
  registrationUrl: httpUrlSchema.nullish(),
  published: z.boolean().optional(), // the database default is false
});
// strict(): an unknown field (typo) is an error instead of being silently ignored.
const createEventSchema = eventFields.strict();
const updateEventSchema = eventFields.partial().strict();

// An event cannot end before it starts. Throwing a ZodError gives the usual 400 answer.
function assertDatesOrdered(startsAt: Date, endsAt: Date | null | undefined) {
  if (endsAt && endsAt < startsAt) {
    throw new z.ZodError([
      { code: 'custom', path: ['endsAt'], message: 'must not be before startsAt', input: endsAt },
    ]);
  }
}

adminEventsRouter.get('/', async (_req, res) => {
  res.json(await prisma.event.findMany({ orderBy: { startsAt: 'desc' } }));
});

adminEventsRouter.post('/', async (req, res) => {
  const data = createEventSchema.parse(req.body);
  assertDatesOrdered(data.startsAt, data.endsAt);

  const slug = await uniqueSlug(
    data.title,
    async (candidate) => (await prisma.event.count({ where: { slug: candidate } })) > 0,
  );
  res.status(201).json(await prisma.event.create({ data: { ...data, slug } }));
});

// The slug is not touched on update: public links keep working when the title changes.
adminEventsRouter.patch('/:id', async (req, res) => {
  const id = idSchema.parse(req.params.id);
  const data = updateEventSchema.parse(req.body);

  const current = await prisma.event.findUniqueOrThrow({ where: { id } });
  assertDatesOrdered(
    data.startsAt ?? current.startsAt,
    data.endsAt === undefined ? current.endsAt : data.endsAt,
  );

  res.json(await prisma.event.update({ where: { id }, data }));
});

adminEventsRouter.delete('/:id', async (req, res) => {
  await prisma.event.delete({ where: { id: idSchema.parse(req.params.id) } });
  res.status(204).end();
});
