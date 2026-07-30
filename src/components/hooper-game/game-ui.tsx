import { useEffect, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface GameShellProps {
  children: ReactNode;
  className?: string;
}

export function GameShell({ children, className }: GameShellProps) {
  return (
    <div
      className={cn(
        'relative isolate min-h-screen overflow-hidden bg-neutral-950 text-white selection:bg-orange-300/30',
        className
      )}
    >
      <img
        src="/imgs/hero-bg.webp"
        alt=""
        width={1920}
        height={1081}
        decoding="async"
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 size-full scale-110 object-cover object-center opacity-50 blur-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-neutral-950/75"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

interface GameBadgeProps {
  children: ReactNode;
}

export function GameBadge({ children }: GameBadgeProps) {
  return (
    <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-left text-sm text-white/80">
      {children}
    </div>
  );
}

interface GameEyebrowProps {
  children: ReactNode;
}

export function GameEyebrow({ children }: GameEyebrowProps) {
  return (
    <p className="text-[11px] font-bold tracking-[0.28em] text-orange-300/90 uppercase">
      {children}
    </p>
  );
}

interface GameTitleProps {
  children: ReactNode;
  className?: string;
}

const SEO_PAGE_TITLES: Record<string, string> = {
  Leaderboard: 'Build a Hooper Leaderboard: Rankings and Scoring Guide',
  Achievements: 'Build a Hooper Achievements: Complete Unlock Guide',
};

export function GameTitle({ children, className }: GameTitleProps) {
  const title =
    typeof children === 'string' ? SEO_PAGE_TITLES[children] ?? children : children;

  return (
    <h1
      className={cn(
        'text-3xl font-black tracking-tight uppercase sm:text-4xl lg:text-5xl',
        className
      )}
    >
      {title}
    </h1>
  );
}

interface GameSectionTitleProps {
  children: ReactNode;
}

export function GameSectionTitle({ children }: GameSectionTitleProps) {
  return (
    <h2 className="text-xl font-black tracking-tight uppercase sm:text-2xl">
      {children}
    </h2>
  );
}

interface GameCardProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export function GameCard({
  children,
  className,
  active,
  onClick,
}: GameCardProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition',
        onClick &&
          'cursor-pointer hover:border-orange-300/50 hover:bg-white/[0.06]',
        active &&
          'border-orange-300/70 bg-orange-300/[0.08] ring-1 ring-orange-300/30',
        className
      )}
    >
      {children}
    </Tag>
  );
}
