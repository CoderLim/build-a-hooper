import { useEffect } from 'react';

import { ADSTERRA_SOCIAL_BAR_SRC } from '@/lib/ads/adsterra';

const SCRIPT_ID = 'adsterra-social-bar';

/**
 * Inject Social Bar after first paint so it does not compete with LCP.
 */
export function AdsterraSocialBar() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    const load = () => {
      if (document.getElementById(SCRIPT_ID)) return;
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = ADSTERRA_SOCIAL_BAR_SRC;
      script.async = true;
      document.body.appendChild(script);
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = globalThis.setTimeout(load, 2000);
    return () => globalThis.clearTimeout(timer);
  }, []);

  return null;
}
