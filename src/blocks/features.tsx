import {
  BarChart3,
  BrainCircuit,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';

const FEATURES: { key: string; icon: LucideIcon }[] = [
  { key: 'draft', icon: Sparkles },
  { key: 'build', icon: BrainCircuit },
  { key: 'modes', icon: BarChart3 },
  { key: 'season', icon: Shield },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.features.title']()}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-8 sm:text-lg">
            {m['landing.features.description']()}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="border-border bg-card rounded-3xl border p-6"
            >
              <div className="bg-primary text-primary-foreground mb-5 inline-flex size-11 items-center justify-center rounded-2xl">
                <Icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">
                {tDynamic(`landing.features.${key}.title`)}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-7">
                {tDynamic(`landing.features.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
