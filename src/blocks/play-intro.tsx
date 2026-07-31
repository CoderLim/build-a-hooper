import { m } from '@/paraglide/messages.js';

const STATS = [
  'landing.hero.stat.attributes',
  'landing.hero.stat.modes',
  'landing.hero.stat.games',
] as const;

export function PlayIntro() {
  return (
    <section
      aria-labelledby="play-intro-title"
      className="border-border/60 bg-background border-y px-4 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-primary/90 text-xs font-bold tracking-[0.28em] uppercase">
          {m['landing.hero.eyebrow']()}
        </p>
        <h1
          id="play-intro-title"
          className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl"
        >
          {m['landing.hero.headline']()}
        </h1>
        <p className="text-muted-foreground mx-auto mt-6 max-w-3xl text-base leading-8 sm:text-lg">
          {m['landing.hero.subheadline']()}
        </p>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
          {STATS.map((key) => (
            <div
              key={key}
              className="border-border/70 bg-muted/30 rounded-2xl border px-4 py-4 text-center"
            >
              <div className="text-primary text-sm font-semibold sm:text-base">
                {m[key]()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
