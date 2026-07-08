import { clearGameState } from '@/lib/hooper-game/persistence';
import { ATTRIBUTE_KEYS, GRADE_VALUES, POSITIONS, REROLLS_BY_MODE } from './constants';
import { CAREER_TEAMS, TEAM_SEASONS } from './data';
import { createSeasonState } from './season-engine';
import type {
  AttributeKey,
  BuildSlot,
  GameMode,
  GameState,
  Grade,
  LockedPick,
  Position,
  TeamSeason,
} from './types';

export function createInitialState(): GameState {
  return {
    screen: 'landing',
    mode: null,
    position: null,
    positionRevealed: false,
    buildPhase: 'idle',
    careerTeamPhase: 'idle',
    currentTeam: null,
    spinDisplayAbbr: null,
    rerollsLeft: 0,
    lockedPicks: [],
    buildSlots: ATTRIBUTE_KEYS.map((attribute) => ({ attribute, locked: false })),
    usedPlayerNames: new Set(),
    selectedPlayerId: null,
    selectedAttribute: null,
    spinPool: [...TEAM_SEASONS],
    careerTeam: null,
    seasonState: null,
    gameCast: null,
    seasonStats: null,
  };
}

export function startGame(state: GameState): GameState {
  return { ...state, screen: 'mode-select' };
}

export function selectMode(state: GameState, mode: GameMode): GameState {
  return {
    ...state,
    mode,
    rerollsLeft: REROLLS_BY_MODE[mode],
  };
}

export function confirmMode(state: GameState): GameState {
  if (!state.mode) return state;

  if (state.mode === 'classic') {
    return { ...state, screen: 'position-select' };
  }

  const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)]!;

  if (state.mode === 'blind') {
    return {
      ...state,
      position,
      positionRevealed: true,
      screen: 'position-roll',
    };
  }

  return {
    ...state,
    position,
    positionRevealed: false,
    screen: 'build',
    buildPhase: 'idle',
  };
}

export function selectPosition(state: GameState, position: Position): GameState {
  return { ...state, position };
}

export function confirmPosition(state: GameState): GameState {
  if (!state.position) return state;
  return { ...state, screen: 'build', buildPhase: 'idle' };
}

export function confirmPositionRoll(state: GameState): GameState {
  return { ...state, screen: 'build', buildPhase: 'idle' };
}

function pickRandomTeam(pool: TeamSeason[]): TeamSeason {
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function startSpin(state: GameState): GameState {
  if (state.buildPhase !== 'idle') return state;
  const abbrs = TEAM_SEASONS.map((t) => t.abbr);
  return {
    ...state,
    buildPhase: 'spinning',
    spinDisplayAbbr: abbrs[Math.floor(Math.random() * abbrs.length)] ?? null,
    selectedPlayerId: null,
    selectedAttribute: null,
  };
}

export function completeSpin(state: GameState): GameState {
  if (state.buildPhase !== 'spinning') return state;
  const team = pickRandomTeam(state.spinPool);
  return {
    ...state,
    buildPhase: 'roster',
    currentTeam: team,
    spinDisplayAbbr: team.abbr,
    selectedPlayerId: null,
    selectedAttribute: null,
  };
}

export function rerollTeam(state: GameState): GameState {
  if (state.rerollsLeft <= 0 || state.buildPhase !== 'roster') return state;
  const team = pickRandomTeam(state.spinPool);
  return {
    ...state,
    rerollsLeft: state.rerollsLeft - 1,
    currentTeam: team,
    spinDisplayAbbr: team.abbr,
    selectedPlayerId: null,
    selectedAttribute: null,
  };
}

export function isPlayerNameUsed(state: GameState, playerName: string): boolean {
  return state.usedPlayerNames.has(playerName);
}

export function selectPlayer(state: GameState, playerId: string): GameState {
  if (state.buildPhase !== 'roster' || !state.currentTeam) return state;
  const player = state.currentTeam.roster.find((p) => p.id === playerId);
  if (!player || state.usedPlayerNames.has(player.name)) return state;
  return {
    ...state,
    selectedPlayerId: playerId,
    selectedAttribute: null,
  };
}

export function selectAttribute(
  state: GameState,
  attribute: AttributeKey
): GameState {
  if (!state.selectedPlayerId || !state.currentTeam) return state;
  const player = state.currentTeam.roster.find(
    (p) => p.id === state.selectedPlayerId
  );
  if (!player || !player.attributes[attribute]) return state;
  const slot = state.buildSlots.find((s) => s.attribute === attribute);
  if (slot?.locked) return state;
  return { ...state, selectedAttribute: attribute };
}

export function lockPick(state: GameState): GameState {
  if (
    state.buildPhase !== 'roster' ||
    !state.currentTeam ||
    !state.selectedPlayerId ||
    !state.selectedAttribute
  ) {
    return state;
  }

  const player = state.currentTeam.roster.find(
    (p) => p.id === state.selectedPlayerId
  );
  if (!player) return state;

  const grade = player.attributes[state.selectedAttribute] as Grade;
  const overall = GRADE_VALUES[grade] ?? 70;
  const round = state.lockedPicks.length + 1;

  const pick: LockedPick = {
    round,
    teamId: state.currentTeam.id,
    teamName: state.currentTeam.name,
    playerId: player.id,
    playerName: player.name,
    attribute: state.selectedAttribute,
    grade,
    overall,
  };

  const usedPlayerNames = new Set(state.usedPlayerNames);
  usedPlayerNames.add(player.name);

  const buildSlots: BuildSlot[] = state.buildSlots.map((slot) =>
    slot.attribute === state.selectedAttribute
      ? {
          attribute: slot.attribute,
          locked: true,
          grade,
          overall,
          playerName: player.name,
          round,
        }
      : slot
  );

  const lockedPicks = [...state.lockedPicks, pick];
  const isComplete = lockedPicks.length >= ATTRIBUTE_KEYS.length;

  if (isComplete) {
    return {
      ...state,
      lockedPicks,
      buildSlots,
      usedPlayerNames,
      buildPhase: 'idle',
      currentTeam: null,
      spinDisplayAbbr: null,
      selectedPlayerId: null,
      selectedAttribute: null,
      screen: 'reveal',
      positionRevealed: true,
    };
  }

  return {
    ...state,
    lockedPicks,
    buildSlots,
    usedPlayerNames,
    buildPhase: 'idle',
    currentTeam: null,
    spinDisplayAbbr: null,
    selectedPlayerId: null,
    selectedAttribute: null,
  };
}

export function proceedToCareerTeam(state: GameState): GameState {
  return {
    ...state,
    screen: 'career-team',
    careerTeam: null,
    careerTeamPhase: 'idle',
  };
}

export function startCareerSpin(state: GameState): GameState {
  const abbrs = CAREER_TEAMS.map((t) => t.abbr);
  return {
    ...state,
    careerTeamPhase: 'spinning',
    spinDisplayAbbr: abbrs[Math.floor(Math.random() * abbrs.length)] ?? null,
  };
}

export function completeCareerSpin(state: GameState): GameState {
  const team =
    CAREER_TEAMS[Math.floor(Math.random() * CAREER_TEAMS.length)] ?? null;
  return {
    ...state,
    careerTeam: team,
    careerTeamPhase: 'locked',
    spinDisplayAbbr: team?.abbr ?? null,
  };
}

export function confirmCareerTeam(state: GameState): GameState {
  if (!state.careerTeam) return state;
  return {
    ...state,
    screen: 'season',
    seasonState: createSeasonState(state.careerTeam, state.buildSlots),
  };
}

export function resetGame(): GameState {
  clearGameState();
  return createInitialState();
}

export function getOverallRating(slots: BuildSlot[]): number {
  const locked = slots.filter((s) => s.locked && s.overall);
  if (locked.length === 0) return 0;
  return Math.round(
    locked.reduce((sum, s) => sum + (s.overall ?? 0), 0) / locked.length
  );
}

export function ratingsVisible(mode: GameMode | null): boolean {
  return mode === 'classic';
}

export function positionVisible(
  mode: GameMode | null,
  positionRevealed: boolean
): boolean {
  if (!mode) return false;
  if (mode === 'classic') return true;
  return positionRevealed;
}

export function getGameStep(screen: GameState['screen']): import('./types').GameStep {
  switch (screen) {
    case 'landing':
    case 'mode-select':
    case 'position-select':
    case 'position-roll':
      return 'setup';
    case 'build':
      return 'build';
    case 'reveal':
    case 'career-team':
      return 'reveal';
    case 'season':
    case 'gamecast':
    case 'playoffs':
      return 'season';
    case 'my-card':
      return 'card';
    default:
      return 'setup';
  }
}
