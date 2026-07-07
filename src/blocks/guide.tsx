import { m } from '@/paraglide/messages.js';

const SECTIONS = [
  ['landing.guide.attributes_title', 'landing.guide.attributes_body'],
  ['landing.guide.modes_title', 'landing.guide.modes_body'],
  ['landing.guide.season_title', 'landing.guide.season_body'],
  ['landing.guide.beginner_title', 'landing.guide.beginner_body'],
  ['landing.guide.search_title', 'landing.guide.search_body'],
] as const;

export function Guide() {
  return (
    <section id="guide" className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.guide.title']()}
          </h2>
          <p className="text-muted-foreground mt-6 text-base leading-8 sm:text-lg">
            {m['landing.guide.intro']()}
          </p>
        </div>

        <div className="space-y-10">
          {SECTIONS.map(([titleKey, bodyKey]) => (
            <article key={titleKey} className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight">
                {m[titleKey]()}
              </h3>
              <p className="text-muted-foreground text-base leading-8">
                {m[bodyKey]()}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
