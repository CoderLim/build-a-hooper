import type {
  AttributeKey,
  BuildSlot,
  GameMode,
  Grade,
  Position,
  SeasonStats,
  TeamSeason,
} from '@/lib/hooper-game/types';

export type LeaderboardSortBy =
  | 'points'
  | 'championships'
  | 'winRate'
  | 'bestOverall'
  | 'runs'
  | 'awards';

export interface BuildSummaryItem {
  attribute: AttributeKey;
  grade: Grade;
  overall: number;
  playerName: string;
  round: number;
}

export interface SubmitRunInput {
  mode: GameMode;
  position: Position | null;
  careerTeam: Pick<TeamSeason, 'abbr' | 'name'> | null;
  overall: number;
  buildSlots: BuildSlot[];
  seasonStats: SeasonStats;
  rookieCount: number;
}

export interface HooperRunView {
  id: string;
  completedAt: string;
  mode: string;
  position: string | null;
  careerTeamAbbr: string | null;
  careerTeamName: string | null;
  overall: number;
  wins: number;
  losses: number;
  ppg: number;
  apg: number;
  rpg: number;
  champion: boolean;
  fmvp: boolean;
  playoffResult: string;
  awards: string[];
  legacyPoints: number;
  buildSummary: BuildSummaryItem[];
  rookieCount: number;
  tripleDoubles: number;
  madeThroughPlayIn: boolean;
  finalsComeback: boolean;
  playoffPath: string[];
}

export interface HooperLegacyView {
  userId: string;
  displayName: string;
  preferredPosition: string | null;
  totalRuns: number;
  totalChampionships: number;
  totalLegacyPoints: number;
  bestOverall: number;
  totalAwards: number;
  winRate: number;
  lastRunAt: string | null;
  rank?: number;
}

export interface LeaderboardStats {
  totalPlayers: number;
  totalPoints: number;
  totalChampionships: number;
}

export interface LeaderboardResult {
  stats: LeaderboardStats;
  items: HooperLegacyView[];
  total: number;
  page: number;
  pageSize: number;
}

export interface HooperProfileView {
  legacy: HooperLegacyView;
  recentRuns: HooperRunView[];
}
