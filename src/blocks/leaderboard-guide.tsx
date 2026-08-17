import { Link } from '@/core/i18n/navigation';

const PLAYOFF_ROWS = [
  ['Missed Playoffs', '0'],
  ['Play-In Exit', '20'],
  ['First Round Exit', '30'],
  ['Conference Semifinals', '45'],
  ['Conference Finals', '60'],
  ['NBA Finals', '90'],
  ['NBA Champion', '120'],
] as const;

const linkClass =
  'font-semibold text-orange-300 underline decoration-orange-300/30 underline-offset-4 transition hover:text-orange-200';

export function LeaderboardGuide({ locale }: { locale: string }) {
  if (locale !== 'en') return null;

  return (
    <article className="mt-12 space-y-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white/65 sm:p-8">
      <header className="space-y-4">
        <p className="text-xs font-bold tracking-[0.2em] text-orange-300/80 uppercase">
          Rankings explained
        </p>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Build a Hooper Leaderboard Guide
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          The{' '}
          <strong className="text-white/85">Build a Hooper Leaderboard</strong>{' '}
          is the live ranking page for saved careers on buildahooper.org. It
          turns every completed season into a comparable record instead of
          leaving the result inside one local game session. The Build a Hooper
          Leaderboard lets you compare legacy points, championships, win rate,
          best overall rating, total runs, and award totals. Those columns
          reward different kinds of players, so one strong season does not
          automatically make somebody the most complete competitor.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          How the Build a Hooper Leaderboard works
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          The default Build a Hooper Leaderboard view sorts by legacy points.
          Legacy points are designed to reward both completion and meaningful
          postseason progress. Every saved run starts with 10 base points. A
          season with at least 38 wins adds 10 points. Playoff results add
          between 0 and 120 points, and overall rating can add another 10 or 20
          points. That means the maximum Build a Hooper Leaderboard score from
          one run is 160 points.
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead className="bg-white/5 text-xs tracking-wider text-white/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-bold">Legacy component</th>
                <th className="px-4 py-3 font-bold">Requirement</th>
                <th className="px-4 py-3 font-bold">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr>
                <td className="px-4 py-3 font-semibold text-white/80">Base</td>
                <td className="px-4 py-3">Complete and save a run</td>
                <td className="px-4 py-3">10</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white/80">Wins</td>
                <td className="px-4 py-3">
                  Win at least 38 regular-season games
                </td>
                <td className="px-4 py-3">10</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white/80">
                  Overall
                </td>
                <td className="px-4 py-3">90–94 OVR / 95+ OVR</td>
                <td className="px-4 py-3">10 / 20</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-7 sm:text-base">
          Because the Build a Hooper Leaderboard adds points across saved
          careers, consistency usually beats one lucky card. A player who
          finishes ten credible runs, reaches the playoffs often, and wins
          several titles can pass somebody with one spectacular build. The
          ranking therefore measures legacy, not only peak talent. The best way
          to climb the Build a Hooper Leaderboard is to finish runs, avoid empty
          role-defining attributes, and create builds that can survive all 82
          games.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Build a Hooper Leaderboard playoff points
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          Postseason progress is the largest part of the scoring formula. The
          Build a Hooper Leaderboard gives a modest reward for reaching the
          Play-In and increasingly larger rewards for every deeper round. A
          championship contributes 120 points before base, wins, or overall
          bonuses are added.
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead className="bg-white/5 text-xs tracking-wider text-white/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-bold">Playoff result</th>
                <th className="px-4 py-3 font-bold">Legacy points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {PLAYOFF_ROWS.map(([result, points]) => (
                <tr key={result}>
                  <td className="px-4 py-3 font-semibold text-white/80">
                    {result}
                  </td>
                  <td className="px-4 py-3">{points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Reading every Build a Hooper Leaderboard category
        </h2>
        <h3 className="text-base font-bold text-white">Championships</h3>
        <p className="text-sm leading-7 sm:text-base">
          Championship sorting answers a simple question: who has won the most
          titles? The Build a Hooper Leaderboard counts completed championship
          runs, which makes this view useful for players who care about rings
          more than efficient points. A title is also the largest single playoff
          reward in the legacy formula, so championship hunters often rank well
          in the default view too. A player with many attempts can have more
          titles but a lower win rate than a careful player with fewer runs.
        </p>
        <h3 className="text-base font-bold text-white">Win rate</h3>
        <p className="text-sm leading-7 sm:text-base">
          Win rate is the percentage of saved runs that ended with a
          championship. On the Build a Hooper Leaderboard, win rate shows
          efficiency rather than volume. It can identify players whose draft
          decisions produce reliable contenders, but it should be read beside
          total runs. A perfect rate after one run is not the same
          accomplishment as sustaining a strong rate across twenty runs. Use the
          runs column as the sample-size check whenever you compare Build a
          Hooper Leaderboard win rates.
        </p>
        <h3 className="text-base font-bold text-white">Best OVR</h3>
        <p className="text-sm leading-7 sm:text-base">
          Best OVR highlights the highest overall rating recorded by each
          player. The Build a Hooper Leaderboard includes this metric because
          players enjoy chasing elite cards, but overall is not the only path to
          winning. A balanced A- build can defeat a fragile A+ card if the
          stronger-looking card lacks handles, passing, finishing, defense, or
          rebounding for its position. Read the{' '}
          <Link href="/attributes" className={linkClass}>
            complete attributes guide
          </Link>{' '}
          before assuming the highest Build a Hooper Leaderboard OVR represents
          the smartest season.
        </p>
        <h3 className="text-base font-bold text-white">Awards and runs</h3>
        <p className="text-sm leading-7 sm:text-base">
          Awards sorting rewards individual season dominance. MVP, Defensive
          Player of the Year, scoring titles, Finals MVP, and other honors show
          that a build did more than survive. The Build a Hooper Leaderboard
          award view is useful when comparing specialist routes. Total runs adds
          the missing context: it shows how much evidence sits behind every
          other number.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          How to enter the Build a Hooper Leaderboard
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 sm:text-base">
          <li>Sign in before the completed career is saved.</li>
          <li>
            Choose Classic, Blind, or Chaos and finish the 13-attribute draft.
          </li>
          <li>Select a career team and complete the full 82-game season.</li>
          <li>Finish the postseason path and reach the final card.</li>
          <li>
            Return to the Build a Hooper Leaderboard and refresh the ranking.
          </li>
        </ol>
        <p className="text-sm leading-7 sm:text-base">
          Guest runs are useful for practice, but they do not create a
          persistent account ranking. The completed card needs to be saved
          before the Build a Hooper Leaderboard can include its legacy points,
          awards, record, and postseason result.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Build a Hooper Leaderboard strategy by position
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          The most reliable Build a Hooper Leaderboard strategy starts before
          the first spin. Choose a role, then protect its required attributes.
          Point guards need handles and passing; centers need rebounding and
          interior defense; wings need a scoring path and enough perimeter
          defense. The{' '}
          <Link href="/best-builds" className={linkClass}>
            best-builds hub
          </Link>{' '}
          explains every position route, while the{' '}
          <Link href="/modes" className={linkClass}>
            game modes guide
          </Link>{' '}
          shows why Classic, Blind, and Chaos demand different risk management.
          A coherent build is more likely to reach 38 wins, earn postseason
          points, and keep adding to your Build a Hooper Leaderboard total.
        </p>
        <p className="text-sm leading-7 sm:text-base">
          Classic is the safest mode for learning a repeatable ranking strategy
          because ratings are visible and rerolls are more generous. Blind
          forces you to rely on known player roles instead of visible grades.
          Chaos hides both position and ratings, so portable skills become more
          valuable. The Build a Hooper Leaderboard does not replace mode
          strategy; it shows the long-term result of that strategy. Players who
          learn all three modes also have more routes into the{' '}
          <Link href="/achievements" className={linkClass}>
            Build a Hooper Achievements catalog
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Common Build a Hooper Leaderboard mistakes
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          Do not chase the Build a Hooper Leaderboard by resetting every
          imperfect draft. A completed 90 OVR conference finalist can produce
          more legacy value than an abandoned search for a flawless card. Save
          rerolls for boards that cannot support your role. Once the season
          begins, judge the build by repeatable performance rather than one hot
          opening week. The Build a Hooper Leaderboard rewards finished
          evidence.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 sm:text-base">
          <li>
            Overvaluing one high overall rating and ignoring role balance.
          </li>
          <li>Reading a 100% win rate without checking the number of runs.</li>
          <li>
            Copying a safe Classic build directly into hidden-position Chaos.
          </li>
          <li>
            Building for highlights instead of the complete 82-game schedule.
          </li>
          <li>
            Leaving a point guard without creation or a center without
            rebounding.
          </li>
        </ul>
        <p className="text-sm leading-7 sm:text-base">
          The Build a Hooper Leaderboard is a summary of repeated decisions. If
          a weakness appears every night, it eventually appears in wins, playoff
          results, awards, and ranking totals.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Use the Build a Hooper Leaderboard with every guide
        </h2>
        <p className="text-sm leading-7 sm:text-base">
          Learn the complete game loop in the{' '}
          <Link href="/how-to-play" className={linkClass}>
            how-to-play guide
          </Link>
          , review all 13 stats in the{' '}
          <Link href="/attributes" className={linkClass}>
            attributes guide
          </Link>
          , compare modes in the{' '}
          <Link href="/modes" className={linkClass}>
            modes guide
          </Link>
          , and choose a position plan in{' '}
          <Link href="/best-builds" className={linkClass}>
            best builds
          </Link>
          . Then return to the{' '}
          <Link href="/" className={linkClass}>
            playable homepage
          </Link>
          , finish a season, and use the Build a Hooper Leaderboard to compare
          the result.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">
          Build a Hooper Leaderboard FAQ
        </h2>
        <div className="space-y-5 text-sm leading-7 sm:text-base">
          <div>
            <h3 className="font-bold text-white">
              How are legacy points calculated?
            </h3>
            <p>
              Legacy points combine 10 base points, 10 points for at least 38
              wins, playoff points, and a 10- or 20-point overall bonus.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">
              Why can one player lead only one category?
            </h3>
            <p>
              The Build a Hooper Leaderboard separates volume, efficiency, peak
              overall, awards, and championships. Different career styles can
              lead different views.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">
              Is this an official NBA ranking?
            </h3>
            <p>
              No. The Build a Hooper Leaderboard is a community ranking for the
              buildahooper.org simulator and is not affiliated with the NBA, NBA
              2K, Take-Two, or any team or league.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
