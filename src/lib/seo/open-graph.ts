import { envConfigs } from '@/config';

const LOCALE_TO_OG: Record<string, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
  ko: 'ko_KR',
};

export type OpenGraphMetaInput = {
  title: string;
  description: string;
  url: string;
  image?: string;
  locale?: string;
  type?: string;
  siteName?: string;
};

type MetaDescriptor =
  | { property: string; content: string }
  | { name: string; content: string };

/** Absolute URL for the default Open Graph share image. */
export function defaultOgImageUrl(appUrl?: string): string {
  const base = (appUrl || envConfigs.app_url || '').replace(/\/$/, '');
  return `${base}/og.png`;
}

/**
 * Build Open Graph + Twitter Card meta descriptors for TanStack Router `head()`.
 */
export function buildOpenGraphMeta(
  input: OpenGraphMetaInput
): MetaDescriptor[] {
  const siteName = input.siteName || envConfigs.app_name;
  const image = input.image || defaultOgImageUrl();
  const type = input.type || 'website';
  const ogLocale = input.locale
    ? (LOCALE_TO_OG[input.locale] ?? input.locale)
    : undefined;

  const meta: MetaDescriptor[] = [
    { property: 'og:title', content: input.title },
    { property: 'og:description', content: input.description },
    { property: 'og:url', content: input.url },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteName },
    { property: 'og:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: input.title },
    { name: 'twitter:description', content: input.description },
    { name: 'twitter:image', content: image },
  ];

  if (ogLocale) {
    meta.push({ property: 'og:locale', content: ogLocale });
  }

  return meta;
}

/** Minimal site-wide OG defaults when a page does not set its own. */
export function buildDefaultOpenGraphMeta(appUrl: string): MetaDescriptor[] {
  const base = appUrl.replace(/\/$/, '');
  return [
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: envConfigs.app_name },
    { property: 'og:image', content: defaultOgImageUrl(base) },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: defaultOgImageUrl(base) },
  ];
}
