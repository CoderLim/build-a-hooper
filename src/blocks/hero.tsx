import { lazy, Suspense, useEffect, useState } from 'react';

import { m } from '@/paraglide/messages.js';

const HooperGame = lazy(() =>
  import('@/components/hooper-game/hooper-game').then((mod) => ({
    default: mod.HooperGame,
  }))
);

const HERO_BG_DESKTOP = '/imgs/hero-bg.webp';
const HERO_BG_MOBILE = '/imgs/hero-bg-mobile.webp';

function GameFallback({ interactive = false }: { interactive?: boolean }) {
  return (
    <div
      className="relative isolate min-h-[100svh] overflow-hidden bg-neutral-950"
      aria-hidden={!interactive}
    >
      <picture className="pointer-events-none absolute inset-0 -z-20 size-full">
        <source media="(max-width: 768px)" srcSet={HERO_BG_MOBILE} />
        <img
          src={HERO_BG_DESKTOP}
          alt=""
          width={1920}
          height={1081}
          fetchPriority="high"
          decoding="sync"
          className="size-full scale-110 object-cover object-center opacity-50 blur-sm"
        />
      </picture>
      <div className="absolute inset-0 -z-10 bg-neutral-950/75" />
      {interactive ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-24 text-center text-sm text-white/50">
          {m['landing.hero.tap_to_load']()}
        </p>
      ) : null}
    </div>
  );
}

/** Defer the game bundle until the user interacts so LCP stays on the hero image. */
function useDeferredGameLoad() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (!cancelled) setReady(true);
    };

    const onInteraction = () => {
      start();
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };

    window.addEventListener('pointerdown', onInteraction, { passive: true });
    window.addEventListener('keydown', onInteraction);

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };
  }, []);

  return ready;
}

export function Hero() {
  const loadGame = useDeferredGameLoad();

  return (
    <section id="play" className="scroll-mt-16">
      {loadGame ? (
        <Suspense fallback={<GameFallback />}>
          <HooperGame embedded />
        </Suspense>
      ) : (
        <GameFallback interactive />
      )}
    </section>
  );
}
