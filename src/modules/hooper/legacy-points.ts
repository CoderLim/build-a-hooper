import type { SeasonStats } from '@/lib/hooper-game/types';

const PLAYOFF_POINTS: Record<string, number> = {
  'Missed Playoffs': 0,
  'Play-In Exit': 20,
  'First Round Exit': 30,
  'Conference Semifinals': 45,
  'Conference Finals': 60,
  'NBA Finals': 90,
  'NBA Champion': 120,
};

export function computeLegacyPoints(
  seasonStats: SeasonStats,
  overall: number,
  wins: number
): number {
  let points = 10;

  if (wins >= 38) points += 10;
  points += PLAYOFF_POINTS[seasonStats.playoffResult] ?? 0;

  if (overall >= 95) points += 20;
  else if (overall >= 90) points += 10;

  return points;
}
