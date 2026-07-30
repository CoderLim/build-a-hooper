import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import {
  getAvailablePostLocales,
  getLocalPosts,
  mergePosts,
} from '@/content/posts';

const ALL_UI_LOCALES = ['en', 'zh', 'ja', 'ko'] as const;
const LONG_FORM_LOCALES = ['en', 'zh'] as const;

const STATIC_PATHS: {
  path: string;
  availableLocales: readonly string[];
}[] = [
  { path: '', availableLocales: ALL_UI_LOCALES },
  { path: '/scoring-calculator', availableLocales: ALL_UI_LOCALES },
  { path: '/achievements', availableLocales: ALL_UI_LOCALES },
  { path: '/blog', availableLocales: ALL_UI_LOCALES },
  { path: '/how-to-play', availableLocales: LONG_FORM_LOCALES },
  { path: '/modes', availableLocales: LONG_FORM_LOCALES },
  { path: '/attributes', availableLocales: LONG_FORM_LOCALES },
  { path: '/best-builds', availableLocales: LONG_FORM_LOCALES },
  {
    path: '/best-builds/point-guard',
    availableLocales: LONG_FORM_LOCALES,
  },
  {
    path: '/best-builds/shooting-guard',
    availableLocales: LONG_FORM_LOCALES,
  },
  {
    path: '/best-builds/small-forward',
    availableLocales: LONG_FORM_LOCALES,
  },
  {
    path: '/best-builds/power-forward',
    availableLocales: LONG_FORM_LOCALES,
  },
  { path: '/best-builds/center', availableLocales: LONG_FORM_LOCALES },
  { path: '/privacy-policy', availableLocales: LONG_FORM_LOCALES },
  { path: '/terms-of-service', availableLocales: LONG_FORM_LOCALES },
  { path: '/contact', availableLocales: LONG_FORM_LOCALES },
  { path: '/about', availableLocales: LONG_FORM_LOCALES },
];

type Entry = {
  path: string;
  locale: string;
  availableLocales: readonly string[];
  lastModified?: string;
  changeFrequency: string;
  priority: number;
};

function urlFor(path: string, locale: string): string {
  return localizeUrl(`${envConfigs.app_url}${path || '/'}`, {
    locale: locale as any,
  }).href;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function renderUrl(entry: Entry): string {
  const alternates = entry.availableLocales
    .map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(urlFor(entry.path, locale))}" />`
    )
    .concat(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(urlFor(entry.path, baseLocale))}" />`
    )
    .join('\n');

  return [
    '  <url>',
    `    <loc>${escapeXml(urlFor(entry.path, entry.locale))}</loc>`,
    entry.lastModified
      ? `    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`
      : null,
    `    <changefreq>${entry.changeFrequency}</changefreq>`,
    `    <priority>${entry.priority.toFixed(1)}</priority>`,
    alternates,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

async function buildSitemap(): Promise<string> {
  const staticEntries: Entry[] = STATIC_PATHS.flatMap((item) =>
    item.availableLocales.map((locale) => ({
      path: item.path,
      locale,
      availableLocales: item.availableLocales,
      changeFrequency: item.path === '' ? 'daily' : 'weekly',
      priority: item.path === '' ? 1 : 0.8,
    }))
  );

  const posts = mergePosts(
    ...(await Promise.all(locales.map((locale) => getLocalPosts(locale))))
  );
  const postEntries: Entry[] = posts.flatMap((post) => {
    const availableLocales = getAvailablePostLocales(post.slug);
    return availableLocales.map((locale) => ({
      path: `/blog/${post.slug}`,
      locale,
      availableLocales,
      lastModified: post.created_at,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...[...staticEntries, ...postEntries].map(renderUrl),
    '</urlset>',
  ].join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () =>
        new Response(await buildSitemap(), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        }),
    },
  },
});
