import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import type { LeaderboardResult } from '@/modules/hooper/types';
import { buildPageHead } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales } from '@/paraglide/runtime.js';
import { LeaderboardPage } from '@/components/hooper-leaderboard/leaderboard-page';

const EMPTY_LEADERBOARD: LeaderboardResult = {
  stats: {
    totalPlayers: 0,
    totalPoints: 0,
    totalChampionships: 0,
  },
  items: [],
  total: 0,
  page: 1,
  pageSize: 50,
};

const getLeaderboardSnapshotFn = createServerFn().handler(
  async (): Promise<LeaderboardResult> => {
    try {
      const { getLeaderboard } = await import('@/modules/hooper/service');
      return await getLeaderboard({
        sortBy: 'points',
        page: 1,
        pageSize: 50,
      });
    } catch {
      return EMPTY_LEADERBOARD;
    }
  }
);

function LeaderboardRoutePage() {
  const { initialData } = Route.useLoaderData();
  return <LeaderboardPage initialData={initialData} />;
}

export const Route = createFileRoute('/leaderboard')({
  loader: async () => {
    const locale = getLocale();
    return {
      locale,
      title: m['leaderboard.meta.title']({}, { locale }),
      description: m['leaderboard.meta.description']({}, { locale }),
      initialData: await getLeaderboardSnapshotFn(),
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildPageHead({
          title: loaderData.title,
          description: loaderData.description,
          path: '/leaderboard',
          locale: loaderData.locale,
          alternateLocales: locales,
          indexable: loaderData.initialData.total > 0,
        })
      : {},
  component: LeaderboardRoutePage,
});
