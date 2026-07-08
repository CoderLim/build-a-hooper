import {
  GameButton,
  GameEyebrow,
  GamePanel,
  GameTitle,
} from '../game-ui';
import {
  estimatedWinChance,
  getLastFiveGames,
  getNextGame,
} from '@/lib/hooper-game/season-engine';
import type { BuildSlot, SeasonState, TeamSeason } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';
import { cn } from '@/lib/utils';

interface SeasonHubScreenProps {
  seasonState: SeasonState;
  careerTeam: TeamSeason | null;
  buildSlots: BuildSlot[];
  overall: number;
  onSimulateNext: () => void;
  onSimulateToEnd: () => void;
  onWatchGameCast: () => void;
  onStartPlayoffs: () => void;
}

export function SeasonHubScreen({
  seasonState,
  careerTeam,
  buildSlots,
  overall,
  onSimulateNext,
  onSimulateToEnd,
  onWatchGameCast,
  onStartPlayoffs,
}: SeasonHubScreenProps) {
  const nextGame = getNextGame(seasonState);
  const lastFive = getLastFiveGames(seasonState);
  const winChance = estimatedWinChance(buildSlots);
  const { wins, losses, rank } = seasonState.standings;
  const gamesLeft = 82 - seasonState.currentGameIndex;
  const seasonDone = seasonState.seasonComplete;

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div>
        <GameEyebrow>{m['game.season.eyebrow']()}</GameEyebrow>
        <GameTitle className="mt-2">{m['game.season.title']()}</GameTitle>
        <p className="mt-2 text-sm text-white/55">{m['game.season.subtitle']()}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          [`${wins}-${losses}`, m['game.season.record']()],
          [`#${rank}`, m['game.season.rank']()],
          [String(gamesLeft), m['game.season.remaining']()],
          [String(overall), 'OVR'],
        ].map(([val, label]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-white/10 bg-white/3 p-4 text-center"
          >
            <p className="text-xl font-black text-orange-300">{val}</p>
            <p className="mt-1 text-[10px] tracking-wider text-white/40 uppercase">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GamePanel title={m['game.season.next_game']()}>
          {nextGame && !seasonDone ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">
                    {m['game.season.game_n']({ n: String(nextGame.gameNumber) })}
                  </p>
                  <p className="text-lg font-bold">
                    vs {nextGame.opponentAbbr}
                  </p>
                  <p className="text-sm text-white/50">{nextGame.opponent}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-400">{winChance}%</p>
                  <p className="text-[10px] text-white/40 uppercase">
                    {m['game.season.win_chance']()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <GameButton onClick={onWatchGameCast} className="text-xs">
                  {m['game.season.watch_gamecast']()}
                </GameButton>
                <GameButton variant="secondary" onClick={onSimulateNext} className="text-xs">
                  {m['game.season.simulate_next']()}
                </GameButton>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-white/50">{m['game.season.regular_complete']()}</p>
              <GameButton onClick={onStartPlayoffs}>
                {m['game.season.enter_playoffs']()}
              </GameButton>
            </div>
          )}
        </GamePanel>

        <GamePanel title={m['game.season.last_five']()}>
          {lastFive.length === 0 ? (
            <p className="text-sm text-white/40">{m['game.season.no_games']()}</p>
          ) : (
            <ul className="space-y-2">
              {lastFive.map((g) => (
                <li
                  key={g.gameNumber}
                  className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm"
                >
                  <span className="text-white/50">G{g.gameNumber}</span>
                  <span>{g.opponentAbbr}</span>
                  <span
                    className={cn(
                      'font-bold',
                      g.result === 'W' ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {g.result}
                  </span>
                  {g.playerStats && (
                    <span className="text-xs text-white/40">
                      {g.playerStats.pts}/{g.playerStats.ast}/{g.playerStats.reb}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </GamePanel>
      </div>

      <GamePanel title={m['game.season.awards_title']()}>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(seasonState.awardRace).map(([award, score]) => (
            <div key={award}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-white/50">{award}</span>
                <span className="text-orange-300">{score}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-orange-300"
                  style={{ width: `${Math.min(100, score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GamePanel>

      {!seasonDone && (
        <div className="flex justify-center">
          <GameButton variant="secondary" onClick={onSimulateToEnd}>
            {m['game.season.simulate_all']()}
          </GameButton>
        </div>
      )}

      {careerTeam && (
        <p className="text-center text-xs text-white/30">
          {careerTeam.name} · {seasonState.currentGameIndex}/82
        </p>
      )}
    </section>
  );
}
