import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import type { LeaderboardResult } from '@/modules/hooper/types';
import { buildPageHead } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales } from '@/paraglide/runtime.js';
import { Header } from '@/blocks/header';
import { LeaderboardGuide } from '@/blocks/leaderboard-guide';
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
  const { initialData, locale } = Route.useLoaderData();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <LeaderboardPage initialData={initialData} />
      <div className="bg-neutral-950 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <LeaderboardGuide locale={locale} />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/leaderboard')({
  loader: async () => {
    const locale = getLocale();
    const title =
      locale === 'en'
        ? 'Build a Hooper Leaderboard: Rankings & Points'
        : m['leaderboard.meta.title']({}, { locale });
    const description =
      locale === 'en'
        ? 'Explore the Build a Hooper Leaderboard and learn how legacy points, championships, win rate, awards, runs, and overall ratings shape every ranking.'
        : m['leaderboard.meta.description']({}, { locale });

    return {
      locale,
      title,
      description,
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
        })
      : {},
  component: LeaderboardRoutePage,
});
