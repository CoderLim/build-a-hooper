import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { getLeaderboard } from '@/modules/hooper/service';
import type { LeaderboardSortBy } from '@/modules/hooper/types';
import { respData, respErr } from '@/lib/resp';

const SORT_VALUES: LeaderboardSortBy[] = [
  'points',
  'championships',
  'winRate',
  'bestOverall',
  'runs',
  'awards',
];

async function GET({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const sortParam = url.searchParams.get('sortBy') ?? 'points';
    const sortBy = SORT_VALUES.includes(sortParam as LeaderboardSortBy)
      ? (sortParam as LeaderboardSortBy)
      : 'points';
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '50');
    const search = url.searchParams.get('search') ?? undefined;

    const result = await getLeaderboard({ sortBy, page, pageSize, search });
    return respData(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return respErr(message);
  }
}

export const Route = createFileRoute('/api/hooper/leaderboard')({
  server: {
    handlers: { GET },
  },
});
