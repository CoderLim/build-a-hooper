import { useEffect, useReducer, useState } from 'react';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import {
  getGameStep,
  getOverallRating,
  positionVisible,
  ratingsVisible,
} from '@/lib/hooper-game/engine';
import { loadGameState, saveGameState } from '@/lib/hooper-game/persistence';
import type { AttributeKey } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

import {
  createInitialState,
  gameReducer,
  type GameAction,
} from './game-reducer';
import { GameStepper } from './game-stepper';
import { GameConfirmDialog, GameShell } from './game-ui';
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
  return loadGameState() ?? createInitialState();
}

export function HooperGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initState);
  const { data: session } = useSession();

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const showRatings = ratingsVisible(state.mode);
  const showPosition = positionVisible(state.mode, state.positionRevealed);
  const progress = state.lockedPicks.length;
  const currentStep = getGameStep(state.screen);
  const overall = getOverallRating(state.buildSlots);

  const lockedAttributes = state.buildSlots
    .filter((s) => s.locked)
    .map((s) => s.attribute);

  const selectedPlayer = state.currentTeam?.roster.find(
    (p) => p.id === state.selectedPlayerId
  );

  const act = (action: GameAction) => () => dispatch(action);

  const showStepper = state.screen !== 'landing';

  const [confirmRestart, setConfirmRestart] = useState(false);

  return (
    <GameShell>
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 px-4 py-2 transition hover:border-white/20 hover:bg-white/8"
          >
            <img
              src={envConfigs.app_logo}
              alt=""
              className="size-9 shrink-0 object-contain"
              width={36}
              height={36}
              decoding="async"
            />
            <span className="font-serif text-lg text-white italic">
              {envConfigs.app_name}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/leaderboard"
              className="hidden rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold tracking-[0.15em] text-white/60 uppercase transition hover:border-orange-300/50 hover:text-white sm:inline-flex"
            >
              {m['landing.nav.leaderboard']()}
            </Link>
            {!session?.user && (
              <Link
                href="/sign-in?callbackUrl=/game"
                className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold tracking-[0.15em] text-white/60 uppercase transition hover:border-orange-300/50 hover:text-white"
              >
                {m['landing.nav.login']()}
              </Link>
            )}
            {state.screen !== 'landing' && (
              <button
                type="button"
                onClick={() => setConfirmRestart(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold tracking-[0.15em] text-white/60 uppercase transition hover:border-orange-300/50 hover:text-white"
              >
                {m['game.restart']()}
              </button>
            )}
          </div>
        </div>

        {showStepper && <GameStepper currentStep={currentStep} />}

        {state.screen === 'landing' && (
          <LandingScreen onStart={act({ type: 'START' })} />
        )}

        {state.screen === 'mode-select' && (
          <ModeSelectScreen
            mode={state.mode}
            buildSlots={state.buildSlots}
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
            buildSlots={state.buildSlots}
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
      </main>

      <GameConfirmDialog
        open={confirmRestart}
        title={m['game.restart']()}
        description={m['game.restart_confirm']()}
        confirmLabel={m['game.restart']()}
        cancelLabel={m['game.cancel']()}
        onConfirm={() => {
          setConfirmRestart(false);
          dispatch({ type: 'RESET' });
        }}
        onCancel={() => setConfirmRestart(false)}
      />
    </GameShell>
  );
}
