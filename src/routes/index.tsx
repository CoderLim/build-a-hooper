import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
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
import { Screenshots } from '@/blocks/screenshots';
import { getBlogPostsFn } from '@/content/posts/server';

function HomePage() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header overlay />
      <main>
        <Hero />
        <Features />
        <Screenshots />
        <HowItWorks />
        <Guide />
        <FAQ />
        <Blog posts={posts} />
        <Disclaimer />
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
    const title = m['landing.meta.title']({}, { locale: locale as any });
    const description = m['landing.meta.description'](
      {},
      { locale: locale as any }
    );
    const canonical = urlFor(locale);

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
    };
  },
  component: HomePage,
});
