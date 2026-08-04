import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildSeasonStats,
  calculateWinProbability,
  createBuildProfile,
  createSeasonState,
  generatePlayerStats,
  isFinalsComeback,
} from './season-engine';
import type {
  AttributeKey,
  BuildProfile,
  BuildSlot,
  PlayoffSeries,
  Position,
  SeasonGame,
  SeasonState,
  TeamSeason,
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

function makeSlots(
  overrides: Partial<Record<AttributeKey, number>> = {},
  fallback = 75
): BuildSlot[] {
  return ATTRIBUTES.map((attribute) => ({
    attribute,
    locked: true,
    overall: overrides[attribute] ?? fallback,
    grade: 'B',
  }));
}

function makeTeam(abbr = 'BOS'): TeamSeason {
  return {
    id: `${abbr.toLowerCase()}-test`,
    abbr,
    name: `${abbr} Test Team`,
    tagline: 'Test roster',
    roster: [
      {
        id: `${abbr}-one`,
        name: 'Test Star',
        positions: ['SF'],
        overall: 90,
        attributes: Object.fromEntries(
          ATTRIBUTES.map((attribute) => [attribute, 'A'])
        ),
      },
      {
        id: `${abbr}-two`,
        name: 'Test Starter',
        positions: ['PF'],
        overall: 84,
        attributes: Object.fromEntries(
          ATTRIBUTES.map((attribute) => [attribute, 'B'])
        ),
      },
    ],
  };
}

function makeGames(
  count: number,
  stats: { pts: number; ast: number; reb: number },
  wins: number
): SeasonGame[] {
  return Array.from({ length: count }, (_, index) => ({
    gameNumber: index + 1,
    opponent: 'Test Opponent',
    opponentAbbr: 'TST',
    opponentStrength: 84,
    result: index < wins ? 'W' : 'L',
    playerStats: { ...stats },
  }));
}

function makeSeries(
  round: PlayoffSeries['round'],
  results: Array<'W' | 'L'>,
  won = results.filter((result) => result === 'W').length >= 4
): PlayoffSeries {
  return {
    round,
    opponent: 'Test Opponent',
    opponentAbbr: 'TST',
    opponentStrength: 88,
    wins: results.filter((result) => result === 'W').length,
    losses: results.filter((result) => result === 'L').length,
    results,
    completed: true,
    won,
  };
}

function makeSeason(
  profile: BuildProfile,
  games: SeasonGame[],
  playoffSeries: PlayoffSeries[] = []
): SeasonState {
  const wins = games.filter((game) => game.result === 'W').length;
  const losses = games.filter((game) => game.result === 'L').length;
  return {
    games,
    currentGameIndex: games.length,
    standings: { rank: 1, wins, losses },
    awardRace: { MVP: 0, DPOY: 0, Scoring: 0, Clutch: 0 },
    playoffSeries,
    seasonComplete: true,
    inPlayoffs: playoffSeries.length > 0,
    careerTeamAbbr: 'BOS',
    teamStrength: 86,
    buildProfile: profile,
    totals: {
      gamesPlayed: games.length,
      points: games.reduce((sum, game) => sum + (game.playerStats?.pts ?? 0), 0),
      assists: games.reduce((sum, game) => sum + (game.playerStats?.ast ?? 0), 0),
      rebounds: games.reduce((sum, game) => sum + (game.playerStats?.reb ?? 0), 0),
      tripleDoubles: games.filter(
        (game) =>
          (game.playerStats?.pts ?? 0) >= 10 &&
          (game.playerStats?.ast ?? 0) >= 10 &&
          (game.playerStats?.reb ?? 0) >= 10
      ).length,
    },
  };
}

test('position fit rewards guard skills at point guard, not center', () => {
  const guardBuild = makeSlots({
    '3PT': 92,
    HAN: 97,
    PAS: 97,
    PDEF: 90,
    IDEF: 55,
    BLK: 50,
    REB: 55,
    STR: 62,
  });

  const pointGuard = createBuildProfile(guardBuild, 'PG');
  const center = createBuildProfile(guardBuild, 'C');

  assert.ok(pointGuard.positionFit >= center.positionFit + 8);
  assert.ok(pointGuard.impact > center.impact);
});

test('scoring attributes drive points instead of overall alone', () => {
  const scorer = createBuildProfile(
    makeSlots({ '3PT': 97, MID: 95, FIN: 95, DNK: 90, HAN: 92 }, 76),
    'SG'
  );
  const defender = createBuildProfile(
    makeSlots({ PDEF: 97, IDEF: 95, BLK: 94, REB: 92, STR: 92 }, 76),
    'SG'
  );

  const scorerStats = generatePlayerStats(scorer, 'SG', true, () => 0.5);
  const defenderStats = generatePlayerStats(defender, 'SG', true, () => 0.5);

  assert.ok(scorerStats.pts >= defenderStats.pts + 5);
});

test('position and role attributes create distinct box-score profiles', () => {
  const balanced = makeSlots({ PAS: 94, HAN: 93, REB: 94, STR: 90 }, 84);
  const pointGuard = createBuildProfile(balanced, 'PG');
  const center = createBuildProfile(balanced, 'C');

  const guardStats = generatePlayerStats(pointGuard, 'PG', false, () => 0.5);
  const centerStats = generatePlayerStats(center, 'C', false, () => 0.5);

  assert.ok(guardStats.ast >= centerStats.ast + 2);
  assert.ok(centerStats.reb >= guardStats.reb + 3);
});

test('defense contributes directly to win probability', () => {
  const base = createBuildProfile(makeSlots({}, 84), 'SF');
  const weakDefense: BuildProfile = {
    ...base,
    defense: 68,
    perimeterDefense: 68,
    interiorDefense: 68,
  };
  const eliteDefense: BuildProfile = {
    ...base,
    defense: 96,
    perimeterDefense: 96,
    interiorDefense: 96,
  };

  const weakChance = calculateWinProbability(weakDefense, 86, 86);
  const eliteChance = calculateWinProbability(eliteDefense, 86, 86);

  assert.ok(eliteChance >= weakChance + 0.07);
});

test('season schedule never includes the career team as its own opponent', () => {
  const season = createSeasonState(
    makeTeam('BOS'),
    makeSlots({}, 84),
    'SF',
    () => 0
  );

  assert.equal(season.games.length, 82);
  assert.ok(season.games.every((game) => game.opponentAbbr !== 'BOS'));
});

test('DPOY requires elite defense rather than high overall alone', () => {
  const highOverall = createBuildProfile(makeSlots({}, 92), 'SF');
  const offenseOnly: BuildProfile = {
    ...highOverall,
    defense: 80,
    perimeterDefense: 80,
    interiorDefense: 80,
  };
  const eliteDefender: BuildProfile = {
    ...highOverall,
    defense: 94,
    perimeterDefense: 94,
    interiorDefense: 94,
  };
  const games = makeGames(82, { pts: 24, ast: 7, reb: 7 }, 54);

  assert.ok(!buildSeasonStats(makeSeason(offenseOnly, games)).awards.includes('DPOY'));
  assert.ok(buildSeasonStats(makeSeason(eliteDefender, games)).awards.includes('DPOY'));
});

test('Scoring Title requires elite scoring in addition to points per game', () => {
  const profile = createBuildProfile(makeSlots({}, 90), 'SG');
  const averageScorer: BuildProfile = { ...profile, scoring: 82 };
  const eliteScorer: BuildProfile = { ...profile, scoring: 94 };
  const games = makeGames(82, { pts: 28, ast: 5, reb: 5 }, 52);

  assert.ok(
    !buildSeasonStats(makeSeason(averageScorer, games)).awards.includes(
      'Scoring Title'
    )
  );
  assert.ok(
    buildSeasonStats(makeSeason(eliteScorer, games)).awards.includes(
      'Scoring Title'
    )
  );
});

test('Finals comeback only counts a real 1-3 series recovery', () => {
  assert.equal(
    isFinalsComeback(['L', 'L', 'L', 'W', 'W', 'W', 'W']),
    true
  );
  assert.equal(
    isFinalsComeback(['L', 'W', 'L', 'W', 'L', 'W', 'W']),
    false
  );

  const profile = createBuildProfile(makeSlots({}, 92), 'SF');
  const games = makeGames(82, { pts: 26, ast: 7, reb: 8 }, 58);
  const falseComeback = makeSeries(
    'finals',
    ['L', 'W', 'L', 'W', 'L', 'W', 'W']
  );
  const realComeback = makeSeries(
    'finals',
    ['L', 'L', 'L', 'W', 'W', 'W', 'W']
  );

  assert.equal(
    buildSeasonStats(makeSeason(profile, games, [falseComeback])).finalsComeback,
    false
  );
  assert.equal(
    buildSeasonStats(makeSeason(profile, games, [realComeback])).finalsComeback,
    true
  );
});
