import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { getMyAchievements } from '@/modules/hooper/service';
import { respData, respErr } from '@/lib/resp';

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    const result = await getMyAchievements(session?.user?.id ?? null);
    return respData(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return respErr(message);
  }
}

export const Route = createFileRoute('/api/hooper/achievements')({
  server: {
    handlers: { GET },
  },
});
