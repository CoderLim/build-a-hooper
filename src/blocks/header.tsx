import { getSiteNavLinks } from '@/blocks/site-nav';
import { SiteHeader } from '@/components/site-header';

export function Header({ overlay = false }: { overlay?: boolean }) {
  return (
    <SiteHeader navLinks={getSiteNavLinks()} showAuthLinks overlay={overlay} />
  );
}
