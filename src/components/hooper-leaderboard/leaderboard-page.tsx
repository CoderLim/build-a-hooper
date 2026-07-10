'use client';

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Link } from '@/core/i18n/navigation';
import type { LeaderboardSortBy } from '@/modules/hooper/types';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { useLeaderboard } from '@/hooks/use-hooper-leaderboard';
import {
  GameButton,
  GameEyebrow,
  GamePanel,
  GameShell,
  GameTitle,
} from '@/components/hooper-game/game-ui';

const SORT_OPTIONS: { id: LeaderboardSortBy; labelKey: keyof typeof m }[] = [
  { id: 'points', labelKey: 'leaderboard.sort.points' },
  { id: 'championships', labelKey: 'leaderboard.sort.championships' },
  { id: 'winRate', labelKey: 'leaderboard.sort.win_rate' },
  { id: 'bestOverall', labelKey: 'leaderboard.sort.best_overall' },
  { id: 'runs', labelKey: 'leaderboard.sort.runs' },
  { id: 'awards', labelKey: 'leaderboard.sort.awards' },
];

function statValue(
  sortBy: LeaderboardSortBy,
  player: {
    totalLegacyPoints: number;
    totalChampionships: number;
    winRate: number;
    bestOverall: number;
    totalRuns: number;
    totalAwards: number;
  }
) {
  switch (sortBy) {
    case 'championships':
      return player.totalChampionships;
    case 'winRate':
      return `${player.winRate}%`;
    case 'bestOverall':
      return player.bestOverall;
    case 'runs':
      return player.totalRuns;
    case 'awards':
      return player.totalAwards;
    case 'points':
    default:
      return player.totalLegacyPoints;
  }
}

export function LeaderboardPage() {
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>('points');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { data, isLoading, isFetching } = useLeaderboard({
    sortBy,
    search: query,
  });

  const topThree = useMemo(() => data?.items.slice(0, 3) ?? [], [data?.items]);

  return (
    <GameShell>
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← {m['landing.nav.play']()}
          </Link>
          <GameButton
            variant="ghost"
            className="px-4 py-2 text-xs"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ['hooper-leaderboard'],
              })
            }
          >
            {m['leaderboard.refresh']()}
            {isFetching ? '…' : ''}
          </GameButton>
        </div>

        <div className="mb-8">
          <GameEyebrow>{m['leaderboard.eyebrow']()}</GameEyebrow>
          <GameTitle className="mt-3">{m['leaderboard.title']()}</GameTitle>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
            {m['leaderboard.subtitle']()}
          </p>
        </div>

        {data?.stats && (
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {[
              [data.stats.totalPlayers, m['leaderboard.stats.players']()],
              [data.stats.totalPoints, m['leaderboard.stats.points']()],
              [data.stats.totalChampionships, m['leaderboard.stats.titles']()],
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
        )}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSortBy(option.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase transition',
                  sortBy === option.id
                    ? 'border-orange-300/70 bg-orange-300/10 text-orange-200'
                    : 'border-white/10 bg-white/3 text-white/50 hover:border-white/20'
                )}
              >
                {m[option.labelKey]()}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(search.trim());
            }}
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={m['leaderboard.search_placeholder']()}
              className="w-full min-w-[220px] rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50 lg:w-64"
            />
            <button
              type="submit"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs font-black tracking-wide text-white uppercase transition hover:border-orange-300/60"
            >
              Go
            </button>
          </form>
        </div>

        {topThree.length > 0 && (
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {topThree.map((player) => (
              <GamePanel key={player.userId} className="text-center">
                <p className="text-xs text-white/40">#{player.rank}</p>
                <Link
                  href={`/profile/${player.userId}`}
                  className="mt-2 block text-lg font-black hover:text-orange-300"
                >
                  {player.displayName}
                </Link>
                <p className="mt-1 text-sm text-orange-300">
                  {player.preferredPosition ?? '—'}
                </p>
                <p className="mt-3 text-2xl font-black">
                  {statValue(sortBy, player)}
                </p>
              </GamePanel>
            ))}
          </div>
        )}

        <GamePanel title={m['leaderboard.title']()}>
          {isLoading ? (
            <p className="text-sm text-white/50">…</p>
          ) : !data?.items.length ? (
            <p className="text-sm text-white/50">{m['leaderboard.empty']()}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40">
                    <th className="px-3 py-3 font-medium">
                      {m['leaderboard.rank']()}
                    </th>
                    <th className="px-3 py-3 font-medium">
                      {m['leaderboard.player']()}
                    </th>
                    <th className="px-3 py-3 font-medium">
                      {m[SORT_OPTIONS.find((o) => o.id === sortBy)!.labelKey]()}
                    </th>
                    <th className="px-3 py-3 font-medium">
                      {m['leaderboard.sort.championships']()}
                    </th>
                    <th className="px-3 py-3 font-medium">
                      {m['leaderboard.sort.runs']()}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((player) => (
                    <tr
                      key={player.userId}
                      className="border-b border-white/5 hover:bg-white/3"
                    >
                      <td className="px-3 py-3 font-bold text-orange-300">
                        #{player.rank}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/profile/${player.userId}`}
                          className="font-semibold hover:text-orange-300"
                        >
                          {player.displayName}
                        </Link>
                        <p className="text-xs text-white/40">
                          {player.preferredPosition ?? '—'}
                        </p>
                      </td>
                      <td className="px-3 py-3 font-black">
                        {statValue(sortBy, player)}
                      </td>
                      <td className="px-3 py-3">{player.totalChampionships}</td>
                      <td className="px-3 py-3">{player.totalRuns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GamePanel>
      </main>
    </GameShell>
  );
}
