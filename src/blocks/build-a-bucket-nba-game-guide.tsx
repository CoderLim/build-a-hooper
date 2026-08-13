import { Link } from '@/core/i18n/navigation';
import type { FaqItem } from '@/lib/seo/json-ld';

const OFFICIAL_GAME_URL = 'https://build-a-player.com/bucket';
const linkClass =
  'text-primary font-semibold underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary';

export const BUILD_A_BUCKET_FAQ: FaqItem[] = [
  {
    question: 'What is the Build a Bucket NBA Game?',
    answer:
      'Build a Bucket NBA Game is a common search phrase for Build-A-Bucket, a fan-made browser basketball player builder hosted on Build-A-Player. You choose a Guard or Big path, spin NBA players, use parts of their games to complete a custom player, and then simulate a season.',
  },
  {
    question: 'Can I play Build a Bucket NBA Game on this page?',
    answer:
      'Yes. This page embeds the official Build-A-Bucket page from build-a-player.com/bucket in the play area above. If the external site blocks iframe playback in your browser, use the Open official game link directly below the embed.',
  },
  {
    question: 'Where is the official Build a Bucket NBA Game?',
    answer:
      'The official Build-A-Bucket page is build-a-player.com/bucket. This guide is hosted on buildahooper.org, but the playable frame above loads the official Build-A-Bucket page from its original site.',
  },
  {
    question: 'What attributes are shown in Build a Bucket NBA Game?',
    answer:
      'The current official interface shows Jump Shot, Finishing, Handles, Speed, Bounce, Passing, Perimeter D, Strength, and H/L. The official interface should be treated as the source of truth because labels, player pools, and modes can change.',
  },
  {
    question: 'Does Build a Bucket NBA Game publish its rating formula?',
    answer:
      'No detailed official wheel-odds table, overall-rating formula, or season-simulation formula is published on the current official page. Claims about guaranteed 99 OVR routes or exact hidden weights should be treated as unverified unless the creator documents them.',
  },
  {
    question: 'Is Build a Bucket NBA Game affiliated with the NBA?',
    answer:
      'No. The official Build-A-Bucket page describes the project as fan-made and not affiliated with the NBA.',
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
          is the phrase many players use when searching for Build-A-Bucket, the
          fan-made basketball player builder on Build-A-Player. The official game
          is embedded directly above from{' '}
          <a
            href={OFFICIAL_GAME_URL}
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            build-a-player.com/bucket
          </a>
          , so you can play the real Build-A-Bucket experience first and use this
          guide when you want a clearer explanation of the choices on screen.
        </p>
        <p className="text-muted-foreground leading-8">
          This <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          guide focuses on details that can be verified from the current official
          interface: Guard and Big paths, Current NBA, Daily Salary Cap, the NBA
          player spin loop, visible skill labels, and the season-simulation goal.
          Exact wheel odds, hidden rating weights, and the internal season formula
          are not publicly documented, so this page does not invent them.
        </p>
      </header>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What is Build a Bucket NBA Game?
        </h2>
        <p className="text-muted-foreground leading-8">
          <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          refers to Build-A-Bucket, a browser-based basketball builder where the
          main challenge is making good decisions from randomized NBA-player
          results. Instead of controlling one player possession by possession,
          you construct a custom basketball player from pieces of real-player
          skill profiles and then see how the finished build performs.
        </p>
        <p className="text-muted-foreground leading-8">
          The current <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          interface starts by separating builds into Guard and Big directions.
          Guard covers the backcourt and wing-oriented idea, while Big covers the
          frontcourt idea. That opening choice gives the run structure before the
          wheel begins. A Guard build naturally makes shooting, handles, passing,
          speed, and perimeter defense easier to prioritize, while a Big build
          makes finishing, bounce, strength, and frontcourt impact more central.
        </p>
        <p className="text-muted-foreground leading-8">
          The appeal of <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          comes from the tension between luck and allocation. The wheel controls
          which NBA player appears, but you still decide which open category gains
          the most value from that spin. A superstar name is not automatically the
          best choice when the build already has that player&apos;s strongest area
          covered.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          How to play Build a Bucket NBA Game
        </h2>
        <p className="text-muted-foreground leading-8">
          A normal <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          run is easy to control but harder to optimize. You do not need action-
          game mechanics; the skill is deciding which part of each NBA player is
          most useful for the unfinished custom player.
        </p>
        <ol className="text-muted-foreground list-decimal space-y-3 pl-5 leading-8">
          <li>Choose Guard or Big to establish the basic build direction.</li>
          <li>
            Choose an available selection. The current interface shows Classic
            with Current NBA and a Daily Salary Cap option labeled “Build on a
            budget.”
          </li>
          <li>Spin for an NBA player and inspect the remaining open categories.</li>
          <li>
            Assign the most useful available part of that player&apos;s profile to
            an open category.
          </li>
          <li>Repeat until the custom player is complete.</li>
          <li>Run the season simulation and review how the finished build performs.</li>
        </ol>
        <p className="text-muted-foreground leading-8">
          The easiest way to improve at <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          is to ask three questions after every spin: what is this NBA player best
          known for, which categories are still open, and which weakness will be
          hardest to repair later? That produces more consistent builds than
          choosing the biggest name every round.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game attributes and skill labels
        </h2>
        <p className="text-muted-foreground leading-8">
          The live <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          interface currently shows nine visible labels. These are best treated as
          the checklist you manage during the draft rather than as a published
          mathematical formula.
        </p>
        <div className="border-border overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Visible label</th>
                <th className="px-4 py-3 font-semibold">Practical meaning</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              <tr><td className="px-4 py-3 font-medium">Jump Shot</td><td className="text-muted-foreground px-4 py-3">Perimeter scoring and shooting value.</td></tr>
              <tr><td className="px-4 py-3 font-medium">Finishing</td><td className="text-muted-foreground px-4 py-3">Scoring around the basket.</td></tr>
              <tr><td className="px-4 py-3 font-medium">Handles</td><td className="text-muted-foreground px-4 py-3">Ball control and creation ability.</td></tr>
              <tr><td className="px-4 py-3 font-medium">Speed</td><td className="text-muted-foreground px-4 py-3">Movement and pace.</td></tr>
              <tr><td className="px-4 py-3 font-medium">Bounce</td><td className="text-muted-foreground px-4 py-3">Vertical explosiveness and athletic lift.</td></tr>
              <tr><td className="px-4 py-3 font-medium">Passing</td><td className="text-muted-foreground px-4 py-3">Creation for teammates.</td></tr>
              <tr><td className="px-4 py-3 font-medium">Perimeter D</td><td className="text-muted-foreground px-4 py-3">Defense against guards and wings.</td></tr>
              <tr><td className="px-4 py-3 font-medium">Strength</td><td className="text-muted-foreground px-4 py-3">Physical matchups and contact.</td></tr>
              <tr><td className="px-4 py-3 font-medium">H/L</td><td className="text-muted-foreground px-4 py-3">Use the official interface as the source of truth; no precise public formula is stated.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-8">
          In <strong className="text-foreground">Build a Bucket NBA Game</strong>,
          the useful strategy is to create a coherent player rather than chase one
          perfect grade. A Guard with shooting, handles, passing, and enough
          perimeter defense has a recognizable identity. A Big with finishing,
          strength, bounce, and supporting skills also has a clear role. The exact
          optimal mix remains uncertain because the creator has not published a
          category-weight table.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game modes: Current NBA and Daily Salary Cap
        </h2>
        <p className="text-muted-foreground leading-8">
          The current <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          page visibly separates Classic with Current NBA from a Daily Salary Cap
          option labeled “Build on a budget.” That matters because the same NBA
          player builder can feel different when the available pool or constraint
          changes.
        </p>
        <p className="text-muted-foreground leading-8">
          For a first <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          run, Current NBA is the easiest concept to understand because the pool
          is tied to active-player names shown by the live interface. Salary Cap
          adds a budget-style constraint. Because daily modes can change, use the
          embedded official game above as the live source of truth instead of an
          old screenshot or third-party video.
        </p>
        <p className="text-muted-foreground leading-8">
          Community posts may also discuss Sandbox, all-time pools, 99 OVR runs,
          or other <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          challenges. Those are useful search terms, but they should not be called
          permanent official modes unless they are visible in the current game or
          announced by the creator.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Best Build a Bucket NBA Game strategy for a first run
        </h2>
        <p className="text-muted-foreground leading-8">
          The best beginner strategy for <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          is role first, balance second, perfection third. Start by deciding what
          a successful Guard or Big must be able to do. Secure those difficult
          core areas early, then repair the weakest remaining category instead of
          chasing another luxury strength.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-border rounded-2xl border p-5">
            <h3 className="font-semibold">Guard checklist</h3>
            <ul className="text-muted-foreground mt-3 list-disc space-y-2 pl-5 leading-7">
              <li>Secure at least one dependable scoring route.</li>
              <li>Protect Handles and Passing from late-run desperation picks.</li>
              <li>Do not ignore Perimeter D because the wheel gives a star scorer.</li>
              <li>Use Speed and Bounce to support the intended style.</li>
            </ul>
          </div>
          <div className="border-border rounded-2xl border p-5">
            <h3 className="font-semibold">Big checklist</h3>
            <ul className="text-muted-foreground mt-3 list-disc space-y-2 pl-5 leading-7">
              <li>Build a reliable finishing foundation.</li>
              <li>Use Strength and Bounce to support the frontcourt identity.</li>
              <li>Do not spend versatile players on strengths already solved.</li>
              <li>Leave enough supporting skill to avoid a one-dimensional build.</li>
            </ul>
          </div>
        </div>
        <p className="text-muted-foreground leading-8">
          A strong <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          decision is sometimes less exciting than the obvious superstar pick. If
          a category is already excellent, using the next spin to repair Passing,
          Perimeter D, Strength, or another open need can create a more complete
          player for the season simulation.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game season simulation and 99 OVR searches
        </h2>
        <p className="text-muted-foreground leading-8">
          The final hook of <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          is that the custom player is not only a collection screen. The completed
          build feeds into a season-simulation result, giving the earlier drafting
          decisions a payoff beyond the card itself.
        </p>
        <p className="text-muted-foreground leading-8">
          Searches for <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          often include phrases such as 99 OVR, best build, best Guard, or best Big.
          Those searches make sense, but no official public formula currently
          proves a guaranteed route to a specific overall. The safest strategy is
          to optimize the visible build, preserve role balance, and treat exact
          hidden weights as unknown unless the creator publishes them.
        </p>
        <p className="text-muted-foreground leading-8">
          If you enjoy the draft-and-simulate concept and want a separate game
          with thirteen attributes, Classic, Blind, and Chaos modes, you can also
          play <Link href="/#play" className={linkClass}>Build a Hooper</Link> or
          read our <Link href="/how-it-works" className={linkClass}>simulation guide</Link>.
          Those are separate systems, so their ratings and formulas should not be
          used as evidence for Build-A-Bucket.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game: what is verified and what is not
        </h2>
        <p className="text-muted-foreground leading-8">
          Because <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          is a live browser project, third-party explanations can quickly become
          stale. Use this distinction when reading guides or watching clips.
        </p>
        <div className="border-border overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Topic</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">How to treat it</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              <tr><td className="px-4 py-3">Guard / Big paths</td><td className="px-4 py-3">Verified</td><td className="text-muted-foreground px-4 py-3">Visible on the official interface.</td></tr>
              <tr><td className="px-4 py-3">Current NBA</td><td className="px-4 py-3">Verified</td><td className="text-muted-foreground px-4 py-3">Visible on the official interface.</td></tr>
              <tr><td className="px-4 py-3">Daily Salary Cap</td><td className="px-4 py-3">Verified</td><td className="text-muted-foreground px-4 py-3">Visible on the current official interface.</td></tr>
              <tr><td className="px-4 py-3">Nine visible skill labels</td><td className="px-4 py-3">Verified</td><td className="text-muted-foreground px-4 py-3">Read from the current official game UI.</td></tr>
              <tr><td className="px-4 py-3">Exact wheel odds</td><td className="px-4 py-3">Not publicly documented</td><td className="text-muted-foreground px-4 py-3">Do not present guesses as official percentages.</td></tr>
              <tr><td className="px-4 py-3">Exact OVR formula</td><td className="px-4 py-3">Not publicly documented</td><td className="text-muted-foreground px-4 py-3">Treat guaranteed formulas as unverified.</td></tr>
              <tr><td className="px-4 py-3">Exact season formula</td><td className="px-4 py-3">Not publicly documented</td><td className="text-muted-foreground px-4 py-3">Use the result as game output, not a published model.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="faq" className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Bucket NBA Game FAQ
        </h2>
        <div className="space-y-4">
          {BUILD_A_BUCKET_FAQ.map((item) => (
            <details key={item.question} className="border-border rounded-2xl border p-5">
              <summary className="cursor-pointer font-semibold">
                {item.question}
              </summary>
              <p className="text-muted-foreground mt-3 leading-7">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-border bg-muted/30 rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">Play the official game above</h2>
        <p className="text-muted-foreground mt-3 leading-7">
          The iframe at the top of this page loads the official{' '}
          <strong className="text-foreground">Build a Bucket NBA Game</strong>{' '}
          from Build-A-Player. If your browser or the external site prevents
          iframe playback, open{' '}
          <a href={OFFICIAL_GAME_URL} target="_blank" rel="noreferrer" className={linkClass}>
            the official Build-A-Bucket page
          </a>{' '}
          directly.
        </p>
      </section>
    </article>
  );
}
