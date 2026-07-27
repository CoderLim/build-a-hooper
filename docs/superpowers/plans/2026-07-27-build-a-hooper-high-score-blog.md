# Build a Hooper High-Score Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a bilingual, source-grounded Build a Hooper high-score guide that targets two supporting English keyword phrases naturally.

**Architecture:** Add one English and one Chinese MDX post following the existing local-post convention, then register their shared slug in the static post index. No route or rendering changes are required.

**Tech Stack:** MDX, TypeScript, TanStack Start

---

### Task 1: Write the bilingual guide

**Files:**

- Create: `src/content/posts/build-a-hooper-high-score-guide.en.mdx`
- Create: `src/content/posts/build-a-hooper-high-score-guide.zh.mdx`

- [x] **Step 1: Write the English article**

Include metadata, the OVR and Legacy distinction, the exact scoring table,
win-probability thresholds, draft and mode advice, a checklist, internal links,
and an unofficial-game note. Use `build a hooper basketball` and
`build a player nba` only where they read as search language or a natural
question.

- [x] **Step 2: Write the Chinese article**

Translate the argument and examples for Chinese readers while preserving the
two requested English search phrases in a short search-intent explanation.

- [x] **Step 3: Fact-check**

Compare every number against `src/modules/hooper/legacy-points.ts`,
`src/lib/hooper-game/season-engine.ts`, and
`src/lib/hooper-game/constants.ts`.

### Task 2: Register and verify the post

**Files:**

- Modify: `src/content/posts/index.ts`

- [x] **Step 1: Register the slug**

Add `build-a-hooper-high-score-guide` to `BLOG_POST_SLUGS`.

- [x] **Step 2: Check content and formatting**

Run:

```bash
pnpm prettier --check src/content/posts/build-a-hooper-high-score-guide.en.mdx src/content/posts/build-a-hooper-high-score-guide.zh.mdx src/content/posts/index.ts
```

Expected: all three files pass formatting.

- [x] **Step 3: Build**

Run: `pnpm build`

Expected: production build exits with code 0.

- [x] **Step 4: Inspect scope**

Run: `git diff --check && git status --short`

Expected: only the two posts, the slug registration, and planning documents
are changed.
