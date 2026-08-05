import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import {
  faqPageJsonLd,
  jsonLdScript,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from '@/lib/seo/json-ld';
import { buildOpenGraphMeta } from '@/lib/seo/open-graph';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { Blog } from '@/blocks/blog';
import { Disclaimer } from '@/blocks/disclaimer';
import { FAQ } from '@/blocks/faq';
import { Features } from '@/blocks/features';
import { Footer } from '@/blocks/footer';
import { Guide } from '@/blocks/guide';
import { Header } from '@/blocks/header';
import { Hero } from '@/blocks/hero';
import { HowItWorks } from '@/blocks/how-it-works';
import { PlayIntro } from '@/blocks/play-intro';
import { Screenshots } from '@/blocks/screenshots';
import { VideoGuide } from '@/blocks/video-guide';
import { getBlogPostsFn } from '@/content/posts/server';

const FAQ_KEYS = [
  'what',
  'attributes',
  'beginners',
  'season',
  'official',
] as const;

function HomePage() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header overlay />
      <main>
        <Hero />
        <PlayIntro />
        <Features />
        <Screenshots />
        <HowItWorks />
        <Guide />
        <FAQ />
        <Blog posts={posts} />
        <Disclaimer />
        <VideoGuide />
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute('/')({
  loader: async () => {
    const locale = getLocale();
    const posts = await getBlogPostsFn({ data: { locale, limit: 3 } });
    return { locale, posts };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en';
    const urlFor = (loc: string) =>
      localizeUrl(`${envConfigs.app_url}/`, { locale: loc as any }).href;
    const title =
      locale === 'en'
        ? 'Build a Hooper - Play Online & Master the Season'
        : m['landing.meta.title']({}, { locale: locale as any });
    const description = m['landing.meta.description'](
      {},
      { locale: locale as any }
    );
    const canonical = urlFor(locale);

    const faqItems = FAQ_KEYS.map((key) => ({
      question: m[`landing.faq.${key}.question`]({}, { locale: locale as any }),
      answer: m[`landing.faq.${key}.answer`]({}, { locale: locale as any }),
    }));

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        ...buildOpenGraphMeta({
          title,
          description,
          url: canonical,
          locale,
        }),
      ],
      links: [
        { rel: 'canonical', href: canonical },
        ...locales.map((loc) => ({
          rel: 'alternate',
          hrefLang: loc,
          href: urlFor(loc),
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: urlFor('en') },
      ],
      scripts: [
        jsonLdScript([
          organizationJsonLd(locale),
          websiteJsonLd(locale),
          softwareApplicationJsonLd({
            name: envConfigs.app_name || 'Build a Hooper',
            description,
            url: canonical,
            locale,
          }),
          faqPageJsonLd({
            items: faqItems,
            url: `${canonical}#faq`,
            locale,
          }),
        ]),
      ],
    };
  },
  component: HomePage,
});
