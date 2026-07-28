import type { SeasonStats } from '@/lib/hooper-game/types';

export const PLAYOFF_RESULTS = [
  'Missed Playoffs',
  'Play-In Exit',
  'First Round Exit',
  'Conference Semifinals',
  'Conference Finals',
  'NBA Finals',
  'NBA Champion',
] as const;

export type PlayoffResult = (typeof PLAYOFF_RESULTS)[number];

export const PLAYOFF_POINTS: Record<PlayoffResult, number> = {
  'Missed Playoffs': 0,
  'Play-In Exit': 20,
  'First Round Exit': 30,
  'Conference Semifinals': 45,
  'Conference Finals': 60,
  'NBA Finals': 90,
  'NBA Champion': 120,
};

export type LegacyPointsBreakdown = {
  base: number;
  wins: number;
  playoffs: number;
  overall: number;
  total: number;
};

export function computeLegacyPointsBreakdown(input: {
  playoffResult: string;
  overall: number;
  wins: number;
}): LegacyPointsBreakdown {
  const base = 10;
  const wins = input.wins >= 38 ? 10 : 0;
  const playoffs = PLAYOFF_POINTS[input.playoffResult as PlayoffResult] ?? 0;
  const overall = input.overall >= 95 ? 20 : input.overall >= 90 ? 10 : 0;

  return {
    base,
    wins,
    playoffs,
    overall,
    total: base + wins + playoffs + overall,
  };
}

export function computeLegacyPoints(
  seasonStats: SeasonStats,
  overall: number,
  wins: number
): number {
  return computeLegacyPointsBreakdown({
    playoffResult: seasonStats.playoffResult,
    overall,
    wins,
  }).total;
}
