import { useEffect } from 'react';

/**
 * Inject the AdSense loader after first paint so it does not compete with LCP.
 * Site verification still works once the script lands in <head>.
 */
export function GoogleAdsense({ clientId }: { clientId: string }) {
  useEffect(() => {
    if (!clientId || document.getElementById('adsbygoogle-loader')) return;

    const load = () => {
      if (document.getElementById('adsbygoogle-loader')) return;
      const script = document.createElement('script');
      script.id = 'adsbygoogle-loader';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    };

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(load, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }

    const timer = window.setTimeout(load, 2000);
    return () => window.clearTimeout(timer);
  }, [clientId]);

  return null;
}
