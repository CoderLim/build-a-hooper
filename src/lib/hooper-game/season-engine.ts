import { CAREER_TEAMS } from './data';
import type {
  BuildSlot,
  GameCastState,
  PlayoffRound,
  PlayoffSeries,
  SeasonGame,
  SeasonState,
  SeasonStats,
  TeamSeason,
} from './types';

const OPPONENTS = [
  { name: 'Boston Celtics', abbr: 'BOS' },
  { name: 'Los Angeles Lakers', abbr: 'LAL' },
  { name: 'Golden State Warriors', abbr: 'GSW' },
  { name: 'Dallas Mavericks', abbr: 'DAL' },
  { name: 'Denver Nuggets', abbr: 'DEN' },
  { name: 'Phoenix Suns', abbr: 'PHX' },
  { name: 'Milwaukee Bucks', abbr: 'MIL' },
  { name: 'Philadelphia 76ers', abbr: 'PHI' },
  { name: 'Miami Heat', abbr: 'MIA' },
  { name: 'New York Knicks', abbr: 'NYK' },
  { name: 'Cleveland Cavaliers', abbr: 'CLE' },
  { name: 'Oklahoma City Thunder', abbr: 'OKC' },
  { name: 'Minnesota Timberwolves', abbr: 'MIN' },
  { name: 'Sacramento Kings', abbr: 'SAC' },
  { name: 'Indiana Pacers', abbr: 'IND' },
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

function randomOpponent(excludeAbbr?: string) {
  const pool = excludeAbbr
    ? OPPONENTS.filter((o) => o.abbr !== excludeAbbr)
    : OPPONENTS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function playerOvr(slots: BuildSlot[]): number {
  const locked = slots.filter((s) => s.locked && s.overall);
  if (locked.length === 0) return 75;
  return Math.round(
    locked.reduce((sum, s) => sum + (s.overall ?? 0), 0) / locked.length
  );
}

function genPlayerStats(ovr: number, won: boolean) {
  const base = ovr * 0.3;
  const modifier = won ? 1.1 : 0.85;
  return {
    pts: Math.max(8, Math.round(base + Math.random() * 12 * modifier)),
    ast: Math.max(2, Math.round(ovr * 0.08 + Math.random() * 4)),
    reb: Math.max(2, Math.round(ovr * 0.07 + Math.random() * 4)),
  };
}

function winChance(ovr: number): number {
  return Math.min(0.85, Math.max(0.25, (ovr - 60) / 50));
}

export function createSeasonState(
  careerTeam: TeamSeason,
  buildSlots: BuildSlot[]
): SeasonState {
  const games: SeasonGame[] = Array.from({ length: 82 }, (_, i) => {
    const opp = randomOpponent(careerTeam.abbr);
    return {
      gameNumber: i + 1,
      opponent: opp.name,
      opponentAbbr: opp.abbr,
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
  };
}

function updateStandings(season: SeasonState): SeasonState {
  const wins = season.games.filter((g) => g.result === 'W').length;
  const losses = season.games.filter((g) => g.result === 'L').length;
  const winPct = wins / Math.max(1, wins + losses);
  const rank = Math.max(1, Math.min(15, Math.round(15 - winPct * 14)));
  return {
    ...season,
    standings: { rank, wins, losses },
    awardRace: {
      MVP: Math.round(wins * 1.2 + season.games.filter((g) => g.playerStats).length * 0.3),
      DPOY: Math.round(season.games.filter((g) => g.result === 'W').length * 0.4),
      Scoring: season.games.reduce((s, g) => s + (g.playerStats?.pts ?? 0), 0),
      Clutch: Math.round(wins * 0.8),
    },
  };
}

export function simulateNextGame(
  season: SeasonState,
  buildSlots: BuildSlot[]
): SeasonState {
  if (season.seasonComplete || season.currentGameIndex >= 82) return season;

  const ovr = playerOvr(buildSlots);
  const won = Math.random() < winChance(ovr);
  const game = season.games[season.currentGameIndex]!;
  const playerStats = genPlayerStats(ovr, won);

  const games = season.games.map((g, i) =>
    i === season.currentGameIndex
      ? { ...g, result: won ? ('W' as const) : ('L' as const), playerStats }
      : g
  );

  const next: SeasonState = {
    ...season,
    games,
    currentGameIndex: season.currentGameIndex + 1,
  };

  const updated = updateStandings(next);
  if (updated.currentGameIndex >= 82) {
    return { ...updated, seasonComplete: true };
  }
  return updated;
}

export function simulateToEnd(
  season: SeasonState,
  buildSlots: BuildSlot[]
): SeasonState {
  let current = season;
  while (!current.seasonComplete && current.currentGameIndex < 82) {
    current = simulateNextGame(current, buildSlots);
  }
  return current;
}

export function getLastFiveGames(season: SeasonState): SeasonGame[] {
  const played = season.games.filter((g) => g.result);
  return played.slice(-5).reverse();
}

export function getNextGame(season: SeasonState): SeasonGame | null {
  if (season.currentGameIndex >= 82) return null;
  return season.games[season.currentGameIndex] ?? null;
}

export function estimatedWinChance(buildSlots: BuildSlot[]): number {
  return Math.round(winChance(playerOvr(buildSlots)) * 100);
}

export function startPlayoffs(season: SeasonState): SeasonState {
  const { wins } = season.standings;
  if (wins < 38) {
    return { ...season, seasonComplete: true, inPlayoffs: false };
  }

  const round: PlayoffRound = wins < 42 ? 'playin' : 'r1';
  const opp = randomOpponent();
  const series: PlayoffSeries = {
    round,
    opponent: opp.name,
    opponentAbbr: opp.abbr,
    wins: 0,
    losses: 0,
    completed: false,
  };

  return {
    ...season,
    inPlayoffs: true,
    playoffSeries: [series],
  };
}

const ROUND_ORDER: PlayoffRound[] = ['playin', 'r1', 'r2', 'conf', 'finals'];

function nextRound(round: PlayoffRound): PlayoffRound | null {
  const idx = ROUND_ORDER.indexOf(round);
  return idx < ROUND_ORDER.length - 1 ? ROUND_ORDER[idx + 1]! : null;
}

export function simulatePlayoffGame(
  season: SeasonState,
  buildSlots: BuildSlot[]
): SeasonState {
  const current = season.playoffSeries[season.playoffSeries.length - 1];
  if (!current || current.completed) return season;

  const ovr = playerOvr(buildSlots);
  const won = Math.random() < winChance(ovr) + 0.05;

  const updated: PlayoffSeries = {
    ...current,
    wins: current.wins + (won ? 1 : 0),
    losses: current.losses + (won ? 0 : 1),
  };

  const seriesWon = updated.wins >= 4;
  const seriesLost = updated.losses >= 4;

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

  const opp = randomOpponent();
  const nextSeries: PlayoffSeries = {
    round: next,
    opponent: opp.name,
    opponentAbbr: opp.abbr,
    wins: 0,
    losses: 0,
    completed: false,
  };

  return {
    ...season,
    playoffSeries: [...season.playoffSeries.slice(0, -1), completed, nextSeries],
  };
}

export function buildSeasonStats(
  season: SeasonState,
  buildSlots: BuildSlot[]
): SeasonStats {
  const { wins, losses } = season.standings;
  const played = season.games.filter((g) => g.playerStats);
  const ppg =
    played.length > 0
      ? Math.round(
          played.reduce((s, g) => s + (g.playerStats?.pts ?? 0), 0) / played.length
        )
      : 0;
  const apg =
    played.length > 0
      ? Math.round(
          played.reduce((s, g) => s + (g.playerStats?.ast ?? 0), 0) / played.length
        )
      : 0;
  const rpg =
    played.length > 0
      ? Math.round(
          played.reduce((s, g) => s + (g.playerStats?.reb ?? 0), 0) / played.length
        )
      : 0;

  const ovr = playerOvr(buildSlots);
  const lastSeries = season.playoffSeries[season.playoffSeries.length - 1];
  const champion =
    lastSeries?.round === 'finals' && lastSeries.won === true;
  const madePlayoffs = season.inPlayoffs || wins >= 38;

  const playoffPath = season.playoffSeries.map(
    (s) => `${s.round.toUpperCase()}: ${s.won ? 'W' : 'L'} vs ${s.opponentAbbr} (${s.wins}-${s.losses})`
  );

  let playoffResult = 'Missed Playoffs';
  if (champion) playoffResult = 'NBA Champion';
  else if (lastSeries?.round === 'finals') playoffResult = 'NBA Finals';
  else if (lastSeries?.round === 'conf') playoffResult = 'Conference Finals';
  else if (lastSeries?.round === 'r2') playoffResult = 'Conference Semifinals';
  else if (lastSeries?.round === 'r1') playoffResult = 'First Round Exit';
  else if (lastSeries?.round === 'playin') playoffResult = 'Play-In Exit';
  else if (madePlayoffs && wins >= 42) playoffResult = 'First Round Exit';

  const awards: string[] = [];
  if (ovr >= 88 && wins >= 50) awards.push('MVP Candidate');
  if (ovr >= 85) awards.push('All-NBA Team');
  if (ppg >= 25) awards.push('Scoring Title Race');
  if (season.awardRace.Clutch >= 40) awards.push('Clutch Player');

  return {
    wins,
    losses,
    ppg,
    apg,
    rpg,
    awards,
    playoffResult,
    champion,
    fmvp: champion,
    playoffPath,
  };
}

export function startGameCast(
  season: SeasonState,
  gameIndex: number,
  buildSlots: BuildSlot[]
): GameCastState {
  const game = season.games[gameIndex];
  const ovr = playerOvr(buildSlots);
  const won = game?.result
    ? game.result === 'W'
    : Math.random() < winChance(ovr);
  const playerStats = game?.playerStats ?? genPlayerStats(ovr, won);

  const homeScore = won
    ? 95 + Math.floor(Math.random() * 20)
    : 88 + Math.floor(Math.random() * 15);
  const awayScore = won
    ? homeScore - (5 + Math.floor(Math.random() * 12))
    : homeScore + (3 + Math.floor(Math.random() * 10));

  return {
    gameIndex,
    quarter: 1,
    homeScore: Math.floor(homeScore * 0.2),
    awayScore: Math.floor(awayScore * 0.2),
    plays: [`Q1 · ${PLAY_BY_PLAY[Math.floor(Math.random() * PLAY_BY_PLAY.length)]}`],
    complete: false,
    won,
    playerStats,
  };
}

export function advanceGameCast(cast: GameCastState): GameCastState {
  if (cast.complete) return cast;

  const nextQuarter = cast.quarter + 1;
  const progress = nextQuarter / 4;
  const targetHome = cast.won
    ? 95 + Math.floor(Math.random() * 15)
    : 88 + Math.floor(Math.random() * 12);
  const targetAway = cast.won
    ? targetHome - (5 + Math.floor(Math.random() * 10))
    : targetHome + (3 + Math.floor(Math.random() * 8));

  const play = PLAY_BY_PLAY[Math.floor(Math.random() * PLAY_BY_PLAY.length)]!;

  if (nextQuarter > 4) {
    return {
      ...cast,
      quarter: 4,
      homeScore: targetHome,
      awayScore: targetAway,
      complete: true,
      plays: [...cast.plays, `Final · Game over`],
    };
  }

  return {
    ...cast,
    quarter: nextQuarter,
    homeScore: Math.floor(targetHome * progress),
    awayScore: Math.floor(targetAway * progress),
    plays: [...cast.plays, `Q${nextQuarter} · ${play}`],
  };
}

export function applyGameCastResult(
  season: SeasonState,
  cast: GameCastState
): SeasonState {
  const game = season.games[cast.gameIndex];
  if (!game || game.result) return season;

  const games = season.games.map((g, i) =>
    i === cast.gameIndex
      ? {
          ...g,
          result: cast.won ? ('W' as const) : ('L' as const),
          playerStats: cast.playerStats,
        }
      : g
  );

  const next: SeasonState = {
    ...season,
    games,
    currentGameIndex: Math.max(season.currentGameIndex, cast.gameIndex + 1),
  };

  const updated = updateStandings(next);
  if (updated.currentGameIndex >= 82) {
    return { ...updated, seasonComplete: true };
  }
  return updated;
}

export function getCareerSpinAbbrs(): string[] {
  return CAREER_TEAMS.map((t) => t.abbr);
}
