# Build a Hooper High-Score Blog Design

## Goal

Publish an English and Chinese guide that explains how to improve Build a
Hooper scores using the game's real OVR, season, playoff, and Legacy rules.

## Search intent

The primary intent is practical: players want to know which decisions raise
their score and leaderboard position. The English article should naturally
include the supporting phrases `build a hooper basketball` and
`build a player nba` without repeating them as filler.

## Editorial angle

Open with the distinction between build OVR and Legacy points. Use the scoring
formula to show that a championship matters more than chasing a decorative
rating: a title is worth 120 Legacy points, while 95+ OVR is worth 20. Follow
with specific thresholds, a compact probability table, draft advice, mode
advice, and a final checklist.

The guide must be candid about the current engine:

- All 13 grades have equal weight in OVR.
- Regular-season win chance is based on OVR and randomness.
- PAS and HAN shape assists; REB shapes rebounds.
- Awards are tracked separately and do not add to Legacy points.
- A saved run can earn at most 160 Legacy points.

## Files

- Add `src/content/posts/build-a-hooper-high-score-guide.en.mdx`.
- Add `src/content/posts/build-a-hooper-high-score-guide.zh.mdx`.
- Register `build-a-hooper-high-score-guide` in
  `src/content/posts/index.ts`.

## Acceptance criteria

- Both locale files load through the existing local-post system.
- The English keywords appear in meaningful sentences and headings.
- Every numerical gameplay claim matches the current source code.
- Links point to `/game`, `/leaderboard`, `/best-builds`, `/attributes`, and
  `/modes`.
- `pnpm build` passes.
