# Homepage Keyword Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the English homepage’s exact-match “Build a Hooper” density to approximately 3.0% with natural editorial revisions.

**Architecture:** The homepage already sources its content from flat Paraglide translation keys. Only existing English values will change; React blocks and other locales remain untouched.

**Tech Stack:** TanStack Start, React 19, Paraglide JS, TypeScript

---

### Task 1: Revise homepage copy

**Files:**

- Modify: `messages/en.json`

- [x] **Step 1: Record the baseline**

Count words and case-insensitive exact matches across the translation keys
rendered by `src/routes/index.tsx`. Expected baseline: about 1,389 words and 21
exact matches, or about 1.5% under the repository-side approximation.

- [x] **Step 2: Edit existing copy**

Revise headings, opening sentences, transitions, FAQ answers, and descriptive
captions so the exact phrase identifies the subject naturally. Do not add keys,
new sections, or keyword-only sentences.

- [x] **Step 3: Recalculate density**

Run the same counter against the edited values. Expected result: approximately
3.0%, without materially exceeding the target.

- [x] **Step 4: Review prose**

Read every changed value in context. Confirm adjacent sentences do not repeat
the exact phrase mechanically and that each use clarifies the subject.

### Task 2: Verify the application

**Files:**

- Verify: `messages/en.json`

- [x] **Step 1: Validate JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8'))"`

Expected: exit code 0.

- [x] **Step 2: Build**

Run: `pnpm build`

Expected: exit code 0 with a successful production build.

- [x] **Step 3: Inspect the diff**

Run: `git diff --check && git diff -- messages/en.json`

Expected: no whitespace errors and only intentional English homepage copy
changes.
