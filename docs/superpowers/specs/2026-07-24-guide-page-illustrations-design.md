# Guide Page Illustration Design

## Goal

Create and integrate four coordinated decorative illustrations for:

- `/attributes`
- `/how-to-play`
- `/modes`
- `/best-builds`

The illustrations should make the long-form guides easier to recognize and visually
scan without presenting generated art as authoritative game UI or player data.

## Visual Direction

Use a **retro tactical poster** system:

- warm paper texture
- deep green, sand gold, and burnt orange palette
- bold geometric composition
- basketball court markings, tactical paths, and anonymous player silhouettes
- editorial print character rather than photorealism

The four images must feel like one family while retaining distinct compositions. They
must contain no real player likenesses, team logos, league branding, or generated text.

## Image Set

All four images use a 16:9 landscape format suitable for full-width placement in the
existing MDX reading column.

### Attributes

An anonymous player silhouette anchors the composition. Thirteen tactical nodes and
connecting paths imply the attribute system without spelling attribute names inside
the image.

### How to Play

A circular tactical route moves through five abstract stages: mode selection, position,
draft, player reveal, and an 82-game season. Use symbols and spatial progression, not
embedded labels.

### Modes

A triptych represents the three information states: a clear scouting board for Classic,
a partially obscured board for Blind, and fragmented unpredictable geometry for Chaos.

### Best Builds

A half-court lineup diagram shows five positionally distinct anonymous silhouettes,
communicating complementary roles and balanced roster construction.

## Integration

Insert each illustration immediately after the page H1 and before the opening
paragraph. Reuse the same asset between English and Chinese versions of a page, but
provide localized, descriptive alt text in each MDX file.

Use the existing MDX `img` renderer so the illustrations inherit the current rounded
border, responsive width, lazy loading, and shadow treatment. No component or routing
changes are required.

## Files

Generated assets will live under:

`public/imgs/generated/`

The following MDX sources will reference them:

- `src/content/pages/attributes.en.mdx`
- `src/content/pages/attributes.zh.mdx`
- `src/content/pages/how-to-play.en.mdx`
- `src/content/pages/how-to-play.zh.mdx`
- `src/content/pages/modes.en.mdx`
- `src/content/pages/modes.zh.mdx`
- `src/content/pages/best-builds.en.mdx`
- `src/content/pages/best-builds.zh.mdx`

## Verification

- Confirm all four image files exist and have the intended landscape dimensions.
- Confirm every English and Chinese guide has the correct asset and localized alt text.
- Run `pnpm build` and require it to pass.
- Review the rendered pages at desktop and mobile widths when a local browser session
  is available.

## Out of Scope

- Separate illustrations for the five position detail pages
- Real player portraits or team/league branding
- Changes to page copy, routes, metadata, or navigation
- Generated diagrams containing readable labels or statistics
