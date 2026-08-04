import type { BuildSummaryItem, SubmitRunInput } from '@/modules/hooper/types';
import {
  createRunFingerprint,
  HOOPER_ENGINE_VERSION,
  stableHashHex,
} from '@/lib/hooper-game/run-random';
import type {
  BuildSlot,
  GameMode,
  Position,
  TeamSeason,
} from '@/lib/hooper-game/types';

export function buildSummaryFromSlots(slots: BuildSlot[]): BuildSummaryItem[] {
  return slots
    .filter((slot) => slot.locked && slot.grade && slot.overall != null)
    .map((slot) => ({
      attribute: slot.attribute,
      grade: slot.grade!,
      overall: slot.overall!,
      playerName: slot.playerName ?? '',
      round: slot.round ?? 0,
    }));
}

export function buildSubmitRunInput(input: {
  runToken: string;
  mode: GameMode;
  position: Position;
  careerTeam: TeamSeason;
  buildSlots: BuildSlot[];
}): SubmitRunInput {
  return {
    engineVersion: HOOPER_ENGINE_VERSION,
    runToken: input.runToken,
    mode: input.mode,
    position: input.position,
    careerTeam: { abbr: input.careerTeam.abbr },
    buildSlots: input.buildSlots,
  };
}

export function buildRunFingerprint(input: SubmitRunInput): string {
  const buildFingerprint = createRunFingerprint({
    mode: input.mode,
    position: input.position,
    careerTeamAbbr: input.careerTeam.abbr,
    buildSlots: input.buildSlots,
  });
  return stableHashHex(`${input.runToken}:${buildFingerprint}`);
}
