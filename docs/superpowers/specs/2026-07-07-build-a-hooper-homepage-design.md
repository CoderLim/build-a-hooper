# Build a Hooper Homepage Design

## Goal

Create the first production homepage for `buildahooper.org` as a localized game landing page for Build a Hooper.

This first version will focus on:

- a static marketing homepage
- site-level localization for English and Chinese
- a playable hero section with an embedded iframe for `https://build-a-hooper.pages.dev/`
- long-form SEO content on the homepage for each locale
- a localized privacy policy page

This version will not change auth, dashboard, payments, pricing logic, database schema, or other app modules.

## Scope

### In scope

- Replace the current demo homepage composition with a game-focused homepage
- Replace the current demo landing copy in `messages/en.json` and `messages/zh.json`
- Support English and Chinese as separate localized pages, not mixed on one page
- Configure homepage metadata around `buildahooper.org`
- Add homepage sections that support search intent around the game
- Keep one embedded playable area above the fold
- Update the privacy policy page content for the game site
- Keep the existing localization system, routing, and shared primitives where possible

### Out of scope

- User accounts, sign-in flow, dashboard customization, and admin features
- Monetization, checkout, or pricing configuration
- Additional guide pages, blog migration, or multi-page SEO architecture
- Custom backend modules or API routes
- Copying the embedded game into this codebase

## Product Positioning

Build a Hooper is an unofficial browser basketball simulator where players draft skills inspired by legendary and modern basketball teams, build a custom player, and run an 82-game season.

The homepage should communicate three things immediately:

1. You can play the game right now.
2. The game is about roster building, attributes, modes, and season strategy.
3. The site is a useful destination for discovery and search, not just a thin embed page.

## User Experience

### Audience

- players searching for "Build a Hooper"
- basketball sim fans looking for gameplay explanation
- users searching for tips, strategy, attributes, modes, or season guidance
- English-speaking and Chinese-speaking visitors

### Primary journey

1. Land on homepage from search or direct visit
2. Understand the premise in one screen
3. Start playing immediately in the hero iframe
4. Scroll for gameplay explanation, strategy, and FAQ
5. Optionally switch language or open privacy page

### Secondary journey

1. Land on homepage from a broad search query
2. Read long-form content without playing immediately
3. Build trust through structured explanations and disclaimer content
4. Continue into the game when ready

## Information Architecture

The homepage should be rebuilt as a content-first game landing page with these sections:

1. Header
2. Hero with embed
3. Quick game highlights
4. How the game works
5. Attributes and modes overview
6. Strategy and season guide
7. FAQ
8. Disclaimer / unofficial notice
9. Footer with privacy link

The page should remain a single route at `/` with localization handled by the existing routing system.

## Content Strategy

### Localization model

The site will use one active locale per page view.

- English page: default localized homepage
- Chinese page: localized homepage under the existing i18n URL strategy

Each locale will have:

- its own headline and section copy
- its own meta title and meta description
- its own SEO body copy
- shared structure, different localized wording

The page must not display both languages together.

### SEO strategy

The homepage copy should target navigational and informational intent:

- Build a Hooper
- Build a Hooper game
- Build a Hooper basketball simulator
- Build a Hooper guide
- Build a Hooper tips
- Build a Hooper attributes
- Build a Hooper modes
- Build a Hooper season strategy

Each locale should contain roughly 1000 words of meaningful content. The content should read like a genuine overview and guide, not keyword stuffing.

The copy should include:

- what the game is
- what the player does
- why attributes matter
- how drafting skills changes outcomes
- what the season structure means
- strategic advice for team-building and long-term progression
- short answers to likely search questions

## Visual Direction

Recommended direction: content-led sports simulator landing page.

Characteristics:

- dark, modern, high-contrast feel
- clear typography and readable long-form sections
- subtle basketball/sports atmosphere through color and spacing rather than loud graphics
- hero area prioritizes playability over illustration
- confident information hierarchy that makes the page feel like both a game portal and a useful guide

The page should feel more editorial and game-focused than generic SaaS.

## Technical Design

### Route composition

Reuse the homepage route at `src/routes/index.tsx`, but replace the demo sections with a new composition tailored to the game homepage.

Likely homepage block set:

- `Header`
- `Hero`
- `Features` or equivalent highlights section
- `HowItWorks`
- `Guide` or `Strategy`
- `FAQ`
- `Footer`

The exact filenames can adapt to the existing block structure, but the final composition should stay small and readable.

### Shared components

Prefer existing site primitives where they fit:

- `components/site-header.tsx`
- `components/site-footer.tsx`
- `components/ui/*`

If existing demo blocks are too SaaS-specific, rewrite or replace them while keeping the durable primitives.

### i18n

All user-facing content must come from `messages/en.json` and `messages/zh.json`.

Add new flat keys for:

- homepage metadata
- navigation labels
- hero copy
- embed helper text
- section headings and body content
- FAQ entries
- disclaimer text
- privacy page content if needed

Remove reliance on the current demo `landing.*` semantics where they no longer fit, or repurpose them consistently if that keeps the implementation simpler.

### Metadata

Update app-level metadata content for the product:

- `common.metadata.title`
- `common.metadata.description`

Homepage `head` should use localized title, description, canonical URL, and alternate locale links. The domain should be `https://buildahooper.org`.

### Privacy page

Keep the existing privacy route, but replace the placeholder or template policy with copy appropriate for:

- a browser game portal
- iframe embedding of the public game
- standard analytics/contact/privacy language appropriate to this site

The page should exist in both English and Chinese MDX files.

## Content Sections

### Header

Purpose:

- brand
- locale switcher
- quick anchor links to key sections
- play call-to-action

Suggested nav targets:

- Play
- Guide
- FAQ
- Privacy

### Hero

Purpose:

- immediately explain the game
- embed the actual game
- provide concise context before the long-form content

Hero elements:

- title and subtitle
- 1 primary CTA to play / jump to iframe
- 1 secondary CTA to scroll to guide
- short game stats or badges
- iframe container for `https://build-a-hooper.pages.dev/`

Implementation notes:

- iframe must be responsive
- ensure clear loading/fallback text
- maintain enough height to make the game usable above the fold

### Highlights

Purpose:

- summarize the core loop quickly

Possible cards:

- Draft skills
- Build your player
- Manage attributes
- Chase an 82-game season

### How It Works

Purpose:

- explain the core gameplay loop in a scannable structure

Suggested flow:

1. Choose or draft team-inspired skills
2. Build around attribute strengths
3. Simulate and adapt through the season

### Attributes and Modes

Purpose:

- capture search intent around how the systems work
- explain the known public structure of attributes and modes

This section should describe the game as a basketball simulator with multiple attributes and modes, while avoiding made-up mechanical specifics that cannot be supported.

### Strategy Guide

Purpose:

- provide long-form SEO value
- help the user make better decisions in-game

Topics to cover:

- balancing short-term power and season durability
- choosing complementary strengths instead of stacking random traits
- adapting build choices to game mode
- thinking about consistency over an 82-game schedule
- experimenting with archetypes rather than forcing one perfect build

### FAQ

Purpose:

- answer direct search questions
- improve scanability and structured reading

Questions should include:

- What is Build a Hooper?
- How do attributes affect performance?
- What should beginners focus on?
- Why does season strategy matter?
- Is this an official NBA game?

### Disclaimer

Purpose:

- reduce confusion around licensing and affiliation
- reflect the unofficial nature shown by the source game

This should state that the experience is unofficial and is not affiliated with official leagues, teams, logos, or uniforms.

## Implementation Approaches Considered

### Approach 1: Minimal embed page

Embed the game and add only a few supporting paragraphs.

Pros:

- fastest build
- low implementation risk

Cons:

- weak SEO value
- feels thin
- misses the user's content goal

### Approach 2: Content-first localized homepage

Build a single strong homepage with playable hero and long-form sections in each locale.

Pros:

- strongest match for the current goal
- good balance of speed, SEO, and usability
- easy to extend later into more content pages

Cons:

- requires substantial copywriting in both locales

### Approach 3: Multi-page content architecture now

Split homepage, guide, FAQ, and strategy into separate pages immediately.

Pros:

- strongest long-term SEO structure

Cons:

- too large for the requested first version
- adds routing and content overhead now

## Recommendation

Use Approach 2.

This matches the approved scope: launch a homepage first, keep the real game immediately playable, support site-level localization, and make the homepage substantial enough to earn search traffic.

## Error Handling and Edge Cases

- If the iframe cannot load, show a direct link to `https://build-a-hooper.pages.dev/`
- If long-form content makes the page too dense on mobile, collapse only low-priority supporting content, not the core guide
- Keep anchor navigation resilient even if section order changes
- Avoid unsupported claims about hidden game mechanics

## Testing and Verification

Implementation should be verified with:

- `pnpm build`
- manual check of homepage in English
- manual check of homepage in Chinese
- manual check of iframe responsiveness
- manual check of privacy page in both locales
- manual check of canonical and alternate locale metadata

## Deliverables

1. Rewritten homepage route composition
2. New or rewritten homepage blocks
3. Updated `messages/en.json`
4. Updated `messages/zh.json`
5. Updated privacy policy content in both locales
6. Localized homepage metadata for `buildahooper.org`

## Future Follow-ups

Not part of this implementation, but enabled by it:

- dedicated guide pages
- strategy subpages for SEO clusters
- screenshot galleries or original visuals
- terms of service refresh
- analytics configuration for gameplay entry and language usage
