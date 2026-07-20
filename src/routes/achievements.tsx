import { createFileRoute } from '@tanstack/react-router';

import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { AchievementsPage } from '@/components/hooper-achievements/achievements-page';

function AchievementsRoutePage() {
  return <AchievementsPage />;
}

export const Route = createFileRoute('/achievements')({
  loader: () => {
    const locale = getLocale();
    return {
      title: m['achievements.meta.title']({}, { locale }),
      description: m['achievements.meta.description']({}, { locale }),
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
  component: AchievementsRoutePage,
});
