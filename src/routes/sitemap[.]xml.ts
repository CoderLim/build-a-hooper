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
const ENGLISH_ONLY = ['en'] as const;

const STATIC_PATHS: {
  path: string;
  availableLocales: readonly string[];
}[] = [
  { path: '', availableLocales: ALL_UI_LOCALES },
  { path: '/scoring-calculator', availableLocales: ALL_UI_LOCALES },
  { path: '/create-a-hooper', availableLocales: ALL_UI_LOCALES },
  { path: '/build-a-bucket-nba-game', availableLocales: ENGLISH_ONLY },
  { path: '/leaderboard', availableLocales: ALL_UI_LOCALES },
  { path: '/achievements', availableLocales: ALL_UI_LOCALES },
  { path: '/blog', availableLocales: ALL_UI_LOCALES },
  { path: '/how-to-play', availableLocales: LONG_FORM_LOCALES },
  { path: '/how-it-works', availableLocales: LONG_FORM_LOCALES },
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
    locale: locale as (typeof locales)[number],
  }).href;
}

function entryXml(e: Entry): string {
  const alternates = e.availableLocales
    .map(
      (loc) =>
        `    <xhtml:link rel="alternate" hreflang="${loc}" href="${urlFor(e.path, loc)}"/>`
    )
    .join('\n');
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(e.path, baseLocale)}"/>`;
  return [
    '  <url>',
    `    <loc>${urlFor(e.path, e.locale)}</loc>`,
    alternates,
    xDefault,
    e.lastModified ? `    <lastmod>${e.lastModified}</lastmod>` : null,
    `    <changefreq>${e.changeFrequency}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = STATIC_PATHS.flatMap(
          ({ path, availableLocales }) =>
            availableLocales.map((locale) => ({
              path,
              locale,
              availableLocales,
              changeFrequency:
                path === '/blog' ||
                path === '/leaderboard' ||
                path === '/achievements'
                  ? 'daily'
                  : 'weekly',
              priority: path === '' ? 1 : 0.8,
            }))
        );

        // Blog posts: db posts merged with local MDX posts.
        try {
          const { listPublishedArticles } =
            await import('@/modules/posts/service');
          const rows = await listPublishedArticles().catch(() => []);
          const dbPosts = rows.map((row) => ({
            slug: row.slug,
            title: row.title || row.slug,
            description: row.description || '',
            createdAt: new Date(row.createdAt).toISOString(),
            source: 'db' as const,
          }));
          const posts = mergePosts(dbPosts, getLocalPosts(baseLocale));
          for (const post of posts) {
            const availableLocales =
              post.source === 'local'
                ? getAvailablePostLocales(post.slug)
                : [baseLocale];
            for (const locale of availableLocales) {
              entries.push({
                path: `/blog/${post.slug}`,
                locale,
                availableLocales,
                lastModified: post.createdAt,
                changeFrequency: 'monthly',
                priority: 0.6,
              });
            }
          }
        } catch {
          // Database unreachable — static paths + local posts still listed.
          for (const post of getLocalPosts(baseLocale)) {
            const availableLocales = getAvailablePostLocales(post.slug);
            for (const locale of availableLocales) {
              entries.push({
                path: `/blog/${post.slug}`,
                locale,
                availableLocales,
                lastModified: post.createdAt,
                changeFrequency: 'monthly',
                priority: 0.6,
              });
            }
          }
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
          ...entries.map(entryXml),
          '</urlset>',
          '',
        ].join('\n');

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml' },
        });
      },
    },
  },
});
