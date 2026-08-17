import { ATTRIBUTE_KEYS } from '@/lib/hooper-game/constants';
import { getOverallRating } from '@/lib/hooper-game/engine';
import type { BuildSlot } from '@/lib/hooper-game/types';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';

interface BuildProgressCardProps {
  slots: BuildSlot[];
  showRatings: boolean;
}

const CX = 160;
const CY = 152;
const RADIUS = 92;
const LABEL_R = 118;

function polar(index: number, total: number, radius: number) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
  return {
    x: CX + Math.cos(angle) * radius,
    y: CY + Math.sin(angle) * radius,
    cos: Math.cos(angle),
    sin: Math.sin(angle),
  };
}

function polygonPath(values: number[]) {
  return (
    values
      .map((value, index) => {
        const point = polar(index, values.length, RADIUS * value);
        return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      })
      .join(' ') + ' Z'
  );
}

function AttributeRadar({
  slots,
  showRatings,
}: {
  slots: BuildSlot[];
  showRatings: boolean;
}) {
  const total = ATTRIBUTE_KEYS.length;
  const values = ATTRIBUTE_KEYS.map((key) => {
    const slot = slots.find((item) => item.attribute === key);
    if (!slot?.locked || !showRatings || !slot.overall) return 0.04;
    return Math.min(1, slot.overall / 99);
  });
  const hasLocked = slots.some((slot) => slot.locked);
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox="0 0 320 310"
      className="mx-auto w-full max-w-80"
      role="img"
      aria-label={m['game.build.progress_panel']()}
    >
      <defs>
        <radialGradient id="hooper-radar-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdba74" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#fdba74" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#fdba74" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="hooper-radar-fill"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fdba74" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <circle
        cx={CX}
        cy={CY}
        r={RADIUS * 0.55}
        fill="url(#hooper-radar-glow)"
      />

      {rings.map((level) => (
        <path
          key={level}
          d={polygonPath(Array.from({ length: total }, () => level))}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
      ))}

      {ATTRIBUTE_KEYS.map((_, index) => {
        const end = polar(index, total, RADIUS);
        return (
          <line
            key={index}
            x1={CX}
            y1={CY}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        );
      })}

      {hasLocked && (
        <path
          d={polygonPath(values)}
          fill="url(#hooper-radar-fill)"
          stroke="#fdba74"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      )}

      {ATTRIBUTE_KEYS.map((key, index) => {
        const point = polar(index, total, LABEL_R);
        const textAnchor =
          point.cos > 0.38 ? 'start' : point.cos < -0.38 ? 'end' : 'middle';
        const dy = point.sin > 0.55 ? 8 : point.sin < -0.55 ? 0 : 4;
        return (
          <text
            key={key}
            x={point.x}
            y={point.y + dy}
            textAnchor={textAnchor}
            fill="rgba(255,255,255,0.55)"
            fontSize="10"
            fontWeight="700"
          >
            {key}
          </text>
        );
      })}
    </svg>
  );
}

function lastName(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

function SlotPill({
  slot,
  showRatings,
}: {
  slot: BuildSlot;
  showRatings: boolean;
}) {
  const locked = slot.locked;
  const value = locked
    ? showRatings
      ? String(slot.overall ?? slot.grade ?? '??')
      : '??'
    : '..';
  const status = locked
    ? lastName(slot.playerName) || m['game.build.slot_locked']()
    : m['game.build.slot_open']();

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2',
        locked
          ? 'border-orange-300/30 bg-orange-300/8'
          : 'border-white/10 bg-white/4'
      )}
    >
      <span className="w-9 shrink-0 text-[11px] font-black tracking-wide text-white">
        {slot.attribute}
      </span>
      <span className="min-w-0 flex-1 truncate text-center text-[11px] text-white/40">
        {status}
      </span>
      <span
        className={cn(
          'w-7 shrink-0 text-right text-[11px] font-black tabular-nums',
          locked && showRatings ? 'text-orange-300' : 'text-white/30'
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function BuildProgressCard({
  slots,
  showRatings,
}: BuildProgressCardProps) {
  const overall = getOverallRating(slots);
  const lockedCount = slots.filter((slot) => slot.locked).length;
  const slotMap = new Map(slots.map((slot) => [slot.attribute, slot]));
  const orderedSlots: BuildSlot[] = ATTRIBUTE_KEYS.map(
    (key) => slotMap.get(key) ?? { attribute: key, locked: false }
  );

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/4">
          <div className="text-center leading-none">
            <p className="text-lg font-black text-white">
              {showRatings && overall > 0 ? overall : '—'}
            </p>
            <p className="mt-1 text-[9px] font-bold tracking-[0.18em] text-white/40 uppercase">
              OVR
            </p>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-base font-black tracking-tight">
            {m['game.reveal.title']()}
          </p>
          <p className="mt-0.5 text-xs text-white/45">
            {m['game.build.draft_legend']()}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <AttributeRadar slots={slots} showRatings={showRatings} />
      </div>

      <div className="mt-1 grid grid-cols-2 gap-2">
        {orderedSlots.map((slot) => (
          <SlotPill
            key={slot.attribute}
            slot={slot}
            showRatings={showRatings}
          />
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-linear-to-r from-orange-300 to-amber-500 px-3 py-3.5 text-center text-[13px] font-black text-neutral-950">
        {m['game.build.draft_simulate']({ current: lockedCount })}
      </div>
    </div>
  );
}
