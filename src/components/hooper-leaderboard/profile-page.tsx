'use client';

import { Link } from '@/core/i18n/navigation';
import type { HooperRunView } from '@/modules/hooper/types';
import { m } from '@/paraglide/messages.js';
import { useHooperProfile } from '@/hooks/use-hooper-leaderboard';
import {
  GameEyebrow,
  GamePanel,
  GameShell,
  GameTitle,
} from '@/components/hooper-game/game-ui';

export function HooperProfilePage({ userId }: { userId: string }) {
  const { data, isLoading, isError } = useHooperProfile(userId);

  if (isLoading) {
    return (
      <GameShell>
        <main className="mx-auto max-w-4xl px-4 py-16 text-white/50">…</main>
      </GameShell>
    );
  }

  if (isError || !data) {
    return (
      <GameShell>
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-white/60">{m['profile.not_found']()}</p>
          <Link
            href="/leaderboard"
            className="mt-4 inline-block text-orange-300"
          >
            {m['profile.back_to_leaderboard']()}
          </Link>
        </main>
      </GameShell>
    );
  }

  const { legacy, recentRuns } = data;

  return (
    <GameShell>
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Link
          href="/leaderboard"
          className="text-sm text-white/60 hover:text-white"
        >
          ← {m['profile.back_to_leaderboard']()}
        </Link>

        <div>
          <GameEyebrow>
            {legacy.rank ? `#${legacy.rank}` : m['leaderboard.player']()}
          </GameEyebrow>
          <GameTitle className="mt-3">{legacy.displayName}</GameTitle>
          <p className="mt-2 text-sm text-white/50">
            {legacy.preferredPosition ?? '—'}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [legacy.totalLegacyPoints, m['leaderboard.sort.points']()],
            [legacy.totalChampionships, m['leaderboard.sort.championships']()],
            [`${legacy.winRate}%`, m['leaderboard.sort.win_rate']()],
            [legacy.bestOverall, m['leaderboard.sort.best_overall']()],
          ].map(([value, label]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-white/10 bg-white/3 p-4 text-center"
            >
              <p className="text-2xl font-black text-orange-300">{value}</p>
              <p className="mt-1 text-[10px] tracking-wider text-white/40 uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>

        <GamePanel title={m['profile.recent_runs']()}>
          {!recentRuns.length ? (
            <p className="text-sm text-white/50">{m['profile.no_runs']()}</p>
          ) : (
            <ul className="space-y-3">
              {recentRuns.map((run: HooperRunView) => (
                <li
                  key={run.id}
                  className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">
                      {run.careerTeamAbbr ?? '—'} · OVR {run.overall}
                    </p>
                    <p className="text-sm text-emerald-400">
                      {run.wins}-{run.losses}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-white/50">
                    {run.mode.toUpperCase()} · {run.playoffResult}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </GamePanel>
      </main>
    </GameShell>
  );
}
