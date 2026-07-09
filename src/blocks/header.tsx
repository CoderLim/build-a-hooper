import { m } from '@/paraglide/messages.js';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/game', label: m['landing.nav.play']() },
    { href: '/#guide', label: m['landing.nav.guide']() },
    { href: '/#faq', label: m['landing.nav.faq']() },
    { href: '/blog', label: m['landing.nav.blog']() },
    { href: '/privacy-policy', label: m['landing.nav.privacy']() },
  ];

  return <SiteHeader navLinks={navLinks} />;
}
