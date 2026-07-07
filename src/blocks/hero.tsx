import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { buttonVariants } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/dot-pattern';

const STATS = [
  'landing.hero.stat.attributes',
  'landing.hero.stat.modes',
  'landing.hero.stat.games',
] as const;

export function Hero() {
  return (
    <section
      id="play"
      className="relative isolate flex flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-16 sm:pt-28 sm:pb-24"
    >
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]',
          'text-foreground/10'
        )}
      />
      <div className="relative mx-auto max-w-3xl space-y-8 text-center">
        <p className="text-muted-foreground text-xs tracking-[0.28em] uppercase">
          {m['landing.hero.eyebrow']()}
        </p>
        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {m['landing.hero.headline']()}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-8 sm:text-lg">
          {m['landing.hero.subheadline']()}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/game"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'gap-2 rounded-full px-7'
            )}
          >
            {m['landing.hero.primary']()}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/#guide"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'rounded-full px-7'
            )}
          >
            {m['landing.hero.secondary']()}
          </Link>
        </div>
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-3 pt-2">
          {STATS.map((key) => (
            <div
              key={key}
              className="border-border bg-card/70 rounded-2xl border px-4 py-4 text-center"
            >
              <div className="text-foreground text-sm font-semibold sm:text-base">
                {m[key]()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
