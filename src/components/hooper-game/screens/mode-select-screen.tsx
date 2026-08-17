import { ChevronDownIcon } from 'lucide-react';

import type { GameMode } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

import { AttributeGlossary } from '../attribute-glossary';
import {
  GameButton,
  GameCard,
  GameEyebrow,
  GamePanel,
  ProgressPill,
} from '../game-ui';

const MODES: {
  id: GameMode;
  titleKey: 'game.mode.classic' | 'game.mode.blind' | 'game.mode.chaos';
  descKey:
    | 'game.mode.classic_desc'
    | 'game.mode.blind_desc'
    | 'game.mode.chaos_desc';
  tagKey:
    | 'game.mode.classic_tag'
    | 'game.mode.blind_tag'
    | 'game.mode.chaos_tag';
}[] = [
  {
    id: 'classic',
    titleKey: 'game.mode.classic',
    descKey: 'game.mode.classic_desc',
    tagKey: 'game.mode.classic_tag',
  },
  {
    id: 'blind',
    titleKey: 'game.mode.blind',
    descKey: 'game.mode.blind_desc',
    tagKey: 'game.mode.blind_tag',
  },
  {
    id: 'chaos',
    titleKey: 'game.mode.chaos',
    descKey: 'game.mode.chaos_desc',
    tagKey: 'game.mode.chaos_tag',
  },
];

interface ModeSelectScreenProps {
  mode: GameMode | null;
  progress: number;
  onSelectMode: (mode: GameMode) => void;
  onConfirm: () => void;
}

function modeHint(mode: GameMode | null) {
  if (mode === 'classic') return m['game.mode.classic_hint']();
  if (mode === 'blind') return m['game.mode.blind_hint']();
  if (mode === 'chaos') return m['game.mode.chaos_hint']();
  return m['game.mode.select_hint']();
}

function ConfirmControls({
  mode,
  progress,
  onConfirm,
}: Pick<ModeSelectScreenProps, 'mode' | 'progress' | 'onConfirm'>) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="text-white/40 uppercase">
          {m['game.mode.status_mode']()}
        </p>
        <p className="font-bold">
          {mode
            ? m[`game.mode.${mode}` as keyof typeof m]()
            : m['game.mode.not_selected']()}
        </p>
      </div>
      <ProgressPill
        current={progress}
        total={13}
        label={m['game.build.progress']()}
      />
      <GameButton disabled={!mode} onClick={onConfirm} className="w-full">
        {m['game.mode.next']()}
      </GameButton>
      <p className="text-xs text-white/40">{modeHint(mode)}</p>
    </div>
  );
}

export function ModeSelectScreen({
  mode,
  progress,
  onSelectMode,
  onConfirm,
}: ModeSelectScreenProps) {
  return (
    <section className="flex flex-1 flex-col gap-8 pb-28 lg:pb-0">
      <div>
        <GameEyebrow>{m['game.mode.eyebrow']()}</GameEyebrow>
        <div className="mt-3 text-3xl font-black tracking-tight uppercase sm:text-4xl lg:text-5xl">
          {m['game.mode.title']()}
        </div>
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
            <div className="mt-2 text-lg font-black uppercase">
              {m[item.titleKey]()}
            </div>
            <p className="mt-2 text-sm leading-6 text-white/55">
              {m[item.descKey]()}
            </p>
          </GameCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <GamePanel>
          <details className="group lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xl font-black tracking-tight text-white sm:text-2xl">
              {m['game.mode.attributes_title']()}
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 shrink-0 text-white/45 transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="mt-3">
              <p className="text-sm text-white/50">
                {m['game.mode.attributes_subtitle']()}
              </p>
              <AttributeGlossary className="mt-5" />
            </div>
          </details>
          <div className="hidden lg:block">
            <div className="text-xl font-black tracking-tight text-white sm:text-2xl">
              {m['game.mode.attributes_title']()}
            </div>
            <p className="mt-1.5 text-sm text-white/50">
              {m['game.mode.attributes_subtitle']()}
            </p>
            <AttributeGlossary className="mt-5" />
          </div>
        </GamePanel>
        <GamePanel
          title={m['game.mode.status_title']()}
          className="hidden lg:sticky lg:top-4 lg:block lg:self-start"
        >
          <ConfirmControls
            mode={mode}
            progress={progress}
            onConfirm={onConfirm}
          />
        </GamePanel>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-neutral-950/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <p className="mb-3 text-center text-xs text-white/45">
          {modeHint(mode)}
        </p>
        <GameButton disabled={!mode} onClick={onConfirm} className="w-full">
          {m['game.mode.next']()}
        </GameButton>
      </div>
    </section>
  );
}
