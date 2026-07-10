import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { getMyLegacy } from '@/modules/hooper/service';
import { respData, respErr } from '@/lib/resp';

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const legacy = await getMyLegacy(session.user.id);
    return respData(legacy);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return respErr(message);
  }
}

export const Route = createFileRoute('/api/hooper/legacy/me')({
  server: {
    handlers: { GET },
  },
});
