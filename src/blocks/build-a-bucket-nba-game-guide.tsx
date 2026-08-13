import { Link } from '@/core/i18n/navigation';
import type { FaqItem } from '@/lib/seo/json-ld';

const PRIMARY_KEYWORD = 'Build a Bucket NBA Game';
const OFFICIAL_GAME_URL = 'https://build-a-player.com/bucket';

const linkClass =
  'text-primary font-semibold underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary';

export const BUILD_A_BUCKET_FAQ: FaqItem[] = [
  {
    question: 'What is the Build a Bucket NBA Game?',
    answer:
      'Build a Bucket NBA Game is a search phrase commonly used for Build-A-Bucket, a fan-made browser basketball player builder on the Build-A-Player website. The current game loop lets you choose a Guard or Big direction, spin current NBA players, take aspects of their games, complete a custom player, and simulate a season.',
  },
  {
    question: 'Where is the official Build a Bucket NBA Game?',
    answer:
      'The official Build-A-Bucket page is build-a-player.com/bucket. The playable game at the top of this buildahooper.org page is Build a Hooper, a separate fan-made basketball builder and season simulator.',
  },
  {
    question: 'How do you play Build a Bucket NBA Game?',
    answer:
      'Choose a Guard or Big path, start a draft, spin for NBA players, assign a useful aspect of each player to an open build category, complete the custom player, and then review the season simulation. The official page currently shows Current NBA and a Daily Salary Cap option.',
  },
  {
    question: 'What attributes are in Build a Bucket NBA Game?',
    answer:
      'The current official interface shows Jump Shot, Finishing, Handles, Speed, Bounce, Passing, Perimeter D, Strength, and H/L. The official page should be treated as the source of truth because labels and player pools can change.',
  },
  {
    question: 'Does Build a Bucket NBA Game publish its rating formula?',
    answer:
      'No detailed official wheel-odds table, overall-rating formula, or season-simulation formula is published on the current official page. Claims about guaranteed 99 OVR paths or exact hidden weights should therefore be treated as unverified unless the creator documents them.',
  },
  {
    question: 'Is Build a Bucket NBA Game affiliated with the NBA?',
    answer:
      'No. The official Build-A-Bucket page describes the project as fan-made and not affiliated with the NBA. Build a Hooper on buildahooper.org is also an independent fan project.',
  },
];

export function BuildABucketNbaGameGuide() {
  return (
    <article className="mx-auto max-w-4xl space-y-14 px-4 py-16 sm:py-20">
      <header className="space-y-5">
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          Browser basketball player builder guide
        </p>
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
          Build a Bucket NBA Game: Guide, Modes & How It Works
        </h1>
        <p className="text-muted-foreground text-base leading-8 sm:text-lg">
          <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          is the search phrase many players use when looking for Build-A-Bucket,
          the fan-made basketball player builder hosted by Build-A-Player. The
          basic idea is easy to understand: spin current NBA players, take one
          useful part of each player&apos;s game, finish a custom Guard or Big,
          and see how that player performs in a season simulation. The official
          game is at{' '}
          <a
            href={OFFICIAL_GAME_URL}
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            build-a-player.com/bucket
          </a>
          . The playable experience above is Build a Hooper, our separate
          fan-made basketball builder, so this guide does not pretend that
          buildahooper.org is the official Build-A-Bucket site.
        </p>
        <p className="text-muted-foreground leading-8">
          This <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          guide focuses on information that can be verified from the current
          official page and public launch coverage. It explains the NBA player
          wheel concept, Guard and Big paths, visible skill labels, Current NBA
          and Salary Cap selections, practical drafting strategy, and the limits
          of what is publicly known. Exact wheel odds, hidden rating weights, and
          the internal season formula are not published, so they are not invented
          here.
        </p>
      </header>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What is Build a Bucket NBA Game?
        </h2>
        <p className="text-muted-foreground leading-8">
          <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          refers to Build-A-Bucket, a browser basketball game that launched in
          July 2026 as a basketball version of the Build-A-Player format. Instead
          of controlling a player possession by possession, you construct a
          player through a sequence of randomized NBA-player results and choices.
          Each result creates a decision: use a strength from that player now, or
          preserve another category for a better fit later.
        </p>
        <p className="text-muted-foreground leading-8">
          The current <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          page presents two broad directions. Guard covers PG, SG, and SF, while
          Big covers PF and C. That first choice gives the draft a basketball
          identity before the wheel begins. A Guard-oriented build naturally
          makes players think about shooting, handles, passing, speed, and
          perimeter defense; a Big-oriented build makes finishing, bounce,
          strength, and frontcourt value feel more important. The official page
          does not publish a precise weight for each category, so these are role
          ideas rather than secret formulas.
        </p>
        <p className="text-muted-foreground leading-8">
          The appeal of <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          is therefore closer to a drafting puzzle than a traditional NBA action
          game. The wheel supplies uncertainty, but the player still decides how
          to allocate value. A famous NBA name is not automatically the right
          pick if that player&apos;s best skill duplicates a slot you already solved.
          The interesting question is always which open category improves the
          final build most.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          How to play Build a Bucket NBA Game
        </h2>
        <p className="text-muted-foreground leading-8">
          A normal <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          run can be understood as a short sequence of repeatable decisions.
          Because the game is browser-based, the important skill is not learning
          complex controls; it is learning how to react to the player result in
          front of you without destroying the shape of the build.
        </p>
        <ol className="text-muted-foreground list-decimal space-y-3 pl-5 leading-8">
          <li>
            Open the official Build-A-Bucket page and choose a build direction:
            Guard or Big.
          </li>
          <li>
            Choose the available drafting selection. The current interface shows
            Classic with Current NBA and a Daily Salary Cap option labeled
            “Build on a budget.”
          </li>
          <li>
            Spin for an NBA player and review the open categories in your custom
            player.
          </li>
          <li>
            Take the aspect that best fits both the generated player and the
            remaining needs of the build.
          </li>
          <li>
            Continue until the custom player is complete, then run the season
            simulation and review the outcome.
          </li>
        </ol>
        <p className="text-muted-foreground leading-8">
          The most useful way to learn <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          is to treat every spin as a roster-management choice. Ask three things:
          what does this NBA player clearly do well, which categories are still
          open, and which weak category would be hardest to repair later? That
          mindset is more durable than memorizing a list of superstar names.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game attributes and skill labels
        </h2>
        <p className="text-muted-foreground leading-8">
          The live <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          interface currently shows nine visible labels. These labels are the
          practical checklist you manage while drafting. The page does not expose
          the exact math behind each grade, so the safest approach is to read them
          as basketball dimensions rather than guaranteed numerical weights.
        </p>
        <div className="border-border overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Visible label</th>
                <th className="px-4 py-3 font-semibold">Drafting question</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              <tr><td className="px-4 py-3 font-medium">Jump Shot</td><td className="text-muted-foreground px-4 py-3">Do you have dependable perimeter scoring?</td></tr>
              <tr><td className="px-4 py-3 font-medium">Finishing</td><td className="text-muted-foreground px-4 py-3">Can the build convert chances near the basket?</td></tr>
              <tr><td className="px-4 py-3 font-medium">Handles</td><td className="text-muted-foreground px-4 py-3">Can the player create and protect the ball?</td></tr>
              <tr><td className="px-4 py-3 font-medium">Speed</td><td className="text-muted-foreground px-4 py-3">Does the build have enough movement and pace?</td></tr>
              <tr><td className="px-4 py-3 font-medium">Bounce</td><td className="text-muted-foreground px-4 py-3">Does the athlete have vertical explosiveness?</td></tr>
              <tr><td className="px-4 py-3 font-medium">Passing</td><td className="text-muted-foreground px-4 py-3">Can the player create value for teammates?</td></tr>
              <tr><td className="px-4 py-3 font-medium">Perimeter D</td><td className="text-muted-foreground px-4 py-3">Can the build survive against guards and wings?</td></tr>
              <tr><td className="px-4 py-3 font-medium">Strength</td><td className="text-muted-foreground px-4 py-3">Can the player handle physical matchups?</td></tr>
              <tr><td className="px-4 py-3 font-medium">H/L</td><td className="text-muted-foreground px-4 py-3">Use the official UI as the source of truth; no precise public formula is stated.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-8">
          In <strong className="text-foreground">Build a Bucket NBA Game</strong>,
          the useful strategy is not to assume all nine labels matter equally in
          every role. Instead, build a coherent identity first. A Guard that has
          shooting, handles, passing, and perimeter defense has a readable plan.
          A Big that combines finishing, strength, bounce, and enough supporting
          skills also has a readable plan. The exact “best” mix remains open
          because no official category-weight table has been published.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game modes: Current NBA and Daily Salary Cap
        </h2>
        <p className="text-muted-foreground leading-8">
          The current <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          page visibly separates a Classic selection labeled Current NBA from a
          Daily selection labeled Salary Cap with the phrase “Build on a budget.”
          That distinction matters because it shows that Build-A-Bucket is not
          only a static player wheel; the live interface can frame the same build
          idea under different constraints.
        </p>
        <p className="text-muted-foreground leading-8">
          For a first <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          run, Current NBA is the easiest concept to read because the player pool
          is tied to active NBA players shown by the current interface. The Daily
          Salary Cap selection suggests a budget-oriented challenge, but the
          official page should be checked for the live rules before each attempt.
          Do not rely on an old video or third-party guide for a permanent budget,
          pool, or availability schedule.
        </p>
        <p className="text-muted-foreground leading-8">
          You may also see community discussion of Sandbox, all-time pools, 99
          OVR attempts, and other <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          challenges. Those can be useful for understanding player interest, but
          they should not be described as permanently available official modes
          unless they are visible on the current official page or announced by
          the creator.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Best Build a Bucket NBA Game strategy for a first run
        </h2>
        <p className="text-muted-foreground leading-8">
          The best beginner strategy for <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          is role first, balance second, perfection third. Pick a Guard or Big
          identity, secure the difficult core skills for that identity, and then
          raise the weakest remaining category. Chasing a perfect grade every
          time is less useful if it leaves one essential category empty or weak.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-border rounded-2xl border p-5">
            <h3 className="font-semibold">Guard draft checklist</h3>
            <ul className="text-muted-foreground mt-3 list-disc space-y-2 pl-5 leading-7">
              <li>Secure at least one dependable scoring route.</li>
              <li>Protect Handles and Passing from late-run desperation picks.</li>
              <li>Do not ignore Perimeter D just because the wheel gives stars.</li>
              <li>Use Speed and Bounce to support the intended style.</li>
            </ul>
          </div>
          <div className="border-border rounded-2xl border p-5">
            <h3 className="font-semibold">Big draft checklist</h3>
            <ul className="text-muted-foreground mt-3 list-disc space-y-2 pl-5 leading-7">
              <li>Build a reliable interior scoring or finishing foundation.</li>
              <li>Use Strength and Bounce to support the frontcourt identity.</li>
              <li>Do not waste versatile players on already-secured strengths.</li>
              <li>Leave enough supporting skill to avoid a one-dimensional build.</li>
            </ul>
          </div>
        </div>
        <p className="text-muted-foreground leading-8">
          A strong <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          decision is often boring in the moment. If the wheel gives an elite
          scorer but your scoring slot is already excellent, using that spin to
          repair Passing, Perimeter D, Strength, or another open need can produce
          a more complete final player. The season simulation then becomes a test
          of whether those choices formed a coherent basketball profile.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game season simulation and 99 OVR searches
        </h2>
        <p className="text-muted-foreground leading-8">
          The final hook of <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          is that the custom player is not only a collection screen. The public
          launch description says the completed player is put through a season
          simulation, giving the draft an outcome beyond the visible build. That
          makes each run a small experiment: did the scoring-heavy Guard actually
          produce a strong season, or did the all-around Big create a better team
          result?
        </p>
        <p className="text-muted-foreground leading-8">
          Searches for <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          also overlap with “99 OVR” challenges. Creator and community videos use
          99 OVR as an attractive target, but a challenge title is not the same as
          a published formula. The official page does not currently provide the
          exact arithmetic needed to prove that one fixed set of choices always
          creates a 99 overall player.
        </p>
        <p className="text-muted-foreground leading-8">
          The practical lesson is to compare multiple{' '}
          <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          runs rather than treating one wheel sequence as universal evidence.
          Record which role you chose, which category became the weakest, which
          spins felt wasted, the final displayed result, and the season outcome.
          A few runs will teach more than an unverified “perfect build” list.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game vs Build a Hooper
        </h2>
        <p className="text-muted-foreground leading-8">
          <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          and Build a Hooper share a broad fantasy: combine basketball strengths
          into one custom player and see what happens over a season. They are not
          the same game. Build-A-Bucket belongs to the Build-A-Player project and
          is played on its official website. Build a Hooper is the independent
          game available at the top of this page and across buildahooper.org.
        </p>
        <p className="text-muted-foreground leading-8">
          Build a Hooper uses thirteen attributes, position-aware build logic,
          several information modes, an 82-game simulation, playoffs,
          achievements, and a Legacy leaderboard. If you arrived here searching
          for <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          but want to play immediately without leaving the page, the first screen
          gives you that separate Build a Hooper experience. If you specifically
          want the official Build-A-Bucket, use the official link above.
        </p>
        <p className="text-muted-foreground leading-8">
          For deeper Build a Hooper mechanics, read{' '}
          <Link href="/how-it-works" className={linkClass}>
            How It Works
          </Link>
          , compare the{' '}
          <Link href="/attributes" className={linkClass}>
            Attribute Guide
          </Link>
          , or use the{' '}
          <Link href="/best-builds" className={linkClass}>
            Position Builds
          </Link>{' '}
          hub before your next run.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What is confirmed about Build a Bucket NBA Game — and what is not
        </h2>
        <p className="text-muted-foreground leading-8">
          A useful <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          guide should separate visible facts from speculation. The official page
          confirms the browser game, Guard and Big choices, current skill labels,
          Current NBA presentation, Daily Salary Cap presentation, and the
          fan-made / non-NBA-affiliated status. Public launch coverage confirms
          the spin, choose an aspect, complete a player, simulate a season loop.
        </p>
        <div className="border-border overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Topic</th>
                <th className="px-4 py-3 font-semibold">Current status</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              <tr><td className="px-4 py-3">Official game location</td><td className="text-muted-foreground px-4 py-3">Confirmed: build-a-player.com/bucket</td></tr>
              <tr><td className="px-4 py-3">Guard / Big paths</td><td className="text-muted-foreground px-4 py-3">Confirmed on the current UI</td></tr>
              <tr><td className="px-4 py-3">Current NBA / Daily Salary Cap</td><td className="text-muted-foreground px-4 py-3">Visible on the current UI</td></tr>
              <tr><td className="px-4 py-3">Nine visible skill labels</td><td className="text-muted-foreground px-4 py-3">Visible on the current UI</td></tr>
              <tr><td className="px-4 py-3">Exact wheel odds</td><td className="text-muted-foreground px-4 py-3">Not publicly documented on the official page</td></tr>
              <tr><td className="px-4 py-3">Exact OVR formula</td><td className="text-muted-foreground px-4 py-3">Not publicly documented on the official page</td></tr>
              <tr><td className="px-4 py-3">Exact season formula</td><td className="text-muted-foreground px-4 py-3">Not publicly documented on the official page</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-8">
          That distinction keeps <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          strategy useful even when the live game changes. Check the official page
          before assuming a player pool, daily rule, category meaning, or feature
          from an older video is still active.
        </p>
      </section>

      <section id="faq" className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game FAQ
        </h2>
        <div className="space-y-6">
          {BUILD_A_BUCKET_FAQ.map((item) => (
            <div key={item.question}>
              <h3 className="text-lg font-semibold">{item.question}</h3>
              <p className="text-muted-foreground mt-2 leading-8">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-border bg-muted/30 rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">Sources and update note</h2>
        <p className="text-muted-foreground mt-3 leading-8">
          This <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          page was reviewed against the official Build-A-Bucket browser page and
          public launch information available in August 2026. Because the game is
          new and can change, the official page remains the best source for live
          player pools, modes, labels, and rules. Build a Hooper is not affiliated
          with Build-A-Player, Build-A-Bucket, the NBA, or any NBA team.
        </p>
      </section>
    </article>
  );
}

export { PRIMARY_KEYWORD };
