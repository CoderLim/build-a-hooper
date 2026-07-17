import { useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import { GoogleAdsense } from '@/components/analytics/google-adsense';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { Button } from '@/components/ui/button';

const CONSENT_KEY = 'buildahooper_cookie_consent';
const ADSENSE_CLIENT_ID = 'ca-pub-8028656293202971';

type ConsentValue = 'accepted' | 'rejected';

type ConsentedMarketingScriptsProps = {
  gaId?: string;
};

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

export function ConsentedMarketingScripts({
  gaId,
}: ConsentedMarketingScriptsProps) {
  const location = useLocation();
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    setConsent(saved === 'accepted' || saved === 'rejected' ? saved : null);
    setReady(true);
  }, []);

  const saveConsent = (value: ConsentValue) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  const accepted = consent === 'accepted';
  const showAdsense = canShowAdsense(location.pathname);

  return (
    <>
      {showAdsense ? <GoogleAdsense clientId={ADSENSE_CLIENT_ID} /> : null}
      {accepted && gaId ? <GoogleAnalytics measurementId={gaId} /> : null}
      {ready && consent === null ? (
        <div
          className={cn(
            'bg-background/95 text-foreground fixed right-4 bottom-4 left-4 z-50 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
            'mx-auto max-w-xl sm:left-auto sm:mx-0'
          )}
        >
          <p className="text-sm font-medium">Privacy choices</p>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            We use Google advertising on content pages to support the site.
            Google Analytics is optional and helps us understand site usage. You
            can accept or reject optional analytics cookies.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => saveConsent('rejected')}
            >
              Reject
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => saveConsent('accepted')}
            >
              Accept
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
