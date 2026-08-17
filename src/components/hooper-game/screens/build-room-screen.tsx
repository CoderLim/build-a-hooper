import { TEAM_SEASONS } from '@/lib/hooper-game/data';
import { isPlayerNameUsed } from '@/lib/hooper-game/engine';
import type {
  AttributeKey,
  GameState,
  LockedPick,
  RosterPlayer,
  TeamSeason,
} from '@/lib/hooper-game/types';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';

import { AttributePicker } from '../attribute-grid';
import { BuildProgressCard, DraftSimulateButton } from '../build-progress-card';
import {
  GameButton,
  GameEyebrow,
  GamePanel,
  GameTitle,
  ProgressPill,
} from '../game-ui';
import { SpinAnimation } from '../spin-animation';

interface BuildRoomScreenProps {
  state: GameState;
  showRatings: boolean;
  progress: number;
  lockedAttributes: AttributeKey[];
  selectedPlayer: RosterPlayer | undefined;
  onStartSpin: () => void;
  onCompleteSpin: () => void;
  onReroll: () => void;
  onSelectPlayer: (id: string) => void;
  onSelectAttribute: (attr: AttributeKey) => void;
  onConfirmBuild: () => void;
}

export function BuildRoomScreen({
  state,
  showRatings,
  progress,
  lockedAttributes,
  selectedPlayer,
  onStartSpin,
  onCompleteSpin,
  onReroll,
  onSelectPlayer,
  onSelectAttribute,
  onConfirmBuild,
}: BuildRoomScreenProps) {
  const abbrs = TEAM_SEASONS.map((t) => t.abbr);
  const isDraftComplete = progress >= 13;

  return (
    <section className="flex flex-1 flex-col gap-6 pb-28 lg:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <GameEyebrow>{m['game.build.eyebrow']()}</GameEyebrow>
          <GameTitle className="mt-2 text-2xl sm:text-3xl">
            {m['game.build.title']()}
          </GameTitle>
          <p className="mt-2 text-sm text-white/55">
            {m['game.build.subtitle']()}
          </p>
        </div>
        <ProgressPill
          current={progress}
          total={13}
          label={m['game.build.progress']()}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <GamePanel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase">
                {m['game.build.team_spin']()}
              </p>
              <h3 className="mt-1 text-lg font-black uppercase">
                {isDraftComplete && m['game.build.draft_complete']()}
                {!isDraftComplete &&
                  state.buildPhase === 'idle' &&
                  m['game.build.ready']()}
                {!isDraftComplete &&
                  state.buildPhase === 'spinning' &&
                  m['game.build.spinning']()}
                {!isDraftComplete &&
                  state.buildPhase === 'roster' &&
                  m['game.build.choose_player']()}
              </h3>
            </div>
            {state.buildPhase === 'roster' && (
              <GameButton
                variant="secondary"
                disabled={state.rerollsLeft <= 0}
                onClick={onReroll}
                className="px-5 py-3 text-xs"
              >
                {m['game.build.reroll']({ count: state.rerollsLeft })}
              </GameButton>
            )}
          </div>

          {isDraftComplete && (
            <DraftRecapPanel
              picks={state.lockedPicks}
              showRatings={showRatings}
            />
          )}

          {!isDraftComplete && state.buildPhase === 'idle' && (
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center">
              <p className="text-sm text-white/50">
                {m['game.build.no_team']()}
              </p>
              <GameButton
                className="mt-6 w-full max-w-xs"
                onClick={onStartSpin}
              >
                {m['game.build.start_spin']()}
              </GameButton>
            </div>
          )}

          {!isDraftComplete && state.buildPhase === 'spinning' && (
            <SpinAnimation
              abbrs={abbrs}
              finalAbbr={state.spinDisplayAbbr}
              spinning
              onComplete={onCompleteSpin}
            />
          )}

          {!isDraftComplete &&
            state.buildPhase === 'roster' &&
            state.currentTeam && (
              <RosterPanel
                team={state.currentTeam}
                state={state}
                showRatings={showRatings}
                lockedAttributes={lockedAttributes}
                selectedPlayer={selectedPlayer}
                onSelectPlayer={onSelectPlayer}
                onSelectAttribute={onSelectAttribute}
              />
            )}
        </GamePanel>

        <GamePanel>
          <BuildProgressCard
            slots={state.buildSlots}
            showRatings={showRatings}
            onSimulate={onConfirmBuild}
            showSimulateButton
          />
        </GamePanel>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-neutral-950/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <DraftSimulateButton
          lockedCount={progress}
          disabled={!isDraftComplete}
          onClick={onConfirmBuild}
        />
      </div>
    </section>
  );
}

const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-fuchsia-500',
  'bg-lime-600',
  'bg-sky-500',
];

function playerInitials(name: string) {
  const parts = name.replace(/['']/g, '').split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function overallClass(overall: number, selected: boolean) {
  if (selected) return 'text-red-600';
  if (overall >= 90) return 'text-emerald-400';
  if (overall >= 80) return 'text-orange-300';
  if (overall >= 70) return 'text-yellow-400';
  return 'text-red-400';
}

function DraftRecapPanel({
  picks,
  showRatings,
}: {
  picks: LockedPick[];
  showRatings: boolean;
}) {
  return (
    <div className="mt-6 max-h-[min(52vh,28rem)] space-y-2 overflow-y-auto pr-1">
      {picks.map((pick) => (
        <div
          key={pick.round}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-3 py-2.5"
        >
          <span className="w-6 shrink-0 text-[11px] font-black text-white/35 tabular-nums">
            {pick.round}
          </span>
          <span className="w-9 shrink-0 text-[11px] font-black tracking-wide text-orange-300">
            {pick.attribute}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {pick.playerName}
          </span>
          <span className="hidden max-w-28 truncate text-xs text-white/40 sm:block">
            {pick.teamName}
          </span>
          <span className="w-8 shrink-0 text-right text-xs font-black text-orange-300 tabular-nums">
            {showRatings ? pick.overall : '??'}
          </span>
        </div>
      ))}
    </div>
  );
}

function RosterPanel({
  team,
  state,
  showRatings,
  lockedAttributes,
  selectedPlayer,
  onSelectPlayer,
  onSelectAttribute,
}: {
  team: TeamSeason;
  state: GameState;
  showRatings: boolean;
  lockedAttributes: AttributeKey[];
  selectedPlayer: RosterPlayer | undefined;
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

      <div className="flex flex-wrap gap-2">
        {team.roster.map((player) => {
          const used = isPlayerNameUsed(state, player.name);
          const selected = state.selectedPlayerId === player.id;
          const color = avatarColor(player.id);

          return (
            <button
              key={player.id}
              type="button"
              disabled={used}
              aria-pressed={selected}
              onClick={() => onSelectPlayer(player.id)}
              className={cn(
                'flex min-w-0 items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition',
                selected
                  ? 'bg-orange-300 text-neutral-950 shadow-[0_0_20px_rgba(253,186,116,0.28)]'
                  : 'border border-white/10 bg-white/4 text-white hover:border-orange-300/40',
                used && 'cursor-not-allowed opacity-30 hover:border-white/10'
              )}
            >
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-black text-white',
                  color
                )}
              >
                {playerInitials(player.name)}
              </span>
              <span
                className={cn(
                  'max-w-34 truncate text-sm font-semibold sm:max-w-44',
                  selected ? 'text-neutral-950' : 'text-white'
                )}
              >
                {player.name}
              </span>
              <span className="ml-1 flex items-baseline gap-1.5 pr-0.5 text-xs font-bold">
                {used ? (
                  <span className="tracking-wider uppercase">
                    {m['game.build.used']()}
                  </span>
                ) : (
                  <>
                    <span
                      className={
                        selected ? 'text-neutral-700' : 'text-white/45'
                      }
                    >
                      {player.positions[0]}
                    </span>
                    <span
                      className={cn(
                        'tabular-nums',
                        showRatings
                          ? overallClass(player.overall, selected)
                          : selected
                            ? 'text-neutral-500'
                            : 'text-white/30'
                      )}
                    >
                      {showRatings ? player.overall : '??'}
                    </span>
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {!selectedPlayer ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center">
          <p className="text-sm text-white/45">{m['game.build.no_player']()}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-orange-300/30 bg-neutral-950/40 p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'grid size-16 shrink-0 place-items-center rounded-2xl text-xl font-black text-white sm:size-18 sm:text-2xl',
                avatarColor(selectedPlayer.id)
              )}
            >
              {playerInitials(selectedPlayer.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xl font-black tracking-tight sm:text-2xl">
                {selectedPlayer.name}
              </p>
              <p className="mt-1 text-sm text-white/45">
                {selectedPlayer.positions.join('/')} / OVR{' '}
                {showRatings ? selectedPlayer.overall : '??'}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <AttributePicker
              attributes={selectedPlayer.attributes}
              lockedAttributes={lockedAttributes}
              selected={state.selectedAttribute}
              hidden={!showRatings}
              onSelect={onSelectAttribute}
            />
          </div>
        </div>
      )}
    </div>
  );
}
