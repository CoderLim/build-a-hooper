import { createFileRoute } from '@tanstack/react-router';

import { lockedAchievementCatalog } from '@/lib/hooper/achievements';
import { buildPageHead } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales } from '@/paraglide/runtime.js';
import { Header } from '@/blocks/header';
import { AchievementsPage } from '@/components/hooper-achievements/achievements-page';

function AchievementsRoutePage() {
  const { initialData } = Route.useLoaderData();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <AchievementsPage initialData={initialData} />
    </div>
  );
}

export const Route = createFileRoute('/achievements')({
  loader: () => {
    const locale = getLocale();
    const title =
      locale === 'en'
        ? 'Build a Hooper Achievements: Complete Unlock Guide'
        : m['achievements.meta.title']({}, { locale });
    const description =
      locale === 'en'
        ? 'Use this Build a Hooper Achievements guide to understand categories, rarity, points, unlock tracking, and efficient paths to every milestone.'
        : m['achievements.meta.description']({}, { locale });

    return {
      locale,
      title,
      description,
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
