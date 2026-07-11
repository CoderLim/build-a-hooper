import { m } from '@/paraglide/messages.js';
import type { NavLink } from '@/components/site-header';

export function getSiteNavLinks(): NavLink[] {
  return [
    { href: '/game', label: m['landing.nav.play']() },
    { href: '/leaderboard', label: m['landing.nav.leaderboard']() },
    { href: '/#guide', label: m['landing.nav.guide']() },
    { href: '/#faq', label: m['landing.nav.faq']() },
    { href: '/blog', label: m['landing.nav.blog']() },
    { href: '/privacy-policy', label: m['landing.nav.privacy']() },
  ];
}
