import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

const registrationSchema = z.object({
  type: z.enum(['Individual', 'Group', 'Coach', 'Multiplayer']),
  activity: z.string().trim().min(1, 'Please select an activity.').max(200),
  payload: z.record(z.unknown()),
});

type ApiResponse = { message?: string; registrationId?: string; registrations?: unknown[]; error?: string; details?: unknown };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const registrations = await prisma.registration.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return res.status(200).json({ registrations });
    } catch (error) {
      console.error('GET /api/registrations failed:', error);
      return res.status(503).json({ error: 'Database is unavailable. Check DATABASE_URL and run npm run db:push.' });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST to submit a registration.' });
  }

  const parsed = registrationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Please check the registration details and selected activity.',
      details: parsed.error.flatten(),
    });
  }

  try {
    const registration = await prisma.registration.create({
      data: {
        type: parsed.data.type,
        activity: parsed.data.activity,
        payload: parsed.data.payload as any,
      },
    });
    return res.status(201).json({
      message: 'Registration received successfully.',
      registrationId: registration.id,
    });
  } catch (error) {
    console.error('POST /api/registrations failed:', error);
    return res.status(503).json({
      error: 'The API was reached, but the registration could not be saved. Check DATABASE_URL, database access, and run npm run db:generate followed by npm run db:push.',
    });
  }
}
