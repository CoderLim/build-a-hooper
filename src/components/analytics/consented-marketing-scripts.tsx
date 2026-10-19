import { useLocation } from '@tanstack/react-router';

import { canShowAds } from '@/lib/ads/adsterra';
import { AdsterraSocialBar } from '@/components/ads/adsterra-social-bar';

export function ConsentedMarketingScripts() {
  const location = useLocation();

  if (!canShowAds(location.pathname)) return null;

  return <AdsterraSocialBar />;
}
