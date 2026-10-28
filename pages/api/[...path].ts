import type { NextApiRequest, NextApiResponse } from 'next';
import express from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

const app = express();
app.use(express.json({ limit: '1mb' }));
const registrationSchema = z.object({
  type: z.enum(['Individual', 'Group', 'Coach', 'Multiplayer']),
  activity: z.string().min(1).max(100),
  payload: z.record(z.unknown())
});
app.get('/registrations', async (_req, res) => {
  try {
    const items = await prisma.registration.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    res.json({ registrations: items });
  } catch {
    res.status(503).json({ error: 'Database is not configured. Add DATABASE_URL and run npm run db:push.' });
  }
});
app.post('/registrations', async (req, res) => {
  const parsed = registrationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Please check the registration details.', details: parsed.error.flatten() });
  try {
    const registration = await prisma.registration.create({ data: { type: parsed.data.type, activity: parsed.data.activity, payload: parsed.data.payload as any } });
    return res.status(201).json({ message: 'Registration received successfully.', registrationId: registration.id });
  } catch {
    return res.status(503).json({ error: 'Registration could not be saved. Configure DATABASE_URL and run npm run db:push.' });
  }
});
app.all('*', (_req, res) => res.status(404).json({ error: 'API route not found.' }));
export const config = { api: { bodyParser: false } };
export default function handler(req: NextApiRequest, res: NextApiResponse) { return app(req, res); }
