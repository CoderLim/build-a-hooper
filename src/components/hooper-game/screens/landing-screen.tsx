import { GameButton, GameEyebrow, GameTitle } from '../game-ui';
import { m } from '@/paraglide/messages.js';

interface LandingScreenProps {
  onStart: () => void;
}

const STEPS = [
  { num: '1', titleKey: 'game.landing.step1_title' as const, descKey: 'game.landing.step1_desc' as const },
  { num: '2', titleKey: 'game.landing.step2_title' as const, descKey: 'game.landing.step2_desc' as const },
  { num: '3', titleKey: 'game.landing.step3_title' as const, descKey: 'game.landing.step3_desc' as const },
];

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center text-center">
      <GameEyebrow>{m['game.landing.eyebrow']()}</GameEyebrow>
      <GameTitle className="mt-4 max-w-3xl">{m['game.landing.title']()}</GameTitle>
      <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
        {m['game.landing.subtitle']()}
      </p>
      <div className="mt-10">
        <GameButton onClick={onStart}>{m['game.landing.choose_mode']()}</GameButton>
      </div>
      <div className="mt-12 grid w-full max-w-lg grid-cols-3 gap-3">
        {[
          ['13', m['game.landing.stat_attributes']()],
          ['3', m['game.landing.stat_modes']()],
          ['82', m['game.landing.stat_games']()],
        ].map(([value, label]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-white/10 bg-white/3 px-4 py-4"
          >
            <div className="text-2xl font-black text-orange-300">{value}</div>
            <div className="mt-1 text-xs tracking-wider text-white/50 uppercase">
              {label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 grid w-full max-w-2xl gap-4 text-left sm:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="rounded-2xl border border-white/10 bg-white/3 p-4"
          >
            <span className="text-xs font-bold text-orange-300">{step.num}</span>
            <p className="mt-1 font-bold">{m[step.titleKey]()}</p>
            <p className="mt-1 text-xs leading-5 text-white/50">
              {m[step.descKey]()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
