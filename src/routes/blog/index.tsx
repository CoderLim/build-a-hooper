import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import {
  breadcrumbListJsonLd,
  jsonLdScript,
  organizationJsonLd,
} from '@/lib/seo/json-ld';
import { buildPageHead, localizedPageUrl } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { baseLocale, getLocale, locales } from '@/paraglide/runtime.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { BlogCard } from '@/components/blog-card';
import { formatPostDate } from '@/content/posts';
import { getBlogPostsFn } from '@/content/posts/server';

export const Route = createFileRoute('/blog/')({
  loader: async () => {
    const locale = getLocale();
    const posts = await getBlogPostsFn({ data: { locale } });
    return { locale, posts };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? baseLocale;
    const title = `${m['blog.title']({}, { locale: locale as any })} | ${envConfigs.app_name}`;
    const description = m['blog.description']({}, { locale: locale as any });
    const head = buildPageHead({
      title,
      description,
      path: '/blog',
      locale,
      canonicalLocale: locale,
      alternateLocales: [...locales],
      indexable: true,
    });
    return {
      ...head,
      scripts: [
        jsonLdScript([
          organizationJsonLd(locale),
          breadcrumbListJsonLd([
            {
              name: envConfigs.app_name || 'Build a Hooper',
              url: localizedPageUrl('/', locale),
            },
            {
              name: m['blog.title']({}, { locale: locale as any }),
              url: localizedPageUrl('/blog', locale),
            },
          ]),
        ]),
      ],
    };
  },
  component: BlogPage,
});

function BlogPage() {
  const { locale, posts } = Route.useLoaderData();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h1 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl">
              {m['blog.title']()}
            </h1>
            <p className="text-muted-foreground mx-auto mt-5 max-w-lg">
              {m['blog.description']()}
            </p>
          </div>
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center">
              {m['blog.no_posts']()}
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  description={post.description}
                  image={post.image}
                  date={formatPostDate(post.createdAt, locale)}
                  authorName={post.authorName}
                  authorImage={post.authorImage}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
