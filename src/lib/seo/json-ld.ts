import { envConfigs } from '@/config';

import { defaultOgImageUrl } from './open-graph';

export type JsonLdPrimitive = string | number | boolean | null;
export type JsonLdValue =
  | JsonLdPrimitive
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export type JsonLdObject = { [key: string]: JsonLdValue };

/** Build a TanStack Router `head().scripts` entry for JSON-LD. */
export function jsonLdScript(data: JsonLdObject | JsonLdObject[]) {
  const payload = Array.isArray(data)
    ? {
        '@context': 'https://schema.org',
        '@graph': data.map(({ ['@context']: _ctx, ...rest }) => rest),
      }
    : data;
  return {
    type: 'application/ld+json' as const,
    children: JSON.stringify(payload),
  };
}

export function organizationJsonLd(locale?: string): JsonLdObject {
  const url =
    (envConfigs.app_url || '').replace(/\/$/, '') || 'https://buildahooper.org';
  const logo = envConfigs.app_logo?.startsWith('http')
    ? envConfigs.app_logo
    : `${url}${envConfigs.app_logo || '/logo.png'}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: envConfigs.app_name || 'Build a Hooper',
    url,
    logo,
    description:
      envConfigs.app_description ||
      'Unofficial browser basketball simulator — draft skills, shape a custom player, and test your build across a full season.',
    ...(locale ? { inLanguage: locale } : {}),
  };
}

export function websiteJsonLd(locale?: string): JsonLdObject {
  const url =
    (envConfigs.app_url || '').replace(/\/$/, '') || 'https://buildahooper.org';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: envConfigs.app_name || 'Build a Hooper',
    url,
    publisher: { '@id': `${url}/#organization` },
    ...(locale ? { inLanguage: locale } : {}),
  };
}

export function softwareApplicationJsonLd(input: {
  name: string;
  description: string;
  url: string;
  locale?: string;
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: envConfigs.app_name || 'Build a Hooper',
      url:
        (envConfigs.app_url || '').replace(/\/$/, '') ||
        'https://buildahooper.org',
    },
    ...(input.locale ? { inLanguage: input.locale } : {}),
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  url: string;
  dateModified: string;
  locale?: string;
}): JsonLdObject {
  const siteUrl =
    (envConfigs.app_url || '').replace(/\/$/, '') || 'https://buildahooper.org';
  const organizationId = `${siteUrl}/#organization`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url,
    image: [defaultOgImageUrl()],
    dateModified: input.dateModified,
    author: {
      '@type': 'Organization',
      '@id': organizationId,
      name: envConfigs.app_name || 'Build a Hooper',
      url: siteUrl,
    },
    publisher: { '@id': organizationId },
    isPartOf: { '@id': `${siteUrl}/#website` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    ...(input.locale ? { inLanguage: input.locale } : {}),
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function faqPageJsonLd(input: {
  items: FaqItem[];
  url: string;
  locale?: string;
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: input.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    ...(input.locale ? { inLanguage: input.locale } : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
  };
}

export function blogPostingJsonLd(input: {
  headline: string;
  description?: string | null;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  locale?: string;
}): JsonLdObject {
  const siteUrl =
    (envConfigs.app_url || '').replace(/\/$/, '') || 'https://buildahooper.org';
  const logo = envConfigs.app_logo?.startsWith('http')
    ? envConfigs.app_logo
    : `${siteUrl}${envConfigs.app_logo || '/logo.png'}`;
  const image =
    input.image &&
    (input.image.startsWith('http://') || input.image.startsWith('https://')
      ? input.image
      : `${siteUrl}${input.image.startsWith('/') ? input.image : `/${input.image}`}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    ...(image ? { image: [image] } : { image: [defaultOgImageUrl()] }),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified
      ? { dateModified: input.dateModified }
      : input.datePublished
        ? { dateModified: input.datePublished }
        : {}),
    author: {
      '@type': 'Person',
      name: input.authorName || envConfigs.app_name || 'Build a Hooper',
    },
    publisher: {
      '@type': 'Organization',
      name: envConfigs.app_name || 'Build a Hooper',
      logo: {
        '@type': 'ImageObject',
        url: logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    ...(input.locale ? { inLanguage: input.locale } : {}),
  };
}

export function breadcrumbListJsonLd(
  items: Array<{ name: string; url: string }>
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
