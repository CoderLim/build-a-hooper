import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';

const linkClass =
  'text-primary font-semibold underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary';

function LocalizedCreateAHooperGuide() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-14 sm:py-20">
      <header className="space-y-4 text-center">
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          {m['create_a_hooper.eyebrow']()}
        </p>
        <h1 className="font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl">
          {m['create_a_hooper.title']()}
        </h1>
        <p className="text-muted-foreground text-base leading-8">
          {m['create_a_hooper.intro']()}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {m['create_a_hooper.same_game_title']()}
        </h2>
        <p className="text-muted-foreground leading-8">
          {m['create_a_hooper.same_game_body']()}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {m['create_a_hooper.loop_title']()}
        </h2>
        <p className="text-muted-foreground leading-8">
          {m['create_a_hooper.loop_body']()}
        </p>
        <ol className="text-muted-foreground list-decimal space-y-2 pl-5 leading-8">
          <li>{m['create_a_hooper.loop_1']()}</li>
          <li>{m['create_a_hooper.loop_2']()}</li>
          <li>{m['create_a_hooper.loop_3']()}</li>
          <li>{m['create_a_hooper.loop_4']()}</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {m['create_a_hooper.intent_title']()}
        </h2>
        <p className="text-muted-foreground leading-8">
          {m['create_a_hooper.intent_body']()}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {m['create_a_hooper.modes_title']()}
        </h2>
        <p className="text-muted-foreground leading-8">
          {m['create_a_hooper.modes_body']()}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {m['create_a_hooper.season_title']()}
        </h2>
        <p className="text-muted-foreground leading-8">
          {m['create_a_hooper.season_body']()}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {m['create_a_hooper.faq_title']()}
        </h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold">{m['create_a_hooper.faq1_q']()}</h3>
            <p className="text-muted-foreground mt-2 leading-8">
              {m['create_a_hooper.faq1_a']()}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">{m['create_a_hooper.faq2_q']()}</h3>
            <p className="text-muted-foreground mt-2 leading-8">
              {m['create_a_hooper.faq2_a']()}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">{m['create_a_hooper.faq3_q']()}</h3>
            <p className="text-muted-foreground mt-2 leading-8">
              {m['create_a_hooper.faq3_a']()}
            </p>
          </div>
        </div>
      </section>

      <p className="text-muted-foreground text-sm leading-7">
        {m['create_a_hooper.links_lead']()}{' '}
        <Link href="/how-to-play" className={linkClass}>
          {m['landing.nav.how_to_play']()}
        </Link>
        {' · '}
        <Link href="/modes" className={linkClass}>
          {m['landing.nav.modes']()}
        </Link>
        {' · '}
        <Link href="/attributes" className={linkClass}>
          {m['landing.nav.attributes']()}
        </Link>
        {' · '}
        <Link href="/best-builds" className={linkClass}>
          {m['landing.nav.best_builds']()}
        </Link>
      </p>
    </article>
  );
}

function EnglishCreateAHooperGuide() {
  return (
    <article className="mx-auto max-w-3xl space-y-10 px-4 py-14 sm:py-20">
      <header className="space-y-4 text-center">
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          Free basketball player builder
        </p>
        <h1 className="font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl">
          Create a Hooper
        </h1>
        <p className="text-muted-foreground text-base leading-8 sm:text-lg">
          Want to <strong className="text-foreground">Create a Hooper</strong>{' '}
          in your browser? You are looking for the same free basketball builder
          most people call Build a Hooper: draft skills from team-season
          rosters, shape thirteen attributes, and simulate an 82-game season.
          Use the play area above to Create a Hooper and create a player now,
          then use this page to understand the decisions that separate a
          coherent run from a random stack of high grades.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Create a Hooper and Build a Hooper are the same game
        </h2>
        <p className="text-muted-foreground leading-8">
          Search results for Create a Hooper usually point to Build a Hooper
          gameplay — creator videos talk about creating the perfect player or
          creating an NBA-style card while the product name on screen stays
          Build a Hooper. Companion sites also list related labels such as build
          a player and build a bucket for that same draft-and-simulate loop. On
          buildahooper.org, Create a Hooper simply names the action: open the
          draft room, lock attributes, and test the finished card in a full
          season. If someone tells you to Create a Hooper, they mean this loop.
        </p>
        <p className="text-muted-foreground leading-8">
          That matters for SEO clarity and for you as a player. When you Create
          a Hooper here, you are not jumping into a different ruleset. You get
          the same Classic, Blind, and Chaos modes, the same thirteen attribute
          slots, and the same season simulation used across Build a Hooper
          guides on this site. Create a Hooper is the verb; Build a Hooper is
          the product name players already recognize.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          How to create a player when you Create a Hooper
        </h2>
        <p className="text-muted-foreground leading-8">
          Published play guides describe the loop the same way every time. To
          Create a Hooper and create a player, choose a mode, then work through
          thirteen draft rounds. Each round spins a historic or current
          team-season roster, lets you pick one player from that board, and
          locks one open attribute from that player into your custom hooper.
          Once a slot is filled, it stays filled for the rest of the run.
        </p>
        <ol className="text-muted-foreground list-decimal space-y-2 pl-5 leading-8">
          <li>Choose Classic, Blind, or Chaos.</li>
          <li>Select or reveal a position, depending on the mode.</li>
          <li>
            Spin a team-season, pick one player, and lock one unused attribute.
          </li>
          <li>
            Repeat until all thirteen slots are filled, reveal the card, and
            simulate the season.
          </li>
        </ol>
        <p className="text-muted-foreground leading-8">
          The goal when you Create a Hooper is not to steal the biggest name on
          every spin. Guides emphasize asking which attribute helps the role
          most right now, and which premium skill might be hard to replace
          later. That is the difference between randomly stacking grades and
          choosing to create a player with a readable identity.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Build your Hooper around position fit
        </h2>
        <p className="text-muted-foreground leading-8">
          Before you Build your Hooper, decide the job the card must do. Public
          strategy copy is consistent: point guards need creation and passing;
          wings need two-way balance; bigs need finishing, rebounding, strength,
          interior defense, and rim protection. When a roster gives you an elite
          shooter, taking 3PT early can make sense. When the same board offers
          scarce perimeter defense, locking PDEF may protect the build more than
          another scoring bump.
        </p>
        <p className="text-muted-foreground leading-8">
          Build your Hooper with one or two elite strengths and no disastrous
          holes. Simulation write-ups repeatedly warn that one huge category
          plus empty support categories underperforms a coherent lower peak.
          Treat every spin as a small draft question: does this pick help me
          Build your Hooper for the position I am actually constructing, or does
          it only look impressive on the highlight reel?
        </p>
        <p className="text-muted-foreground leading-8">
          If you want position checklists after you Create a Hooper, use the{' '}
          <Link href="/best-builds" className={linkClass}>
            best-builds hub
          </Link>{' '}
          and the{' '}
          <Link href="/attributes" className={linkClass}>
            attributes guide
          </Link>
          . Those pages go deep on the thirteen ratings; this Create a Hooper
          page stays focused on the create decision itself.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Modes change how you Create a Hooper
        </h2>
        <p className="text-muted-foreground leading-8">
          Classic is the cleanest place to Create a Hooper because you choose
          the position and can see ratings while you draft. Blind keeps the
          position visible but hides grades, so roster knowledge and reputation
          matter more. Chaos hides both position and ratings during the run, so
          a balanced attribute set travels better when you do not yet know
          whether the reveal lands as a guard, wing, or big. Create a Hooper in
          Classic first if you are learning the attribute shorthand.
        </p>
        <p className="text-muted-foreground leading-8">
          Switch modes on purpose when you Build your Hooper for practice. A
          Classic experiment teaches attribute synergy. A Blind or Chaos run
          teaches whether the same create a player plan survives missing
          information. Full mode notes live on the{' '}
          <Link href="/modes" className={linkClass}>
            game modes guide
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          After you Create a Hooper, the season judges the card
        </h2>
        <p className="text-muted-foreground leading-8">
          When the thirteen locks are done, Create a Hooper flows into grading,
          archetype assignment, and an 82-game season with playoff outcomes.
          That season is the feedback loop. If the card fades, ask which create
          a player choice failed first: missing creation for a guard, missing
          rebounding for a big, or a mode-specific information gap you ignored.
          Then Build your Hooper again with one clearer identity instead of
          rerolling for luck alone. Each Create a Hooper attempt should leave
          one written lesson before the next draft.
        </p>
        <p className="text-muted-foreground leading-8">
          Step-by-step first-run help is on the{' '}
          <Link href="/how-to-play" className={linkClass}>
            how to play guide
          </Link>
          . This Create a Hooper page is the intentional companion: play above,
          then read the decision framework that makes the next create a player
          run more repeatable. Ready players can Create a Hooper again
          immediately in the embed without leaving the page.
        </p>
      </section>

      <section id="faq" className="space-y-5">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Create a Hooper FAQ
        </h2>
        <div>
          <h3 className="font-semibold">
            Is Create a Hooper a different game from Build a Hooper?
          </h3>
          <p className="text-muted-foreground mt-2 leading-8">
            No. Create a Hooper is search and creator language for the same
            browser basketball builder. Build a Hooper is the common product
            name; create a player describes the thirteen-round draft action.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">
            How do I Build your Hooper for a higher overall?
          </h3>
          <p className="text-muted-foreground mt-2 leading-8">
            When you Create a Hooper for overall, prioritize position-critical
            attributes early, save flexible skills for later, and use rerolls
            when the current roster does not solve a real hole. Guides stress
            role fit over chasing the highest number on the board.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">
            Is Create a Hooper free, and is it official NBA content?
          </h3>
          <p className="text-muted-foreground mt-2 leading-8">
            Yes — Create a Hooper play on this page is free in the browser. It
            is an unofficial fan simulator experience and is not affiliated with
            the NBA or official team branding.
          </p>
        </div>
      </section>
    </article>
  );
}

export function CreateAHooperGuide() {
  return getLocale() === 'en' ? (
    <EnglishCreateAHooperGuide />
  ) : (
    <LocalizedCreateAHooperGuide />
  );
}
