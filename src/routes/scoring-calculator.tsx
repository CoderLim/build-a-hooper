import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import {
  computeLegacyPointsBreakdown,
  type PlayoffResult,
} from '@/lib/hooper/legacy-points';
import { buildPageHead } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales } from '@/paraglide/runtime.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { buttonVariants } from '@/components/ui/button';

const PLAYOFF_OPTIONS: { value: PlayoffResult; labelKey: string }[] = [
  { value: 'Missed Playoffs', labelKey: 'scoring.result.missed' },
  { value: 'Play-In Exit', labelKey: 'scoring.result.play_in' },
  { value: 'First Round Exit', labelKey: 'scoring.result.first_round' },
  {
    value: 'Conference Semifinals',
    labelKey: 'scoring.result.semifinals',
  },
  {
    value: 'Conference Finals',
    labelKey: 'scoring.result.conference_finals',
  },
  { value: 'NBA Finals', labelKey: 'scoring.result.finals' },
  { value: 'NBA Champion', labelKey: 'scoring.result.champion' },
];

export const Route = createFileRoute('/scoring-calculator')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['scoring.meta.title']({}, { locale }),
      description: m['scoring.meta.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildPageHead({
          title: loaderData.title,
          description: loaderData.description,
          path: '/scoring-calculator',
          locale: loaderData.locale,
          alternateLocales: locales,
        })
      : {},
  component: ScoringCalculatorPage,
});

function ScoringCalculatorPage() {
  const [overall, setOverall] = useState(90);
  const [wins, setWins] = useState(50);
  const [playoffResult, setPlayoffResult] =
    useState<PlayoffResult>('NBA Champion');

  const breakdown = useMemo(
    () => computeLegacyPointsBreakdown({ overall, wins, playoffResult }),
    [overall, playoffResult, wins]
  );

  const rows = [
    [m['scoring.breakdown.base'](), breakdown.base],
    [m['scoring.breakdown.wins'](), breakdown.wins],
    [m['scoring.breakdown.playoffs'](), breakdown.playoffs],
    [m['scoring.breakdown.overall'](), breakdown.overall],
  ] as const;

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
              {m['scoring.eyebrow']()}
            </p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              {m['scoring.title']()}
            </h1>
            <p className="text-muted-foreground mt-5 text-base leading-8">
              {m['scoring.intro']()}
            </p>
          </header>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="border-border bg-card rounded-3xl border p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                {m['scoring.inputs_title']()}
              </h2>
              <div className="mt-6 grid gap-5">
                <label className="grid gap-2 text-sm font-medium">
                  {m['scoring.overall_label']()}
                  <input
                    type="number"
                    min={50}
                    max={97}
                    value={overall}
                    onChange={(event) =>
                      setOverall(
                        Math.min(
                          97,
                          Math.max(50, Number(event.target.value) || 50)
                        )
                      )
                    }
                    className="border-input bg-background h-11 rounded-xl border px-3"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  {m['scoring.wins_label']()}
                  <input
                    type="number"
                    min={0}
                    max={82}
                    value={wins}
                    onChange={(event) =>
                      setWins(
                        Math.min(
                          82,
                          Math.max(0, Number(event.target.value) || 0)
                        )
                      )
                    }
                    className="border-input bg-background h-11 rounded-xl border px-3"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  {m['scoring.result_label']()}
                  <select
                    value={playoffResult}
                    onChange={(event) =>
                      setPlayoffResult(event.target.value as PlayoffResult)
                    }
                    className="border-input bg-background h-11 rounded-xl border px-3"
                  >
                    {PLAYOFF_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {tDynamic(option.labelKey)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <section className="border-primary/25 bg-primary/5 rounded-3xl border p-6 sm:p-8">
              <p className="text-muted-foreground text-sm font-medium">
                {m['scoring.total_label']()}
              </p>
              <p className="text-primary mt-2 text-6xl font-black tabular-nums">
                {breakdown.total}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                {m['scoring.points_unit']()}
              </p>
              <div className="border-border mt-7 border-t pt-5">
                {rows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold tabular-nums">+{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-5 text-xs leading-6">
                {m['scoring.max_note']()}
              </p>
            </section>
          </div>

          <section className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-2xl font-semibold">
              {m['scoring.formula_title']()}
            </h2>
            <div className="text-muted-foreground mt-4 space-y-4 leading-8">
              <p>{m['scoring.formula_body_1']()}</p>
              <p>{m['scoring.formula_body_2']()}</p>
              <p>{m['scoring.formula_body_3']()}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/game" className={buttonVariants()}>
                {m['scoring.play_cta']()}
              </Link>
              <Link
                href="/blog/build-a-hooper-high-score-guide"
                className={buttonVariants({ variant: 'outline' })}
              >
                {m['scoring.guide_cta']()}
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
