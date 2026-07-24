import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { buttonVariants } from '@/components/ui/button';

const STATS = [
  'landing.hero.stat.attributes',
  'landing.hero.stat.modes',
  'landing.hero.stat.games',
] as const;

const ALSO_PLAY_HREF =
  'https://73-9.org/?utm_source=buildahooper&utm_medium=referral&utm_campaign=hero_cta';

export function Hero() {
  return (
    <section
      id="play"
      className="relative isolate flex min-h-[min(100svh,56rem)] flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 sm:pt-28 sm:pb-24"
    >
      <img
        src="/imgs/hero-bg.webp"
        alt=""
        width={1920}
        height={1081}
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover object-[center_30%]"
      />
      <div
        aria-hidden
        className="to-background absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/40"
      />

      <div className="relative mx-auto max-w-3xl space-y-8 text-center">
        <p className="text-primary/90 text-xs font-bold tracking-[0.28em] uppercase">
          {m['landing.hero.eyebrow']()}
        </p>
        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-6xl">
          {m['landing.hero.headline']()}
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
          {m['landing.hero.subheadline']()}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/game"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'gap-2 rounded-full px-7 font-semibold tracking-wide hover:bg-orange-200'
            )}
          >
            {m['landing.hero.primary']()}
            <ArrowRight className="size-4" />
          </Link>
          <a
            href={ALSO_PLAY_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'relative gap-2 rounded-full border-white/20 bg-black/30 px-6 text-white backdrop-blur-sm transition-transform hover:-translate-y-0.5 hover:border-orange-300/60 hover:bg-black/45'
            )}
          >
            <span className="absolute -top-2 -right-1 z-10">
              <span
                aria-hidden
                className="bg-primary/45 absolute inset-0 animate-ping rounded-full"
              />
              <span className="bg-primary text-primary-foreground animate-new-badge-bob relative inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm">
                {m['landing.also_play.badge']()}
              </span>
            </span>
            <img
              src="/also-play/73-9.png"
              alt=""
              width={22}
              height={22}
              className="size-5.5 rounded-sm"
            />
            {m['landing.also_play.cta']()}
            <ArrowUpRight className="size-4" />
          </a>
        </div>
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-3 pt-2">
          {STATS.map((key) => (
            <div
              key={key}
              className="rounded-2xl border border-white/15 bg-black/35 px-4 py-4 text-center backdrop-blur-sm"
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
