import { lazy, Suspense, useEffect, useState } from 'react';

const HooperGame = lazy(() =>
  import('@/components/hooper-game/hooper-game').then((mod) => ({
    default: mod.HooperGame,
  }))
);

function GameFallback() {
  return (
    <div
      className="relative isolate min-h-[100svh] overflow-hidden bg-neutral-950"
      aria-hidden
    >
      <img
        src="/imgs/hero-bg.webp"
        alt=""
        width={1920}
        height={1081}
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-20 size-full scale-110 object-cover object-center opacity-50 blur-sm"
      />
      <div className="absolute inset-0 -z-10 bg-neutral-950/75" />
    </div>
  );
}

/** Defer the game bundle until idle or first interaction so LCP stays on the hero image. */
function useDeferredGameLoad() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

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

    let idleId: number;
    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(start, { timeout: 4000 });
    } else {
      idleId = window.setTimeout(start, 4000) as unknown as number;
    }

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
      if ('requestIdleCallback' in window) {
        cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
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
        <GameFallback />
      )}
    </section>
  );
}
