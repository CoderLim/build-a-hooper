import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface SpinAnimationProps {
  abbrs: string[];
  finalAbbr?: string | null;
  spinning: boolean;
  onComplete?: () => void;
  className?: string;
}

export function SpinAnimation({
  abbrs,
  finalAbbr,
  spinning,
  onComplete,
  className,
}: SpinAnimationProps) {
  const [displayAbbr, setDisplayAbbr] = useState(finalAbbr ?? abbrs[0] ?? '???');
  const [slowing, setSlowing] = useState(false);

  useEffect(() => {
    if (!spinning) {
      if (finalAbbr) setDisplayAbbr(finalAbbr);
      return;
    }

    let frame = 0;
    const totalFrames = 14;
    const interval = window.setInterval(() => {
      frame += 1;
      if (frame >= totalFrames - 3) setSlowing(true);

      if (frame >= totalFrames) {
        window.clearInterval(interval);
        if (finalAbbr) setDisplayAbbr(finalAbbr);
        onComplete?.();
        return;
      }

      const abbr = abbrs[Math.floor(Math.random() * abbrs.length)] ?? '???';
      setDisplayAbbr(abbr);
    }, slowing ? 90 : 50);

    return () => window.clearInterval(interval);
  }, [spinning, finalAbbr, abbrs, onComplete, slowing]);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12',
        className
      )}
    >
      <div
        className={cn(
          'flex size-28 items-center justify-center rounded-2xl border-2 text-3xl font-black transition-all duration-300',
          spinning
            ? 'border-orange-300/60 bg-orange-300/10 text-orange-300 scale-105'
            : 'border-orange-300 bg-orange-300 text-neutral-950 scale-100'
        )}
      >
        {displayAbbr}
      </div>
      {spinning && (
        <p className="mt-4 text-sm font-bold tracking-widest text-orange-300 uppercase animate-pulse">
          Spinning...
        </p>
      )}
    </div>
  );
}
