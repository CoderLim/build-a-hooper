import { tDynamic } from '@/core/i18n/dynamic';
import { ATTRIBUTE_KEYS } from '@/lib/hooper-game/constants';
import type { AttributeKey } from '@/lib/hooper-game/types';
import { cn } from '@/lib/utils';

const ATTR_SLUG: Record<AttributeKey, string> = {
  '3PT': '3pt',
  MID: 'mid',
  FIN: 'fin',
  DNK: 'dnk',
  HAN: 'han',
  PAS: 'pas',
  PDEF: 'pdef',
  IDEF: 'idef',
  BLK: 'blk',
  REB: 'reb',
  ATH: 'ath',
  STR: 'str',
  CLU: 'clu',
};

interface AttributeGlossaryProps {
  className?: string;
}

export function AttributeGlossary({ className }: AttributeGlossaryProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {ATTRIBUTE_KEYS.map((key) => {
        const slug = ATTR_SLUG[key];
        return (
          <div
            key={key}
            className="min-w-0 rounded-xl border border-white/8 bg-black/25 px-3.5 py-3.5"
          >
            <p className="text-base font-black tracking-wide text-orange-300">
              {key}
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              {tDynamic(`game.attr.${slug}.name`)}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-white/45">
              {tDynamic(`game.attr.${slug}.desc`)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
