import type { ComponentType } from 'react';
import { notFound, useLoaderData } from '@tanstack/react-router';

import { Link } from '@/core/i18n/navigation';
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

const playGuideCalculationLinks: Record<
  string,
  { title: string; description: string; link: string }
> = {
  en: {
    title: 'Why did this build produce that season?',
    description:
      'The Play Guide explains what to do. The How It Works guide explains, at a high level, how attributes, position fit, team strength, player production, awards, and playoffs shape the result.',
    link: 'Read How It Works',
  },
  zh: {
    title: '为什么这套 Build 会得到这样的赛季结果？',
    description:
      'Play Guide 负责讲怎么玩；计算逻辑页会从属性组合、位置适配、球队强度、个人数据、奖项与季后赛等角度，概括说明结果是怎样形成的。',
    link: '查看计算逻辑',
  },
  ja: {
    title: 'このビルドがこのシーズン結果になる理由は？',
    description:
      'プレイガイドは操作と進め方を説明します。How It Works では、能力、ポジション適性、チーム力、個人成績、受賞、プレーオフが結果にどう関わるかを大まかに紹介します。',
    link: '仕組みを見る',
  },
  ko: {
    title: '왜 이 빌드가 이런 시즌 결과를 만들었을까요?',
    description:
      '플레이 가이드는 진행 방법을 설명합니다. How It Works 가이드는 능력치, 포지션 적합도, 팀 전력, 개인 기록, 수상 및 플레이오프가 결과에 반영되는 방식을 간단히 설명합니다.',
    link: '작동 원리 보기',
  },
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
  const calculationLink =
    playGuideCalculationLinks[resolvedLocale] ?? playGuideCalculationLinks.en!;

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
        {slug === 'how-to-play' && (
          <aside className="border-border bg-muted/35 mt-10 rounded-2xl border p-5 md:p-6">
            <h2 className="text-foreground text-xl font-semibold">
              {calculationLink.title}
            </h2>
            <p className="text-muted-foreground mt-2">
              {calculationLink.description}
            </p>
            <Link
              href="/how-it-works"
              className="text-primary mt-4 inline-flex font-semibold underline underline-offset-4"
            >
              {calculationLink.link} →
            </Link>
          </aside>
        )}
      </div>
    </article>
  );
}
