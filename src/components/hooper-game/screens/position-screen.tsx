import type { Position } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

import {
  GameButton,
  GameCard,
  GameEyebrow,
  GamePanel,
  GameTitle,
} from '../game-ui';

const POSITIONS: { id: Position; labelKey: string; nameKey: keyof typeof m }[] =
  [
    { id: 'PG', labelKey: 'PG', nameKey: 'game.position.pg' },
    { id: 'SG', labelKey: 'SG', nameKey: 'game.position.sg' },
    { id: 'SF', labelKey: 'SF', nameKey: 'game.position.sf' },
    { id: 'PF', labelKey: 'PF', nameKey: 'game.position.pf' },
    { id: 'C', labelKey: 'C', nameKey: 'game.position.c' },
  ];

interface PositionScreenProps {
  position: Position | null;
  onSelect: (position: Position) => void;
  onConfirm: () => void;
}

export function PositionSelectScreen({
  position,
  onSelect,
  onConfirm,
}: PositionScreenProps) {
  return (
    <section className="flex flex-1 flex-col gap-8 pb-28 lg:pb-0">
      <div>
        <GameEyebrow>{m['game.position.classic_eyebrow']()}</GameEyebrow>
        <GameTitle className="mt-3">{m['game.position.title']()}</GameTitle>
        <p className="mt-3 text-sm text-white/55">
          {m['game.position.subtitle']()}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {POSITIONS.map((pos) => (
          <GameCard
            key={pos.id}
            active={position === pos.id}
            onClick={() => onSelect(pos.id)}
            className="text-center"
          >
            <div className="text-2xl font-black text-orange-300">
              {pos.labelKey}
            </div>
            <div className="mt-1 text-xs text-white/50">{m[pos.nameKey]()}</div>
          </GameCard>
        ))}
      </div>
      <div className="hidden flex-wrap items-center justify-between gap-4 lg:flex">
        <GamePanel className="min-w-[200px]">
          <p className="text-xs text-white/40 uppercase">
            {m['game.position.selected']()}
          </p>
          <p className="text-xl font-black">{position ?? '—'}</p>
        </GamePanel>
        <GameButton disabled={!position} onClick={onConfirm}>
          {m['game.position.start']()}
        </GameButton>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-neutral-950/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <GamePanel className="min-w-0 flex-1 px-4 py-3">
            <p className="text-[10px] text-white/40 uppercase">
              {m['game.position.selected']()}
            </p>
            <p className="text-lg font-black">{position ?? '—'}</p>
          </GamePanel>
          <GameButton
            disabled={!position}
            onClick={onConfirm}
            className="shrink-0 px-6 py-4 text-xs"
          >
            {m['game.position.start']()}
          </GameButton>
        </div>
      </div>
    </section>
  );
}

export function PositionRollScreen({
  position,
  onConfirm,
}: {
  position: Position;
  onConfirm: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center text-center">
      <GameEyebrow>{m['game.position.roll_eyebrow']()}</GameEyebrow>
      <GameTitle className="mt-4">{m['game.position.roll_title']()}</GameTitle>
      <div className="mt-8 rounded-3xl border border-orange-300/40 bg-orange-300/10 px-8 py-10 sm:px-16">
        <div className="text-6xl font-black text-orange-300">{position}</div>
        <p className="mt-2 text-sm text-white/60">
          {m[`game.position.${position.toLowerCase()}` as keyof typeof m]()}
        </p>
      </div>
      <GameButton className="mt-10" onClick={onConfirm}>
        {m['game.position.enter_build']()}
      </GameButton>
    </section>
  );
}
