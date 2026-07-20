import type { BuildSummaryItem, SubmitRunInput } from '@/modules/hooper/types';
import { getOverallRating } from '@/lib/hooper-game/engine';
import type {
  BuildSlot,
  GameMode,
  Position,
  SeasonStats,
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
  mode: GameMode;
  position: Position | null;
  careerTeam: TeamSeason | null;
  buildSlots: BuildSlot[];
  seasonStats: SeasonStats;
}): SubmitRunInput {
  const rookieCount = input.buildSlots.filter(
    (slot) => slot.locked && slot.isRookie
  ).length;

  return {
    mode: input.mode,
    position: input.position,
    careerTeam: input.careerTeam
      ? { abbr: input.careerTeam.abbr, name: input.careerTeam.name }
      : null,
    overall: getOverallRating(input.buildSlots),
    buildSlots: input.buildSlots,
    seasonStats: input.seasonStats,
    rookieCount,
  };
}

export function buildRunFingerprint(input: SubmitRunInput): string {
  const { seasonStats } = input;
  return [
    input.mode,
    input.position ?? 'none',
    input.overall,
    seasonStats.wins,
    seasonStats.losses,
    seasonStats.playoffResult,
    seasonStats.champion ? '1' : '0',
  ].join(':');
}
