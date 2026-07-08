import { AttributeGrid } from '../attribute-grid';
import { GameButton, GameEyebrow, GameTitle } from '../game-ui';
import type { BuildSlot, Position } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

interface RevealScreenProps {
  buildSlots: BuildSlot[];
  overall: number;
  position: Position | null;
  showPosition: boolean;
  onContinue: () => void;
}

export function RevealScreen({
  buildSlots,
  overall,
  position,
  showPosition,
  onContinue,
}: RevealScreenProps) {
  return (
    <section className="flex flex-1 flex-col items-center gap-8 py-8 text-center">
      <GameEyebrow>{m['game.reveal.eyebrow']()}</GameEyebrow>
      <GameTitle>{m['game.reveal.title']()}</GameTitle>
      {showPosition && position && (
        <p className="text-lg text-white/60">
          {m['game.reveal.position']({ position })}
        </p>
      )}
      <div className="w-full max-w-md rounded-3xl border border-orange-300/40 bg-linear-to-b from-orange-300/15 to-transparent p-8">
        <p className="text-[11px] font-bold tracking-[0.25em] text-orange-300 uppercase">
          {m['game.reveal.overall']()}
        </p>
        <p className="mt-2 text-7xl font-black text-white">{overall}</p>
      </div>
      <div className="w-full max-w-3xl">
        <AttributeGrid slots={buildSlots} />
      </div>
      <GameButton onClick={onContinue}>{m['game.reveal.continue']()}</GameButton>
    </section>
  );
}
