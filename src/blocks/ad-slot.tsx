import { useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';

import { canShowAds } from '@/lib/ads/adsterra';
import { AdsterraBanner } from '@/components/ads/adsterra-banner';

/**
 * Top rail: 320×50 on mobile, 728×90 on desktop.
 * Waits for breakpoint detection so only one unit mounts.
 */
export function AdSlotTop() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  if (!canShowAds(location.pathname) || isMobile === null) return null;

  return (
    <aside
      aria-label="Advertisement"
      className="border-border/40 flex justify-center border-y py-4"
    >
      <AdsterraBanner size={isMobile ? '320x50' : '728x90'} />
    </aside>
  );
}

/** In-content medium rectangle (300×250). */
export function AdSlotInContent() {
  const location = useLocation();

  if (!canShowAds(location.pathname)) return null;

  return (
    <aside aria-label="Advertisement" className="flex justify-center px-4 py-8">
      <AdsterraBanner size="300x250" />
    </aside>
  );
}
