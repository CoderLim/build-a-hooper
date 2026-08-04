import { ATTRIBUTE_KEYS } from './constants';
import type { BuildSlot, GameMode, Position } from './types';

export const HOOPER_ENGINE_VERSION = '2';

export function stableHash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function stableHashHex(input: string): string {
  return [0, 1, 2, 3]
    .map((salt) => stableHash32(`${salt}:${input}`).toString(16).padStart(8, '0'))
    .join('');
}

export function createSeededRandom(seed: string | number): () => number {
  let state =
    typeof seed === 'number' ? seed >>> 0 : stableHash32(String(seed));

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function deterministicIndex(
  seed: number,
  scope: string,
  length: number
): number {
  if (length <= 0) throw new Error('Cannot choose from an empty collection');
  return Math.floor(createSeededRandom(`${seed}:${scope}`)() * length);
}

export function canonicalRunKey(input: {
  mode: GameMode;
  position: Position;
  careerTeamAbbr: string;
  buildSlots: BuildSlot[];
}): string {
  const byAttribute = new Map(
    input.buildSlots.map((slot) => [slot.attribute, slot] as const)
  );
  const slots = ATTRIBUTE_KEYS.map((attribute) => {
    const slot = byAttribute.get(attribute);
    return [
      attribute,
      slot?.teamId ?? '',
      slot?.playerId ?? '',
      slot?.grade ?? '',
      slot?.overall ?? '',
      slot?.round ?? '',
      slot?.rollAttempt ?? '',
      slot?.isRookie ? '1' : '0',
    ].join(':');
  }).join('|');

  return [
    HOOPER_ENGINE_VERSION,
    input.mode,
    input.position,
    input.careerTeamAbbr,
    slots,
  ].join('|');
}

export function deriveRunSeed(input: {
  mode: GameMode;
  position: Position;
  careerTeamAbbr: string;
  buildSlots: BuildSlot[];
}): number {
  return stableHash32(canonicalRunKey(input));
}

export function createRunFingerprint(input: {
  mode: GameMode;
  position: Position;
  careerTeamAbbr: string;
  buildSlots: BuildSlot[];
}): string {
  return stableHashHex(canonicalRunKey(input));
}

export function createVerifiedRunId(
  userId: string,
  fingerprint: string
): string {
  return `run_${HOOPER_ENGINE_VERSION}_${stableHashHex(`${userId}:${fingerprint}`)}`;
}
