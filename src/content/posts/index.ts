import type { ComponentType } from 'react';

import { baseLocale, locales } from '@/paraglide/runtime.js';

/**
 * Local blog posts written as MDX files in this directory.
 * File naming: `<slug>.<locale>.mdx` (detail pages may fall back to the base
 * locale, while localized indexes only list exact-locale posts).
 * Register every local post slug here — it drives loading and the sitemap.
 *
 * This module is isomorphic (safe in client bundles). Database posts are
 * fetched through the server functions in ./server.ts and merged with the
 * local posts via the pure helpers below.
 */
export const BLOG_POST_SLUGS = [
  'build-a-hooper-99-overall',
  'build-a-hooper-high-score-guide',
  'build-your-hooper-guide',
  'hooper-achievements-guide',
  'login-leaderboard-update',
  'introducing-buildahooper',
] as const;

export type BlogPostMeta = {
  title: string;
  description: string;
  created_at: string;
  author_name?: string;
  author_image?: string;
  image?: string;
};

type PostModule = {
  default: ComponentType;
  meta: BlogPostMeta;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  /** ISO date string — serializable across loader/server-fn boundaries */
  createdAt: string;
  authorName?: string;
  authorImage?: string;
  source: 'local' | 'db';
};

export type BlogPostDetail = BlogPost & {
  /** Raw markdown — set for database posts */
  content?: string;
  /** Locale of the content actually rendered after fallback resolution. */
  resolvedLocale: string;
  /** True when a locale URL is showing base-locale content. */
  isFallback: boolean;
};

// Eagerly bundle the local MDX posts (small markdown files), mirroring the
// static-pages pattern. Keys are absolute from the project root.
const postModules = import.meta.glob<PostModule>('/src/content/posts/*.mdx', {
  eager: true,
});

export type LocalPostResolution = {
  module: PostModule;
  resolvedLocale: string;
  isFallback: boolean;
};

export function resolveLocalPost(
  slug: string,
  locale: string
): LocalPostResolution | null {
  if (!BLOG_POST_SLUGS.includes(slug as (typeof BLOG_POST_SLUGS)[number])) {
    return null;
  }

  const localizedModule =
    postModules[`/src/content/posts/${slug}.${locale}.mdx`];
  if (localizedModule) {
    return {
      module: localizedModule,
      resolvedLocale: locale,
      isFallback: false,
    };
  }

  const fallbackModule =
    postModules[`/src/content/posts/${slug}.${baseLocale}.mdx`];
  if (!fallbackModule) return null;

  return {
    module: fallbackModule,
    resolvedLocale: baseLocale,
    isFallback: true,
  };
}

export function loadLocalPost(slug: string, locale: string): PostModule | null {
  return resolveLocalPost(slug, locale)?.module ?? null;
}

export function getAvailablePostLocales(slug: string): string[] {
  return locales.filter(
    (locale) => postModules[`/src/content/posts/${slug}.${locale}.mdx`]
  );
}

function localPostToItem(slug: string, meta: BlogPostMeta): BlogPost {
  return {
    slug,
    title: meta.title,
    description: meta.description,
    image: meta.image,
    createdAt: new Date(meta.created_at).toISOString(),
    authorName: meta.author_name,
    authorImage: meta.author_image,
    source: 'local',
  };
}

export function getLocalPosts(locale: string): BlogPost[] {
  return BLOG_POST_SLUGS.map((slug) => ({
    slug: slug as string,
    mod: postModules[`/src/content/posts/${slug}.${locale}.mdx`] ?? null,
  }))
    .filter((m): m is { slug: string; mod: PostModule } => m.mod !== null)
    .map(({ slug, mod }) => localPostToItem(slug, mod.meta));
}

/**
 * Merge database posts with local MDX posts, deduped by slug
 * (database wins), newest first.
 */
export function mergePosts(
  dbPosts: BlogPost[],
  localPosts: BlogPost[],
  options: { limit?: number } = {}
): BlogPost[] {
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const merged = [
    ...dbPosts,
    ...localPosts.filter((p) => !dbSlugs.has(p.slug)),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return options.limit ? merged.slice(0, options.limit) : merged;
}

const POST_DATE_LOCALES: Record<string, string> = {
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
};

export function formatPostDate(dateIso: string, locale: string): string {
  const intlLocale = POST_DATE_LOCALES[locale] ?? 'en-US';
  const useLongMonth = locale in POST_DATE_LOCALES;
  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: useLongMonth ? 'long' : 'short',
    day: 'numeric',
  }).format(new Date(dateIso));
}
