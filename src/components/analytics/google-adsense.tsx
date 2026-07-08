// Google AdSense loader — rendered as a native <script> tag (not next/script)
// so it lands in the SSR HTML directly; see analytics/google-analytics.tsx for
// the full rationale. `async` flags this to React 19 as a hoistable resource,
// so it's lifted into <head> where AdSense's site verification expects it.
export function GoogleAdsense({ clientId }: { clientId: string }) {
  if (!clientId) return null;
  return (
    <script
      id="adsbygoogle-loader"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      async
    />
  );
}
