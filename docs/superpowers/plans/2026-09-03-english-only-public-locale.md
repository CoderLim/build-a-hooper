# English-Only Public Locale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish and index only English pages while preserving the Paraglide localization layer and existing translation assets for future reactivation.

**Architecture:** Keep `en`, `zh`, `ja`, and `ko` registered in Paraglide, but introduce an application-level public-locale allowlist containing only `en`. Normalize retired locale prefixes before the TanStack handler, and drive selectors, metadata, content discovery, and the sitemap from the allowlist.

**Tech Stack:** TanStack Start, React 19, TypeScript, Paraglide JS, Node test runner

---

### Task 1: Add the public-locale boundary and retired-prefix redirect

**Files:**

- Modify: `src/config/locale/index.ts`
- Modify: `vite.config.ts`
- Modify: `src/lib/canonical-redirect.test.ts`
- Modify: `src/lib/canonical-redirect.ts`
- Modify: `package.json`

- [x] **Step 1: Write redirect regression tests**

Cover bare and nested `zh`, `ja`, and `ko` paths, query preservation, combined host/protocol normalization, and a `/jazz` non-match.

- [x] **Step 2: Verify the tests fail for the missing behavior**

Run: `node --import tsx --test src/lib/canonical-redirect.test.ts`

Expected: two new subtests fail because locale prefixes are not removed.

- [x] **Step 3: Define public and retired locales**

```ts
export const publicLocales = ['en'] as const;
export const retiredLocalePrefixes = ['zh', 'ja', 'ko'] as const;
```

Keep all locale names, message files, localized MDX, and `project.inlang/settings.json` intact.

- [x] **Step 4: Implement one-hop normalization**

Build a first-segment regex from `retiredLocalePrefixes`, remove a matching prefix, preserve the path/query, and combine this with existing HTTPS/apex normalization before returning one 301 response.

- [x] **Step 5: Prevent stale cookies from selecting retired content**

Set the Paraglide strategy to `['url', 'baseLocale']`. Keep URL patterns and every configured locale so URL-based multilingual routing remains ready.

- [x] **Step 6: Add the redirect suite to the normal test command**

```json
"test": "node --import tsx --test src/lib/canonical-redirect.test.ts src/lib/hooper-game/*.test.ts"
```

- [x] **Step 7: Verify the redirect tests pass**

Run: `node --import tsx --test src/lib/canonical-redirect.test.ts`

Expected: 8 tests pass and 0 fail.

### Task 2: Restrict all discovery signals to English

**Files:**

- Modify: `src/lib/seo/metadata.ts`
- Modify: `src/routes/sitemap[.]xml.ts`
- Modify: `src/routes/index.tsx`
- Modify: `src/routes/scoring-calculator.tsx`
- Modify: `src/routes/create-a-hooper.tsx`
- Modify: `src/routes/leaderboard.tsx`
- Modify: `src/routes/achievements.tsx`
- Modify: `src/routes/blog/index.tsx`
- Modify: `src/content/posts/index.ts`
- Modify: `src/routes/(pages)/-static-page.tsx`

- [x] **Step 1: Default shared metadata to public locales**

Change `buildPageHead()` so its default `alternateLocales` is `publicLocales`, while generated Paraglide `locales` continues to validate URL-generation inputs.

- [x] **Step 2: Replace route-level alternates**

Use `publicLocales` anywhere a route previously passed or mapped all generated `locales`, including the custom homepage head.

- [x] **Step 3: Restrict content availability helpers**

Enumerate `publicLocales` in local blog-post and static-page availability functions. Keep locale resolution and fallback code unchanged.

- [x] **Step 4: Emit only public locales in the sitemap**

Set the sitemap's UI and long-form locale groups to `publicLocales`; preserve the generic localized serializer and English-only special cases.

### Task 3: Hide inactive language controls

**Files:**

- Modify: `src/components/locale-selector.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/components/user-menu.tsx`

- [x] **Step 1: Hide the standalone selector**

Return `null` when `publicLocales.length <= 1`, and map `publicLocales` when multiple languages are active.

- [x] **Step 2: Hide footer and account-menu controls**

Render those language controls only when `publicLocales.length > 1`. Retain `setLocale()` and all control markup for future reactivation.

### Task 4: Verify the complete behavior

**Files:**

- Verify all modified files

- [x] **Step 1: Run all tests**

Run: `pnpm test`

Expected: redirect and game suites pass with no failures.

- [x] **Step 2: Check formatting**

Run a targeted Prettier check over every file changed by this plan. The global
`pnpm format:check` currently also reports pre-existing differences in unrelated
files, which remain untouched.

Expected: Prettier reports no formatting differences.

- [x] **Step 3: Build production output**

Run: `pnpm build`

Expected: Vite and Nitro exit 0; Paraglide still compiles its message modules.

- [x] **Step 4: Smoke-test production output**

Start the server on a temporary port. Confirm `/zh`, `/ja/blog/introducing-buildahooper`, and `/ko/scoring-calculator?mode=quick` return 301 to unprefixed paths. Confirm `/sitemap.xml` contains no retired prefix or retired hreflang and contains one English entry per URL.

- [x] **Step 5: Inspect the final diff**

Run: `git diff --check`, review `git diff`, and confirm `project.inlang/settings.json`, all message files, and localized MDX assets remain untouched.
