import { useEffect, useLayoutEffect, useReducer, useRef } from 'react';

import { useSession } from '@/core/auth/client';
import { apiPost } from '@/lib/api-client';
import {
  createDevCardPreviewState,
  isDevCardPreviewActive,
} from '@/lib/hooper-game/dev-card-preview';
import {
  getOverallRating,
  positionVisible,
  ratingsVisible,
} from '@/lib/hooper-game/engine';
import type { RunChallengeResponse } from '@/lib/hooper-game/run-challenge';
import type { AttributeKey } from '@/lib/hooper-game/types';
import { cn } from '@/lib/utils';

import {
  createInitialState,
  gameReducer,
  type GameAction,
} from './game-reducer';
import { GameShell } from './game-ui';
import { BuildRoomScreen } from './screens/build-room-screen';
import { CareerTeamScreen } from './screens/career-team-screen';
import { GameCastScreen } from './screens/gamecast-screen';
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
  const { data: session, isPending: sessionPending } = useSession();
  const issuingChallenge = useRef(false);

  const showRatings = ratingsVisible(state.mode);
  const showPosition = positionVisible(state.mode, state.positionRevealed);
  const progress = state.lockedPicks.length;
  const overall = getOverallRating(state.buildSlots);

  const lockedAttributes = state.buildSlots
    .filter((slot) => slot.locked)
    .map((slot) => slot.attribute);

  const selectedPlayer = state.currentTeam?.roster.find(
    (player) => player.id === state.selectedPlayerId
  );

  const act = (action: GameAction) => () => dispatch(action);

  const prevScreen = useRef(state.screen);
  useLayoutEffect(() => {
    if (!embedded) return;
    if (prevScreen.current === state.screen) return;
    prevScreen.current = state.screen;
    document
      .getElementById('play')
      ?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [embedded, state.screen]);

  useEffect(() => {
    if (state.screen !== 'mode-select') return;
    if (state.runToken) return;
    if (sessionPending || !session?.user) return;
    if (issuingChallenge.current) return;

    issuingChallenge.current = true;
    let cancelled = false;

    void (async () => {
      try {
        const challenge = await apiPost<RunChallengeResponse>(
          '/api/hooper/runs/challenge'
        );
        if (cancelled) return;
        dispatch({
          type: 'SET_RUN_CHALLENGE',
          runToken: challenge.runToken,
          seed: challenge.seed,
        });
      } catch (error) {
        console.error('[hooper] Failed to issue run challenge', error);
      } finally {
        issuingChallenge.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state.screen, state.runToken, session?.user, sessionPending]);

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
            onConfirmBuild={act({ type: 'CONFIRM_BUILD' })}
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
            runToken={state.runToken}
            onPlayAgain={act({ type: 'RESET' })}
          />
        )}
      </div>
    </GameShell>
  );
}
