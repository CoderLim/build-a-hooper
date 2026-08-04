import { useReducer } from 'react';

import {
  createDevCardPreviewState,
  isDevCardPreviewActive,
} from '@/lib/hooper-game/dev-card-preview';
import {
  getOverallRating,
  positionVisible,
  ratingsVisible,
} from '@/lib/hooper-game/engine';
import type { AttributeKey } from '@/lib/hooper-game/types';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';

import {
  createInitialState,
  gameReducer,
  type GameAction,
} from './game-reducer';
import { GameShell } from './game-ui';
import { BuildRoomScreen } from './screens/build-room-screen';
import { CareerTeamScreen } from './screens/career-team-screen';
import { GameCastScreen } from './screens/gamecast-screen';
import { LandingScreen } from './screens/landing-screen';
import { ModeSelectScreen } from './screens/mode-select-screen';
import { MyCardScreen } from './screens/my-card-screen';
import { PlayoffsScreen } from './screens/playoffs-screen';
import {
  PositionRollScreen,
  PositionSelectScreen,
} from './screens/position-screen';
import { RevealScreen } from './screens/reveal-screen';
import { SeasonHubScreen } from './screens/season-hub-screen';

function initState() {
  if (isDevCardPreviewActive()) {
    return createDevCardPreviewState();
  }
  return createInitialState();
}

interface HooperGameProps {
  embedded?: boolean;
}

export function HooperGame({ embedded = false }: HooperGameProps = {}) {
  const [state, dispatch] = useReducer(gameReducer, undefined, initState);

  const showRatings = ratingsVisible(state.mode);
  const showPosition = positionVisible(state.mode, state.positionRevealed);
  const progress = state.lockedPicks.length;
  const overall = getOverallRating(state.buildSlots);

  const lockedAttributes = state.buildSlots
    .filter((s) => s.locked)
    .map((s) => s.attribute);

  const selectedPlayer = state.currentTeam?.roster.find(
    (p) => p.id === state.selectedPlayerId
  );

  const act = (action: GameAction) => () => dispatch(action);

  return (
    <GameShell
      className={cn('flex-1', embedded ? 'min-h-[100svh]' : 'min-h-0')}
    >
      <div
        className={cn(
          'mx-auto flex min-h-0 max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:px-8',
          embedded ? 'pt-24 pb-10 sm:pt-28 sm:pb-14' : 'py-8'
        )}
      >
        {state.screen === 'landing' && (
          <LandingScreen embedded={embedded} onStart={act({ type: 'START' })} />
        )}

        {state.screen === 'mode-select' && (
          <ModeSelectScreen
            mode={state.mode}
            progress={progress}
            onSelectMode={(mode) => dispatch({ type: 'SELECT_MODE', mode })}
            onConfirm={act({ type: 'CONFIRM_MODE' })}
          />
        )}

        {state.screen === 'position-select' && (
          <PositionSelectScreen
            position={state.position}
            onSelect={(position) =>
              dispatch({ type: 'SELECT_POSITION', position })
            }
            onConfirm={act({ type: 'CONFIRM_POSITION' })}
          />
        )}

        {state.screen === 'position-roll' && state.position && (
          <PositionRollScreen
            position={state.position}
            onConfirm={act({ type: 'CONFIRM_POSITION_ROLL' })}
          />
        )}

        {state.screen === 'build' && (
          <BuildRoomScreen
            state={state}
            showRatings={showRatings}
            showPosition={showPosition}
            progress={progress}
            lockedAttributes={lockedAttributes}
            selectedPlayer={selectedPlayer}
            onStartSpin={act({ type: 'START_SPIN' })}
            onCompleteSpin={act({ type: 'COMPLETE_SPIN' })}
            onReroll={act({ type: 'REROLL' })}
            onSelectPlayer={(playerId) =>
              dispatch({ type: 'SELECT_PLAYER', playerId })
            }
            onSelectAttribute={(attribute: AttributeKey) =>
              dispatch({ type: 'SELECT_ATTRIBUTE', attribute })
            }
            onLockPick={act({ type: 'LOCK_PICK' })}
          />
        )}

        {state.screen === 'reveal' && (
          <RevealScreen
            buildSlots={state.buildSlots}
            overall={overall}
            position={state.position}
            showPosition={showPosition}
            onContinue={act({ type: 'TO_CAREER' })}
          />
        )}

        {state.screen === 'career-team' && (
          <CareerTeamScreen
            phase={state.careerTeamPhase}
            careerTeam={state.careerTeam}
            spinDisplayAbbr={state.spinDisplayAbbr}
            onStartSpin={act({ type: 'START_CAREER_SPIN' })}
            onCompleteSpin={act({ type: 'COMPLETE_CAREER_SPIN' })}
            onConfirm={act({ type: 'CONFIRM_CAREER' })}
          />
        )}

        {state.screen === 'season' && state.seasonState && (
          <SeasonHubScreen
            seasonState={state.seasonState}
            careerTeam={state.careerTeam}
            overall={overall}
            onSimulateNext={act({ type: 'SIMULATE_NEXT' })}
            onSimulateToEnd={act({ type: 'SIMULATE_TO_END' })}
            onWatchGameCast={act({ type: 'START_GAMECAST' })}
            onStartPlayoffs={act({ type: 'START_PLAYOFFS' })}
          />
        )}

        {state.screen === 'gamecast' && state.gameCast && state.seasonState && (
          <GameCastScreen
            gameCast={state.gameCast}
            seasonState={state.seasonState}
            onAdvance={act({ type: 'ADVANCE_GAMECAST' })}
            onSkip={act({ type: 'COMPLETE_GAMECAST' })}
          />
        )}

        {state.screen === 'playoffs' && state.seasonState && (
          <PlayoffsScreen
            seasonState={state.seasonState}
            onSimulateGame={act({ type: 'SIMULATE_PLAYOFF_GAME' })}
            onFinish={act({ type: 'FINISH_PLAYOFFS' })}
          />
        )}

        {state.screen === 'my-card' && state.seasonStats && (
          <MyCardScreen
            mode={state.mode}
            buildSlots={state.buildSlots}
            position={state.position}
            showPosition={showPosition}
            careerTeam={state.careerTeam}
            seasonStats={state.seasonStats}
            onPlayAgain={act({ type: 'RESET' })}
          />
        )}

        <p className="mt-auto pt-8 text-center text-[11px] text-white/30">
          {m['game.disclaimer']()}
        </p>
      </div>
    </GameShell>
  );
}
