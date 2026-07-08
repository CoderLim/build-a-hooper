import { m } from '@/paraglide/messages.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';

export function Footer() {
  const columns: FooterColumn[] = [
    {
      title: m['landing.footer.explore'](),
      links: [
        {
          label: m['landing.nav.play'](),
          href: 'https://build-a-hooper.pages.dev/',
        },
        { label: m['landing.nav.guide'](), href: '/#guide' },
        { label: m['landing.nav.faq'](), href: '/#faq' },
      ],
    },
    {
      title: m['landing.footer.legal'](),
      links: [{ label: m['landing.nav.privacy'](), href: '/privacy-policy' }],
    },
  ];

  return (
    <SiteFooter
      tagline={m['landing.footer.tagline']()}
      columns={columns}
      copyright={m['landing.footer.copyright']()}
    />
  );
}
