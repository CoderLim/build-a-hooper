import { useEffect, useRef } from 'react';

import { ADSTERRA_BANNERS, type AdsterraBannerSize } from '@/lib/ads/adsterra';
import { cn } from '@/lib/utils';

type AdsterraBannerProps = {
  size: AdsterraBannerSize;
  className?: string;
};

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, unknown>;
    };
  }
}

/** Serialize loads so concurrent slots do not clobber window.atOptions. */
let loadChain: Promise<void> = Promise.resolve();

function enqueueBannerLoad(task: () => Promise<void>): () => void {
  let cancelled = false;
  loadChain = loadChain.then(async () => {
    if (cancelled) return;
    await task();
  });
  return () => {
    cancelled = true;
  };
}

function clearHost(host: HTMLElement) {
  while (host.firstChild) {
    host.removeChild(host.firstChild);
  }
}

/**
 * Injects an Adsterra iframe banner into a fixed-size host.
 * Client-only: invoke.js writes into the host after mount.
 */
export function AdsterraBanner({ size, className }: AdsterraBannerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const config = ADSTERRA_BANNERS[size];

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const cancel = enqueueBannerLoad(async () => {
      clearHost(host);

      window.atOptions = {
        key: config.key,
        format: 'iframe',
        height: config.height,
        width: config.width,
        params: {},
      };

      await new Promise<void>((resolve) => {
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = config.invokeSrc;
        invokeScript.onload = () => resolve();
        invokeScript.onerror = () => resolve();
        host.appendChild(invokeScript);
      });
    });

    return () => {
      cancel();
      clearHost(host);
    };
  }, [config.height, config.invokeSrc, config.key, config.width]);

  return (
    <div
      className={cn('flex justify-center', className)}
      style={{ minHeight: config.height }}
    >
      <div
        ref={hostRef}
        style={{ width: config.width, height: config.height }}
      />
    </div>
  );
}
