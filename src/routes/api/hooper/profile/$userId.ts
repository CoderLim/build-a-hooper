import { createFileRoute } from '@tanstack/react-router';

import { getPublicProfile } from '@/modules/hooper/service';
import { respData, respErr } from '@/lib/resp';

async function GET({
  request,
  params,
}: {
  request: Request;
  params: { userId: string };
}) {
  try {
    const profile = await getPublicProfile(params.userId);
    if (!profile) return respErr('Profile not found', { status: 404 });
    return respData(profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return respErr(message);
  }
}

export const Route = createFileRoute('/api/hooper/profile/$userId')({
  server: {
    handlers: { GET },
  },
});
