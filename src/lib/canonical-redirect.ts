import { retiredLocalePrefixes } from '@/config/locale';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
const retiredLocalePrefixPattern = new RegExp(
  `^/(${retiredLocalePrefixes.join('|')})(?=/|$)`
);

/** Skip canonical redirects for local dev and Cloudflare preview hosts. */
function shouldSkipCanonicalRedirect(hostname: string) {
  if (LOCAL_HOSTS.has(hostname)) return true;
  if (hostname.endsWith('.workers.dev')) return true;
  return false;
}

/**
 * Redirect www / http traffic to the canonical https apex host in one hop.
 * Used as a fallback when edge redirect rules are not in place (e.g. workers.dev).
 */
export function canonicalRedirect(req: Request): Response | null {
  const url = new URL(req.url);
  const host = url.hostname;
  let shouldRedirect = false;

  if (retiredLocalePrefixPattern.test(url.pathname)) {
    url.pathname = url.pathname.replace(retiredLocalePrefixPattern, '') || '/';
    shouldRedirect = true;
  }

  if (!shouldSkipCanonicalRedirect(host)) {
    const isWww = host.startsWith('www.');
    const isHttp = url.protocol === 'http:';

    if (isHttp) {
      url.protocol = 'https:';
      shouldRedirect = true;
    }
    if (isWww) {
      url.hostname = host.replace(/^www\./, '');
      shouldRedirect = true;
    }
  }

  return shouldRedirect ? Response.redirect(url.toString(), 301) : null;
}
