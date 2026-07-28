import { envConfigs } from '@/config';
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime.js';

import { buildOpenGraphMeta } from './open-graph';

export type SiteLocale = (typeof locales)[number];

type PageHeadInput = {
  title: string;
  description: string;
  path: string;
  locale: string;
  canonicalLocale?: string;
  alternateLocales?: readonly string[];
  indexable?: boolean;
  image?: string;
  type?: string;
};

export function localizedPageUrl(path: string, locale: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return localizeUrl(`${envConfigs.app_url}${normalizedPath}`, {
    locale: locale as SiteLocale,
  }).href;
}

export function buildPageHead({
  title,
  description,
  path,
  locale,
  canonicalLocale = locale,
  alternateLocales = locales,
  indexable = true,
  image,
  type,
}: PageHeadInput) {
  const canonical = localizedPageUrl(path, canonicalLocale);
  const absoluteImage = image
    ? image.startsWith('http://') || image.startsWith('https://')
      ? image
      : `${envConfigs.app_url}${image.startsWith('/') ? image : `/${image}`}`
    : undefined;
  const uniqueAlternates = [...new Set(alternateLocales)].filter((item) =>
    locales.includes(item as SiteLocale)
  );

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...(indexable ? [] : [{ name: 'robots', content: 'noindex, follow' }]),
      ...buildOpenGraphMeta({
        title,
        description,
        url: canonical,
        locale: canonicalLocale,
        image: absoluteImage,
        type,
      }),
    ],
    links: [
      { rel: 'canonical', href: canonical },
      ...uniqueAlternates.map((alternateLocale) => ({
        rel: 'alternate',
        hrefLang: alternateLocale,
        href: localizedPageUrl(path, alternateLocale),
      })),
      {
        rel: 'alternate',
        hrefLang: 'x-default',
        href: localizedPageUrl(path, baseLocale),
      },
    ],
  };
}

export function noIndexHead(follow = false) {
  return {
    meta: [
      {
        name: 'robots',
        content: follow ? 'noindex, follow' : 'noindex, nofollow',
      },
    ],
  };
}
