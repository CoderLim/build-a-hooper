import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { getAuth } from '@/core/auth';
import { issueRunChallenge } from '@/lib/hooper-game/run-challenge';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 1000,
    keyPrefix: 'hooper-run-challenge',
  });
  if (limited) return limited;

  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const challenge = await issueRunChallenge(
      session.user.id,
      envConfigs.auth_secret
    );
    return respData(challenge);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return respErr(message);
  }
}

export const Route = createFileRoute('/api/hooper/runs/challenge')({
  server: {
    handlers: { POST },
  },
});
