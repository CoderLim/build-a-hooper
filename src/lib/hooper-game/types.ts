export type AttributeKey =
  | '3PT'
  | 'MID'
  | 'FIN'
  | 'DNK'
  | 'HAN'
  | 'PAS'
  | 'PDEF'
  | 'IDEF'
  | 'BLK'
  | 'REB'
  | 'ATH'
  | 'STR'
  | 'CLU';

export type Grade =
  | 'A+'
  | 'A'
  | 'A-'
  | 'B+'
  | 'B'
  | 'B-'
  | 'C+'
  | 'C'
  | 'C-'
  | 'D+'
  | 'D'
  | 'D-'
  | 'F';

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export type GameMode = 'classic' | 'blind' | 'chaos';

export type GameScreen =
  | 'landing'
  | 'mode-select'
  | 'position-select'
  | 'position-roll'
  | 'build'
  | 'reveal'
  | 'career-team'
  | 'season'
  | 'gamecast'
  | 'playoffs'
  | 'my-card';

export type GameStep = 'setup' | 'build' | 'reveal' | 'season' | 'card';

export type BuildPhase = 'idle' | 'spinning' | 'roster';

export type CareerTeamPhase = 'idle' | 'spinning' | 'locked';

export type PlayoffRound = 'playin' | 'r1' | 'r2' | 'conf' | 'finals';

export interface PlayerAttributes {
  [key: string]: Grade;
}

export interface RosterPlayer {
  id: string;
  name: string;
  positions: Position[];
  attributes: PlayerAttributes;
  overall: number;
}

export interface TeamSeason {
  id: string;
  abbr: string;
  name: string;
  tagline: string;
  roster: RosterPlayer[];
}

export interface LockedPick {
  round: number;
  teamId: string;
  teamName: string;
  playerId: string;
  playerName: string;
  attribute: AttributeKey;
  grade: Grade;
  overall: number;
}

export interface BuildSlot {
  attribute: AttributeKey;
  locked: boolean;
  grade?: Grade;
  overall?: number;
  playerName?: string;
  round?: number;
}

export interface SeasonGame {
  gameNumber: number;
  opponent: string;
  opponentAbbr: string;
  result?: 'W' | 'L';
  playerStats?: { pts: number; ast: number; reb: number };
  isPlayoff?: boolean;
}

export interface PlayoffSeries {
  round: PlayoffRound;
  opponent: string;
  opponentAbbr: string;
  wins: number;
  losses: number;
  completed: boolean;
  won?: boolean;
}

export interface SeasonState {
  games: SeasonGame[];
  currentGameIndex: number;
  standings: { rank: number; wins: number; losses: number };
  awardRace: Record<string, number>;
  playoffSeries: PlayoffSeries[];
  seasonComplete: boolean;
  inPlayoffs: boolean;
}

export interface GameCastState {
  gameIndex: number;
  quarter: number;
  homeScore: number;
  awayScore: number;
  plays: string[];
  complete: boolean;
  won: boolean;
  playerStats: { pts: number; ast: number; reb: number };
}

export interface SeasonStats {
  wins: number;
  losses: number;
  ppg: number;
  apg: number;
  rpg: number;
  awards: string[];
  playoffResult: string;
  champion: boolean;
  fmvp: boolean;
  playoffPath: string[];
}

export interface GameState {
  screen: GameScreen;
  mode: GameMode | null;
  position: Position | null;
  positionRevealed: boolean;
  buildPhase: BuildPhase;
  careerTeamPhase: CareerTeamPhase;
  currentTeam: TeamSeason | null;
  spinDisplayAbbr: string | null;
  rerollsLeft: number;
  lockedPicks: LockedPick[];
  buildSlots: BuildSlot[];
  usedPlayerNames: Set<string>;
  selectedPlayerId: string | null;
  selectedAttribute: AttributeKey | null;
  spinPool: TeamSeason[];
  careerTeam: TeamSeason | null;
  seasonState: SeasonState | null;
  gameCast: GameCastState | null;
  seasonStats: SeasonStats | null;
}
