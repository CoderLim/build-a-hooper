import { useState } from 'react';

import { AttributeGrid } from '../attribute-grid';
import {
  GameButton,
  GameCard,
  GameEyebrow,
  GamePanel,
  GameTitle,
  ProgressPill,
} from '../game-ui';
import type { BuildSlot, GameMode } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

const MODES: {
  id: GameMode;
  titleKey: 'game.mode.classic' | 'game.mode.blind' | 'game.mode.chaos';
  descKey: 'game.mode.classic_desc' | 'game.mode.blind_desc' | 'game.mode.chaos_desc';
  tagKey: 'game.mode.classic_tag' | 'game.mode.blind_tag' | 'game.mode.chaos_tag';
}[] = [
  { id: 'classic', titleKey: 'game.mode.classic', descKey: 'game.mode.classic_desc', tagKey: 'game.mode.classic_tag' },
  { id: 'blind', titleKey: 'game.mode.blind', descKey: 'game.mode.blind_desc', tagKey: 'game.mode.blind_tag' },
  { id: 'chaos', titleKey: 'game.mode.chaos', descKey: 'game.mode.chaos_desc', tagKey: 'game.mode.chaos_tag' },
];

interface ModeSelectScreenProps {
  mode: GameMode | null;
  buildSlots: BuildSlot[];
  progress: number;
  onSelectMode: (mode: GameMode) => void;
  onConfirm: () => void;
}

export function ModeSelectScreen({
  mode,
  buildSlots,
  progress,
  onSelectMode,
  onConfirm,
}: ModeSelectScreenProps) {
  const [showAttributes, setShowAttributes] = useState(false);

  return (
    <section className="flex flex-1 flex-col gap-8">
      <div>
        <GameEyebrow>{m['game.mode.eyebrow']()}</GameEyebrow>
        <GameTitle className="mt-3">{m['game.mode.title']()}</GameTitle>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
          {m['game.mode.subtitle']()}
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {MODES.map((item) => (
          <GameCard
            key={item.id}
            active={mode === item.id}
            onClick={() => onSelectMode(item.id)}
          >
            <p className="text-[10px] font-bold tracking-[0.2em] text-orange-300/80 uppercase">
              {m[item.tagKey]()}
            </p>
            <h3 className="mt-2 text-lg font-black uppercase">{m[item.titleKey]()}</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">{m[item.descKey]()}</p>
          </GameCard>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <GamePanel title={m['game.mode.attributes_title']()}>
          <button
            type="button"
            onClick={() => setShowAttributes((v) => !v)}
            className="mb-3 text-xs font-bold text-orange-300 hover:underline"
          >
            {showAttributes
              ? m['game.mode.hide_attributes']()
              : m['game.mode.show_attributes']()}
          </button>
          {showAttributes && (
            <AttributeGrid slots={buildSlots} showValues={false} compact />
          )}
        </GamePanel>
        <GamePanel title={m['game.mode.status_title']()} className="lg:sticky lg:top-4 lg:self-start">
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-white/40 uppercase">{m['game.mode.status_mode']()}</p>
              <p className="font-bold">
                {mode ? m[`game.mode.${mode}` as keyof typeof m]() : m['game.mode.not_selected']()}
              </p>
            </div>
            <ProgressPill current={progress} total={13} label={m['game.build.progress']()} />
            <GameButton disabled={!mode} onClick={onConfirm} className="w-full">
              {m['game.mode.next']()}
            </GameButton>
            <p className="text-xs text-white/40">
              {mode === 'classic'
                ? m['game.mode.classic_hint']()
                : mode === 'blind'
                  ? m['game.mode.blind_hint']()
                  : mode === 'chaos'
                    ? m['game.mode.chaos_hint']()
                    : m['game.mode.select_hint']()}
            </p>
          </div>
        </GamePanel>
      </div>
    </section>
  );
}
