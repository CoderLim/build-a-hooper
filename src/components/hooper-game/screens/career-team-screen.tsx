import { SpinAnimation } from '../spin-animation';
import { GameButton, GameEyebrow, GameTitle } from '../game-ui';
import { getCareerSpinAbbrs } from '@/lib/hooper-game/season-engine';
import type { CareerTeamPhase, TeamSeason } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

interface CareerTeamScreenProps {
  phase: CareerTeamPhase;
  careerTeam: TeamSeason | null;
  spinDisplayAbbr: string | null;
  onStartSpin: () => void;
  onCompleteSpin: () => void;
  onConfirm: () => void;
}

export function CareerTeamScreen({
  phase,
  careerTeam,
  spinDisplayAbbr,
  onStartSpin,
  onCompleteSpin,
  onConfirm,
}: CareerTeamScreenProps) {
  const abbrs = getCareerSpinAbbrs();

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <GameEyebrow>{m['game.career.eyebrow']()}</GameEyebrow>
      <GameTitle>{m['game.career.title']()}</GameTitle>
      <p className="max-w-lg text-sm text-white/55">{m['game.career.subtitle']()}</p>

      {phase === 'idle' && (
        <>
          <p className="text-sm text-white/45">{m['game.career.spin_prompt']()}</p>
          <GameButton onClick={onStartSpin}>{m['game.career.spin_team']()}</GameButton>
        </>
      )}

      {phase === 'spinning' && (
        <SpinAnimation
          abbrs={abbrs}
          finalAbbr={careerTeam?.abbr ?? spinDisplayAbbr}
          spinning
          onComplete={onCompleteSpin}
        />
      )}

      {phase === 'locked' && careerTeam && (
        <>
          <div className="rounded-3xl border border-orange-300/40 bg-orange-300/10 px-12 py-10">
            <span className="rounded-lg bg-orange-300 px-3 py-1 text-sm font-black text-neutral-950">
              {careerTeam.abbr}
            </span>
            <p className="mt-4 text-2xl font-black">{careerTeam.name}</p>
            <p className="mt-2 text-sm text-white/50">{careerTeam.tagline}</p>
          </div>
          <GameButton onClick={onConfirm}>{m['game.career.start_season']()}</GameButton>
        </>
      )}
    </section>
  );
}
