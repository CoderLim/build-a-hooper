import { m } from '@/paraglide/messages.js';
import type { NavLink } from '@/components/site-header';

export function getSiteNavLinks(): NavLink[] {
  return [
    { href: '/game', label: m['landing.nav.play']() },
    { href: '/leaderboard', label: m['landing.nav.leaderboard']() },
    { href: '/achievements', label: m['landing.nav.achievements']() },
    { href: '/how-to-play', label: m['landing.nav.how_to_play']() },
    { href: '/modes', label: m['landing.nav.modes']() },
    { href: '/best-builds', label: m['landing.nav.best_builds']() },
    { href: '/attributes', label: m['landing.nav.attributes']() },
    { href: '/blog', label: m['landing.nav.blog']() },
  ];
}
