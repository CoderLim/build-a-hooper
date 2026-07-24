import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';

const STEP_KEYS = ['step1', 'step2', 'step3'] as const;

export function HowItWorks() {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.how.title']()}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-8 sm:text-lg">
            {m['landing.how.description']()}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {STEP_KEYS.map((key) => (
            <article
              key={key}
              className="border-border bg-card rounded-3xl border p-6"
            >
              <h3 className="text-xl font-semibold">
                {tDynamic(`landing.how.${key}.title`)}
              </h3>
              <p className="text-muted-foreground mt-4 text-sm leading-7">
                {tDynamic(`landing.how.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
