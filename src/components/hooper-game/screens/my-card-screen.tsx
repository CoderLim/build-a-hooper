import { useState } from 'react';

import { AttributeGrid } from '../attribute-grid';
import { GameButton, GameEyebrow, GameTitle } from '../game-ui';
import { getOverallRating } from '@/lib/hooper-game/engine';
import type { BuildSlot, Position, SeasonStats, TeamSeason } from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

interface MyCardScreenProps {
  buildSlots: BuildSlot[];
  position: Position | null;
  showPosition: boolean;
  careerTeam: TeamSeason | null;
  seasonStats: SeasonStats;
  onPlayAgain: () => void;
}

function buildShareText(
  position: Position | null,
  showPosition: boolean,
  careerTeam: TeamSeason | null,
  seasonStats: SeasonStats,
  overall: number
): string {
  const pos = showPosition && position ? position : '??';
  return [
    `Build a Hooper — My Card`,
    `${careerTeam?.name ?? 'Free Agent'} · ${pos} · OVR ${overall}`,
    `Record: ${seasonStats.wins}-${seasonStats.losses}`,
    `Stats: ${seasonStats.ppg} PPG / ${seasonStats.apg} APG / ${seasonStats.rpg} RPG`,
    `Playoffs: ${seasonStats.playoffResult}`,
    seasonStats.awards.length > 0 ? `Awards: ${seasonStats.awards.join(', ')}` : '',
    seasonStats.fmvp ? 'Finals MVP' : '',
    `https://buildahooper.org/game`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function MyCardScreen({
  buildSlots,
  position,
  showPosition,
  careerTeam,
  seasonStats,
  onPlayAgain,
}: MyCardScreenProps) {
  const [copied, setCopied] = useState(false);
  const overall = getOverallRating(buildSlots);

  const handleShare = async () => {
    const text = buildShareText(position, showPosition, careerTeam, seasonStats, overall);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Build a Hooper Card', text });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex flex-1 flex-col gap-8 py-4">
      <div className="text-center">
        <GameEyebrow>{m['game.card.eyebrow']()}</GameEyebrow>
        <GameTitle className="mt-3">{m['game.card.title']()}</GameTitle>
      </div>

      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-orange-300/30 bg-linear-to-br from-orange-300/10 via-white/3 to-transparent p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest text-white/40 uppercase">
              {careerTeam?.name}
            </p>
            <p className="mt-1 text-4xl font-black">
              {showPosition && position ? position : '??'}
            </p>
            <p className="mt-1 text-orange-300">OVR {overall}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-emerald-400">
              {seasonStats.wins}-{seasonStats.losses}
            </p>
            <p className="text-xs text-white/40 uppercase">{m['game.card.record']()}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            [seasonStats.ppg, 'PPG'],
            [seasonStats.apg, 'APG'],
            [seasonStats.rpg, 'RPG'],
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

        <div className="mt-6 space-y-2 text-sm">
          <p>
            <span className="text-white/40">{m['game.card.playoffs']()}: </span>
            <span className="font-semibold">{seasonStats.playoffResult}</span>
          </p>
          {seasonStats.playoffPath.length > 0 && (
            <div>
              <p className="text-white/40">{m['game.card.playoff_path']()}:</p>
              <ul className="mt-1 space-y-1">
                {seasonStats.playoffPath.map((step, i) => (
                  <li key={i} className="text-xs text-white/60">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {seasonStats.awards.length > 0 && (
            <p>
              <span className="text-white/40">{m['game.card.awards']()}: </span>
              <span className="font-semibold">{seasonStats.awards.join(', ')}</span>
            </p>
          )}
          {seasonStats.fmvp && (
            <p className="font-bold text-orange-300">{m['game.card.fmvp']()}</p>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <AttributeGrid slots={buildSlots} compact />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <GameButton variant="secondary" onClick={handleShare}>
          {copied ? m['game.card.copied']() : m['game.card.share']()}
        </GameButton>
        <GameButton onClick={onPlayAgain}>{m['game.card.play_again']()}</GameButton>
      </div>
    </section>
  );
}
