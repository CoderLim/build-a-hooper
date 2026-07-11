import { getSiteNavLinks } from '@/blocks/site-nav';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  return <SiteHeader navLinks={getSiteNavLinks()} showAuthLinks />;
}
