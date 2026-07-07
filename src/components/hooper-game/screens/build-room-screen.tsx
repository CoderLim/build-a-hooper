import { AttributeGrid, AttributePicker } from '../attribute-grid';
import {
  GameButton,
  GameEyebrow,
  GamePanel,
  GameTitle,
  ProgressPill,
} from '../game-ui';
import { SpinAnimation } from '../spin-animation';
import { TEAM_SEASONS } from '@/lib/hooper-game/data';
import { isPlayerNameUsed } from '@/lib/hooper-game/engine';
import type {
  AttributeKey,
  BuildPhase,
  BuildSlot,
  GameMode,
  GameState,
  Position,
  RosterPlayer,
  TeamSeason,
} from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';
import { cn } from '@/lib/utils';

interface BuildRoomScreenProps {
  state: GameState;
  showRatings: boolean;
  showPosition: boolean;
  progress: number;
  lockedAttributes: AttributeKey[];
  selectedPlayer: RosterPlayer | undefined;
  onStartSpin: () => void;
  onCompleteSpin: () => void;
  onReroll: () => void;
  onSelectPlayer: (id: string) => void;
  onSelectAttribute: (attr: AttributeKey) => void;
  onLockPick: () => void;
}

function stickyAction(
  phase: BuildPhase,
  selectedAttribute: AttributeKey | null,
  onStartSpin: () => void,
  onLockPick: () => void
) {
  if (phase === 'idle') {
    return { label: m['game.build.start_spin'](), action: onStartSpin, disabled: false };
  }
  if (phase === 'roster' && selectedAttribute) {
    return { label: m['game.build.lock_pick'](), action: onLockPick, disabled: false };
  }
  return null;
}

export function BuildRoomScreen({
  state,
  showRatings,
  showPosition,
  progress,
  lockedAttributes,
  selectedPlayer,
  onStartSpin,
  onCompleteSpin,
  onReroll,
  onSelectPlayer,
  onSelectAttribute,
  onLockPick,
}: BuildRoomScreenProps) {
  const abbrs = TEAM_SEASONS.map((t) => t.abbr);
  const sticky = stickyAction(
    state.buildPhase,
    state.selectedAttribute,
    onStartSpin,
    onLockPick
  );

  return (
    <section className="flex flex-1 flex-col gap-6 pb-24 lg:pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <GameEyebrow>{m['game.build.eyebrow']()}</GameEyebrow>
          <GameTitle className="mt-2 text-2xl sm:text-3xl">
            {m['game.build.title']()}
          </GameTitle>
          <p className="mt-2 text-sm text-white/55">{m['game.build.subtitle']()}</p>
        </div>
        <ProgressPill current={progress} total={13} label={m['game.build.progress']()} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_240px]">
        {/* Left: Team spin + roster */}
        <GamePanel className="lg:col-span-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase">
                {m['game.build.team_spin']()}
              </p>
              <h3 className="mt-1 text-lg font-black uppercase">
                {state.buildPhase === 'idle' && m['game.build.ready']()}
                {state.buildPhase === 'spinning' && m['game.build.spinning']()}
                {state.buildPhase === 'roster' && m['game.build.choose_player']()}
              </h3>
            </div>
            {state.buildPhase === 'roster' && (
              <GameButton
                variant="secondary"
                disabled={state.rerollsLeft <= 0}
                onClick={onReroll}
                className="hidden px-5 py-3 text-xs lg:inline-flex"
              >
                {m['game.build.reroll']({ count: state.rerollsLeft })}
              </GameButton>
            )}
          </div>

          {state.buildPhase === 'idle' && (
            <div className="mt-6 hidden flex-col items-center rounded-2xl border border-dashed border-white/15 py-12 text-center lg:flex">
              <p className="text-sm text-white/50">{m['game.build.no_team']()}</p>
              <GameButton className="mt-6" onClick={onStartSpin}>
                {m['game.build.start_spin']()}
              </GameButton>
            </div>
          )}

          {state.buildPhase === 'spinning' && (
            <SpinAnimation
              abbrs={abbrs}
              finalAbbr={state.spinDisplayAbbr}
              spinning
              onComplete={onCompleteSpin}
            />
          )}

          {state.buildPhase === 'roster' && state.currentTeam && (
            <RosterPanel
              team={state.currentTeam}
              state={state}
              showRatings={showRatings}
              lockedAttributes={lockedAttributes}
              onSelectPlayer={onSelectPlayer}
              onSelectAttribute={onSelectAttribute}
            />
          )}
        </GamePanel>

        {/* Center: Selected player */}
        <GamePanel title={m['game.build.selected_player']()}>
          {!selectedPlayer ? (
            <p className="text-sm text-white/45">{m['game.build.no_player']()}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-lg font-black">{selectedPlayer.name}</p>
                <p className="text-sm text-white/50">
                  OVR {showRatings ? selectedPlayer.overall : '??'} ·{' '}
                  {selectedPlayer.positions.join('/')}
                </p>
              </div>
              <AttributePicker
                attributes={selectedPlayer.attributes}
                lockedAttributes={lockedAttributes}
                selected={state.selectedAttribute}
                hidden={!showRatings}
                onSelect={onSelectAttribute}
              />
              <GameButton
                className="hidden w-full lg:inline-flex"
                disabled={!state.selectedAttribute}
                onClick={onLockPick}
              >
                {m['game.build.lock_pick']()}
              </GameButton>
            </div>
          )}
        </GamePanel>

        {/* Right: Locked progress only */}
        <GamePanel title={m['game.build.progress_panel']()} className="hidden lg:block">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-white/50">{m['game.build.mode']()}</span>
            <span className="font-bold uppercase">{state.mode}</span>
          </div>
          {showPosition && state.position && (
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-white/50">{m['game.build.position']()}</span>
              <span className="font-bold">{state.position}</span>
            </div>
          )}
          <AttributeGrid slots={state.buildSlots} showValues={showRatings} lockedOnly />
        </GamePanel>
      </div>

      {sticky && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-neutral-950/95 p-4 backdrop-blur lg:hidden">
          <GameButton className="w-full" onClick={sticky.action} disabled={sticky.disabled}>
            {sticky.label}
          </GameButton>
        </div>
      )}
    </section>
  );
}

function RosterPanel({
  team,
  state,
  showRatings,
  lockedAttributes,
  onSelectPlayer,
  onSelectAttribute,
}: {
  team: TeamSeason;
  state: GameState;
  showRatings: boolean;
  lockedAttributes: AttributeKey[];
  onSelectPlayer: (id: string) => void;
  onSelectAttribute: (attr: AttributeKey) => void;
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-xl border border-orange-300/30 bg-orange-300/6 p-4">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-orange-300 px-2 py-1 text-xs font-black text-neutral-950">
            {team.abbr}
          </span>
          <div>
            <p className="font-bold">{team.name}</p>
            <p className="text-xs text-white/50">{team.tagline}</p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-white/10 bg-white/3 px-3 py-2 text-[10px] font-bold tracking-wider text-white/40 uppercase">
          <span>{m['game.build.col_player']()}</span>
          <span>{m['game.build.col_status']()}</span>
        </div>
        {team.roster.map((player) => {
          const used = isPlayerNameUsed(state, player.name);
          const selected = state.selectedPlayerId === player.id;
          return (
            <div key={player.id} className="border-b border-white/5 last:border-0">
              <button
                type="button"
                disabled={used}
                onClick={() => onSelectPlayer(player.id)}
                className={cn(
                  'grid w-full grid-cols-[1fr_auto] gap-2 px-3 py-3 text-left text-sm transition',
                  selected && 'bg-orange-300/10',
                  used ? 'cursor-not-allowed opacity-30' : 'hover:bg-white/4'
                )}
              >
                <div>
                  <span className="font-semibold">{player.name}</span>
                  <span className="ml-2 text-xs text-white/40">
                    {player.positions.join('/')}
                  </span>
                </div>
                <span
                  className={cn(
                    'text-xs font-bold uppercase',
                    used ? 'text-white/30' : selected ? 'text-orange-300' : 'text-emerald-400'
                  )}
                >
                  {used
                    ? m['game.build.used']()
                    : selected
                      ? m['game.build.selected']()
                      : m['game.build.available']()}
                </span>
              </button>
              {selected && (
                <div className="border-t border-white/5 px-3 py-2 lg:hidden">
                  <AttributePicker
                    attributes={player.attributes}
                    lockedAttributes={lockedAttributes}
                    selected={state.selectedAttribute}
                    hidden={!showRatings}
                    onSelect={onSelectAttribute}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
