import { useLocation } from '@tanstack/react-router';

import { GoogleAdsense } from '@/components/analytics/google-adsense';

const ADSENSE_CLIENT_ID = 'ca-pub-8028656293202971';

function normalizePathname(pathname: string): string {
  const match = pathname.match(/^\/(zh|ja|ko)(\/.*)?$/);
  return match ? match[2] || '/' : pathname || '/';
}

function canShowAdsense(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return (
    path === '/' ||
    path === '/game' ||
    path === '/blog' ||
    path.startsWith('/blog/')
  );
}

export function ConsentedMarketingScripts() {
  const location = useLocation();
  const showAdsense = canShowAdsense(location.pathname);

  if (!showAdsense) return null;

  return <GoogleAdsense clientId={ADSENSE_CLIENT_ID} />;
}
