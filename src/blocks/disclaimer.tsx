import { AlertCircle } from 'lucide-react';

import { m } from '@/paraglide/messages.js';

export function Disclaimer() {
  return (
    <section className="px-4 pb-20 sm:pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="border-border bg-card rounded-3xl border p-6 sm:p-8">
          <div className="bg-primary/15 text-primary mb-4 inline-flex size-11 items-center justify-center rounded-2xl">
            <AlertCircle className="size-5" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {m['landing.disclaimer.title']()}
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-8">
            {m['landing.disclaimer.body']()}
          </p>
        </div>
      </div>
    </section>
  );
}
