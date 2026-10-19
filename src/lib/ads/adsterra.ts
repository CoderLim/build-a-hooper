export type AdsterraBannerSize = '320x50' | '300x250' | '728x90';

export type AdsterraBannerConfig = {
  key: string;
  width: number;
  height: number;
  invokeSrc: string;
};

/** Banner units for buildahooper.org (Adsterra). */
export const ADSTERRA_BANNERS: Record<
  AdsterraBannerSize,
  AdsterraBannerConfig
> = {
  '320x50': {
    key: '0f5070e54410fe3ddcbada4c0fd0d684',
    width: 320,
    height: 50,
    invokeSrc:
      'https://www.highrevenueformat.com/0f5070e54410fe3ddcbada4c0fd0d684/invoke.js',
  },
  '300x250': {
    key: 'eeb42529e778080db55259c8ed41c3b8',
    width: 300,
    height: 250,
    invokeSrc:
      'https://www.highrevenueformat.com/eeb42529e778080db55259c8ed41c3b8/invoke.js',
  },
  '728x90': {
    key: '69daa98019ef1e70328ec6e540cf193d',
    width: 728,
    height: 90,
    invokeSrc:
      'https://www.highrevenueformat.com/69daa98019ef1e70328ec6e540cf193d/invoke.js',
  },
};

/** Social Bar — global floating unit. */
export const ADSTERRA_SOCIAL_BAR_SRC =
  'https://pl31917218.profitableratecpmnetwork.com/f4/23/32/f42332c71e1edf40ee5b3ea02b3067ae.js';

function normalizePathname(pathname: string): string {
  const match = pathname.match(/^\/(zh|ja|ko)(\/.*)?$/);
  return match ? match[2] || '/' : pathname || '/';
}

/**
 * Content pages with substantial publisher content.
 * Legal, auth, tools, and thin list pages are excluded.
 */
export function canShowAds(pathname: string): boolean {
  if (/^\/(ja|ko)(\/|$)/.test(pathname)) return false;
  const path = normalizePathname(pathname);
  return (
    path === '/' ||
    path === '/create-a-hooper' ||
    path === '/achievements' ||
    path === '/how-to-play' ||
    path === '/modes' ||
    path === '/attributes' ||
    path === '/best-builds' ||
    path.startsWith('/best-builds/') ||
    path.startsWith('/blog/')
  );
}
