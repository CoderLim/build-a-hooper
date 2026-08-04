import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSeasonStats, createBuildProfile } from './season-engine';
import type {
  AttributeKey,
  BuildSlot,
  SeasonGame,
  SeasonState,
} from './types';

const ATTRIBUTES: AttributeKey[] = [
  '3PT',
  'MID',
  'FIN',
  'DNK',
  'HAN',
  'PAS',
  'PDEF',
  'IDEF',
  'BLK',
  'REB',
  'ATH',
  'STR',
  'CLU',
];

function makeSlots(overall: number): BuildSlot[] {
  return ATTRIBUTES.map((attribute) => ({
    attribute,
    locked: true,
    overall,
    grade: 'A',
  }));
}

function makeSeason(stats: { pts: number; ast: number; reb: number }): SeasonState {
  const profile = createBuildProfile(makeSlots(92), 'SF');
  const games: SeasonGame[] = Array.from({ length: 82 }, (_, index) => ({
    gameNumber: index + 1,
    opponent: 'Test Opponent',
    opponentAbbr: 'TST',
    opponentStrength: 86,
    result: index < 55 ? 'W' : 'L',
    playerStats: { ...stats },
  }));

  return {
    games,
    currentGameIndex: 82,
    standings: { rank: 1, wins: 55, losses: 27 },
    awardRace: { MVP: 0, DPOY: 0, Scoring: 0, Clutch: 0 },
    playoffSeries: [],
    seasonComplete: true,
    inPlayoffs: false,
    careerTeamAbbr: 'BOS',
    teamStrength: 88,
    buildProfile: profile,
    totals: {
      gamesPlayed: 82,
      points: stats.pts * 82,
      assists: stats.ast * 82,
      rebounds: stats.reb * 82,
      tripleDoubles: 0,
    },
  };
}

test('MVP requires elite production instead of overall and wins alone', () => {
  const lowProduction = buildSeasonStats(
    makeSeason({ pts: 18, ast: 3, reb: 4 })
  );
  const eliteProduction = buildSeasonStats(
    makeSeason({ pts: 28, ast: 8, reb: 8 })
  );

  assert.ok(!lowProduction.awards.includes('MVP'));
  assert.ok(eliteProduction.awards.includes('MVP'));
});
