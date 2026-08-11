# IndexNow Integration Design

## Goal

Enable Cloudflare Crawler Hints for `buildahooper.org` and add repeatable,
project-local IndexNow submission for production deployments.

## Architecture

Use Cloudflare Crawler Hints as a passive signal and `shipany-indexnow@0.1.0`
as an explicit deployment-time submitter. Keep the package in `devDependencies`
so every repository pins its own version; do not require a global install.

Each site owns an `indexnow.config.mjs` containing only public site metadata.
The stable `INDEXNOW_KEY` is stored as a GitHub Actions secret. CI generates
`public/{INDEXNOW_KEY}.txt` before the Worker build, deploys that key file with
the site, then submits the deployed sitemap after a successful deployment.

## Data Flow

1. GitHub Actions receives `INDEXNOW_KEY` from repository secrets.
2. `shipany-indexnow keyfile` writes the verification file into `public/`.
3. The Cloudflare Worker build includes that file.
4. Wrangler deploys the Worker.
5. `shipany-indexnow submit --wait` verifies the deployed key file and sitemap,
   then submits sitemap URLs to IndexNow in protocol-sized batches.

## Error Handling

Build or deployment failures remain blocking. IndexNow submission is
non-blocking after a successful deployment so a temporary search-engine outage
does not mark a valid production deployment as failed. The command output stays
visible in Actions for diagnosis.

## Verification

- Confirm the package and scripts resolve locally.
- Run a dry-run against the production sitemap.
- Run `pnpm build`.
- Confirm the GitHub secret name exists without displaying its value.
- Confirm Cloudflare reports `crawler_hints` as enabled, or report the exact
  permission/UI blocker if the authenticated session cannot change zone settings.
