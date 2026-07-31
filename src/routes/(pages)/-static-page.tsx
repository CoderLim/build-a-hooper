import type { ComponentType } from 'react';
import { notFound, useLoaderData } from '@tanstack/react-router';

import { buildPageHead } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { baseLocale, getLocale, locales } from '@/paraglide/runtime.js';

type PageMeta = {
  title: string;
  description: string;
  heading?: string;
  updated_at: string;
};

type PageModule = {
  default: ComponentType;
  meta: PageMeta;
};

// Eagerly bundle the static content pages (small legal/info MDX files).
// Keys are absolute from the project root.
const pages = import.meta.glob<PageModule>('/src/content/pages/*.mdx', {
  eager: true,
});

type ResolvedPage = {
  page: PageModule;
  resolvedLocale: string;
  isFallback: boolean;
};

function resolvePage(slug: string, locale: string): ResolvedPage | null {
  const localizedPage = pages[`/src/content/pages/${slug}.${locale}.mdx`];
  if (localizedPage) {
    return { page: localizedPage, resolvedLocale: locale, isFallback: false };
  }

  const fallbackPage = pages[`/src/content/pages/${slug}.${baseLocale}.mdx`];
  if (!fallbackPage) return null;

  return {
    page: fallbackPage,
    resolvedLocale: baseLocale,
    isFallback: true,
  };
}

function availablePageLocales(slug: string): string[] {
  return locales.filter(
    (locale) => pages[`/src/content/pages/${slug}.${locale}.mdx`]
  );
}

type LoaderData = {
  meta: PageMeta;
  slug: string;
  locale: string;
  resolvedLocale: string;
  isFallback: boolean;
  availableLocales: string[];
};

// Shared route options for static MDX pages. Each page gets its own
// explicit route file (e.g. privacy-policy.tsx) so static segments
// always outrank dynamic ones — add a new page by creating the MDX
// content plus a thin route file using this factory.
//
// `slug` is the MDX filename stem (e.g. `best-builds-point-guard`).
// `path` is the public URL path when it differs from `/${slug}`
// (e.g. `/best-builds/point-guard`).
export function staticPageRouteOptions(slug: string, path?: string) {
  const pagePath = path ?? `/${slug}`;
  return {
    loader: (): LoaderData => {
      const locale = getLocale();
      const resolved = resolvePage(slug, locale);
      if (!resolved) throw notFound();
      return {
        meta: resolved.page.meta,
        slug,
        locale,
        resolvedLocale: resolved.resolvedLocale,
        isFallback: resolved.isFallback,
        availableLocales: availablePageLocales(slug),
      };
    },
    head: ({ loaderData }: { loaderData?: LoaderData }) => {
      if (!loaderData) return {};
      const { meta, locale, resolvedLocale, isFallback, availableLocales } =
        loaderData;
      return buildPageHead({
        title: meta.title,
        description: meta.description,
        path: pagePath,
        locale,
        canonicalLocale: resolvedLocale,
        alternateLocales: availableLocales,
        indexable: !isFallback,
      });
    },
    component: StaticPage,
  };
}

function StaticPage() {
  const { meta, slug, resolvedLocale } = useLoaderData({
    strict: false,
  }) as LoaderData;

  const page = resolvePage(slug, resolvedLocale)!;
  const Content = page.page.default;

  return (
    <article>
      <header className="border-border mb-6 border-b pb-5">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          {meta.heading ?? meta.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">{meta.description}</p>
        <p className="text-muted-foreground mt-2 text-xs">
          {m['common.pages.last_updated']()}: {meta.updated_at}
        </p>
      </header>
      <div className="text-foreground/90 text-[15px] leading-7">
        <Content />
      </div>
    </article>
  );
}
