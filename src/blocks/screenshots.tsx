import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';

const SHOTS = [
  { key: 'modes', src: '/imgs/screenshots/mode-select.png' },
  { key: 'position', src: '/imgs/screenshots/position-select.png' },
  { key: 'build', src: '/imgs/screenshots/draft-spin.png' },
] as const;

export function Screenshots() {
  return (
    <section id="screenshots" className="bg-muted/30 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.screenshots.title']()}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-8 sm:text-lg">
            {m['landing.screenshots.description']()}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {SHOTS.map(({ key, src }) => (
            <figure
              key={key}
              className="border-border bg-background overflow-hidden rounded-3xl border shadow-sm"
            >
              <div className="bg-muted/40 aspect-[4/3] overflow-hidden">
                <img
                  src={src}
                  alt={tDynamic(`landing.screenshots.${key}.alt`)}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <figcaption className="space-y-1 p-5">
                <h3 className="font-semibold">
                  {tDynamic(`landing.screenshots.${key}.title`)}
                </h3>
                <p className="text-muted-foreground text-sm leading-7">
                  {tDynamic(`landing.screenshots.${key}.caption`)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
