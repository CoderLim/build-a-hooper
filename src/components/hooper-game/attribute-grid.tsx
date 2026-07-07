import { ATTRIBUTE_KEYS } from '@/lib/hooper-game/constants';
import type { AttributeKey, BuildSlot, Grade } from '@/lib/hooper-game/types';
import { cn } from '@/lib/utils';

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  '3PT': 'Three-Point',
  MID: 'Midrange',
  FIN: 'Finishing',
  DNK: 'Dunking',
  HAN: 'Ball Handle',
  PAS: 'Passing',
  PDEF: 'Perimeter Def',
  IDEF: 'Interior Def',
  BLK: 'Blocks',
  REB: 'Rebounding',
  ATH: 'Athleticism',
  STR: 'Strength',
  CLU: 'Clutch / IQ',
};

function gradeColor(grade?: Grade): string {
  if (!grade) return 'text-white/30';
  if (grade.startsWith('A')) return 'text-emerald-400';
  if (grade.startsWith('B')) return 'text-orange-300';
  if (grade.startsWith('C')) return 'text-yellow-400';
  return 'text-red-400';
}

interface AttributeGridProps {
  slots: BuildSlot[];
  showValues?: boolean;
  compact?: boolean;
  lockedOnly?: boolean;
}

export function AttributeGrid({
  slots,
  showValues = true,
  compact = false,
  lockedOnly = false,
}: AttributeGridProps) {
  const displaySlots = lockedOnly ? slots.filter((s) => s.locked) : slots;

  if (lockedOnly && displaySlots.length === 0) {
    return (
      <p className="text-sm text-white/40">No attributes locked yet.</p>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-2',
        compact
          ? 'grid-cols-2 sm:grid-cols-3'
          : lockedOnly
            ? 'grid-cols-2'
            : 'grid-cols-2 lg:grid-cols-3'
      )}
    >
      {displaySlots.map((slot) => (
        <div
          key={slot.attribute}
          className={cn(
            'min-w-0 rounded-xl border border-white/10 bg-black/20 px-3 py-3',
            slot.locked && 'border-orange-300/30 bg-orange-300/5'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold tracking-wider text-white/70">
              {slot.attribute}
            </span>
            {slot.locked && showValues ? (
              <span className={cn('text-sm font-black', gradeColor(slot.grade))}>
                {slot.grade}
              </span>
            ) : (
              <span className="text-[10px] tracking-wider text-white/30 uppercase">
                Empty
              </span>
            )}
          </div>
          {!compact && (
            <p className="mt-1 truncate text-[11px] text-white/40">
              {ATTRIBUTE_LABELS[slot.attribute]}
            </p>
          )}
          {slot.locked && slot.playerName && (
            <p className="mt-2 truncate text-[11px] text-white/60">
              R{slot.round} · {slot.playerName}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

interface AttributePickerProps {
  attributes: Partial<Record<AttributeKey, Grade>>;
  lockedAttributes: AttributeKey[];
  selected?: AttributeKey | null;
  hidden?: boolean;
  onSelect: (attr: AttributeKey) => void;
}

export function AttributePicker({
  attributes,
  lockedAttributes,
  selected,
  hidden = false,
  onSelect,
}: AttributePickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ATTRIBUTE_KEYS.map((attr) => {
        const grade = attributes[attr];
        const isLocked = lockedAttributes.includes(attr);
        const isSelected = selected === attr;
        if (!grade || isLocked) return null;
        return (
          <button
            key={attr}
            type="button"
            onClick={() => onSelect(attr)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left transition',
              isSelected
                ? 'border-orange-300 bg-orange-300/15'
                : 'border-white/10 bg-white/3 hover:border-orange-300/40'
            )}
          >
            <span className="text-xs font-bold text-white/80">{attr}</span>
            <span
              className={cn(
                'ml-2 text-sm font-black',
                hidden ? 'text-white/20' : gradeColor(grade)
              )}
            >
              {hidden ? '?' : grade}
            </span>
          </button>
        );
      })}
    </div>
  );
}
