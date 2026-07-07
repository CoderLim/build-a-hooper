import {
  GameButton,
  GameEyebrow,
  GamePanel,
  GameTitle,
} from '../game-ui';
import type { SeasonState } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';
import { cn } from '@/lib/utils';

interface PlayoffsScreenProps {
  seasonState: SeasonState;
  onSimulateGame: () => void;
  onFinish: () => void;
}

function roundLabel(round: string): string {
  const key = `game.playoffs.${round}` as keyof typeof m;
  const fn = m[key];
  return typeof fn === 'function' ? (fn as () => string)() : round;
}

export function PlayoffsScreen({
  seasonState,
  onSimulateGame,
  onFinish,
}: PlayoffsScreenProps) {
  const current = seasonState.playoffSeries[seasonState.playoffSeries.length - 1];
  const seasonDone = seasonState.seasonComplete;

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div>
        <GameEyebrow>{m['game.playoffs.eyebrow']()}</GameEyebrow>
        <GameTitle className="mt-2">{m['game.playoffs.title']()}</GameTitle>
        <p className="mt-2 text-sm text-white/55">{m['game.playoffs.subtitle']()}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {seasonState.playoffSeries.map((series, i) => (
          <GamePanel key={i}>
            <p className="text-[10px] font-bold tracking-wider text-orange-300 uppercase">
              {roundLabel(series.round)}
            </p>
            <p className="mt-1 font-bold">vs {series.opponentAbbr}</p>
            <p className="text-2xl font-black">
              {series.wins}-{series.losses}
            </p>
            {series.completed && (
              <p
                className={cn(
                  'mt-1 text-xs font-bold uppercase',
                  series.won ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                {series.won ? m['game.playoffs.won']() : m['game.playoffs.lost']()}
              </p>
            )}
          </GamePanel>
        ))}
      </div>

      {current && !current.completed && (
        <GamePanel title={m['game.playoffs.current_series']()}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold">{roundLabel(current.round)}</p>
              <p className="text-white/50">
                vs {current.opponent} ({current.opponentAbbr})
              </p>
              <p className="mt-2 text-3xl font-black">
                {current.wins} - {current.losses}
              </p>
              <p className="text-xs text-white/40">{m['game.playoffs.best_of_7']()}</p>
            </div>
            <GameButton onClick={onSimulateGame}>
              {m['game.playoffs.simulate_game']()}
            </GameButton>
          </div>
        </GamePanel>
      )}

      {seasonDone && (
        <div className="flex justify-center">
          <GameButton onClick={onFinish}>{m['game.playoffs.view_card']()}</GameButton>
        </div>
      )}
    </section>
  );
}
