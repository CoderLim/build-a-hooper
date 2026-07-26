import { useEffect, useRef } from 'react';

const ADSTERRA_KEY = '0f5070e54410fe3ddcbada4c0fd0d684';
const ADSTERRA_INVOKE_URL = `https://www.highperformanceformat.com/${ADSTERRA_KEY}/invoke.js`;

const ADSTERRA_OPTIONS = {
  key: ADSTERRA_KEY,
  format: 'iframe',
  height: 50,
  width: 320,
  params: {},
} as const;

declare global {
  interface Window {
    atOptions?: typeof ADSTERRA_OPTIONS;
  }
}

export function AdsterraBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    window.atOptions = ADSTERRA_OPTIONS;

    const script = document.createElement('script');
    script.src = ADSTERRA_INVOKE_URL;
    script.async = false;
    container.appendChild(script);

    return () => {
      script.remove();
      container.replaceChildren();

      if (window.atOptions === ADSTERRA_OPTIONS) {
        delete window.atOptions;
      }
    };
  }, []);

  return (
    <div
      className="mx-auto flex h-[50px] w-[320px] items-center justify-center overflow-hidden"
      aria-label="Advertisement"
    >
      <div ref={containerRef} className="h-[50px] w-[320px]" />
    </div>
  );
}
