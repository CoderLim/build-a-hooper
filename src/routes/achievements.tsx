import { createFileRoute } from '@tanstack/react-router';

import { lockedAchievementCatalog } from '@/lib/hooper/achievements';
import { buildPageHead } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales } from '@/paraglide/runtime.js';
import { AchievementsPage } from '@/components/hooper-achievements/achievements-page';

function AchievementsRoutePage() {
  const { initialData } = Route.useLoaderData();
  return <AchievementsPage initialData={initialData} />;
}

export const Route = createFileRoute('/achievements')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['achievements.meta.title']({}, { locale }),
      description: m['achievements.meta.description']({}, { locale }),
      initialData: lockedAchievementCatalog(),
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildPageHead({
          title: loaderData.title,
          description: loaderData.description,
          path: '/achievements',
          locale: loaderData.locale,
          alternateLocales: locales,
        })
      : {},
  component: AchievementsRoutePage,
});
