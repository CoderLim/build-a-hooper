import { m } from '@/paraglide/messages.js';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/#play', label: m['landing.nav.play']() },
    { href: '/#guide', label: m['landing.nav.guide']() },
    { href: '/#faq', label: m['landing.nav.faq']() },
    { href: '/privacy-policy', label: m['landing.nav.privacy']() },
  ];

  return <SiteHeader navLinks={navLinks} />;
}
