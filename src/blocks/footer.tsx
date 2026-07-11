import { m } from '@/paraglide/messages.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';

export function Footer() {
  const columns: FooterColumn[] = [
    {
      title: m['landing.footer.explore'](),
      links: [
        {
          label: m['landing.nav.play'](),
          href: '/game',
        },
        { href: '/leaderboard', label: m['landing.nav.leaderboard']() },
        { label: m['landing.nav.guide'](), href: '/#guide' },
        { label: m['landing.nav.faq'](), href: '/#faq' },
        { label: m['landing.footer.blog'](), href: '/blog' },
        {
          label: m['landing.footer.chrome_extension'](),
          href: 'https://chromewebstore.google.com/detail/build-a-hooper-launcher/dccnpagebnanngljphnfbbfefnmhlckm',
        },
        {
          label: m['landing.footer.github'](),
          href: 'https://github.com/CoderLim/build-a-hooper-extension',
        },
      ],
    },
    {
      title: m['landing.footer.legal'](),
      links: [
        { label: m['landing.nav.privacy'](), href: '/privacy-policy' },
        { label: m['landing.footer.terms'](), href: '/terms-of-service' },
      ],
    },
    {
      title: m['landing.footer.about_section'](),
      links: [
        { label: m['landing.footer.about'](), href: '/about' },
        { label: m['landing.footer.contact'](), href: '/contact' },
      ],
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
