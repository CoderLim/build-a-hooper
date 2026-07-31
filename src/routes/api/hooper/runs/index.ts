import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { getAuth } from '@/core/auth';
import { getUserRuns, submitRun } from '@/modules/hooper/service';
import type { SubmitRunInput } from '@/modules/hooper/types';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

const seasonStatsSchema = z.object({
  wins: z.number().int().min(0).max(82),
  losses: z.number().int().min(0).max(82),
  ppg: z.number().int().min(0).max(100),
  apg: z.number().int().min(0).max(50),
  rpg: z.number().int().min(0).max(50),
  awards: z.array(z.string().max(64)).max(20),
  playoffResult: z.string().max(64),
  champion: z.boolean(),
  fmvp: z.boolean(),
  playoffPath: z.array(z.string().max(64)).max(16).optional(),
  tripleDoubles: z.number().int().min(0).max(82).default(0),
  madeThroughPlayIn: z.boolean().default(false),
  finalsComeback: z.boolean().default(false),
});

const buildSlotSchema = z.object({
  attribute: z.string().max(64),
  locked: z.boolean(),
  grade: z.string().max(8).optional(),
  overall: z.number().min(0).max(99).optional(),
  playerName: z.string().max(128).optional(),
  round: z.number().int().min(0).max(20).optional(),
  isRookie: z.boolean().optional(),
});

const submitRunSchema = z.object({
  mode: z.enum(['classic', 'blind', 'chaos']),
  position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']).nullable(),
  careerTeam: z
    .object({
      abbr: z.string().max(8),
      name: z.string().max(64),
    })
    .nullable(),
  overall: z.number().int().min(0).max(99),
  buildSlots: z.array(buildSlotSchema).max(20),
  seasonStats: seasonStatsSchema,
  rookieCount: z.number().int().min(0).max(13).default(0),
});

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get('pageSize') ?? '10') || 10)
    );

    const result = await getUserRuns(session.user.id, page, pageSize);
    return respData(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return respErr(message);
  }
}

async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 3000,
    keyPrefix: 'hooper-runs',
  });
  if (limited) return limited;

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
    // Soft integrity: regular-season games must not exceed 82.
    const { wins, losses } = input.seasonStats;
    if (wins + losses > 82) {
      return respErr('Invalid season record');
    }

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
