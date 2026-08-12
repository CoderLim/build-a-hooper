import { Link } from '@/core/i18n/navigation';
import type { FaqItem } from '@/lib/seo/json-ld';
import { getLocale } from '@/paraglide/runtime.js';

const linkClass =
  'text-primary font-semibold underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary';

const EN_FAQ: FaqItem[] = [
  {
    question: 'What are Legacy points in Build a Hooper?',
    answer:
      'Legacy points are the ranking score attached to a completed saved Build a Hooper run. The current calculator uses four inputs from the run: a 10-point completion base, a 10-point bonus for at least 38 regular-season wins, one playoff-result bonus, and an OVR bonus for 90+ or 95+ cards.',
  },
  {
    question: 'Do awards add Legacy points?',
    answer:
      'No. MVP, Defensive Player of the Year, Scoring Title, Finals MVP, and achievement points are tracked separately. The Legacy calculator only uses completion, regular-season wins, deepest playoff result, and final overall rating.',
  },
  {
    question: 'Do playoff bonuses stack by round?',
    answer:
      'No. Only the deepest playoff result counts. A championship is worth 120 playoff points total; it does not also add the First Round, Semifinals, Conference Finals, and NBA Finals values.',
  },
  {
    question: 'How many points is a championship worth?',
    answer:
      'An NBA Champion result contributes 120 playoff points. A completed run can reach the 160-point maximum when it also has at least 38 wins and a 95+ OVR card: 10 base + 10 wins + 120 championship + 20 OVR.',
  },
  {
    question: 'Why does the calculator use 38 wins?',
    answer:
      'Thirty-eight wins is a Build a Hooper scoring threshold, not an official NBA playoff qualification rule. Reaching 38 wins adds 10 Legacy points under the current game scoring system.',
  },
  {
    question: 'Does using this calculator save or change my run?',
    answer:
      'No. The calculator is a read-only estimator. Changing OVR, wins, or playoff result on this page does not alter a saved season, leaderboard entry, achievement, or game simulation.',
  },
];

const LOCALIZED_FAQ: Record<string, FaqItem[]> = {
  zh: [
    {
      question: 'Build a Hooper 的 Legacy points 是什么？',
      answer:
        'Legacy points 是已完成并保存的赛季用于排行榜比较的积分。当前规则由完成赛季基础分、38 胜奖励、最深季后赛轮次奖励和最终 OVR 奖励组成。',
    },
    {
      question: 'MVP、DPOY 等奖项会增加 Legacy points 吗？',
      answer:
        '不会。奖项和成就积分单独记录，Legacy Calculator 只计算完成赛季、常规赛胜场、最深季后赛结果和最终 OVR。',
    },
    {
      question: '季后赛每一轮的积分会累加吗？',
      answer:
        '不会，只计算你到达的最深结果。例如夺冠直接计算 120 分季后赛奖励，不再叠加首轮、半决赛和分区决赛奖励。',
    },
    {
      question: 'Legacy points 最高是多少？',
      answer:
        '当前最高为 160：完成赛季 10 分 + 至少 38 胜 10 分 + 总冠军 120 分 + 95+ OVR 20 分。',
    },
  ],
  ja: [
    {
      question: 'Build a Hooper の Legacy points とは何ですか？',
      answer:
        'Legacy points は、完了して保存されたシーズンをランキングで比較するためのスコアです。完走、38勝以上、最深のプレーオフ結果、最終 OVR で計算されます。',
    },
    {
      question: 'MVP や DPOY は Legacy points に加算されますか？',
      answer:
        'いいえ。受賞歴と実績ポイントは別管理です。Legacy Calculator は完走、勝数、プレーオフ結果、OVR のみを使用します。',
    },
    {
      question: 'プレーオフの各ラウンドのポイントは累積しますか？',
      answer:
        'いいえ。最も深く進んだ結果だけが対象です。優勝ならプレーオフ分は合計 120 ポイントです。',
    },
    {
      question: 'Legacy points の最大値はいくつですか？',
      answer:
        '現在の最大値は 160 です。完走 10 + 38勝以上 10 + 優勝 120 + OVR 95以上 20 で到達します。',
    },
  ],
  ko: [
    {
      question: 'Build a Hooper Legacy points는 무엇인가요?',
      answer:
        'Legacy points는 완료 후 저장된 시즌을 리더보드에서 비교하는 점수입니다. 완주, 38승 이상, 가장 깊은 플레이오프 결과, 최종 OVR을 사용합니다.',
    },
    {
      question: 'MVP나 DPOY도 Legacy points에 추가되나요?',
      answer:
        '아니요. 수상 기록과 업적 포인트는 별도로 추적됩니다. Legacy Calculator는 완주, 승수, 플레이오프 결과, OVR만 계산합니다.',
    },
    {
      question: '플레이오프 라운드 점수는 누적되나요?',
      answer:
        '아니요. 가장 깊게 진출한 결과 하나만 계산합니다. 우승 시 플레이오프 보너스는 총 120점입니다.',
    },
    {
      question: 'Legacy points 최고 점수는 얼마인가요?',
      answer:
        '현재 최고 점수는 160점입니다. 완주 10 + 38승 이상 10 + 우승 120 + OVR 95 이상 20으로 구성됩니다.',
    },
  ],
};

export function getScoringFaqItems(locale: string): FaqItem[] {
  return locale === 'en' ? EN_FAQ : (LOCALIZED_FAQ[locale] ?? EN_FAQ);
}

function EnglishScoringGuide() {
  return (
    <div className="mx-auto mt-16 max-w-3xl space-y-14">
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          How to use the Build a Hooper Legacy Points Calculator
        </h2>
        <p className="text-muted-foreground leading-8">
          The <strong className="text-foreground">Build a Hooper Legacy Points Calculator</strong>{' '}
          is designed for one job: estimate the leaderboard value of a completed
          Build a Hooper season from the same inputs used by the current Legacy
          scoring rule. You do not need to remember every threshold. Enter the
          final OVR shown on your card, enter the number of regular-season wins,
          then choose the deepest playoff result your run reached. The score and
          breakdown update immediately.
        </p>
        <ol className="text-muted-foreground list-decimal space-y-3 pl-5 leading-8">
          <li>
            Enter your final <strong className="text-foreground">OVR</strong> from
            50 to 97. This controls the OVR bonus only; it does not replace the
            season or playoff components.
          </li>
          <li>
            Enter your <strong className="text-foreground">regular-season wins</strong>{' '}
            from 0 to 82. Build a Hooper adds the current win bonus once the run
            reaches 38 wins.
          </li>
          <li>
            Choose the <strong className="text-foreground">deepest playoff result</strong>{' '}
            from Missed Playoffs through NBA Champion. Only one postseason value
            is used.
          </li>
          <li>
            Read the total and the four-part breakdown. The Build a Hooper
            Legacy Points Calculator separates completion, wins, playoffs, and
            OVR so you can see exactly where the score came from.
          </li>
        </ol>
        <p className="text-muted-foreground leading-8">
          The calculator does not save a season or modify your account. It is a
          planning and explanation tool. To create an actual ranked run, play
          Build a Hooper while signed in and finish the season so the authoritative
          result can be saved to the{' '}
          <Link href="/leaderboard" className={linkClass}>
            leaderboard
          </Link>
          .
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Hooper Legacy points table
        </h2>
        <p className="text-muted-foreground leading-8">
          Build a Hooper Legacy scoring is additive across four categories, but
          the playoff category itself is not cumulative. Every completed saved
          run starts with 10 points. A run with at least 38 regular-season wins
          adds another 10. The deepest playoff result adds between 0 and 120,
          and OVR can add 0, 10, or 20.
        </p>
        <div className="border-border overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Component</th>
                <th className="px-4 py-3 font-semibold">Condition</th>
                <th className="px-4 py-3 text-right font-semibold">Points</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              <tr><td className="px-4 py-3">Completed run</td><td className="px-4 py-3 text-muted-foreground">Finish the run</td><td className="px-4 py-3 text-right font-semibold">10</td></tr>
              <tr><td className="px-4 py-3">Win bonus</td><td className="px-4 py-3 text-muted-foreground">38+ regular-season wins</td><td className="px-4 py-3 text-right font-semibold">10</td></tr>
              <tr><td className="px-4 py-3">Missed Playoffs</td><td className="px-4 py-3 text-muted-foreground">Deepest result</td><td className="px-4 py-3 text-right font-semibold">0</td></tr>
              <tr><td className="px-4 py-3">Play-In Exit</td><td className="px-4 py-3 text-muted-foreground">Deepest result</td><td className="px-4 py-3 text-right font-semibold">20</td></tr>
              <tr><td className="px-4 py-3">First Round Exit</td><td className="px-4 py-3 text-muted-foreground">Deepest result</td><td className="px-4 py-3 text-right font-semibold">30</td></tr>
              <tr><td className="px-4 py-3">Conference Semifinals</td><td className="px-4 py-3 text-muted-foreground">Deepest result</td><td className="px-4 py-3 text-right font-semibold">45</td></tr>
              <tr><td className="px-4 py-3">Conference Finals</td><td className="px-4 py-3 text-muted-foreground">Deepest result</td><td className="px-4 py-3 text-right font-semibold">60</td></tr>
              <tr><td className="px-4 py-3">NBA Finals</td><td className="px-4 py-3 text-muted-foreground">Deepest result</td><td className="px-4 py-3 text-right font-semibold">90</td></tr>
              <tr><td className="px-4 py-3">NBA Champion</td><td className="px-4 py-3 text-muted-foreground">Deepest result</td><td className="px-4 py-3 text-right font-semibold">120</td></tr>
              <tr><td className="px-4 py-3">OVR bonus</td><td className="px-4 py-3 text-muted-foreground">90–94 OVR</td><td className="px-4 py-3 text-right font-semibold">10</td></tr>
              <tr><td className="px-4 py-3">OVR bonus</td><td className="px-4 py-3 text-muted-foreground">95+ OVR</td><td className="px-4 py-3 text-right font-semibold">20</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-8">
          The maximum Build a Hooper Legacy score from these rules is 160:
          10 completion points + 10 for 38 or more wins + 120 for a championship
          + 20 for a 95+ OVR card. This is the same ceiling shown in the live
          breakdown above.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Three scoring examples
        </h2>
        <p className="text-muted-foreground leading-8">
          Examples make the Build a Hooper scoring system easier to read than a
          formula alone. The important detail is that a high OVR helps, but the
          postseason result can be worth far more than the OVR bonus.
        </p>
        <div className="grid gap-4">
          <article className="border-border bg-card rounded-2xl border p-5">
            <h3 className="font-semibold">Example 1: 87 OVR, 37 wins, missed playoffs</h3>
            <p className="text-muted-foreground mt-2 leading-7">
              This Build a Hooper run receives only the 10-point completion base.
              It misses the 38-win threshold, receives no playoff bonus, and is
              below the 90 OVR bonus line. Estimated Legacy score: <strong className="text-foreground">10</strong>.
            </p>
          </article>
          <article className="border-border bg-card rounded-2xl border p-5">
            <h3 className="font-semibold">Example 2: 92 OVR, 50 wins, Conference Finals</h3>
            <p className="text-muted-foreground mt-2 leading-7">
              The score is 10 for completion + 10 for 38+ wins + 60 for the
              Conference Finals + 10 for a 90–94 OVR card. Estimated Legacy
              score: <strong className="text-foreground">90</strong>.
            </p>
          </article>
          <article className="border-border bg-card rounded-2xl border p-5">
            <h3 className="font-semibold">Example 3: 96 OVR, 62 wins, NBA Champion</h3>
            <p className="text-muted-foreground mt-2 leading-7">
              This reaches every maximum category: 10 completion + 10 wins +
              120 championship + 20 for 95+ OVR. The Build a Hooper Legacy
              Points Calculator returns the maximum <strong className="text-foreground">160</strong>.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What matters most for a higher Legacy score?
        </h2>
        <p className="text-muted-foreground leading-8">
          The largest swing in Build a Hooper Legacy points comes from playoff
          progress. Moving from a First Round Exit to a championship changes the
          playoff component from 30 to 120 points, a 90-point difference. By
          comparison, moving from an 89 OVR card to a 95+ card changes the OVR
          component by 20 points. That does not make OVR unimportant; it means
          Build a Hooper rewards a season that turns the build into wins and a
          deep postseason run rather than rewarding the card grade alone.
        </p>
        <p className="text-muted-foreground leading-8">
          If your calculator score is lower than expected, inspect the breakdown
          instead of chasing a random higher total. A 37-win season is one win
          below the current 10-point win bonus. A 94 OVR card is one rating point
          below the 20-point OVR tier, but it still receives the 10-point 90+
          bonus. A Finals loss already earns 90 playoff points, while winning the
          championship increases that category to 120. These thresholds help you
          identify which part of the Build a Hooper result changed the ranking
          value.
        </p>
        <p className="text-muted-foreground leading-8">
          For build decisions, use the{' '}
          <Link href="/how-it-works" className={linkClass}>
            How It Works guide
          </Link>{' '}
          to understand position fit and season simulation, then compare role
          priorities in the{' '}
          <Link href="/best-builds" className={linkClass}>
            Position Builds guide
          </Link>
          . The Build a Hooper Legacy Points Calculator should be the final
          scoring lens, not the strategy engine you use to select every attribute.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          How playoff labels should be interpreted
        </h2>
        <p className="text-muted-foreground leading-8">
          Build a Hooper borrows familiar basketball postseason labels so the
          result is easy to read, but its Legacy score is a fan-game system. In
          the real NBA, the official{' '}
          <a
            className={linkClass}
            href="https://www.nba.com/news/nba-play-in-tournament"
            target="_blank"
            rel="noreferrer"
          >
            Play-In Tournament format
          </a>{' '}
          uses teams finishing seventh through tenth in each conference to decide
          the final two playoff seeds. The NBA also describes playoff rounds as
          best-of-seven series in its{' '}
          <a
            className={linkClass}
            href="https://www.nba.com/news/faq"
            target="_blank"
            rel="noreferrer"
          >
            official FAQ
          </a>
          . Those references explain the basketball vocabulary; they do not
          define Build a Hooper Legacy points.
        </p>
        <p className="text-muted-foreground leading-8">
          The 38-win threshold is likewise a Build a Hooper scoring rule, not a
          statement that 38 real NBA wins guarantee a postseason place. Keeping
          the distinction clear matters because the calculator is meant to
          explain this site's leaderboard scoring, not predict real standings or
          reproduce official NBA tiebreakers.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What the calculator does not count
        </h2>
        <p className="text-muted-foreground leading-8">
          Awards do not add Legacy points in the current Build a Hooper formula.
          MVP, Defensive Player of the Year, the Scoring Title, Finals MVP,
          triple-doubles, and individual achievements can still matter elsewhere
          on the site, but they are not hidden inputs in this calculator. The
          same is true for points per game, assists per game, rebounds per game,
          archetype, position, and the number of A+ attributes on the card.
        </p>
        <p className="text-muted-foreground leading-8">
          Achievement points are also separate from Legacy points. Use the{' '}
          <Link href="/achievements" className={linkClass}>
            Achievements page
          </Link>{' '}
          to track challenge progress and rarity rewards. Use the Build a Hooper
          Legacy Points Calculator when you want to understand the score that
          ranks completed runs by the current Legacy formula.
        </p>
      </section>

      <section id="faq" className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a Hooper Legacy Points Calculator FAQ
        </h2>
        <div className="space-y-6">
          {EN_FAQ.map((item) => (
            <div key={item.question}>
              <h3 className="font-semibold">{item.question}</h3>
              <p className="text-muted-foreground mt-2 leading-8">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const LOCALIZED_GUIDE: Record<
  string,
  { useTitle: string; steps: string[]; faqTitle: string; noteTitle: string; noteBody: string }
> = {
  zh: {
    useTitle: 'Build a Hooper Legacy Calculator 使用说明',
    steps: [
      '输入最终 OVR（50–97）。',
      '输入 82 场常规赛中的胜场数（0–82）。',
      '选择这次赛季达到的最深季后赛结果。',
      '查看总 Legacy points 以及完成赛季、胜场、季后赛和 OVR 四项拆分。',
    ],
    faqTitle: 'Build a Hooper Legacy Calculator 常见问题',
    noteTitle: '如何理解这个分数',
    noteBody:
      'Legacy points 用来比较已完成并保存的 Build a Hooper 赛季。当前最高为 160 分。季后赛结果是变化最大的部分；奖项、成就积分和单场数据不会直接进入 Legacy Calculator。',
  },
  ja: {
    useTitle: 'Build a Hooper Legacy Calculator の使い方',
    steps: [
      '最終 OVR（50–97）を入力します。',
      '82試合のレギュラーシーズン勝数（0–82）を入力します。',
      '最も深く進んだプレーオフ結果を選びます。',
      '完走、勝数、プレーオフ、OVR の内訳と合計 Legacy points を確認します。',
    ],
    faqTitle: 'Build a Hooper Legacy Calculator FAQ',
    noteTitle: 'スコアの読み方',
    noteBody:
      'Legacy points は保存済みの Build a Hooper シーズンを比較するためのスコアです。現在の最大値は160で、プレーオフ結果が最も大きな差を生みます。受賞や実績ポイントは別計算です。',
  },
  ko: {
    useTitle: 'Build a Hooper Legacy Calculator 사용 방법',
    steps: [
      '최종 OVR(50–97)을 입력합니다.',
      '82경기 정규시즌 승수(0–82)를 입력합니다.',
      '가장 깊게 진출한 플레이오프 결과를 선택합니다.',
      '완주, 승수, 플레이오프, OVR 항목과 총 Legacy points를 확인합니다.',
    ],
    faqTitle: 'Build a Hooper Legacy Calculator FAQ',
    noteTitle: '점수를 읽는 방법',
    noteBody:
      'Legacy points는 저장된 Build a Hooper 시즌을 비교하는 점수입니다. 현재 최대값은 160이며 플레이오프 결과가 가장 큰 차이를 만듭니다. 수상 기록과 업적 포인트는 별도로 계산됩니다.',
  },
};

function LocalizedScoringGuide({ locale }: { locale: string }) {
  const copy = LOCALIZED_GUIDE[locale] ?? LOCALIZED_GUIDE.zh!;
  const faq = getScoringFaqItems(locale);

  return (
    <div className="mx-auto mt-16 max-w-3xl space-y-12">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">{copy.useTitle}</h2>
        <ol className="text-muted-foreground list-decimal space-y-2 pl-5 leading-8">
          {copy.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">{copy.noteTitle}</h2>
        <p className="text-muted-foreground leading-8">{copy.noteBody}</p>
      </section>
      <section id="faq" className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">{copy.faqTitle}</h2>
        {faq.map((item) => (
          <div key={item.question}>
            <h3 className="font-semibold">{item.question}</h3>
            <p className="text-muted-foreground mt-2 leading-8">{item.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export function ScoringCalculatorGuide() {
  const locale = getLocale();
  return locale === 'en' ? (
    <EnglishScoringGuide />
  ) : (
    <LocalizedScoringGuide locale={locale} />
  );
}
