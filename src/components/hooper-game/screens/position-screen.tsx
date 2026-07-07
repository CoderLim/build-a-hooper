import {
  GameButton,
  GameCard,
  GameEyebrow,
  GamePanel,
  GameTitle,
} from '../game-ui';
import type { Position } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

const POSITIONS: { id: Position; labelKey: string; nameKey: keyof typeof m }[] = [
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
    <section className="flex flex-1 flex-col gap-8">
      <div>
        <GameEyebrow>{m['game.position.classic_eyebrow']()}</GameEyebrow>
        <GameTitle className="mt-3">{m['game.position.title']()}</GameTitle>
        <p className="mt-3 text-sm text-white/55">{m['game.position.subtitle']()}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {POSITIONS.map((pos) => (
          <GameCard
            key={pos.id}
            active={position === pos.id}
            onClick={() => onSelect(pos.id)}
            className="text-center"
          >
            <div className="text-2xl font-black text-orange-300">{pos.labelKey}</div>
            <div className="mt-1 text-xs text-white/50">{m[pos.nameKey]()}</div>
          </GameCard>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <GamePanel className="min-w-[200px]">
          <p className="text-xs text-white/40 uppercase">{m['game.position.selected']()}</p>
          <p className="text-xl font-black">{position ?? '—'}</p>
        </GamePanel>
        <GameButton disabled={!position} onClick={onConfirm}>
          {m['game.position.start']()}
        </GameButton>
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
      <div className="mt-8 rounded-3xl border border-orange-300/40 bg-orange-300/10 px-16 py-10">
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
