import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import {
  breadcrumbListJsonLd,
  faqPageJsonLd,
  jsonLdScript,
  softwareApplicationJsonLd,
} from '@/lib/seo/json-ld';
import { buildPageHead, localizedPageUrl } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales } from '@/paraglide/runtime.js';
import { CreateAHooperGuide } from '@/blocks/create-a-hooper-guide';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { Hero } from '@/blocks/hero';

const PATH = '/create-a-hooper';

const EN_FAQ = [
  {
    question: 'Is Create a Hooper a different game from Build a Hooper?',
    answer:
      'No. Create a Hooper is search and creator language for the same browser basketball builder. Build a Hooper is the common product name; create a player describes the thirteen-round draft action.',
  },
  {
    question: 'How do I Build your Hooper for a higher overall?',
    answer:
      'When you Create a Hooper for overall, prioritize position-critical attributes early, save flexible skills for later, and use rerolls when the current roster does not solve a real hole. Guides stress role fit over chasing the highest number on the board.',
  },
  {
    question: 'Is Create a Hooper free, and is it official NBA content?',
    answer:
      'Yes — Create a Hooper play on this page is free in the browser. It is an unofficial fan simulator experience and is not affiliated with the NBA or official team branding.',
  },
] as const;

export const Route = createFileRoute('/create-a-hooper')({
  loader: () => {
    const locale = getLocale();
    const title =
      locale === 'en'
        ? 'Create a Hooper Online — Free Basketball Player Builder'
        : m['create_a_hooper.meta.title']({}, { locale });
    const description =
      locale === 'en'
        ? 'Create a Hooper in your browser with the same Build a Hooper draft loop: spin team seasons, create a player across 13 attributes, Build your Hooper with role fit, and simulate an 82-game season.'
        : m['create_a_hooper.meta.description']({}, { locale });

    return { locale, title, description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};

    const { locale, title, description } = loaderData;
    const canonical = localizedPageUrl(PATH, locale);
    const siteUrl =
      (envConfigs.app_url || '').replace(/\/$/, '') ||
      'https://buildahooper.org';
    const faqItems =
      locale === 'en'
        ? [...EN_FAQ]
        : [
            {
              question: m['create_a_hooper.faq1_q']({}, { locale }),
              answer: m['create_a_hooper.faq1_a']({}, { locale }),
            },
            {
              question: m['create_a_hooper.faq2_q']({}, { locale }),
              answer: m['create_a_hooper.faq2_a']({}, { locale }),
            },
            {
              question: m['create_a_hooper.faq3_q']({}, { locale }),
              answer: m['create_a_hooper.faq3_a']({}, { locale }),
            },
          ];

    const head = buildPageHead({
      title,
      description,
      path: PATH,
      locale,
      alternateLocales: locales,
    });

    return {
      ...head,
      scripts: [
        ...(head.scripts ?? []),
        jsonLdScript([
          breadcrumbListJsonLd([
            { name: 'Home', url: `${siteUrl}/` },
            { name: title, url: canonical },
          ]),
          softwareApplicationJsonLd({
            name: 'Create a Hooper',
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
  component: CreateAHooperPage,
});

function CreateAHooperPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header overlay />
      <main>
        <Hero />
        <CreateAHooperGuide />
      </main>
      <Footer />
    </div>
  );
}
