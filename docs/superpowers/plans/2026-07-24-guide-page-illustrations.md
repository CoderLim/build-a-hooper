# Guide Page Illustrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and integrate four coordinated retro tactical-poster illustrations for the Attributes, How to Play, Modes, and Best Builds guides.

**Architecture:** Generate four standalone 16:9 raster assets under `public/imgs/generated/`, then reference each shared asset from the English and Chinese MDX variants of its guide. The existing MDX image renderer provides responsive layout, border, radius, shadow, and lazy loading; no React component changes are needed.

**Tech Stack:** Pollinations image generation script, MDX, React MDX component mapping, TanStack Start/Vite

---

### Task 1: Generate the four-image poster series

**Files:**

- Create: `public/imgs/generated/attributes-tactical-poster.webp`
- Create: `public/imgs/generated/how-to-play-tactical-poster.webp`
- Create: `public/imgs/generated/modes-tactical-poster.webp`
- Create: `public/imgs/generated/best-builds-tactical-poster.webp`

- [ ] **Step 1: Generate the Attributes poster**

Run the project image-generation script once with a 16:9 prompt:

```bash
echo '{"prompt":"retro basketball tactical poster on warm aged paper, deep forest green sand gold and burnt orange palette, anonymous basketball player silhouette centered, exactly thirteen abstract circular skill nodes connected by crisp coaching diagram paths, bold screenprint geometry, editorial sports magazine composition, no real person, no team logo, no league branding, no letters, no numbers, no text","style":"illustration","width":1280,"height":720,"slug":"attributes-tactical-poster","seed":1301}' | node .claude/skills/generate-image/main.mjs
```

Expected: JSON containing a created `public/imgs/generated/attributes-tactical-poster-*.png` file and its `/imgs/generated/...` public URL.

Rename the returned file to the stable integration path:

```bash
mv "$(find public/imgs/generated -type f -name 'attributes-tactical-poster-*.png' -print | sort | tail -1)" public/imgs/generated/attributes-tactical-poster.png
```

- [ ] **Step 2: Generate the How to Play poster**

```bash
echo '{"prompt":"retro basketball tactical poster on warm aged paper, deep forest green sand gold and burnt orange palette, circular coaching route flowing through five abstract stages represented only by icons: mode choice, court position, player draft, player reveal, full season, anonymous basketball silhouettes, bold screenprint geometry, editorial sports magazine composition, no real person, no team logo, no league branding, no letters, no numbers, no text","style":"illustration","width":1280,"height":720,"slug":"how-to-play-tactical-poster","seed":1302}' | node .claude/skills/generate-image/main.mjs
```

Expected: JSON containing a created `public/imgs/generated/how-to-play-tactical-poster-*.png` file and its public URL.

```bash
mv "$(find public/imgs/generated -type f -name 'how-to-play-tactical-poster-*.png' -print | sort | tail -1)" public/imgs/generated/how-to-play-tactical-poster.png
```

- [ ] **Step 3: Generate the Modes poster**

```bash
echo '{"prompt":"retro basketball tactical poster triptych on warm aged paper, deep forest green sand gold and burnt orange palette, left panel clear scouting diagram, middle panel partially obscured player and court diagram, right panel fragmented unpredictable court geometry, anonymous basketball silhouettes, bold screenprint editorial composition, no real person, no team logo, no league branding, no letters, no numbers, no text","style":"illustration","width":1280,"height":720,"slug":"modes-tactical-poster","seed":1303}' | node .claude/skills/generate-image/main.mjs
```

Expected: JSON containing a created `public/imgs/generated/modes-tactical-poster-*.png` file and its public URL.

```bash
mv "$(find public/imgs/generated -type f -name 'modes-tactical-poster-*.png' -print | sort | tail -1)" public/imgs/generated/modes-tactical-poster.png
```

- [ ] **Step 4: Generate the Best Builds poster**

```bash
echo '{"prompt":"retro basketball tactical poster on warm aged paper, deep forest green sand gold and burnt orange palette, half-court lineup diagram with five positionally distinct anonymous basketball silhouettes arranged as a balanced team, coaching arrows and role zones, bold screenprint editorial geometry, no real person, no team logo, no league branding, no letters, no numbers, no text","style":"illustration","width":1280,"height":720,"slug":"best-builds-tactical-poster","seed":1304}' | node .claude/skills/generate-image/main.mjs
```

Expected: JSON containing a created `public/imgs/generated/best-builds-tactical-poster-*.png` file and its public URL.

```bash
mv "$(find public/imgs/generated -type f -name 'best-builds-tactical-poster-*.png' -print | sort | tail -1)" public/imgs/generated/best-builds-tactical-poster.png
```

- [ ] **Step 5: Verify asset dimensions and formats**

Run:

```bash
file public/imgs/generated/*-tactical-poster.webp
```

Expected: four WebP images with consistent 16:9 landscape dimensions.

### Task 2: Integrate localized images into the MDX guides

**Files:**

- Modify: `src/content/pages/attributes.en.mdx`
- Modify: `src/content/pages/attributes.zh.mdx`
- Modify: `src/content/pages/how-to-play.en.mdx`
- Modify: `src/content/pages/how-to-play.zh.mdx`
- Modify: `src/content/pages/modes.en.mdx`
- Modify: `src/content/pages/modes.zh.mdx`
- Modify: `src/content/pages/best-builds.en.mdx`
- Modify: `src/content/pages/best-builds.zh.mdx`

- [ ] **Step 1: Insert the English image references**

Immediately after each H1, insert the actual generated public URL using these alt texts:

```md
![Retro tactical poster mapping thirteen basketball attributes around an anonymous player](/imgs/generated/attributes-tactical-poster.webp)
```

```md
![Retro tactical poster showing the five-stage Build a Hooper game loop](/imgs/generated/how-to-play-tactical-poster.webp)
```

```md
![Retro triptych contrasting clear, hidden, and chaotic basketball draft information](/imgs/generated/modes-tactical-poster.webp)
```

```md
![Retro half-court tactical poster showing five complementary basketball positions](/imgs/generated/best-builds-tactical-poster.webp)
```

- [ ] **Step 2: Insert the Chinese image references**

Use the same four URLs immediately after the matching Chinese H1 headings with these localized alt texts:

```md
![复古战术海报：匿名球员周围连接十三项篮球属性节点](/imgs/generated/attributes-tactical-poster.webp)
```

```md
![复古战术海报：展示 Build a Hooper 的五阶段游戏循环](/imgs/generated/how-to-play-tactical-poster.webp)
```

```md
![复古三联战术海报：对比清晰、隐藏和混沌的篮球选秀信息](/imgs/generated/modes-tactical-poster.webp)
```

```md
![复古半场战术海报：展示五个互补的篮球位置](/imgs/generated/best-builds-tactical-poster.webp)
```

- [ ] **Step 3: Verify every guide references exactly one generated image**

Run:

```bash
rg -n "^!\\[" src/content/pages/{attributes,how-to-play,modes,best-builds}.{en,zh}.mdx
```

Expected: eight matches, one in each MDX file, with English and Chinese alt text pointing to the same asset for each route.

### Task 3: Validate the production build and rendered layout

**Files:**

- Verify: `src/components/mdx-components.tsx`
- Verify: the eight MDX files from Task 2
- Verify: the four generated WebP assets from Task 1

- [ ] **Step 1: Run formatting checks on the changed text files**

Run:

```bash
pnpm exec prettier --check docs/superpowers/plans/2026-07-24-guide-page-illustrations.md src/content/pages/{attributes,how-to-play,modes,best-builds}.{en,zh}.mdx
```

Expected: all matched files pass Prettier validation.

- [ ] **Step 2: Build the application**

Run:

```bash
pnpm build
```

Expected: exit code 0 with the TanStack Start/Vite production output completed.

- [ ] **Step 3: Inspect the four routes at desktop and mobile widths**

Start the local app with `pnpm dev`, then inspect:

```text
/attributes
/how-to-play
/modes
/best-builds
```

Expected: each route shows one full-width illustration below its H1; the image remains inside the reading column without horizontal overflow at desktop and mobile widths, and both English and `/zh` variants resolve the asset.

- [ ] **Step 4: Review the final diff**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only the intended plan, four assets, and eight MDX integrations appear alongside the user's pre-existing worktree changes.
