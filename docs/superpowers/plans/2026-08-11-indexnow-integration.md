# IndexNow Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add pinned, deployment-time IndexNow submission and enable Cloudflare Crawler Hints for `buildahooper.org`.

**Architecture:** Install `shipany-indexnow` as a project-local development dependency. CI generates the public key file before building, deploys it with the Worker, and submits the production sitemap afterward; Cloudflare Crawler Hints remains an independent passive fallback.

**Tech Stack:** pnpm, Node.js 22, `shipany-indexnow@0.1.0`, GitHub Actions, Cloudflare Workers and Zone Settings API.

---

### Task 1: Add project-local IndexNow configuration

**Files:**

- Create: `indexnow.config.mjs`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Install the pinned package**

Run:

```bash
pnpm add -D shipany-indexnow@0.1.0
```

Expected: `shipany-indexnow` appears in `devDependencies` and the lockfile.

- [ ] **Step 2: Add the per-site configuration**

```js
export default {
  host: 'buildahooper.org',
  keyEnv: 'INDEXNOW_KEY',
  sitemap: 'https://buildahooper.org/sitemap.xml',
  endpoint: 'indexnow',
  publicDir: 'public',
};
```

- [ ] **Step 3: Add reusable package scripts**

```json
{
  "indexnow:keyfile": "shipany-indexnow keyfile",
  "indexnow:verify": "shipany-indexnow verify --wait",
  "indexnow:submit": "shipany-indexnow submit --wait"
}
```

- [ ] **Step 4: Verify command resolution**

Run:

```bash
pnpm exec shipany-indexnow help
```

Expected: help lists `keyfile`, `verify`, and `submit`.

### Task 2: Wire IndexNow into production deployment

**Files:**

- Modify: `.github/workflows/deploy-cloudflare.yaml`

- [ ] **Step 1: Generate the key file before the Worker build**

Pass `${{ secrets.INDEXNOW_KEY }}` to the Wrangler action and prepend
`pnpm indexnow:keyfile` to its command.

- [ ] **Step 2: Submit the sitemap after successful deployment**

Add a step with `continue-on-error: true`:

```yaml
- name: Notify IndexNow
  continue-on-error: true
  env:
    INDEXNOW_KEY: ${{ secrets.INDEXNOW_KEY }}
  run: pnpm indexnow:submit
```

- [ ] **Step 3: Create and verify the GitHub Actions secret**

Generate a stable 64-character hexadecimal key, pipe it to
`gh secret set INDEXNOW_KEY`, then confirm only the secret name with
`gh secret list`.

### Task 3: Enable Cloudflare Crawler Hints

**Files:** None.

- [ ] **Step 1: Resolve the `buildahooper.org` zone**

Use the authenticated Cloudflare session or Dashboard without displaying any
credential value.

- [ ] **Step 2: Set and verify `crawler_hints=on`**

Use Cloudflare Cache Configuration in the Dashboard, or the zone setting API
when a token with `Zone Settings Write` is available. Read the setting back and
confirm its value is `on`.

### Task 4: Verify the integration

**Files:** None.

- [ ] **Step 1: Run an IndexNow dry-run**

With a temporary valid key, run:

```bash
pnpm exec shipany-indexnow submit --dry-run
```

Expected: production sitemap URLs are collected without a POST.

- [ ] **Step 2: Run project verification**

```bash
pnpm build
git diff --check
```

Expected: build passes and the diff has no whitespace errors.

- [ ] **Step 3: Run the security scan before any commit**

Follow `.claude/skills/security-scan/SKILL.md`; HIGH findings block the commit.
