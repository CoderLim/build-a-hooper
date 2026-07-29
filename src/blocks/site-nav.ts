import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import type { NavLink } from '@/components/site-header';

const achievementsLabels: Record<string, string> = {
  en: 'Achievements',
  zh: '成就',
  ja: '実績',
  ko: '업적',
};

export function getSiteNavLinks(): NavLink[] {
  const locale = getLocale();

  return [
    { href: '/#play', label: m['landing.nav.play']() },
    { href: '/leaderboard', label: m['landing.nav.leaderboard']() },
    {
      href: '/achievements',
      label:
        achievementsLabels[locale] ?? m['landing.nav.achievements'](),
    },
    { href: '/how-to-play', label: m['landing.nav.how_to_play']() },
    { href: '/modes', label: m['landing.nav.modes']() },
    { href: '/best-builds', label: m['landing.nav.best_builds']() },
    { href: '/attributes', label: m['landing.nav.attributes']() },
    { href: '/blog', label: m['landing.nav.blog']() },
  ];
}
