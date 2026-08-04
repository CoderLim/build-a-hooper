import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import type { NavLink } from '@/components/site-header';

const achievementsLabels: Record<string, string> = {
  en: 'Achievements',
  zh: '成就',
  ja: '実績',
  ko: '업적',
};

const howItWorksLabels: Record<string, string> = {
  en: 'How It Works',
  zh: '计算逻辑',
  ja: '仕組み',
  ko: '작동 원리',
};

export function getHowItWorksLabel(): string {
  return howItWorksLabels[getLocale()] ?? howItWorksLabels.en!;
}

export function getSiteNavLinks(): NavLink[] {
  const locale = getLocale();

  return [
    { href: '/leaderboard', label: m['landing.nav.leaderboard']() },
    {
      href: '/achievements',
      label:
        achievementsLabels[locale] ?? m['landing.nav.achievements'](),
    },
    { href: '/how-to-play', label: m['landing.nav.how_to_play']() },
    { href: '/attributes', label: m['landing.nav.attributes']() },
    { href: '/how-it-works', label: getHowItWorksLabel() },
    { href: '/modes', label: m['landing.nav.modes']() },
    { href: '/best-builds', label: m['landing.nav.best_builds']() },
    { href: '/blog', label: m['landing.nav.blog']() },
  ];
}
