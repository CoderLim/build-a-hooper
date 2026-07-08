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
        'min-h-screen bg-neutral-950 text-white selection:bg-orange-300/30',
        className
      )}
    >
      {children}
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

export function GameTitle({ children, className }: GameTitleProps) {
  return (
    <h1
      className={cn(
        'text-3xl font-black tracking-tight uppercase sm:text-4xl lg:text-5xl',
        className
      )}
    >
      {children}
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
          'hover:border-orange-300/50 hover:bg-white/[0.06] cursor-pointer',
        active && 'border-orange-300/70 bg-orange-300/[0.08] ring-1 ring-orange-300/30',
        className
      )}
    >
      {children}
    </Tag>
  );
}

interface GameButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export function GameButton({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className,
}: GameButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-full px-8 py-4 text-sm font-black tracking-[0.18em] uppercase transition disabled:cursor-not-allowed disabled:opacity-40 sm:tracking-[0.25em]',
        variant === 'primary' &&
          'bg-orange-300 text-neutral-950 hover:scale-[1.02] hover:bg-orange-200',
        variant === 'secondary' &&
          'border border-white/10 bg-white/[0.04] text-white hover:border-orange-300/60 hover:bg-white/[0.08]',
        variant === 'ghost' &&
          'border border-white/10 bg-transparent text-white/70 hover:text-white',
        className
      )}
    >
      {children}
    </button>
  );
}

interface GamePanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function GamePanel({ children, title, className }: GamePanelProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.03] p-5',
        className
      )}
    >
      {title && (
        <p className="mb-3 text-[11px] font-bold tracking-[0.22em] text-white/50 uppercase">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

interface GameConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function GameConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: GameConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label={cancelLabel}
        onClick={onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
        <h2 className="text-lg font-black tracking-tight uppercase">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            {description}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <GameButton
            variant="secondary"
            onClick={onCancel}
            className="px-6 py-3 text-xs"
          >
            {cancelLabel}
          </GameButton>
          <GameButton onClick={onConfirm} className="px-6 py-3 text-xs">
            {confirmLabel}
          </GameButton>
        </div>
      </div>
    </div>
  );
}

interface ProgressPillProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressPill({ current, total, label }: ProgressPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase">
      {label && <span className="text-white/50">{label}</span>}
      <span className="text-orange-300">
        {current} / {total}
      </span>
    </div>
  );
}
