import { m } from '@/paraglide/messages.js';

/**
 * SSR-visible gameplay guide for /game.
 * Keeps AdSense content pages above thin-content thresholds.
 */
export function GameGuide() {
  return (
    <article className="border-t border-white/10 bg-black/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 text-left">
        <header>
          <p className="text-xs font-bold tracking-[0.2em] text-orange-300/80 uppercase">
            {m['game.guide.eyebrow']()}
          </p>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {m['game.guide.title']()}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
            {m['game.guide.intro']()}
          </p>
        </header>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white">
            {m['game.guide.modes_title']()}
          </h3>
          <p className="text-sm leading-7 text-white/60">
            {m['game.guide.modes_body']()}
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-white/60">
            <li>{m['game.guide.mode_classic']()}</li>
            <li>{m['game.guide.mode_blind']()}</li>
            <li>{m['game.guide.mode_chaos']()}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white">
            {m['game.guide.attrs_title']()}
          </h3>
          <p className="text-sm leading-7 text-white/60">
            {m['game.guide.attrs_body']()}
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-white/60">
            <li>{m['game.guide.attrs_scoring']()}</li>
            <li>{m['game.guide.attrs_creation']()}</li>
            <li>{m['game.guide.attrs_defense']()}</li>
            <li>{m['game.guide.attrs_physical']()}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white">
            {m['game.guide.tutorial_title']()}
          </h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-white/60">
            <li>{m['game.guide.tutorial_1']()}</li>
            <li>{m['game.guide.tutorial_2']()}</li>
            <li>{m['game.guide.tutorial_3']()}</li>
            <li>{m['game.guide.tutorial_4']()}</li>
            <li>{m['game.guide.tutorial_5']()}</li>
          </ol>
          <p className="text-sm leading-7 text-white/60">
            {m['game.guide.tutorial_outro']()}
          </p>
        </section>
      </div>
    </article>
  );
}
