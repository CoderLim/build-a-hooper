import { GameButton, GameEyebrow, GamePanel, GameTitle } from '../game-ui';
import type { GameCastState, SeasonState } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

interface GameCastScreenProps {
  gameCast: GameCastState;
  seasonState: SeasonState;
  onAdvance: () => void;
  onSkip: () => void;
}

export function GameCastScreen({
  gameCast,
  seasonState,
  onAdvance,
  onSkip,
}: GameCastScreenProps) {
  const game = seasonState.games[gameCast.gameIndex];

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <GameEyebrow>{m['game.gamecast.eyebrow']()}</GameEyebrow>
          <GameTitle className="mt-2 text-2xl">
            {m['game.gamecast.title']()}
          </GameTitle>
          {game && (
            <p className="mt-1 text-sm text-white/50">
              G{game.gameNumber} · vs {game.opponentAbbr}
            </p>
          )}
        </div>
        <div className="text-center">
          <p className="text-4xl font-black tracking-wider">
            <span className="text-orange-300">{gameCast.homeScore}</span>
            <span className="mx-2 text-white/30">-</span>
            <span className="text-white">{gameCast.awayScore}</span>
          </p>
          <p className="text-xs text-white/40 uppercase">
            {gameCast.complete ? m['game.gamecast.final']() : `Q${gameCast.quarter}`}
          </p>
        </div>
      </div>

      <GamePanel title={m['game.gamecast.play_by_play']()}>
        <ul className="max-h-64 space-y-2 overflow-y-auto">
          {gameCast.plays.map((play, i) => (
            <li
              key={i}
              className="rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-sm text-white/70"
            >
              {play}
            </li>
          ))}
        </ul>
      </GamePanel>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          [gameCast.playerStats.pts, 'PTS'],
          [gameCast.playerStats.ast, 'AST'],
          [gameCast.playerStats.reb, 'REB'],
        ].map(([val, label]) => (
          <div
            key={String(label)}
            className="rounded-xl border border-white/10 bg-black/20 py-3"
          >
            <p className="text-xl font-black">{val}</p>
            <p className="text-[10px] text-white/40">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        {!gameCast.complete && (
          <GameButton variant="secondary" onClick={onAdvance}>
            {m['game.gamecast.next_quarter']()}
          </GameButton>
        )}
        <GameButton onClick={onSkip}>
          {gameCast.complete
            ? m['game.gamecast.continue']()
            : m['game.gamecast.skip']()}
        </GameButton>
      </div>
    </section>
  );
}
