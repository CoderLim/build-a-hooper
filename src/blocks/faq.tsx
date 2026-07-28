import { ChevronDownIcon } from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';

const FAQ_KEYS = [
  'what',
  'attributes',
  'beginners',
  'season',
  'official',
] as const;

export function FAQ() {
  return (
    <section id="faq" className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.faq.title']()}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-8">
            {m['landing.faq.description']()}
          </p>
        </div>
        <div className="w-full">
          {FAQ_KEYS.map((key) => (
            <details
              key={key}
              className="group border-border not-last:border-b"
            >
              <summary className="text-foreground flex cursor-pointer list-none items-start justify-between gap-4 py-6 text-left text-base font-medium">
                <span>{tDynamic(`landing.faq.${key}.question`)}</span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="text-muted-foreground pb-6 leading-8">
                {tDynamic(`landing.faq.${key}.answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
