import { useEffect, useRef, useState } from 'react';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { apiPost } from '@/lib/api-client';
import { getOverallRating } from '@/lib/hooper-game/engine';
import type {
  BuildSlot,
  GameMode,
  Position,
  SeasonStats,
  TeamSeason,
} from '@/lib/hooper-game/types';
import {
  buildRunFingerprint,
  buildSubmitRunInput,
} from '@/lib/hooper/build-run-payload';
import { m } from '@/paraglide/messages.js';

import { AttributeGrid } from '../attribute-grid';
import { GameButton, GameEyebrow, GameTitle } from '../game-ui';
import { ShareCardActions } from '../share-card-actions';
import { ShareCardPreview } from '../share-card-preview';

interface MyCardScreenProps {
  mode: GameMode | null;
  buildSlots: BuildSlot[];
  position: Position | null;
  showPosition: boolean;
  careerTeam: TeamSeason | null;
  seasonStats: SeasonStats;
  onPlayAgain: () => void;
}

type SaveState = 'idle' | 'pending' | 'saved' | 'error';

export function MyCardScreen({
  mode,
  buildSlots,
  position,
  showPosition,
  careerTeam,
  seasonStats,
  onPlayAgain,
}: MyCardScreenProps) {
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const submittedRef = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const overall = getOverallRating(buildSlots);

  useEffect(() => {
    if (!session?.user || !mode || submittedRef.current) return;

    const payload = buildSubmitRunInput({
      mode,
      position,
      careerTeam,
      buildSlots,
      seasonStats,
    });
    const fingerprint = buildRunFingerprint(payload);
    const storageKey = `hooper-run-submitted:${session.user.id}:${fingerprint}`;
    if (sessionStorage.getItem(storageKey)) {
      setSaveState('saved');
      submittedRef.current = true;
      return;
    }

    submittedRef.current = true;
    setSaveState('pending');

    apiPost('/api/hooper/runs', payload)
      .then(() => {
        sessionStorage.setItem(storageKey, '1');
        setSaveState('saved');
      })
      .catch(() => {
        submittedRef.current = false;
        setSaveState('error');
      });
  }, [session?.user, mode, position, careerTeam, buildSlots, seasonStats]);

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
            <p className="text-xs text-white/40 uppercase">
              {m['game.card.record']()}
            </p>
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
              <span className="font-semibold">
                {seasonStats.awards.join(', ')}
              </span>
            </p>
          )}
          {seasonStats.fmvp && (
            <p className="font-bold text-orange-300">{m['game.card.fmvp']()}</p>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        {session?.user ? (
          <p className="mb-4 text-center text-sm text-white/60">
            {saveState === 'pending' && m['game.card.save_run_pending']()}
            {saveState === 'saved' && m['game.card.save_run']()}
            {saveState === 'error' && m['game.card.save_run_error']()}
          </p>
        ) : (
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/3 px-4 py-4 text-center">
            <p className="text-sm text-white/60">
              {m['game.card.login_to_save']()}
            </p>
            <Link
              href="/sign-in?callbackUrl=/game"
              className="mt-3 inline-flex rounded-full bg-orange-300 px-5 py-2 text-xs font-black tracking-wide text-neutral-950 uppercase"
            >
              {m['game.card.login']()}
            </Link>
          </div>
        )}
        <AttributeGrid slots={buildSlots} compact />
      </div>

      <ShareCardActions
        previewRef={previewRef}
        mode={mode}
        position={position}
        showPosition={showPosition}
        careerTeam={careerTeam}
        seasonStats={seasonStats}
        overall={overall}
      />

      <div className="flex justify-center">
        <GameButton onClick={onPlayAgain}>
          {m['game.card.play_again']()}
        </GameButton>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 -left-[10000px]"
      >
        <ShareCardPreview
          ref={previewRef}
          buildSlots={buildSlots}
          position={position}
          showPosition={showPosition}
          careerTeam={careerTeam}
          seasonStats={seasonStats}
          overall={overall}
        />
      </div>
    </section>
  );
}
