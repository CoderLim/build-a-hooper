import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import {
  articleJsonLd,
  breadcrumbListJsonLd,
  faqPageJsonLd,
  jsonLdScript,
} from '@/lib/seo/json-ld';
import { buildPageHead, localizedPageUrl } from '@/lib/seo/metadata';
import { getLocale } from '@/paraglide/runtime.js';
import {
  BUILD_A_BUCKET_FAQ,
  BuildABucketNbaGameGuide,
} from '@/blocks/build-a-bucket-nba-game-guide';
import { BuildABucketEmbed } from '@/blocks/build-a-bucket-embed';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';

const PATH = '/build-a-bucket-nba-game';
const TITLE = 'Build a Bucket NBA Game: Guide, Modes & How It Works';
const DESCRIPTION =
  'Build a Bucket NBA Game is a browser basketball player builder. Learn the official game loop, Guard and Big paths, skills, modes, and season simulation.';
const UPDATED_AT = '2026-08-13';

export const Route = createFileRoute('/build-a-bucket-nba-game')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en';
    const canonical = localizedPageUrl(PATH, 'en');
    const siteUrl =
      (envConfigs.app_url || '').replace(/\/$/, '') ||
      'https://buildahooper.org';
    const head = buildPageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      locale,
      canonicalLocale: 'en',
      alternateLocales: ['en'],
      indexable: locale === 'en',
      type: 'article',
    });

    if (locale !== 'en') return head;

    return {
      ...head,
      scripts: [
        jsonLdScript([
          articleJsonLd({
            headline: TITLE,
            description: DESCRIPTION,
            url: canonical,
            dateModified: UPDATED_AT,
            locale: 'en',
          }),
          breadcrumbListJsonLd([
            { name: 'Home', url: `${siteUrl}/` },
            { name: 'Build a Bucket NBA Game', url: canonical },
          ]),
          faqPageJsonLd({
            items: BUILD_A_BUCKET_FAQ,
            url: `${canonical}#faq`,
            locale: 'en',
          }),
        ]),
      ],
    };
  },
  component: BuildABucketNbaGamePage,
});

function BuildABucketNbaGamePage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header overlay />
      <main>
        <BuildABucketEmbed />
        <BuildABucketNbaGameGuide />
      </main>
      <Footer />
    </div>
  );
}
