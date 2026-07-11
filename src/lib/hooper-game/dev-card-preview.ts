import { ATTRIBUTE_KEYS } from '@/lib/hooper-game/constants';
import { TEAM_SEASONS } from '@/lib/hooper-game/data';
import { createInitialState } from '@/lib/hooper-game/engine';
import type {
  BuildSlot,
  GameState,
  SeasonStats,
} from '@/lib/hooper-game/types';

const DEMO_BUILD: BuildSlot[] = [
  {
    attribute: '3PT',
    locked: true,
    grade: 'B+',
    overall: 87,
    playerName: 'Magic Johnson',
    round: 1,
  },
  {
    attribute: 'MID',
    locked: true,
    grade: 'B+',
    overall: 87,
    playerName: 'Magic Johnson',
    round: 1,
  },
  {
    attribute: 'FIN',
    locked: true,
    grade: 'A-',
    overall: 90,
    playerName: 'James Worthy',
    round: 2,
  },
  {
    attribute: 'DNK',
    locked: true,
    grade: 'B+',
    overall: 87,
    playerName: 'James Worthy',
    round: 2,
  },
  {
    attribute: 'HAN',
    locked: true,
    grade: 'A',
    overall: 93,
    playerName: 'Magic Johnson',
    round: 3,
  },
  {
    attribute: 'PAS',
    locked: true,
    grade: 'A+',
    overall: 97,
    playerName: 'Magic Johnson',
    round: 3,
  },
  {
    attribute: 'PDEF',
    locked: true,
    grade: 'A',
    overall: 93,
    playerName: 'Michael Cooper',
    round: 4,
  },
  {
    attribute: 'IDEF',
    locked: true,
    grade: 'A',
    overall: 93,
    playerName: 'Kareem Abdul-Jabbar',
    round: 5,
  },
  {
    attribute: 'BLK',
    locked: true,
    grade: 'A',
    overall: 93,
    playerName: 'Kareem Abdul-Jabbar',
    round: 5,
  },
  {
    attribute: 'REB',
    locked: true,
    grade: 'A-',
    overall: 90,
    playerName: 'Kareem Abdul-Jabbar',
    round: 6,
  },
  {
    attribute: 'ATH',
    locked: true,
    grade: 'B+',
    overall: 87,
    playerName: 'James Worthy',
    round: 7,
  },
  {
    attribute: 'STR',
    locked: true,
    grade: 'B+',
    overall: 87,
    playerName: 'Kareem Abdul-Jabbar',
    round: 8,
  },
  {
    attribute: 'CLU',
    locked: true,
    grade: 'A+',
    overall: 97,
    playerName: 'Magic Johnson',
    round: 9,
  },
];

const DEMO_SEASON_STATS: SeasonStats = {
  wins: 58,
  losses: 24,
  ppg: 26,
  apg: 9,
  rpg: 6,
  awards: ['All-NBA First Team', 'MVP Finalist'],
  playoffResult: 'NBA Champion',
  champion: true,
  fmvp: true,
  playoffPath: [
    'First Round: Beat Suns 4-2',
    'Semifinals: Beat Nuggets 4-1',
    'Finals: Beat Celtics 4-3',
  ],
};

export function isDevCardPreviewActive(): boolean {
  if (!import.meta.env.DEV || typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('preview') === 'card';
}

/** Dev-only fixture: jump straight to My Card with a completed Showtime Lakers run. */
export function createDevCardPreviewState(): GameState {
  const careerTeam =
    TEAM_SEASONS.find((team) => team.abbr === 'LAL') ?? TEAM_SEASONS[0]!;

  return {
    ...createInitialState(),
    screen: 'my-card',
    mode: 'classic',
    position: 'PG',
    positionRevealed: true,
    buildPhase: 'idle',
    careerTeamPhase: 'locked',
    careerTeam,
    buildSlots: ATTRIBUTE_KEYS.map((attribute) => {
      const slot = DEMO_BUILD.find((item) => item.attribute === attribute);
      return slot ?? { attribute, locked: false };
    }),
    usedPlayerNames: new Set([
      'Magic Johnson',
      'James Worthy',
      'Michael Cooper',
      'Kareem Abdul-Jabbar',
    ]),
    seasonStats: DEMO_SEASON_STATS,
  };
}
