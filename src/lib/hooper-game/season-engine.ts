import { CAREER_TEAMS } from './data';
import {
  createSeededRandom,
  deriveRunSeed,
  HOOPER_ENGINE_VERSION,
} from './run-random';
import type {
  AttributeKey,
  BuildProfile,
  BuildSlot,
  GameCastState,
  GameMode,
  PlayoffRound,
  PlayoffSeries,
  Position,
  SeasonGame,
  SeasonState,
  SeasonStats,
  TeamSeason,
} from './types';

type RandomSource = () => number;

interface Opponent {
  name: string;
  abbr: string;
  strength: number;
}

const OPPONENTS: Opponent[] = [
  { name: 'Boston Celtics', abbr: 'BOS', strength: 92 },
  { name: 'Los Angeles Lakers', abbr: 'LAL', strength: 88 },
  { name: 'Golden State Warriors', abbr: 'GSW', strength: 87 },
  { name: 'Dallas Mavericks', abbr: 'DAL', strength: 88 },
  { name: 'Denver Nuggets', abbr: 'DEN', strength: 91 },
  { name: 'Phoenix Suns', abbr: 'PHX', strength: 85 },
  { name: 'Milwaukee Bucks', abbr: 'MIL', strength: 89 },
  { name: 'Philadelphia 76ers', abbr: 'PHI', strength: 86 },
  { name: 'Miami Heat', abbr: 'MIA', strength: 86 },
  { name: 'New York Knicks', abbr: 'NYK', strength: 89 },
  { name: 'Cleveland Cavaliers', abbr: 'CLE', strength: 91 },
  { name: 'Oklahoma City Thunder', abbr: 'OKC', strength: 93 },
  { name: 'Minnesota Timberwolves', abbr: 'MIN', strength: 90 },
  { name: 'Sacramento Kings', abbr: 'SAC', strength: 84 },
  { name: 'Indiana Pacers', abbr: 'IND', strength: 88 },
];

const PLAY_BY_PLAY = [
  'pull-up midrange',
  'corner three',
  'drive and finish',
  'alley-oop slam',
  'step-back three',
  'post fadeaway',
  'coast-to-coast layup',
  'and-one finish',
  'deflection and steal',
  'clutch free throws',
];

const POSITION_WEIGHTS: Record<
  Position,
  Record<
    | 'scoring'
    | 'playmaking'
    | 'perimeterDefense'
    | 'interiorDefense'
    | 'rebounding'
    | 'physical'
    | 'clutch',
    number
  >
> = {
  PG: {
    scoring: 0.25,
    playmaking: 0.3,
    perimeterDefense: 0.18,
    interiorDefense: 0.03,
    rebounding: 0.05,
    physical: 0.08,
    clutch: 0.11,
  },
  SG: {
    scoring: 0.32,
    playmaking: 0.2,
    perimeterDefense: 0.2,
    interiorDefense: 0.04,
    rebounding: 0.05,
    physical: 0.09,
    clutch: 0.1,
  },
  SF: {
    scoring: 0.26,
    playmaking: 0.15,
    perimeterDefense: 0.18,
    interiorDefense: 0.1,
    rebounding: 0.1,
    physical: 0.11,
    clutch: 0.1,
  },
  PF: {
    scoring: 0.2,
    playmaking: 0.1,
    perimeterDefense: 0.1,
    interiorDefense: 0.22,
    rebounding: 0.18,
    physical: 0.12,
    clutch: 0.08,
  },
  C: {
    scoring: 0.15,
    playmaking: 0.07,
    perimeterDefense: 0.05,
    interiorDefense: 0.3,
    rebounding: 0.25,
    physical: 0.12,
    clutch: 0.06,
  },
};

const POSITION_BASE_STATS: Record<
  Position,
  { ast: number; reb: number; usage: number }
> = {
  PG: { ast: 4.8, reb: 2.6, usage: 1 },
  SG: { ast: 3, reb: 3.3, usage: 1.08 },
  SF: { ast: 2.6, reb: 4.6, usage: 1 },
  PF: { ast: 2, reb: 6.1, usage: 0.92 },
  C: { ast: 1.7, reb: 7.2, usage: 0.88 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function slotOverall(slots: BuildSlot[], attribute: AttributeKey) {
  const slot = slots.find(
    (candidate) =>
      candidate.attribute === attribute &&
      candidate.locked &&
      typeof candidate.overall === 'number'
  );
  return slot?.overall ?? 70;
}

function weightedAverage(entries: Array<[number, number]>) {
  const totalWeight = entries.reduce(
    (sum, [, currentWeight]) => sum + currentWeight,
    0
  );
  if (totalWeight === 0) return 70;
  return (
    entries.reduce(
      (sum, [value, currentWeight]) => sum + value * currentWeight,
      0
    ) / totalWeight
  );
}

export function createBuildProfile(
  buildSlots: BuildSlot[],
  position: Position
): BuildProfile {
  const value = (attribute: AttributeKey) =>
    slotOverall(buildSlots, attribute);
  const locked = buildSlots.filter(
    (slot) => slot.locked && typeof slot.overall === 'number'
  );
  const overall = locked.length
    ? Math.round(
        locked.reduce((sum, slot) => sum + (slot.overall ?? 0), 0) /
          locked.length
      )
    : 75;

  const scoring = weightedAverage([
    [value('3PT'), 0.22],
    [value('MID'), 0.18],
    [value('FIN'), 0.22],
    [value('DNK'), 0.12],
    [value('HAN'), 0.12],
    [value('ATH'), 0.08],
    [value('CLU'), 0.06],
  ]);
  const playmaking = weightedAverage([
    [value('PAS'), 0.48],
    [value('HAN'), 0.32],
    [value('CLU'), 0.1],
    [value('ATH'), 0.1],
  ]);
  const perimeterDefense = weightedAverage([
    [value('PDEF'), 0.62],
    [value('ATH'), 0.18],
    [value('STR'), 0.1],
    [value('CLU'), 0.1],
  ]);
  const interiorDefense = weightedAverage([
    [value('IDEF'), 0.45],
    [value('BLK'), 0.3],
    [value('STR'), 0.15],
    [value('REB'), 0.1],
  ]);
  const rebounding = weightedAverage([
    [value('REB'), 0.58],
    [value('STR'), 0.2],
    [value('ATH'), 0.12],
    [value('IDEF'), 0.1],
  ]);
  const physical = weightedAverage([
    [value('ATH'), 0.55],
    [value('STR'), 0.45],
  ]);
  const clutch = value('CLU');
  const perimeterShare: Record<Position, number> = {
    PG: 0.78,
    SG: 0.7,
    SF: 0.52,
    PF: 0.3,
    C: 0.15,
  };
  const defense =
    perimeterDefense * perimeterShare[position] +
    interiorDefense * (1 - perimeterShare[position]);
  const weights = POSITION_WEIGHTS[position];
  const positionFit =
    scoring * weights.scoring +
    playmaking * weights.playmaking +
    perimeterDefense * weights.perimeterDefense +
    interiorDefense * weights.interiorDefense +
    rebounding * weights.rebounding +
    physical * weights.physical +
    clutch * weights.clutch;
  const impact = overall * 0.42 + positionFit * 0.58;

  return {
    position,
    overall,
    scoring: Math.round(scoring),
    playmaking: Math.round(playmaking),
    perimeterDefense: Math.round(perimeterDefense),
    interiorDefense: Math.round(interiorDefense),
    defense: Math.round(defense),
    rebounding: Math.round(rebounding),
    physical: Math.round(physical),
    clutch: Math.round(clutch),
    positionFit: Math.round(positionFit),
    impact: Math.round(impact),
  };
}

function calculateTeamStrength(team: TeamSeason) {
  const topRotation = [...team.roster]
    .sort((left, right) => right.overall - left.overall)
    .slice(0, 8);
  if (topRotation.length === 0) return 84;
  const average =
    topRotation.reduce((sum, player) => sum + player.overall, 0) /
    topRotation.length;
  return clamp(Math.round(average), 78, 94);
}

export function calculateWinProbability(
  profile: BuildProfile,
  teamStrength: number,
  opponentStrength: number
) {
  const playerEdge = (profile.impact - 78) * 0.012;
  const teamEdge = (teamStrength - opponentStrength) * 0.018;
  const defenseBoost = (profile.defense - 75) * 0.003;
  const clutchBoost = (profile.clutch - 75) * 0.0015;
  return clamp(
    0.48 + playerEdge + teamEdge + defenseBoost + clutchBoost,
    0.15,
    0.88
  );
}

export function generatePlayerStats(
  profile: BuildProfile,
  position: Position,
  won: boolean,
  random: RandomSource = Math.random
) {
  const role = POSITION_BASE_STATS[position];
  const winBonus = won ? 1.2 : 0;
  const pointsMean =
    (10 + (profile.scoring - 60) * 0.4 + (profile.impact - 75) * 0.1) *
      role.usage +
    winBonus;
  const assistsMean =
    role.ast +
    (profile.playmaking - 60) * 0.16 +
    (position === 'PG' ? 0.8 : 0);
  const reboundsMean =
    role.reb +
    (profile.rebounding - 60) * 0.13 +
    (profile.physical - 70) * 0.03;

  return {
    pts: Math.max(6, Math.round(pointsMean + (random() - 0.5) * 8)),
    ast: Math.max(1, Math.round(assistsMean + (random() - 0.5) * 3)),
    reb: Math.max(1, Math.round(reboundsMean + (random() - 0.5) * 3)),
  };
}

function isTripleDouble(stats: { pts: number; ast: number; reb: number }) {
  return stats.pts >= 10 && stats.ast >= 10 && stats.reb >= 10;
}

function winsToCapture(round: PlayoffRound) {
  return round === 'playin' ? 1 : 4;
}

function randomOpponent(excludeAbbr: string, random: RandomSource): Opponent {
  const pool = OPPONENTS.filter(
    (opponent) => opponent.abbr !== excludeAbbr
  );
  return pool[Math.floor(random() * pool.length)]!;
}

function calculateRank(wins: number, losses: number) {
  const winPct = wins / Math.max(1, wins + losses);
  return clamp(Math.round(15 - winPct * 14), 1, 15);
}

function calculateAwardRace(season: SeasonState) {
  const games = Math.max(1, season.totals.gamesPlayed);
  const ppg = season.totals.points / games;
  const apg = season.totals.assists / games;
  const rpg = season.totals.rebounds / games;
  const winPct = season.standings.wins / games;
  const profile = season.buildProfile;
  return {
    MVP: clamp(
      Math.round(
        (profile.impact - 72) * 2 +
          winPct * 35 +
          Math.max(0, ppg - 18) * 1.4 +
          apg * 0.8 +
          rpg * 0.45
      ),
      0,
      100
    ),
    DPOY: clamp(
      Math.round((profile.defense - 70) * 2.8 + winPct * 25),
      0,
      100
    ),
    Scoring: clamp(
      Math.round(
        (profile.scoring - 72) * 1.8 + Math.max(0, ppg - 15) * 4
      ),
      0,
      100
    ),
    Clutch: clamp(
      Math.round((profile.clutch - 70) * 2 + winPct * 30),
      0,
      100
    ),
  };
}

export function createSeasonState(
  careerTeam: TeamSeason,
  buildSlots: BuildSlot[],
  position: Position,
  mode: GameMode = 'classic',
  random?: RandomSource
): SeasonState {
  const runSeed = deriveRunSeed({
    mode,
    position,
    careerTeamAbbr: careerTeam.abbr,
    buildSlots,
  });
  const games: SeasonGame[] = Array.from({ length: 82 }, (_, index) => {
    const opponentRandom =
      random ?? createSeededRandom(`${runSeed}:schedule:${index}`);
    const opponent = randomOpponent(careerTeam.abbr, opponentRandom);
    return {
      gameNumber: index + 1,
      opponent: opponent.name,
      opponentAbbr: opponent.abbr,
      opponentStrength: opponent.strength,
    };
  });

  return {
    games,
    currentGameIndex: 0,
    standings: { rank: 15, wins: 0, losses: 0 },
    awardRace: { MVP: 0, DPOY: 0, Scoring: 0, Clutch: 0 },
    playoffSeries: [],
    seasonComplete: false,
    inPlayoffs: false,
    careerTeamAbbr: careerTeam.abbr,
    teamStrength: calculateTeamStrength(careerTeam),
    buildProfile: createBuildProfile(buildSlots, position),
    totals: {
      gamesPlayed: 0,
      points: 0,
      assists: 0,
      rebounds: 0,
      tripleDoubles: 0,
    },
    mode,
    runSeed,
    engineVersion: HOOPER_ENGINE_VERSION,
  };
}

function regularGameOutcome(
  season: SeasonState,
  gameIndex: number,
  random?: RandomSource
) {
  const game = season.games[gameIndex];
  if (!game) return null;
  const source =
    random ?? createSeededRandom(`${season.runSeed}:regular:${gameIndex}`);
  const chance = calculateWinProbability(
    season.buildProfile,
    season.teamStrength,
    game.opponentStrength
  );
  const won = source() < chance;
  const playerStats = generatePlayerStats(
    season.buildProfile,
    season.buildProfile.position,
    won,
    source
  );
  return { won, playerStats };
}

function applyRegularSeasonResult(
  season: SeasonState,
  gameIndex: number,
  won: boolean,
  playerStats: { pts: number; ast: number; reb: number }
): SeasonState {
  const game = season.games[gameIndex];
  if (!game || game.result) return season;
  const games = season.games.map((candidate, index) =>
    index === gameIndex
      ? {
          ...candidate,
          result: won ? ('W' as const) : ('L' as const),
          playerStats,
        }
      : candidate
  );
  const standings = {
    wins: season.standings.wins + (won ? 1 : 0),
    losses: season.standings.losses + (won ? 0 : 1),
    rank: 15,
  };
  standings.rank = calculateRank(standings.wins, standings.losses);
  const totals = {
    gamesPlayed: season.totals.gamesPlayed + 1,
    points: season.totals.points + playerStats.pts,
    assists: season.totals.assists + playerStats.ast,
    rebounds: season.totals.rebounds + playerStats.reb,
    tripleDoubles:
      season.totals.tripleDoubles + (isTripleDouble(playerStats) ? 1 : 0),
  };
  const next: SeasonState = {
    ...season,
    games,
    currentGameIndex: Math.max(season.currentGameIndex, gameIndex + 1),
    standings,
    totals,
  };
  return { ...next, awardRace: calculateAwardRace(next) };
}

export function simulateNextGame(
  season: SeasonState,
  random?: RandomSource
): SeasonState {
  if (season.seasonComplete || season.currentGameIndex >= 82) return season;
  const outcome = regularGameOutcome(season, season.currentGameIndex, random);
  if (!outcome) return season;
  const updated = applyRegularSeasonResult(
    season,
    season.currentGameIndex,
    outcome.won,
    outcome.playerStats
  );
  return updated.currentGameIndex >= 82
    ? { ...updated, seasonComplete: true }
    : updated;
}

export function simulateToEnd(
  season: SeasonState,
  random?: RandomSource
): SeasonState {
  let current = season;
  while (!current.seasonComplete && current.currentGameIndex < 82) {
    current = simulateNextGame(current, random);
  }
  return current;
}

export function getLastFiveGames(season: SeasonState): SeasonGame[] {
  return season.games.filter((game) => game.result).slice(-5).reverse();
}

export function getNextGame(season: SeasonState): SeasonGame | null {
  if (season.currentGameIndex >= 82) return null;
  return season.games[season.currentGameIndex] ?? null;
}

export function estimatedWinChance(season: SeasonState): number {
  const opponent = getNextGame(season);
  if (!opponent) return 0;
  return Math.round(
    calculateWinProbability(
      season.buildProfile,
      season.teamStrength,
      opponent.opponentStrength
    ) * 100
  );
}

export function startPlayoffs(
  season: SeasonState,
  random?: RandomSource
): SeasonState {
  if (season.playoffSeries.length > 0) return season;
  const { wins } = season.standings;
  if (wins < 38) {
    return { ...season, seasonComplete: true, inPlayoffs: false };
  }
  const round: PlayoffRound = wins < 42 ? 'playin' : 'r1';
  const source =
    random ?? createSeededRandom(`${season.runSeed}:playoffs:${round}:opponent`);
  const opponent = randomOpponent(season.careerTeamAbbr, source);
  const series: PlayoffSeries = {
    round,
    opponent: opponent.name,
    opponentAbbr: opponent.abbr,
    opponentStrength: opponent.strength,
    wins: 0,
    losses: 0,
    results: [],
    completed: false,
  };
  return {
    ...season,
    inPlayoffs: true,
    seasonComplete: false,
    playoffSeries: [series],
  };
}

const ROUND_ORDER: PlayoffRound[] = ['playin', 'r1', 'r2', 'conf', 'finals'];

function nextRound(round: PlayoffRound): PlayoffRound | null {
  const index = ROUND_ORDER.indexOf(round);
  return index < ROUND_ORDER.length - 1
    ? ROUND_ORDER[index + 1]!
    : null;
}

export function simulatePlayoffGame(
  season: SeasonState,
  random?: RandomSource
): SeasonState {
  const current = season.playoffSeries[season.playoffSeries.length - 1];
  if (!current || current.completed) return season;
  const source =
    random ??
    createSeededRandom(
      `${season.runSeed}:playoffs:${current.round}:${current.results.length}`
    );
  const probability = clamp(
    calculateWinProbability(
      season.buildProfile,
      season.teamStrength,
      current.opponentStrength
    ) + 0.03,
    0.15,
    0.9
  );
  const won = source() < probability;
  const updated: PlayoffSeries = {
    ...current,
    wins: current.wins + (won ? 1 : 0),
    losses: current.losses + (won ? 0 : 1),
    results: [...current.results, won ? 'W' : 'L'],
  };
  const target = winsToCapture(current.round);
  const seriesWon = updated.wins >= target;
  const seriesLost = updated.losses >= target;
  if (!seriesWon && !seriesLost) {
    return {
      ...season,
      playoffSeries: [...season.playoffSeries.slice(0, -1), updated],
    };
  }
  const completed: PlayoffSeries = {
    ...updated,
    completed: true,
    won: seriesWon,
  };
  if (!seriesWon) {
    return {
      ...season,
      playoffSeries: [...season.playoffSeries.slice(0, -1), completed],
      seasonComplete: true,
    };
  }
  const next = nextRound(current.round);
  if (!next) {
    return {
      ...season,
      playoffSeries: [...season.playoffSeries.slice(0, -1), completed],
      seasonComplete: true,
    };
  }
  const opponentSource =
    random ?? createSeededRandom(`${season.runSeed}:playoffs:${next}:opponent`);
  const opponent = randomOpponent(season.careerTeamAbbr, opponentSource);
  const nextSeries: PlayoffSeries = {
    round: next,
    opponent: opponent.name,
    opponentAbbr: opponent.abbr,
    opponentStrength: opponent.strength,
    wins: 0,
    losses: 0,
    results: [],
    completed: false,
  };
  return {
    ...season,
    playoffSeries: [
      ...season.playoffSeries.slice(0, -1),
      completed,
      nextSeries,
    ],
  };
}

export function isFinalsComeback(results: Array<'W' | 'L'>) {
  let wins = 0;
  let losses = 0;
  let trailedOneThreeAt = -1;
  for (let index = 0; index < results.length; index += 1) {
    if (results[index] === 'W') wins += 1;
    else losses += 1;
    if (wins === 1 && losses === 3) {
      trailedOneThreeAt = index;
      break;
    }
  }
  if (trailedOneThreeAt < 0) return false;
  const remaining = results.slice(trailedOneThreeAt + 1);
  return remaining.length >= 3 && remaining.every((result) => result === 'W');
}

export function buildSeasonStats(season: SeasonState): SeasonStats {
  const { wins, losses } = season.standings;
  const played = Math.max(1, season.totals.gamesPlayed);
  const ppg = Math.round(season.totals.points / played);
  const apg = Math.round(season.totals.assists / played);
  const rpg = Math.round(season.totals.rebounds / played);
  const profile = season.buildProfile;
  const lastSeries = season.playoffSeries[season.playoffSeries.length - 1];
  const champion = lastSeries?.round === 'finals' && lastSeries.won === true;
  const madePlayoffs = season.inPlayoffs || wins >= 38;
  const enteredViaPlayIn = season.playoffSeries[0]?.round === 'playin';
  const wonPlayIn = season.playoffSeries.some(
    (series) => series.round === 'playin' && series.won
  );
  const finalsSeries = season.playoffSeries.find(
    (series) => series.round === 'finals'
  );
  const finalsComeback =
    champion && finalsSeries?.won === true
      ? isFinalsComeback(finalsSeries.results)
      : false;
  const playoffPath = season.playoffSeries.map(
    (series) =>
      `${series.round.toUpperCase()}: ${series.won ? 'W' : 'L'} vs ${series.opponentAbbr} (${series.wins}-${series.losses})`
  );

  let playoffResult = 'Missed Playoffs';
  if (champion) playoffResult = 'NBA Champion';
  else if (lastSeries?.round === 'finals') playoffResult = 'NBA Finals';
  else if (lastSeries?.round === 'conf') playoffResult = 'Conference Finals';
  else if (lastSeries?.round === 'r2')
    playoffResult = 'Conference Semifinals';
  else if (lastSeries?.round === 'r1') playoffResult = 'First Round Exit';
  else if (lastSeries?.round === 'playin') playoffResult = 'Play-In Exit';
  else if (madePlayoffs && wins >= 42) playoffResult = 'First Round Exit';

  const awards: string[] = [];
  if (ppg >= 27 && profile.scoring >= 88) awards.push('Scoring Title');
  const mvpProduction = ppg * 1.15 + apg * 1.8 + rpg * 1.2;
  if (profile.impact >= 88 && wins >= 50 && mvpProduction >= 50) {
    awards.push('MVP');
  }
  if (profile.defense >= 91 && wins >= 45) awards.push('DPOY');
  const fmvp = champion && profile.impact >= 86;
  if (fmvp) awards.push('Finals MVP');

  return {
    wins,
    losses,
    ppg,
    apg,
    rpg,
    awards,
    playoffResult,
    champion,
    fmvp,
    playoffPath,
    tripleDoubles: season.totals.tripleDoubles,
    madeThroughPlayIn: champion && enteredViaPlayIn && wonPlayIn,
    finalsComeback,
  };
}

function createFinalScore(won: boolean, random: RandomSource) {
  const homeScore = won
    ? 98 + Math.floor(random() * 18)
    : 90 + Math.floor(random() * 15);
  const awayScore = won
    ? homeScore - (3 + Math.floor(random() * 11))
    : homeScore + (2 + Math.floor(random() * 9));
  return { homeScore, awayScore };
}

export function startGameCast(
  season: SeasonState,
  gameIndex: number,
  random?: RandomSource
): GameCastState {
  const game = season.games[gameIndex];
  const outcome = game?.result
    ? {
        won: game.result === 'W',
        playerStats: game.playerStats ?? { pts: 0, ast: 0, reb: 0 },
      }
    : regularGameOutcome(season, gameIndex, random) ?? {
        won: false,
        playerStats: { pts: 0, ast: 0, reb: 0 },
      };
  const scoreSource =
    random ?? createSeededRandom(`${season.runSeed}:gamecast:${gameIndex}`);
  const target = createFinalScore(outcome.won, scoreSource);
  return {
    gameIndex,
    quarter: 1,
    homeScore: Math.floor(target.homeScore * 0.2),
    awayScore: Math.floor(target.awayScore * 0.2),
    targetHomeScore: target.homeScore,
    targetAwayScore: target.awayScore,
    plays: [
      `Q1 · ${PLAY_BY_PLAY[Math.floor(scoreSource() * PLAY_BY_PLAY.length)]}`,
    ],
    complete: false,
    won: outcome.won,
    playerStats: outcome.playerStats,
  };
}

export function advanceGameCast(cast: GameCastState): GameCastState {
  if (cast.complete) return cast;
  const nextQuarter = cast.quarter + 1;
  if (nextQuarter > 4) {
    return {
      ...cast,
      quarter: 4,
      homeScore: cast.targetHomeScore,
      awayScore: cast.targetAwayScore,
      complete: true,
      plays: [...cast.plays, 'Final · Game over'],
    };
  }
  const progress = nextQuarter / 4;
  const play = PLAY_BY_PLAY[Math.floor(Math.random() * PLAY_BY_PLAY.length)]!;
  return {
    ...cast,
    quarter: nextQuarter,
    homeScore: Math.max(
      cast.homeScore,
      Math.floor(cast.targetHomeScore * progress)
    ),
    awayScore: Math.max(
      cast.awayScore,
      Math.floor(cast.targetAwayScore * progress)
    ),
    plays: [...cast.plays, `Q${nextQuarter} · ${play}`],
  };
}

export function applyGameCastResult(
  season: SeasonState,
  cast: GameCastState
): SeasonState {
  const updated = applyRegularSeasonResult(
    season,
    cast.gameIndex,
    cast.won,
    cast.playerStats
  );
  return updated.currentGameIndex >= 82
    ? { ...updated, seasonComplete: true }
    : updated;
}

export function getCareerSpinAbbrs(): string[] {
  return CAREER_TEAMS.map((team) => team.abbr);
}
