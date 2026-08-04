import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { getAuth } from '@/core/auth';
import { HOOPER_ENGINE_VERSION } from '@/lib/hooper-game/run-random';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';
import { getUserRuns, submitRun } from '@/modules/hooper/service';
import type { SubmitRunInput } from '@/modules/hooper/types';

const attributeSchema = z.enum([
  '3PT',
  'MID',
  'FIN',
  'DNK',
  'HAN',
  'PAS',
  'PDEF',
  'IDEF',
  'BLK',
  'REB',
  'ATH',
  'STR',
  'CLU',
]);

const gradeSchema = z.enum([
  'A+',
  'A',
  'A-',
  'B+',
  'B',
  'B-',
  'C+',
  'C',
  'C-',
  'D+',
  'D',
  'D-',
  'F',
]);

const buildSlotSchema = z
  .object({
    attribute: attributeSchema,
    locked: z.literal(true),
    grade: gradeSchema,
    overall: z.number().int().min(0).max(99),
    playerName: z.string().min(1).max(128),
    playerId: z.string().min(1).max(256),
    teamId: z.string().min(1).max(256),
    round: z.number().int().min(1).max(13),
    rollAttempt: z.number().int().min(0).max(3),
    isRookie: z.boolean(),
  })
  .strict();

const submitRunSchema = z
  .object({
    engineVersion: z.literal(HOOPER_ENGINE_VERSION),
    runToken: z.string().min(32).max(4096),
    mode: z.enum(['classic', 'blind', 'chaos']),
    position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']),
    careerTeam: z
      .object({
        abbr: z.string().min(2).max(8),
      })
      .strict(),
    buildSlots: z.array(buildSlotSchema).length(13),
  })
  .strict();

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

    const run = await submitRun(
      session.user.id,
      session.user.name || 'Hooper',
      parsed.data as SubmitRunInput
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
