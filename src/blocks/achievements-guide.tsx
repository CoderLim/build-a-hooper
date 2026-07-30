import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';

const REWARD_ROWS = [
  {
    rarityKey: 'achievements.rarities.common' as const,
    pointsKey: 'achievements.guide.table.common_pts' as const,
    noteKey: 'achievements.guide.table.common_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.rare' as const,
    pointsKey: 'achievements.guide.table.rare_pts' as const,
    noteKey: 'achievements.guide.table.rare_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.epic' as const,
    pointsKey: 'achievements.guide.table.epic_pts' as const,
    noteKey: 'achievements.guide.table.epic_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.legendary' as const,
    pointsKey: 'achievements.guide.table.legendary_pts' as const,
    noteKey: 'achievements.guide.table.legendary_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.special' as const,
    pointsKey: 'achievements.guide.table.special_pts' as const,
    noteKey: 'achievements.guide.table.special_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.goat' as const,
    pointsKey: 'achievements.guide.table.goat_pts' as const,
    noteKey: 'achievements.guide.table.goat_note' as const,
  },
];

const linkClass =
  'font-semibold text-orange-300 underline decoration-orange-300/30 underline-offset-4 transition hover:text-orange-200';

function RewardTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead className="bg-white/5 text-xs tracking-wider text-white/50 uppercase">
          <tr>
            <th className="px-4 py-3 font-bold">
              {m['achievements.guide.table.col_rarity']()}
            </th>
            <th className="px-4 py-3 font-bold">
              {m['achievements.guide.table.col_points']()}
            </th>
            <th className="px-4 py-3 font-bold">
              {m['achievements.guide.table.col_note']()}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-white/65">
          {REWARD_ROWS.map((row) => (
            <tr key={row.rarityKey}>
              <td className="px-4 py-3 font-semibold text-white/80">
                {m[row.rarityKey]()}
              </td>
              <td className="px-4 py-3">{m[row.pointsKey]()}</td>
              <td className="px-4 py-3 leading-6">{m[row.noteKey]()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LocalizedAchievementsGuide() {
  return (
    <article className="space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <header>
        <p className="text-xs font-bold tracking-[0.2em] text-orange-300/80 uppercase">
          {m['achievements.guide.eyebrow']()}
        </p>
        <h2 className="mt-3 text-xl font-black tracking-tight text-white sm:text-2xl">
          {m['achievements.guide.title']()}
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/60">
          {m['achievements.guide.intro']()}
        </p>
      </header>
      <section className="space-y-3">
        <h3 className="text-base font-bold text-white">
          {m['achievements.guide.unlock_title']()}
        </h3>
        <p className="text-sm leading-7 text-white/60">
          {m['achievements.guide.unlock_body']()}
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-white/60">
          <li>{m['achievements.guide.unlock_1']()}</li>
          <li>{m['achievements.guide.unlock_2']()}</li>
          <li>{m['achievements.guide.unlock_3']()}</li>
        </ol>
      </section>
      <section className="space-y-3">
        <h3 className="text-base font-bold text-white">
          {m['achievements.guide.categories_title']()}
        </h3>
        <p className="text-sm leading-7 text-white/60">
          {m['achievements.guide.categories_body']()}
        </p>
      </section>
      <section className="space-y-3">
        <h3 className="text-base font-bold text-white">
          {m['achievements.guide.table_title']()}
        </h3>
        <RewardTable />
      </section>
    </article>
  );
}

function EnglishAchievementsGuide() {
  return (
    <article className="space-y-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white/65 sm:p-8">
      <header className="space-y-4">
        <p className="text-xs font-bold tracking-[0.2em] text-orange-300/80 uppercase">
          Complete unlock guide
        </p>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Build a Hooper Achievements Guide
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          <strong className="text-white/85">Build a Hooper Achievements</strong>{' '}
          is the complete milestone system for saved careers on buildahooper.org.
          The page tracks mode challenges, competitive titles, position wins,
          rookie experiments, underdog runs, build quality, awards, and long-term
          legacy goals. Build a Hooper Achievements turns repeat play into a
          structured progression path, so every run can teach a new strategy
          instead of becoming another isolated season.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          How Build a Hooper Achievements unlock
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          To unlock Build a Hooper Achievements, sign in before completing the
          relevant run. Guest players can browse the catalog and plan objectives,
          but account progress appears only for signed-in careers. After a saved
          season satisfies an objective, the matching Build a Hooper Achievements
          card becomes unlocked and its points are added to the achievement total.
          Use the refresh button when a recently completed run has not appeared
          yet.
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 sm:text-base">
          <li>Choose one primary objective before starting the draft.</li>
          <li>Sign in, complete the full run, and reach the final season card.</li>
          <li>Return to Build a Hooper Achievements and refresh your progress.</li>
        </ol>
        <p className="text-sm leading-7 sm:text-base">
          The Build a Hooper Achievements page includes filters for status,
          category, and rarity. Status separates unlocked objectives from
          remaining goals. Category groups related challenges. Rarity indicates
          how difficult or specialized a milestone is expected to be. Search is
          useful when you already know the name of a target, such as Floor
          General, Balanced Monster, Finals MVP, or Complete Hooper.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Build a Hooper Achievements mode challenges
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          Mode achievements are the best starting point. First Classic, First
          Blind, and First Chaos ask you to complete a run in each mode. Ring
          objectives then require championships in Classic, Blind, or Chaos. The
          Build a Hooper Achievements system gives extra long-term weight to
          Blind and Chaos title ladders because those modes remove information
          and reduce reroll safety. Read the{' '}
          <Link href="/modes" className={linkClass}>
            complete game modes guide
          </Link>{' '}
          before attempting the harder Build a Hooper Achievements challenges.
        </p>
        <p className="text-sm leading-7 sm:text-base">
          Competitive-title objectives such as Ring Collector, Eleven Rings,
          Dynasty Builder, and Immortal Legacy require increasing numbers of
          titles in Blind or Chaos. These Build a Hooper Achievements cannot be
          rushed with one perfect build. They reward a repeatable process: choose
          portable attributes, avoid position-breaking holes, save the reroll for
          a truly dead board, and finish every season that still has a credible
          playoff path.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Build a Hooper Achievements by position
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          Position achievements ask you to win with PG, SG, SF, PF, and C. The
          Build a Hooper Achievements catalog includes individual position titles
          and Complete Hooper, which requires a championship with every position
          in Blind or Chaos. This category is where the{' '}
          <Link href="/attributes" className={linkClass}>
            attributes guide
          </Link>{' '}
          and{' '}
          <Link href="/best-builds" className={linkClass}>
            best-builds hub
          </Link>{' '}
          become essential. Handles and passing anchor point guards; shooting and
          perimeter defense support wings; rebounding and interior defense
          stabilize bigs.
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead className="bg-white/5 text-xs tracking-wider text-white/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-bold">Position</th>
                <th className="px-4 py-3 font-bold">Foundation</th>
                <th className="px-4 py-3 font-bold">Compatible targets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr>
                <td className="px-4 py-3 font-semibold text-white/80">PG</td>
                <td className="px-4 py-3">HAN, PAS, 3PT or MID</td>
                <td className="px-4 py-3">Floor General, MVP, 60 wins</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white/80">SG</td>
                <td className="px-4 py-3">3PT, MID, FIN, HAN</td>
                <td className="px-4 py-3">Sniper Build, Scoring King</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white/80">SF</td>
                <td className="px-4 py-3">3PT, PDEF, FIN, ATH</td>
                <td className="px-4 py-3">Balanced Monster, two-way awards</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white/80">PF / C</td>
                <td className="px-4 py-3">REB, IDEF, FIN, BLK or STR</td>
                <td className="px-4 py-3">Defensive Wall, DPOY, underdog title</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Rookie and underdog Build a Hooper Achievements
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          Rookie achievements create a different drafting puzzle. Some Build a
          Hooper Achievements require at least one rookie, five rookies, an
          all-rookie build, or a championship with an all-rookie roster in Blind
          or Chaos. The goal is not simply selecting young players. You still
          need role coverage. A rookie-heavy point guard build must create
          offense, and a rookie-heavy center must rebound. Build a Hooper
          Achievements rewards the constraint only when the season result proves
          the build worked.
        </p>
        <p className="text-sm leading-7 sm:text-base">
          Underdog Run and Underdog Miracle focus on A- or lower builds in Blind
          or Chaos. These Build a Hooper Achievements teach one of the most useful
          lessons in the game: overall rating is not the whole card. A coherent
          lower-rated player can outperform a shiny build with empty creation,
          weak finishing, or no defensive foundation.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Build and award Build a Hooper Achievements
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          Build achievements examine the attribute sheet itself. Floor General
          asks for strong passing and handles. Sniper Build requires high
          three-point and mid-range grades. Athletic Freak combines athleticism,
          dunking, and strength. Defensive Wall checks perimeter defense,
          interior defense, blocks, and rebounding. Balanced Monster, Specialist,
          Superstar Build, GOAT Blueprint, and Perfect Balance raise the standard
          further. The Build a Hooper Achievements filters make it easy to isolate
          these construction targets before you start a new run.
        </p>
        <p className="text-sm leading-7 sm:text-base">
          Award achievements depend on season outcomes. Scoring King, Defensive
          Anchor, Season MVP, Finals MVP, Complete Superstar, Offensive Takeover,
          Two-Way Monster, and Perfect Resume require individual awards or
          specific combinations. These Build a Hooper Achievements are easier
          when the build has a clear identity. A scoring route needs a reliable
          shot diet, while a defensive route needs attributes that affect
          possessions across the season.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Build a Hooper Achievements rarity and points
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          Rarity and achievement points show the expected effort. Common
          objectives introduce the system. Rare and Epic milestones usually
          require stronger runs or deliberate construction. Legendary, Special,
          and GOAT objectives represent long grinds, difficult combinations, or
          near-perfect outcomes. Build a Hooper Achievements points are separate
          from leaderboard legacy points: achievement points measure catalog
          completion, while the{' '}
          <Link href="/leaderboard" className={linkClass}>
            Build a Hooper Leaderboard
          </Link>{' '}
          measures saved career performance.
        </p>
        <RewardTable />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Fastest Build a Hooper Achievements route
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          The fastest Build a Hooper Achievements route is not to chase every
          objective at once. Start with mode completion, then earn one
          championship at each position in Classic while learning role
          requirements. Move into Blind for position and underdog goals. Use
          Chaos when you can draft balanced, transferable clusters without
          visible ratings. Stack compatible targets: a rookie-heavy Blind title
          might unlock a mode ring, a rookie milestone, a position title, and an
          award objective in one run.
        </p>
        <p className="text-sm leading-7 sm:text-base">
          Before each run, choose one primary Build a Hooper Achievements target
          and two compatible secondary targets. A PG Floor General attempt can
          also pursue Season MVP and a 60-win season. A Center Defensive Wall
          attempt can chase Defensive Player of the Year and a title. This
          planning prevents the common mistake of locking unrelated A+ grades
          that do not support the same result.
        </p>
        <p className="text-sm leading-7 sm:text-base">
          Do not abandon a run just because one target becomes impossible. The
          Build a Hooper Achievements system contains enough overlapping goals
          that the season can still produce progress. If an all-rookie route
          breaks, the same card may still earn a position championship, an award,
          a record, or leaderboard points. Finish credible runs and read the
          result as feedback.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Use Build a Hooper Achievements with every guide
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          The{' '}
          <Link href="/how-to-play" className={linkClass}>
            how-to-play guide
          </Link>{' '}
          explains the full loop. The{' '}
          <Link href="/modes" className={linkClass}>
            modes guide
          </Link>{' '}
          covers hidden-information strategy. The{' '}
          <Link href="/attributes" className={linkClass}>
            attributes guide
          </Link>{' '}
          defines all 13 stats.{' '}
          <Link href="/best-builds" className={linkClass}>
            Best builds
          </Link>{' '}
          provides PG, SG, SF, PF, and C templates. Return to the{' '}
          <Link href="/" className={linkClass}>
            playable homepage
          </Link>{' '}
          when you have chosen the next Build a Hooper Achievements objective.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Build a Hooper Achievements FAQ
        </h2>
        <div className="space-y-5 text-sm leading-7 sm:text-base">
          <div>
            <h3 className="font-bold text-white">Do guest runs unlock achievements?</h3>
            <p>
              Guest players can browse Build a Hooper Achievements, but persistent
              unlock progress requires a signed-in saved run.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">Are rarity levels random?</h3>
            <p>
              No. Rarity classifies the expected difficulty or effort of an
              objective; it is not a random drop rate.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">
              Are achievement points the same as legacy points?
            </h3>
            <p>
              No. Build a Hooper Achievements points measure catalog completion,
              while legacy points rank completed careers on the leaderboard.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">Is this an official NBA system?</h3>
            <p>
              No. Build a Hooper Achievements is part of an unofficial fan
              simulator and is not affiliated with the NBA, NBA 2K, Take-Two, or
              any team or league.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}

export function AchievementsGuide() {
  return m['achievements.title']() === 'Achievements' ? (
    <EnglishAchievementsGuide />
  ) : (
    <LocalizedAchievementsGuide />
  );
}
