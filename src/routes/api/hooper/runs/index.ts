import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { getAuth } from '@/core/auth';
import { getMyLegacy, getUserRuns, submitRun } from '@/modules/hooper/service';
import type { SubmitRunInput } from '@/modules/hooper/types';
import { respData, respErr } from '@/lib/resp';

const seasonStatsSchema = z.object({
  wins: z.number().int(),
  losses: z.number().int(),
  ppg: z.number().int(),
  apg: z.number().int(),
  rpg: z.number().int(),
  awards: z.array(z.string()),
  playoffResult: z.string(),
  champion: z.boolean(),
  fmvp: z.boolean(),
  playoffPath: z.array(z.string()).optional(),
  tripleDoubles: z.number().int().min(0).default(0),
  madeThroughPlayIn: z.boolean().default(false),
  finalsComeback: z.boolean().default(false),
});

const buildSlotSchema = z.object({
  attribute: z.string(),
  locked: z.boolean(),
  grade: z.string().optional(),
  overall: z.number().optional(),
  playerName: z.string().optional(),
  round: z.number().optional(),
  isRookie: z.boolean().optional(),
});

const submitRunSchema = z.object({
  mode: z.enum(['classic', 'blind', 'chaos']),
  position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']).nullable(),
  careerTeam: z
    .object({
      abbr: z.string(),
      name: z.string(),
    })
    .nullable(),
  overall: z.number().int().min(0).max(99),
  buildSlots: z.array(buildSlotSchema),
  seasonStats: seasonStatsSchema,
  rookieCount: z.number().int().min(0).default(0),
});

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10');

    const result = await getUserRuns(session.user.id, page, pageSize);
    return respData(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return respErr(message);
  }
}

async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const body = await request.json();
    const parsed = submitRunSchema.safeParse(body);
    if (!parsed.success) {
      return respErr(parsed.error.issues[0]?.message ?? 'Invalid payload');
    }

    const input = parsed.data as SubmitRunInput;
    const run = await submitRun(
      session.user.id,
      session.user.name || 'Hooper',
      input
    );
    return respData(run);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return respErr(message);
  }
}

export const Route = createFileRoute('/api/hooper/runs/')({
  server: {
    handlers: { GET, POST },
  },
});
