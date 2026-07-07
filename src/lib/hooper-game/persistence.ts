import { createInitialState } from './engine';
import type { GameState } from './types';

const STORAGE_KEY = 'build-a-hooper-game-state';

interface PersistedGameState {
  screen: GameState['screen'];
  mode: GameState['mode'];
  position: GameState['position'];
  positionRevealed: boolean;
  buildPhase: GameState['buildPhase'];
  careerTeamPhase: GameState['careerTeamPhase'];
  currentTeam: GameState['currentTeam'];
  spinDisplayAbbr: string | null;
  rerollsLeft: number;
  lockedPicks: GameState['lockedPicks'];
  buildSlots: GameState['buildSlots'];
  usedPlayerNames: string[];
  selectedPlayerId: string | null;
  selectedAttribute: GameState['selectedAttribute'];
  careerTeam: GameState['careerTeam'];
  seasonState: GameState['seasonState'];
  gameCast: GameState['gameCast'];
  seasonStats: GameState['seasonStats'];
}

export function serializeGameState(state: GameState): PersistedGameState {
  return {
    screen: state.screen,
    mode: state.mode,
    position: state.position,
    positionRevealed: state.positionRevealed,
    buildPhase: state.buildPhase,
    careerTeamPhase: state.careerTeamPhase,
    currentTeam: state.currentTeam,
    spinDisplayAbbr: state.spinDisplayAbbr,
    rerollsLeft: state.rerollsLeft,
    lockedPicks: state.lockedPicks,
    buildSlots: state.buildSlots,
    usedPlayerNames: [...state.usedPlayerNames],
    selectedPlayerId: state.selectedPlayerId,
    selectedAttribute: state.selectedAttribute,
    careerTeam: state.careerTeam,
    seasonState: state.seasonState,
    gameCast: state.gameCast,
    seasonStats: state.seasonStats,
  };
}

export function deserializeGameState(data: PersistedGameState): GameState {
  const initial = createInitialState();
  return {
    ...initial,
    ...data,
    usedPlayerNames: new Set(data.usedPlayerNames),
    spinPool: initial.spinPool,
  };
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  if (state.screen === 'landing') {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeGameState(state)));
}

export function loadGameState(): GameState | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return deserializeGameState(JSON.parse(raw) as PersistedGameState);
  } catch {
    return null;
  }
}

export function clearGameState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
