# Build a Hooper Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the demo landing page with a localized Build a Hooper homepage that embeds the live game, ships long-form SEO content in English and Chinese, and includes an updated privacy page for `buildahooper.org`.

**Architecture:** Keep the existing route and i18n system, but swap the SaaS demo blocks for game-specific sections. Reuse shared `SiteHeader` and `SiteFooter`, rebuild homepage blocks around iframe playability and editorial SEO content, and update the privacy MDX files instead of adding new routes or backend code.

**Tech Stack:** TanStack Start, React 19, TypeScript, Paraglide i18n, MDX static pages, Tailwind CSS 4, shadcn/ui

---

## File Structure

### Files to modify

- `src/routes/index.tsx`
  - Replace the demo homepage composition and localized metadata wiring.
- `src/blocks/header.tsx`
  - Update nav targets for the new homepage sections.
- `src/blocks/hero.tsx`
  - Replace SaaS hero content with game intro, CTAs, stats, and iframe embed.
- `src/blocks/features.tsx`
  - Convert feature cards into game highlights.
- `src/blocks/faq.tsx`
  - Replace SaaS FAQ content with game-specific FAQ entries.
- `src/blocks/footer.tsx`
  - Update footer columns and links for the game site.
- `messages/en.json`
  - Add English homepage metadata, section copy, FAQ, disclaimer, and footer copy.
- `messages/zh.json`
  - Add Chinese homepage metadata, section copy, FAQ, disclaimer, and footer copy.
- `src/content/pages/privacy-policy.en.mdx`
  - Replace template privacy text with game-site-specific policy.
- `src/content/pages/privacy-policy.zh.mdx`
  - Replace template privacy text with localized game-site-specific policy.

### Files to create

- `src/blocks/how-it-works.tsx`
  - Three-step explanation of the core gameplay loop.
- `src/blocks/guide.tsx`
  - Long-form attributes, modes, and strategy content section.
- `src/blocks/disclaimer.tsx`
  - Unofficial/fan-made notice and licensing clarification section.

### Verification targets

- `pnpm build`
- Manual homepage check in English and Chinese
- Manual privacy page check in English and Chinese
- Manual iframe and anchor navigation check

---

### Task 1: Rewrite homepage translation model and metadata

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/zh.json`

- [ ] **Step 1: Replace app-level metadata with Build a Hooper values**

Update these keys in `messages/en.json`:

```json
"common.metadata.title": "Build a Hooper - Play the Basketball Team Building Simulator",
"common.metadata.description": "Play Build a Hooper online at buildahooper.org. Draft skills, shape your attributes, experiment with game modes, and chase a full 82-game basketball season."
```

Update these keys in `messages/zh.json`:

```json
"common.metadata.title": "Build a Hooper - 在线体验篮球建队模拟器",
"common.metadata.description": "在 buildahooper.org 在线体验 Build a Hooper。选技能、配属性、尝试不同模式，并挑战完整的 82 场篮球赛季。"
```

- [ ] **Step 2: Add homepage metadata keys for localized head tags**

Add these keys in `messages/en.json`:

```json
"landing.meta.title": "Build a Hooper - Play Online, Learn the Modes, Master the Season",
"landing.meta.description": "Build a Hooper is an unofficial browser basketball simulator where you draft skills, tune attributes, explore game modes, and push through an 82-game season.",
"landing.nav.play": "Play",
"landing.nav.guide": "Guide",
"landing.nav.faq": "FAQ",
"landing.nav.privacy": "Privacy",
"landing.hero.eyebrow": "Unofficial basketball simulator",
"landing.hero.headline": "Spin, build, simulate, and chase your perfect 82-game season.",
"landing.hero.subheadline": "Build a Hooper lets you draft team-inspired skills, shape your player's strengths, and test your roster logic across a full season from your browser.",
"landing.hero.primary": "Play now",
"landing.hero.secondary": "Read the guide",
"landing.hero.stat.attributes": "13 attributes",
"landing.hero.stat.modes": "3 modes",
"landing.hero.stat.games": "82 games",
"landing.hero.embed_title": "Build a Hooper game embed",
"landing.hero.embed_fallback": "If the game does not load in the embedded frame, open it in a new tab.",
"landing.hero.embed_link": "Open the game directly"
```

Add these keys in `messages/zh.json`:

```json
"landing.meta.title": "Build a Hooper - 在线游玩、了解模式、掌握赛季策略",
"landing.meta.description": "Build a Hooper 是一款非官方浏览器篮球模拟游戏。你可以搭配技能、配置属性、尝试不同模式，并挑战完整 82 场赛季。",
"landing.nav.play": "开始玩",
"landing.nav.guide": "攻略",
"landing.nav.faq": "常见问题",
"landing.nav.privacy": "隐私",
"landing.hero.eyebrow": "非官方篮球模拟器",
"landing.hero.headline": "转出技能，打造球员，模拟赛季，冲击你的 82 场终极征程。",
"landing.hero.subheadline": "Build a Hooper 让你在浏览器里围绕球队风格技能来构建球员，配置成长方向，并把一套 build 放进完整赛季里检验。",
"landing.hero.primary": "立即开玩",
"landing.hero.secondary": "查看攻略",
"landing.hero.stat.attributes": "13 项属性",
"landing.hero.stat.modes": "3 种模式",
"landing.hero.stat.games": "82 场赛季",
"landing.hero.embed_title": "Build a Hooper 游戏嵌入",
"landing.hero.embed_fallback": "如果嵌入框未能加载游戏，可以直接在新标签页打开。",
"landing.hero.embed_link": "直接打开游戏"
```

- [ ] **Step 3: Add game-highlight, guide, FAQ, and disclaimer keys**

Add these English keys in `messages/en.json`:

```json
"landing.features.title": "Why players keep coming back to Build a Hooper",
"landing.features.description": "The game loop is simple to start but surprisingly deep once you begin optimizing a full season.",
"landing.features.draft.title": "Draft skills with identity",
"landing.features.draft.description": "Each run starts with choices that feel tied to recognizable basketball archetypes, so your build has direction before the season even begins.",
"landing.features.build.title": "Shape a player around strengths",
"landing.features.build.description": "Attributes matter because they define how consistently your player performs, how your strengths compound, and where your build can break under pressure.",
"landing.features.modes.title": "Adjust to different modes",
"landing.features.modes.description": "Different modes reward different priorities, which makes experimentation part of the fun instead of an afterthought.",
"landing.features.season.title": "Think beyond one hot streak",
"landing.features.season.description": "An 82-game season rewards durable builds, not just flashy peaks, so roster logic and long-term balance matter.",
"landing.how.title": "How Build a Hooper works",
"landing.how.description": "The best way to enjoy the game is to think of every run as a basketball theory test: can this build survive an entire season?",
"landing.how.step1.title": "1. Draft a direction",
"landing.how.step1.description": "Start by choosing skills that point you toward a clear identity instead of collecting disconnected bonuses.",
"landing.how.step2.title": "2. Build around attributes",
"landing.how.step2.description": "Use the attribute spread to support the style you want to play, because efficiency comes from synergy more than from isolated numbers.",
"landing.how.step3.title": "3. Survive the season",
"landing.how.step3.description": "The real test is whether your choices still make sense after many games, when consistency and adaptability start separating good builds from fragile ones.",
"landing.guide.title": "Build a Hooper guide, tips, and season strategy",
"landing.guide.intro": "Build a Hooper stands out because it turns a familiar sports fantasy into a small, fast, replayable simulation loop. You are not only clicking through a basketball game; you are building a theory about what kind of player wins over time. The fun starts with the draft, but the real depth shows up later, when you realize that every skill choice changes how your attributes should be valued and how much risk your season can tolerate. That is why the game feels better when you stop looking for one perfect build and start thinking in terms of archetypes, trade-offs, and season-long consistency.",
"landing.guide.attributes_title": "How to think about attributes",
"landing.guide.attributes_body": "The public game page tells us there are 13 attributes, and that alone changes how you should approach the simulator. A larger attribute spread usually means no single stat can carry everything. Instead, the strongest runs tend to come from builds where several strengths reinforce each other. If your draft points you toward explosive offense, you still need enough balance to avoid collapsing in the long season. If your choices lean toward all-around stability, the goal becomes maximizing repeatable value rather than chasing the most dramatic result in one stretch. Beginners often overreact to the most exciting option on the board, but better results usually come from asking which attribute investments make the entire build more coherent.",
"landing.guide.modes_title": "How to approach the different modes",
"landing.guide.modes_body": "Because Build a Hooper includes three modes, it is safer to think in terms of adaptation rather than a universal recipe. Some modes will make aggression more rewarding, while others may punish imbalance over time. The practical lesson is simple: do not assume the first successful build transfers perfectly everywhere. When you switch modes, look at the same set of strengths through a new lens. Does this setup depend on short bursts? Does it need consistency? Does it rely on one weakness never being exposed? Treat every mode as a new environment for testing your basketball logic, and your experimentation becomes much more productive.",
"landing.guide.season_title": "How to survive an 82-game season",
"landing.guide.season_body": "The 82-game structure is one of the most important parts of the fantasy. A long season shifts the goal from momentary excitement to repeatable performance. In practical terms, that means you should value stability, role clarity, and compounding strengths. A build that looks unstoppable in the short term can become disappointing if it depends on everything breaking perfectly. Strong season builds usually have a plan for average nights, not just peak nights. They win because they continue producing when the novelty wears off. That is the key strategic mindset for Build a Hooper: the best player is not always the most dramatic one, but the one whose strengths still matter in game 57, game 68, and game 82.",
"landing.guide.beginner_title": "Beginner advice that actually helps",
"landing.guide.beginner_body": "If you are new, start by forcing yourself to commit to one identity per run. Do one offensive-leaning build. Do one balanced build. Do one build that tries to maximize steadiness instead of excitement. After each attempt, ask what failed first. Did the player lack enough support around a signature strength? Did the season expose a weak area that seemed harmless at the draft stage? Did a mode reward a pacing strategy you ignored? This style of reflection will teach you more than blindly rerolling for better luck. Build a Hooper becomes much more satisfying when you read each season as feedback on your decisions.",
"landing.guide.search_title": "Why players search for guides",
"landing.guide.search_body": "Search interest around Build a Hooper usually comes from the same curiosity loop: players want to know whether there is a best build, whether attributes matter more than skills, and how much mode selection changes the right strategy. The most honest answer is that the game becomes more interesting when you stop hunting for a single solved formula. The better question is how to create a build that fits the mode, survives the season, and stays internally consistent. Once you approach the simulator that way, the draft becomes more meaningful, the season becomes easier to read, and your improvements become easier to repeat.",
"landing.faq.title": "Frequently asked questions",
"landing.faq.description": "Quick answers for players who want to understand the game before or while playing.",
"landing.faq.what.question": "What is Build a Hooper?",
"landing.faq.what.answer": "Build a Hooper is an unofficial browser basketball simulator focused on drafting skills, shaping a custom player, and testing your build across a full 82-game season.",
"landing.faq.attributes.question": "How do attributes affect performance?",
"landing.faq.attributes.answer": "Attributes shape how reliably your build expresses its strengths. The game advertises 13 attributes, so the key is usually synergy and balance rather than one isolated number.",
"landing.faq.beginners.question": "What should beginners focus on first?",
"landing.faq.beginners.answer": "Start by choosing a clear identity for each run. Builds become easier to understand when your skill draft and attribute priorities support the same direction.",
"landing.faq.season.question": "Why does season strategy matter so much?",
"landing.faq.season.answer": "A full 82-game season rewards consistency. A flashy build can look great early and still fade if it lacks balance, durability, or adaptability.",
"landing.faq.official.question": "Is this an official NBA game?",
"landing.faq.official.answer": "No. Build a Hooper is presented here as an unofficial basketball simulator and is not affiliated with the NBA or official team branding.",
"landing.disclaimer.title": "Unofficial game notice",
"landing.disclaimer.body": "Build a Hooper is an unofficial basketball simulator experience. This site is a fan-oriented portal that embeds the publicly available game and provides original explanatory content, strategy notes, and localized guidance. It is not affiliated with the NBA or with any official league, team, logo, photo, or uniform rights holder."
```

Add these Chinese keys in `messages/zh.json`:

```json
"landing.features.title": "为什么玩家会反复回到 Build a Hooper",
"landing.features.description": "它上手很快，但一旦你开始为完整赛季优化 build，深度就会明显冒出来。",
"landing.features.draft.title": "围绕球队风格去选技能",
"landing.features.draft.description": "每次开局的选择都像是在确定球员原型，让你的 build 一开始就有明确方向，而不是随机堆效果。",
"landing.features.build.title": "围绕强项来塑造球员",
"landing.features.build.description": "属性的重要性不只在高低本身，更在于它决定你的强项能否稳定兑现、能否叠加放大，以及短板会不会被放大。",
"landing.features.modes.title": "不同模式要换不同思路",
"landing.features.modes.description": "模式变化会改变优先级，所以实验本身就是乐趣的一部分，而不是开局之后才补救。",
"landing.features.season.title": "别只看一时爆发",
"landing.features.season.description": "82 场赛季奖励的是能长期运转的 build，而不是只在短时间里华丽的峰值表现。",
"landing.how.title": "Build a Hooper 是怎么玩的",
"landing.how.description": "最适合这款游戏的心态，是把每一次 run 都当成一次篮球逻辑测试：这套 build 真的能撑完整个赛季吗？",
"landing.how.step1.title": "1. 先确定方向",
"landing.how.step1.description": "一开始就围绕同一种球员身份去选技能，不要把互相脱节的收益硬凑在一起。",
"landing.how.step2.title": "2. 再让属性配合方向",
"landing.how.step2.description": "属性分布要服务于你想打出的风格，因为效率通常来自联动，而不是某一个孤立数字特别高。",
"landing.how.step3.title": "3. 用赛季检验 build",
"landing.how.step3.description": "真正的难点在于很多场比赛之后，这套选择是否仍然成立；稳定性和可调整性会把强 build 与脆弱 build 拉开。",
"landing.guide.title": "Build a Hooper 攻略、技巧与赛季思路",
"landing.guide.intro": "Build a Hooper 的吸引力，在于它把大家熟悉的篮球幻想压缩成一个轻量、快速、可反复试验的模拟循环。你不是单纯点开一场篮球游戏，而是在验证一种关于“什么样的球员能长期赢球”的想法。乐趣从选技能开始，但深度会在后面才真正出现，因为你很快会发现，每一次 draft 都会改变你该如何看待属性，也会改变你这套 build 能承受多大的风险。所以与其执着于找一套唯一正确答案，不如把注意力放在原型、取舍和赛季稳定性上。",
"landing.guide.attributes_title": "应该怎么理解属性",
"landing.guide.attributes_body": "公开页面告诉我们这款游戏有 13 项属性，这一点本身就很关键。属性维度一多，通常就意味着没有任何单一数值可以包打天下。更强的 run 往往来自多个强项彼此加成，而不是某个点异常突出。如果你的 draft 明显偏向进攻爆发，那你仍然需要足够的平衡，避免长赛季里出现断崖式下滑；如果你的选择更偏向全能稳定，那目标就是把可重复兑现的价值最大化，而不是追逐某一段极端夸张的表现。新手最常见的问题，是被最刺激的选项吸引，却没有回头问一句：这会不会让整套 build 更完整？",
"landing.guide.modes_title": "不同模式该怎么应对",
"landing.guide.modes_body": "既然 Build a Hooper 有 3 种模式，更稳妥的思路就是把“适应”放在“套公式”前面。有些模式可能更鼓励激进打法，有些模式则会更快暴露失衡 build 的问题。最实用的经验是，不要假设一套成功 build 可以原封不动地通吃所有环境。当你切换模式时，要重新审视同一批优点：它是靠短时间爆发吃饭，还是靠长期稳定取胜？它是不是默认自己的短板永远不会被针对？把每种模式都当成新的篮球环境去测试，你的实验效率会高很多。",
"landing.guide.season_title": "82 场赛季为什么改变一切",
"landing.guide.season_body": "82 场赛季是这款游戏最有味道的部分之一，因为它会把目标从“瞬间爽感”拉回到“长期可重复表现”。落到实际策略上，你会更看重稳定性、角色清晰度和优势叠加能力。一套 build 也许前几场看起来无敌，但如果它只能在所有条件都刚好成立时才发挥，那后面往往会掉下去。真正强的赛季 build，通常不是只会打巅峰局，而是连普通夜晚也有明确产出逻辑。这也是 Build a Hooper 最值得抓住的核心思维：最好的球员，不一定是最夸张的那个，而是到了第 57 场、第 68 场、第 82 场，优势依然成立的那个。",
"landing.guide.beginner_title": "真正有用的新手建议",
"landing.guide.beginner_body": "如果你刚上手，最好的练习不是疯狂重开，而是强迫自己每一轮都只验证一种身份。试一次偏进攻的 build，试一次更平衡的 build，再试一次把稳定性放在第一位的 build。每轮结束之后，问自己最先出问题的是什么：是不是某个招牌强项缺少支撑？是不是赛季把一个原本看起来无伤大雅的短板放大了？是不是某种模式奖励了你原本忽略的节奏？这种复盘方式比单纯赌下一把运气更有价值，也会让 Build a Hooper 变得更耐玩。",
"landing.guide.search_title": "为什么大家会来搜攻略",
"landing.guide.search_body": "大家搜索 Build a Hooper 攻略，往往都源于同一种好奇：到底有没有最强 build？属性和技能哪个更重要？模式切换会不会彻底改变正确答案？最诚实的回答是，这款游戏在你放弃“唯一解”之后会更有意思。真正应该问的问题，是这套 build 是否适合当前模式，是否扛得住完整赛季，内部逻辑是否自洽。当你开始这样理解模拟器，draft 会更有意义，赛季会更容易读懂，你的进步也会更容易复现。",
"landing.faq.title": "常见问题",
"landing.faq.description": "给准备开玩或正在游玩的玩家一些快速答案。",
"landing.faq.what.question": "Build a Hooper 是什么游戏？",
"landing.faq.what.answer": "Build a Hooper 是一款非官方浏览器篮球模拟游戏，重点在于选技能、塑造自定义球员，并把 build 放进完整 82 场赛季里检验。",
"landing.faq.attributes.question": "属性到底会怎么影响表现？",
"landing.faq.attributes.answer": "属性决定的是一套 build 能否稳定兑现它的强项。既然公开信息里提到有 13 项属性，通常就更需要联动和平衡，而不是只盯一项数值。",
"landing.faq.beginners.question": "新手最应该先关注什么？",
"landing.faq.beginners.answer": "先给每一轮 build 定一个明确身份。只要技能选择和属性优先级服务于同一方向，你就更容易看懂这轮为什么成功或失败。",
"landing.faq.season.question": "为什么赛季策略这么重要？",
"landing.faq.season.answer": "因为 82 场赛季奖励的是稳定性。短期很亮眼的 build，如果缺少平衡、耐久性或调整空间，后面可能很快掉速。",
"landing.faq.official.question": "这是官方 NBA 游戏吗？",
"landing.faq.official.answer": "不是。这里展示的 Build a Hooper 是一款非官方篮球模拟体验，与 NBA 或任何官方球队品牌没有关联。",
"landing.disclaimer.title": "非官方说明",
"landing.disclaimer.body": "Build a Hooper 是一款非官方篮球模拟体验。本站是一个面向玩家的内容入口，嵌入了公开可访问的游戏，并提供原创介绍、策略说明和本地化内容。本站与 NBA、任何官方联赛、球队、标志、照片或球衣权利方均无隶属或授权关系。"
```

- [ ] **Step 4: Save and format the JSON files**

Run:

```bash
pnpm format messages/en.json messages/zh.json
```

Expected: both message files are rewritten by Prettier with valid JSON formatting.

### Task 2: Rebuild the homepage block composition

**Files:**
- Modify: `src/routes/index.tsx`
- Modify: `src/blocks/header.tsx`
- Modify: `src/blocks/hero.tsx`
- Modify: `src/blocks/features.tsx`
- Create: `src/blocks/how-it-works.tsx`
- Create: `src/blocks/guide.tsx`
- Modify: `src/blocks/faq.tsx`
- Create: `src/blocks/disclaimer.tsx`
- Modify: `src/blocks/footer.tsx`

- [ ] **Step 1: Replace homepage imports and composition in `src/routes/index.tsx`**

Update `src/routes/index.tsx` to this structure:

```tsx
import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { Disclaimer } from '@/blocks/disclaimer';
import { FAQ } from '@/blocks/faq';
import { Features } from '@/blocks/features';
import { Footer } from '@/blocks/footer';
import { Guide } from '@/blocks/guide';
import { Header } from '@/blocks/header';
import { Hero } from '@/blocks/hero';
import { HowItWorks } from '@/blocks/how-it-works';

function HomePage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Guide />
        <FAQ />
        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute('/')({
  loader: () => {
    const locale = getLocale();
    return { locale };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en';
    const urlFor = (loc: string) =>
      localizeUrl(`${envConfigs.app_url}/`, { locale: loc as any }).href;

    return {
      meta: [
        { title: m['landing.meta.title']({}, { locale: locale as any }) },
        {
          name: 'description',
          content: m['landing.meta.description']({}, { locale: locale as any }),
        },
      ],
      links: [
        { rel: 'canonical', href: urlFor(locale) },
        ...locales.map((loc) => ({
          rel: 'alternate',
          hrefLang: loc,
          href: urlFor(loc),
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: urlFor('en') },
      ],
    };
  },
  component: HomePage,
});
```

- [ ] **Step 2: Update header navigation for play, guide, FAQ, and privacy**

Replace `src/blocks/header.tsx` with:

```tsx
import { m } from '@/paraglide/messages.js';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/#play', label: m['landing.nav.play']() },
    { href: '/#guide', label: m['landing.nav.guide']() },
    { href: '/#faq', label: m['landing.nav.faq']() },
    { href: '/privacy-policy', label: m['landing.nav.privacy']() },
  ];

  return <SiteHeader navLinks={navLinks} />;
}
```

- [ ] **Step 3: Replace the hero with a responsive iframe section**

Rewrite `src/blocks/hero.tsx` with:

```tsx
import { ArrowRight, ExternalLink } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { buttonVariants } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/dot-pattern';

const STATS = [
  'landing.hero.stat.attributes',
  'landing.hero.stat.modes',
  'landing.hero.stat.games',
] as const;

export function Hero() {
  return (
    <section
      id="play"
      className="relative isolate overflow-hidden px-4 pt-20 pb-16 sm:pt-28 sm:pb-24"
    >
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]',
          'text-foreground/10'
        )}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_1.2fr] lg:items-center">
        <div className="space-y-7">
          <p className="text-muted-foreground text-xs tracking-[0.28em] uppercase">
            {m['landing.hero.eyebrow']()}
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {m['landing.hero.headline']()}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-8 sm:text-lg">
            {m['landing.hero.subheadline']()}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://build-a-hooper.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: 'lg' }), 'gap-2 rounded-full px-7')}
            >
              {m['landing.hero.primary']()}
              <ArrowRight className="size-4" />
            </a>
            <Link
              href="/#guide"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'rounded-full px-7'
              )}
            >
              {m['landing.hero.secondary']()}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {STATS.map((key) => (
              <div
                key={key}
                className="border-border bg-card/70 rounded-2xl border px-4 py-4 text-center"
              >
                <div className="text-foreground text-sm font-semibold sm:text-base">
                  {m[key]()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="border-border bg-card/80 overflow-hidden rounded-[28px] border shadow-2xl">
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-medium">{m['landing.hero.embed_title']()}</p>
              <a
                href="https://build-a-hooper.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
              >
                {m['landing.hero.embed_link']()}
                <ExternalLink className="size-4" />
              </a>
            </div>
            <div className="aspect-[16/11] min-h-[560px] w-full bg-black">
              <iframe
                src="https://build-a-hooper.pages.dev/"
                title={m['landing.hero.embed_title']()}
                className="h-full w-full"
                loading="lazy"
                allow="fullscreen"
              />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {m['landing.hero.embed_fallback']()}{' '}
            <a
              href="https://build-a-hooper.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              {m['landing.hero.embed_link']()}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Replace feature cards with four game highlights**

Rewrite `src/blocks/features.tsx` with:

```tsx
import {
  BarChart3,
  BrainCircuit,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';

const FEATURES: { key: string; icon: LucideIcon }[] = [
  { key: 'draft', icon: Sparkles },
  { key: 'build', icon: BrainCircuit },
  { key: 'modes', icon: BarChart3 },
  { key: 'season', icon: Shield },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.features.title']()}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-8 sm:text-lg">
            {m['landing.features.description']()}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="border-border bg-card/70 rounded-3xl border p-6 shadow-sm"
            >
              <div className="bg-foreground text-background mb-5 inline-flex size-11 items-center justify-center rounded-2xl">
                <Icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">
                {tDynamic(`landing.features.${key}.title`)}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-7">
                {tDynamic(`landing.features.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
```

and finish it with:

```tsx
    </section>
  );
}
```

- [ ] **Step 5: Create the three-step gameplay explanation block**

Create `src/blocks/how-it-works.tsx`:

```tsx
import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';

const STEP_KEYS = ['step1', 'step2', 'step3'] as const;

export function HowItWorks() {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.how.title']()}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-8 sm:text-lg">
            {m['landing.how.description']()}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {STEP_KEYS.map((key) => (
            <article
              key={key}
              className="border-border bg-background rounded-3xl border p-6"
            >
              <h3 className="text-xl font-semibold">
                {tDynamic(`landing.how.${key}.title`)}
              </h3>
              <p className="text-muted-foreground mt-4 text-sm leading-7">
                {tDynamic(`landing.how.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create the long-form SEO guide block**

Create `src/blocks/guide.tsx`:

```tsx
import { m } from '@/paraglide/messages.js';

const SECTIONS = [
  ['landing.guide.attributes_title', 'landing.guide.attributes_body'],
  ['landing.guide.modes_title', 'landing.guide.modes_body'],
  ['landing.guide.season_title', 'landing.guide.season_body'],
  ['landing.guide.beginner_title', 'landing.guide.beginner_body'],
  ['landing.guide.search_title', 'landing.guide.search_body'],
] as const;

export function Guide() {
  return (
    <section id="guide" className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.guide.title']()}
          </h2>
          <p className="text-muted-foreground mt-6 text-base leading-8 sm:text-lg">
            {m['landing.guide.intro']()}
          </p>
        </div>

        <div className="space-y-10">
          {SECTIONS.map(([titleKey, bodyKey]) => (
            <article key={titleKey} className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight">
                {m[titleKey]()}
              </h3>
              <p className="text-muted-foreground text-base leading-8">
                {m[bodyKey]()}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Replace the FAQ key list with game FAQ entries**

Replace `src/blocks/faq.tsx` with:

```tsx
import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_KEYS = ['what', 'attributes', 'beginners', 'season', 'official'] as const;

export function FAQ() {
  return (
    <section id="faq" className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.faq.title']()}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-8">
            {m['landing.faq.description']()}
          </p>
        </div>
        <Accordion className="w-full">
          {FAQ_KEYS.map((key) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="cursor-pointer py-6 text-left text-base font-medium hover:no-underline">
                {tDynamic(`landing.faq.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-8">
                {tDynamic(`landing.faq.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Create the unofficial disclaimer section**

Create `src/blocks/disclaimer.tsx`:

```tsx
import { AlertCircle } from 'lucide-react';

import { m } from '@/paraglide/messages.js';

export function Disclaimer() {
  return (
    <section className="px-4 pb-20 sm:pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="border-border bg-card/70 rounded-3xl border p-6 sm:p-8">
          <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
            <AlertCircle className="size-5" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {m['landing.disclaimer.title']()}
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-8">
            {m['landing.disclaimer.body']()}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 9: Simplify footer links around the game site**

Replace `src/blocks/footer.tsx` with:

```tsx
import { m } from '@/paraglide/messages.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';

export function Footer() {
  const columns: FooterColumn[] = [
    {
      title: m['landing.nav.play'](),
      links: [
        { label: m['landing.nav.play'](), href: '/#play' },
        { label: m['landing.nav.guide'](), href: '/#guide' },
        { label: m['landing.nav.faq'](), href: '/#faq' },
      ],
    },
    {
      title: m['landing.footer.legal'](),
      links: [{ label: m['landing.nav.privacy'](), href: '/privacy-policy' }],
    },
  ];

  return (
    <SiteFooter
      tagline={m['landing.footer.tagline']()}
      columns={columns}
      copyright={`© ${new Date().getFullYear()} Build a Hooper. All rights reserved.`}
    />
  );
}
```

- [ ] **Step 10: Format the homepage files**

Run:

```bash
pnpm format src/routes/index.tsx src/blocks/header.tsx src/blocks/hero.tsx src/blocks/features.tsx src/blocks/how-it-works.tsx src/blocks/guide.tsx src/blocks/faq.tsx src/blocks/disclaimer.tsx src/blocks/footer.tsx
```

Expected: all homepage route and block files are rewritten in consistent project style.

### Task 3: Rewrite the privacy pages for the embedded game site

**Files:**
- Modify: `src/content/pages/privacy-policy.en.mdx`
- Modify: `src/content/pages/privacy-policy.zh.mdx`

- [ ] **Step 1: Replace the English privacy policy content**

Replace `src/content/pages/privacy-policy.en.mdx` with:

```mdx
export const meta = {
  title: 'Privacy Policy',
  description: 'How buildahooper.org collects, uses, and protects information.',
  updated_at: '2026-07-07',
};

## Introduction

This Privacy Policy explains how `buildahooper.org` handles information when you visit our localized Build a Hooper game portal. The site provides original explanatory content and may embed a publicly accessible game experience from `https://build-a-hooper.pages.dev/`.

## What We Collect

We may collect limited technical and usage information such as browser type, device information, language preference, referrer data, page visits, and basic interaction events needed to operate and improve the site. If analytics tools are enabled later, they will be used only for site performance, traffic understanding, and product improvement.

## Embedded Game Content

The homepage may display the Build a Hooper game inside an iframe sourced from `https://build-a-hooper.pages.dev/`. When you interact with the embedded game, your browser may communicate directly with that source. This site does not control how the embedded source collects or processes data, so you should review any policies made available by the game host if you want to understand their practices in more detail.

## Cookies and Similar Technologies

We may use cookies or similar technologies to remember interface preferences, including language settings, and to support normal site operation. If analytics is enabled, cookies may also be used to understand aggregate usage patterns.

## How We Use Information

We use information to operate the website, deliver localized content, improve usability, monitor performance, prevent abuse, and understand how visitors discover and use the site.

## Sharing

We do not sell personal information. Information may be shared only with infrastructure or analytics providers that help operate the site, or when required to comply with law, protect rights, or address security issues.

## Data Retention

We keep information only for as long as reasonably necessary to operate the site, analyze performance, comply with legal obligations, and resolve abuse or security issues.

## Your Choices

You can stop using the site at any time, block cookies through your browser settings, or avoid interacting with the embedded game by opening or closing the page as you choose.

## Third-Party Links and Services

This site may link to or embed third-party services. Their privacy practices are governed by their own policies, not this one.

## Contact

If you have questions about this Privacy Policy, please use the contact information provided on the website when available.
```

- [ ] **Step 2: Replace the Chinese privacy policy content**

Replace `src/content/pages/privacy-policy.zh.mdx` with:

```mdx
export const meta = {
  title: '隐私政策',
  description: 'buildahooper.org 如何收集、使用和保护信息。',
  updated_at: '2026-07-07',
};

## 简介

本《隐私政策》说明 `buildahooper.org` 在你访问本站这个 Build a Hooper 本地化游戏入口时，如何处理相关信息。本站提供原创介绍内容，并可能通过 iframe 嵌入 `https://build-a-hooper.pages.dev/` 上公开可访问的游戏体验。

## 我们可能收集的信息

我们可能收集有限的技术和使用信息，例如浏览器类型、设备信息、语言偏好、来源页面、访问页面以及为保障网站运行与改进体验所需的基础交互数据。如果未来启用了统计工具，也只会用于了解站点表现、访问来源和内容改进方向。

## 关于嵌入的游戏内容

首页可能会通过 iframe 展示来自 `https://build-a-hooper.pages.dev/` 的 Build a Hooper 游戏。当你与嵌入内容互动时，浏览器可能会直接与该来源通信。本站无法控制该嵌入来源如何收集或处理数据，因此如果你希望进一步了解其做法，应查看游戏宿主方提供的相关政策或说明。

## Cookie 与类似技术

我们可能使用 Cookie 或类似技术来记住界面偏好设置，包括语言选择，并支持网站的正常运行。如果后续启用了统计功能，也可能使用相关技术来分析聚合后的访问模式。

## 我们如何使用这些信息

我们使用这些信息来运行网站、提供多语言内容、改善可用性、监控性能、防止滥用，并了解访客如何发现和使用本站。

## 信息共享

我们不会出售个人信息。只有在网站运行所需的基础设施或统计服务提供方协助下，或在法律要求、权利保护与安全处置需要时，相关信息才可能被有限共享。

## 数据保留

我们仅在合理必要的范围内保留相关信息，用于网站运营、性能分析、履行法律义务，以及处理滥用或安全问题。

## 你的选择

你可以随时停止使用本站，也可以通过浏览器设置阻止 Cookie，或自行决定是否与嵌入的游戏内容互动。

## 第三方链接与服务

本站可能链接到或嵌入第三方服务。此类服务的隐私做法适用其自身政策，而不是本政策。

## 联系方式

如果你对本《隐私政策》有疑问，请在网站提供相关联系方式后通过相应渠道与我们联系。
```

- [ ] **Step 3: Format the privacy files**

Run:

```bash
pnpm format src/content/pages/privacy-policy.en.mdx src/content/pages/privacy-policy.zh.mdx
```

Expected: both MDX files are reformatted without syntax changes.

### Task 4: Build verification and manual QA

**Files:**
- Modify: none

- [ ] **Step 1: Run the production build**

Run:

```bash
pnpm build
```

Expected: Vite build succeeds and regenerates localized output without route or MDX errors.

- [ ] **Step 2: Start the local dev server for manual QA**

Run:

```bash
pnpm dev
```

Expected: local server starts on `http://localhost:3000`.

- [ ] **Step 3: Verify the English homepage manually**

Open:

```text
http://localhost:3000/
```

Check:

```text
- Header links scroll to Play, Guide, and FAQ.
- Hero iframe renders and is usable.
- The page copy is Build a Hooper specific rather than SaaS demo text.
- Footer contains a privacy link.
```

- [ ] **Step 4: Verify the Chinese homepage manually**

Open:

```text
http://localhost:3000/zh
```

Check:

```text
- Locale switch works.
- Chinese metadata and body copy are localized.
- Anchor navigation still works.
- The iframe section and long-form guide render cleanly on mobile-width and desktop-width layouts.
```

- [ ] **Step 5: Verify the privacy pages manually**

Open:

```text
http://localhost:3000/privacy-policy
http://localhost:3000/zh/privacy-policy
```

Check:

```text
- Both pages render the new policy copy.
- The wording references the embedded game and localized portal behavior.
- The updated date is `2026-07-07`.
```

- [ ] **Step 6: Check the final edited files for diagnostics**

Run the editor lint/diagnostic pass on:

```text
src/routes/index.tsx
src/blocks/header.tsx
src/blocks/hero.tsx
src/blocks/features.tsx
src/blocks/how-it-works.tsx
src/blocks/guide.tsx
src/blocks/faq.tsx
src/blocks/disclaimer.tsx
src/blocks/footer.tsx
src/content/pages/privacy-policy.en.mdx
src/content/pages/privacy-policy.zh.mdx
```

Expected: no newly introduced diagnostics remain.
