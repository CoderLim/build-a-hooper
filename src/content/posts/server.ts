import { createServerFn } from '@tanstack/react-start';

import { baseLocale } from '@/paraglide/runtime.js';

import {
  getLocalPosts,
  mergePosts,
  resolveLocalPost,
  type BlogPost,
  type BlogPostDetail,
} from './index';

// Database access stays behind server functions (dynamic import keeps
// drizzle out of the client bundle), mirroring the analytics pattern.

async function getDbPosts(): Promise<BlogPost[]> {
  try {
    const { listPublishedArticles } = await import('@/modules/posts/service');
    const rows = await listPublishedArticles();
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title || row.slug,
      description: row.description || '',
      image: row.image || undefined,
      createdAt: new Date(row.createdAt).toISOString(),
      authorName: row.authorName || undefined,
      authorImage: row.authorImage || undefined,
      source: 'db' as const,
    }));
  } catch {
    // Database not configured/reachable — local posts still render.
    return [];
  }
}

/**
 * All blog posts: database posts merged with local MDX posts,
 * deduped by slug (database wins), newest first.
 */
export const getBlogPostsFn = createServerFn()
  .inputValidator((data: { locale: string; limit?: number }) => data)
  .handler(async ({ data }) => {
    // Database posts currently have no locale column, so they are base-locale
    // content. Do not duplicate them across localized blog indexes.
    const dbPosts = data.locale === baseLocale ? await getDbPosts() : [];
    return mergePosts(dbPosts, getLocalPosts(data.locale), {
      limit: data.limit,
    });
  });

/**
 * Single blog post by slug: database first, local MDX as fallback.
 * Local posts return meta only — the route component resolves the MDX
 * Content from the bundled glob map (components don't serialize).
 */
export const getBlogPostFn = createServerFn()
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }): Promise<BlogPostDetail | null> => {
    if (data.locale === baseLocale) {
      try {
        const { findPublishedBySlug } = await import('@/modules/posts/service');
        const row = await findPublishedBySlug(data.slug);
        if (row) {
          return {
            slug: row.slug,
            title: row.title || row.slug,
            description: row.description || '',
            image: row.image || undefined,
            createdAt: new Date(row.createdAt).toISOString(),
            authorName: row.authorName || undefined,
            authorImage: row.authorImage || undefined,
            source: 'db',
            content: row.content || '',
            resolvedLocale: baseLocale,
            isFallback: false,
          };
        }
      } catch {
        // Database not configured/reachable — fall through to local posts.
      }
    }

    const resolved = resolveLocalPost(data.slug, data.locale);
    if (!resolved) return null;
    const meta = resolved.module.meta;
    return {
      slug: data.slug,
      title: meta.title,
      description: meta.description,
      image: meta.image,
      createdAt: new Date(meta.created_at).toISOString(),
      authorName: meta.author_name,
      authorImage: meta.author_image,
      source: 'local',
      resolvedLocale: resolved.resolvedLocale,
      isFallback: resolved.isFallback,
    };
  });
