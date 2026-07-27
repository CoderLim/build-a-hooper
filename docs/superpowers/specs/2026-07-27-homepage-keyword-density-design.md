# Homepage Keyword Density Design

## Goal

Raise the exact-match English homepage keyword “Build a Hooper” from roughly
1.4% to approximately 3.0%, without making the page sound repetitive,
mechanical, or machine-written.

## Scope

- Update existing English homepage translation values in `messages/en.json`.
- Keep the current homepage sections, hierarchy, links, and components.
- Do not add new translation keys or change non-English locales.
- Preserve useful supporting terms such as game, simulator, modes, attributes,
  builds, guide, and season strategy.

## Content approach

Use the full name where a human writer would naturally re-establish the subject:
section headings, opening sentences, transitions between guide topics, and
direct FAQ answers. Replace ambiguous subjects such as “the game,” “the
simulator,” “it,” or an isolated “build” when the full name improves clarity.
Avoid repeated exact matches within neighboring sentences and avoid standalone
SEO filler.

## Acceptance criteria

- The same homepage-content counting method used for the baseline reports an
  exact-match phrase density close to 3.0%, without materially exceeding it.
- The exact phrase remains distributed across the page rather than clustered in
  one section.
- No existing translation key is removed or added.
- `pnpm build` passes.
