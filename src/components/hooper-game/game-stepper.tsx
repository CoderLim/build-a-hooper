import type { GameStep } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';
import { cn } from '@/lib/utils';

const STEPS: { id: GameStep; labelKey: keyof typeof m }[] = [
  { id: 'setup', labelKey: 'game.stepper.setup' },
  { id: 'build', labelKey: 'game.stepper.build' },
  { id: 'reveal', labelKey: 'game.stepper.reveal' },
  { id: 'season', labelKey: 'game.stepper.season' },
  { id: 'card', labelKey: 'game.stepper.card' },
];

interface GameStepperProps {
  currentStep: GameStep;
  className?: string;
}

export function GameStepper({ currentStep, className }: GameStepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav
      aria-label="Game progress"
      className={cn('mb-8 flex items-center justify-center gap-1 sm:gap-2', className)}
    >
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.id} className="flex items-center gap-1 sm:gap-2">
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold tracking-wider uppercase sm:px-3 sm:text-xs',
                active && 'bg-orange-300/15 text-orange-300 ring-1 ring-orange-300/40',
                done && 'text-emerald-400',
                !active && !done && 'text-white/30'
              )}
            >
              <span
                className={cn(
                  'flex size-5 items-center justify-center rounded-full text-[10px]',
                  active && 'bg-orange-300 text-neutral-950',
                  done && 'bg-emerald-400/20 text-emerald-400',
                  !active && !done && 'bg-white/10 text-white/40'
                )}
              >
                {done ? '✓' : idx + 1}
              </span>
              <span className="hidden sm:inline">{m[step.labelKey]()}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-px w-4 sm:w-8',
                  done ? 'bg-emerald-400/40' : 'bg-white/10'
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
