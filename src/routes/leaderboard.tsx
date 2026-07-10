import { createFileRoute } from '@tanstack/react-router';

import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { LeaderboardPage } from '@/components/hooper-leaderboard/leaderboard-page';

function LeaderboardRoutePage() {
  return <LeaderboardPage />;
}

export const Route = createFileRoute('/leaderboard')({
  loader: () => {
    const locale = getLocale();
    return {
      title: m['leaderboard.meta.title']({}, { locale }),
      description: m['leaderboard.meta.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.title },
          { name: 'description', content: loaderData.description },
        ]
      : [],
  }),
  component: LeaderboardRoutePage,
});
