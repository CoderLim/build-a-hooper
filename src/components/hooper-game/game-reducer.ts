import { ATTRIBUTE_KEYS } from '@/lib/hooper-game/constants';
import {
  completeCareerSpin,
  completeSpin,
  confirmCareerTeam,
  confirmMode,
  confirmPosition,
  confirmPositionRoll,
  createInitialState,
  lockPick,
  proceedToCareerTeam,
  resetGame,
  rerollTeam,
  selectAttribute,
  selectMode,
  selectPlayer,
  selectPosition,
  startCareerSpin,
  startGame,
  startSpin,
} from '@/lib/hooper-game/engine';
import {
  advanceGameCast,
  applyGameCastResult,
  buildSeasonStats,
  simulateNextGame,
  simulatePlayoffGame,
  simulateToEnd,
  startGameCast,
  startPlayoffs,
} from '@/lib/hooper-game/season-engine';
import type { AttributeKey, GameMode, GameState, Position } from '@/lib/hooper-game/types';

export type GameAction =
  | { type: 'START' }
  | { type: 'SELECT_MODE'; mode: GameMode }
  | { type: 'CONFIRM_MODE' }
  | { type: 'SELECT_POSITION'; position: Position }
  | { type: 'CONFIRM_POSITION' }
  | { type: 'CONFIRM_POSITION_ROLL' }
  | { type: 'START_SPIN' }
  | { type: 'COMPLETE_SPIN' }
  | { type: 'REROLL' }
  | { type: 'SELECT_PLAYER'; playerId: string }
  | { type: 'SELECT_ATTRIBUTE'; attribute: AttributeKey }
  | { type: 'LOCK_PICK' }
  | { type: 'TO_CAREER' }
  | { type: 'START_CAREER_SPIN' }
  | { type: 'COMPLETE_CAREER_SPIN' }
  | { type: 'CONFIRM_CAREER' }
  | { type: 'SIMULATE_NEXT' }
  | { type: 'SIMULATE_TO_END' }
  | { type: 'START_PLAYOFFS' }
  | { type: 'SIMULATE_PLAYOFF_GAME' }
  | { type: 'FINISH_PLAYOFFS' }
  | { type: 'START_GAMECAST' }
  | { type: 'ADVANCE_GAMECAST' }
  | { type: 'COMPLETE_GAMECAST' }
  | { type: 'RESET' }
  | { type: 'RESTORE'; state: GameState };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return startGame(state);
    case 'SELECT_MODE':
      return selectMode(state, action.mode);
    case 'CONFIRM_MODE':
      return confirmMode(state);
    case 'SELECT_POSITION':
      return selectPosition(state, action.position);
    case 'CONFIRM_POSITION':
      return confirmPosition(state);
    case 'CONFIRM_POSITION_ROLL':
      return confirmPositionRoll(state);
    case 'START_SPIN':
      return startSpin(state);
    case 'COMPLETE_SPIN':
      return completeSpin(state);
    case 'REROLL':
      return rerollTeam(state);
    case 'SELECT_PLAYER':
      return selectPlayer(state, action.playerId);
    case 'SELECT_ATTRIBUTE':
      return selectAttribute(state, action.attribute);
    case 'LOCK_PICK':
      return lockPick(state);
    case 'TO_CAREER':
      return proceedToCareerTeam(state);
    case 'START_CAREER_SPIN':
      return startCareerSpin(state);
    case 'COMPLETE_CAREER_SPIN':
      return completeCareerSpin(state);
    case 'CONFIRM_CAREER':
      return confirmCareerTeam(state);
    case 'SIMULATE_NEXT': {
      if (!state.seasonState) return state;
      const seasonState = simulateNextGame(state.seasonState, state.buildSlots);
      if (seasonState.seasonComplete && !seasonState.inPlayoffs) {
        const withPlayoffs = startPlayoffs(seasonState);
        if (withPlayoffs.inPlayoffs) {
          return { ...state, seasonState: withPlayoffs, screen: 'playoffs' };
        }
        return {
          ...state,
          seasonState: withPlayoffs,
          seasonStats: buildSeasonStats(withPlayoffs, state.buildSlots),
          screen: 'my-card',
        };
      }
      return { ...state, seasonState };
    }
    case 'SIMULATE_TO_END': {
      if (!state.seasonState) return state;
      let seasonState = simulateToEnd(state.seasonState, state.buildSlots);
      seasonState = startPlayoffs(seasonState);
      if (seasonState.inPlayoffs) {
        return { ...state, seasonState, screen: 'playoffs' };
      }
      return {
        ...state,
        seasonState,
        seasonStats: buildSeasonStats(seasonState, state.buildSlots),
        screen: 'my-card',
      };
    }
    case 'START_PLAYOFFS': {
      if (!state.seasonState) return state;
      const seasonState = startPlayoffs(state.seasonState);
      if (!seasonState.inPlayoffs) {
        return {
          ...state,
          seasonState,
          seasonStats: buildSeasonStats(seasonState, state.buildSlots),
          screen: 'my-card',
        };
      }
      return { ...state, seasonState, screen: 'playoffs' };
    }
    case 'SIMULATE_PLAYOFF_GAME': {
      if (!state.seasonState) return state;
      let seasonState = simulatePlayoffGame(state.seasonState, state.buildSlots);
      if (seasonState.seasonComplete) {
        return {
          ...state,
          seasonState,
          seasonStats: buildSeasonStats(seasonState, state.buildSlots),
          screen: 'my-card',
        };
      }
      return { ...state, seasonState };
    }
    case 'FINISH_PLAYOFFS': {
      if (!state.seasonState) return state;
      return {
        ...state,
        seasonStats: buildSeasonStats(state.seasonState, state.buildSlots),
        screen: 'my-card',
      };
    }
    case 'START_GAMECAST': {
      if (!state.seasonState) return state;
      const idx = state.seasonState.currentGameIndex;
      if (idx >= 82) return state;
      const gameCast = startGameCast(state.seasonState, idx, state.buildSlots);
      return { ...state, gameCast, screen: 'gamecast' };
    }
    case 'ADVANCE_GAMECAST': {
      if (!state.gameCast) return state;
      const gameCast = advanceGameCast(state.gameCast);
      return { ...state, gameCast };
    }
    case 'COMPLETE_GAMECAST': {
      if (!state.gameCast || !state.seasonState) return state;
      let gameCast = state.gameCast;
      while (!gameCast.complete) {
        gameCast = advanceGameCast(gameCast);
      }
      const seasonState = applyGameCastResult(state.seasonState, gameCast);
      if (seasonState.seasonComplete && !seasonState.inPlayoffs) {
        const withPlayoffs = startPlayoffs(seasonState);
        if (withPlayoffs.inPlayoffs) {
          return {
            ...state,
            seasonState: withPlayoffs,
            gameCast: null,
            screen: 'playoffs',
          };
        }
        return {
          ...state,
          seasonState: withPlayoffs,
          gameCast: null,
          seasonStats: buildSeasonStats(withPlayoffs, state.buildSlots),
          screen: 'my-card',
        };
      }
      return {
        ...state,
        seasonState,
        gameCast: null,
        screen: 'season',
      };
    }
    case 'RESET':
      return resetGame();
    case 'RESTORE':
      return action.state;
    default:
      return state;
  }
}

export { createInitialState, ATTRIBUTE_KEYS };
