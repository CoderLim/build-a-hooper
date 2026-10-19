import { createFileRoute } from '@tanstack/react-router';

import { publicLocales } from '@/config/locale';
import { lockedAchievementCatalog } from '@/lib/hooper/achievements';
import { buildPageHead } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { AdSlotInContent, AdSlotTop } from '@/blocks/ad-slot';
import { Header } from '@/blocks/header';
import { AchievementsPage } from '@/components/hooper-achievements/achievements-page';

function AchievementsRoutePage() {
  const { initialData } = Route.useLoaderData();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <AdSlotTop />
      <AchievementsPage initialData={initialData} />
      <AdSlotInContent />
    </div>
  );
}

export const Route = createFileRoute('/achievements')({
  loader: () => {
    const locale = getLocale();
    const title = m['achievements.meta.title']({}, { locale });
    const description = m['achievements.meta.description']({}, { locale });

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
          alternateLocales: publicLocales,
        })
      : {},
  component: AchievementsRoutePage,
});
