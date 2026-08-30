const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

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

  if (shouldSkipCanonicalRedirect(host)) return null;

  const isWww = host.startsWith('www.');
  const isHttp = url.protocol === 'http:';
  if (!isWww && !isHttp) return null;

  url.protocol = 'https:';
  if (isWww) {
    url.hostname = host.replace(/^www\./, '');
  }

  return Response.redirect(url.toString(), 301);
}
