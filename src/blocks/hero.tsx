import { lazy, Suspense } from 'react';

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

export function Hero() {
  return (
    <section id="play" className="scroll-mt-16">
      <Suspense fallback={<GameFallback />}>
        <HooperGame embedded />
      </Suspense>
    </section>
  );
}
