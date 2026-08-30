#!/usr/bin/env node
/**
 * Ensure a single-hop www → apex redirect on Cloudflare.
 * Mirrors auto-launch-website `CloudflareProvider.ensureWwwRedirect`.
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=... node scripts/sync-cloudflare-redirect.mjs
 *   CLOUDFLARE_API_TOKEN=... node scripts/sync-cloudflare-redirect.mjs --zone buildahooper.org
 *
 * Token scopes: Zone > Single Redirect > Edit, Zone > Bot Management > Edit (for robots.txt).
 */

const ZONE_NAME = getArg('--zone') ?? 'buildahooper.org';
const CANONICAL_HOST = ZONE_NAME;
const PHASE = 'http_request_dynamic_redirect';
const RULE_DESCRIPTION = 'build-a-hooper: www to apex';

const WWW_RULE = {
  action: 'redirect',
  description: RULE_DESCRIPTION,
  enabled: true,
  expression: `(http.host eq "www.${CANONICAL_HOST}")`,
  action_parameters: {
    from_value: {
      status_code: 301,
      target_url: {
        expression: `concat("https://${CANONICAL_HOST}", http.request.uri.path)`,
      },
      preserve_query_string: true,
    },
  },
};

const token =
  process.env.CLOUDFLARE_API_TOKEN ?? process.env.WRANGLER_API_TOKEN;
if (!token) {
  console.error(
    'Missing CLOUDFLARE_API_TOKEN.\n' +
      'Wrangler OAuth cannot edit Bot Management — create a token with\n' +
      'Zone > Single Redirect > Edit and Zone > Bot Management > Edit:\n' +
      'https://dash.cloudflare.com/profile/api-tokens\n\n' +
      `Or disable manually: Security → Bots → turn off Managed robots.txt:\n` +
      `https://dash.cloudflare.com/bf6733e0074adfcf86efe8653db2ee0c/${ZONE_NAME}/security/bots`
  );
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

async function main() {
  const zoneId = await getZoneId(ZONE_NAME);
  const entrypoint = await getEntrypoint(zoneId);

  if (!entrypoint?.id) {
    const created = await api('POST', `/zones/${zoneId}/rulesets`, {
      name: 'build-a-hooper redirects',
      kind: 'zone',
      phase: PHASE,
      rules: [WWW_RULE],
    });
    console.log(`Created redirect ruleset ${created.result.id}.`);
    await disableManagedRobots(zoneId);
    return;
  }

  const existing = entrypoint.rules?.find(
    (rule) =>
      rule.description === RULE_DESCRIPTION ||
      rule.expression?.includes(`www.${CANONICAL_HOST}`)
  );

  if (existing?.id) {
    await api(
      'PATCH',
      `/zones/${zoneId}/rulesets/${entrypoint.id}/rules/${existing.id}`,
      WWW_RULE
    );
    console.log(
      `Updated redirect rule ${existing.id} in ruleset ${entrypoint.id}.`
    );
    await disableManagedRobots(zoneId);
    return;
  }

  await api(
    'POST',
    `/zones/${zoneId}/rulesets/${entrypoint.id}/rules`,
    WWW_RULE
  );
  console.log(`Added redirect rule to ruleset ${entrypoint.id}.`);

  await disableManagedRobots(zoneId);
}

/** Stop Cloudflare prepending Content-Signal blocks (Lighthouse flags them as invalid). */
async function disableManagedRobots(zoneId) {
  try {
    const current = await api('GET', `/zones/${zoneId}/bot_management`);
    if (current.result?.is_robots_txt_managed === false) {
      console.log('Managed robots.txt already disabled.');
      return;
    }
    await api('PUT', `/zones/${zoneId}/bot_management`, {
      ...current.result,
      is_robots_txt_managed: false,
    });
    console.log(
      'Disabled Cloudflare managed robots.txt (removes Content-Signal prepend).'
    );
  } catch (error) {
    console.warn(
      'Could not disable managed robots.txt via API:',
      error instanceof Error ? error.message : error,
      '\nDisable manually: Security → Bots → turn off Managed robots.txt / Bot Preference Sync.'
    );
  }
}

async function getZoneId(name) {
  const data = await api('GET', `/zones?name=${encodeURIComponent(name)}`);
  const zone = data.result?.[0];
  if (!zone?.id) {
    throw new Error(`Zone not found: ${name}`);
  }
  return zone.id;
}

async function getEntrypoint(zoneId) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/phases/${PHASE}/entrypoint`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (response.status === 404) return null;
  const data = await response.json();
  if (!data.success) {
    const message =
      data.errors?.map((error) => error.message).join('; ') ??
      response.statusText;
    throw new Error(`GET entrypoint failed: ${message}`);
  }
  return data.result;
}

async function api(method, path, body) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!data.success) {
    const message =
      data.errors?.map((error) => error.message).join('; ') ??
      response.statusText;
    throw new Error(`${method} ${path} failed: ${message}`);
  }
  return data;
}

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}
