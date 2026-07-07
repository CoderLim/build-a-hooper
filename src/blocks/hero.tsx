import { ArrowRight, ExternalLink } from 'lucide-react';

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
      className="relative isolate overflow-hidden px-4 pt-20 pb-16 sm:pt-28 sm:pb-24"
    >
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]',
          'text-foreground/10'
        )}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_1.2fr] lg:items-center">
        <div className="space-y-7">
          <p className="text-muted-foreground text-xs tracking-[0.28em] uppercase">
            {m['landing.hero.eyebrow']()}
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {m['landing.hero.headline']()}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-8 sm:text-lg">
            {m['landing.hero.subheadline']()}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://build-a-hooper.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'gap-2 rounded-full px-7'
              )}
            >
              {m['landing.hero.primary']()}
              <ArrowRight className="size-4" />
            </a>
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
          <div className="grid grid-cols-3 gap-3 pt-2">
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

        <div className="space-y-3">
          <div className="border-border bg-card/80 overflow-hidden rounded-[28px] border shadow-2xl">
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-medium">
                {m['landing.hero.embed_title']()}
              </p>
              <a
                href="https://build-a-hooper.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
              >
                {m['landing.hero.embed_link']()}
                <ExternalLink className="size-4" />
              </a>
            </div>
            <div className="aspect-[16/11] min-h-[560px] w-full bg-black">
              <iframe
                src="https://build-a-hooper.pages.dev/"
                title={m['landing.hero.embed_title']()}
                className="h-full w-full"
                loading="lazy"
                allow="fullscreen"
              />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {m['landing.hero.embed_fallback']()}{' '}
            <a
              href="https://build-a-hooper.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              {m['landing.hero.embed_link']()}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
