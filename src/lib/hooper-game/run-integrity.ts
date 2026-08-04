import type { SubmitRunInput } from '@/modules/hooper/types';

import {
  ATTRIBUTE_KEYS,
  GRADE_VALUES,
  POSITIONS,
  REROLLS_BY_MODE,
} from './constants';
import { CAREER_TEAMS, TEAM_SEASONS } from './data';
import type { VerifiedRunChallenge } from './run-challenge';
import {
  createRunFingerprint,
  deterministicIndex,
  HOOPER_ENGINE_VERSION,
} from './run-random';
import {
  buildSeasonStats,
  createSeasonState,
  simulatePlayoffGame,
  simulateToEnd,
  startPlayoffs,
} from './season-engine';
import type { BuildSlot, Grade, TeamSeason } from './types';

export class RunVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RunVerificationError';
  }
}

function fail(message: string): never {
  throw new RunVerificationError(message);
}

function getCareerTeam(abbr: string): TeamSeason {
  const team = CAREER_TEAMS.find((candidate) => candidate.abbr === abbr);
  return team ?? fail('Unknown career team');
}

export function validateRunInput(
  input: SubmitRunInput,
  challenge: VerifiedRunChallenge
): {
  input: SubmitRunInput;
  careerTeam: TeamSeason;
  buildSlots: BuildSlot[];
} {
  if (
    input.engineVersion !== HOOPER_ENGINE_VERSION ||
    challenge.engineVersion !== HOOPER_ENGINE_VERSION
  ) {
    fail('Unsupported game engine version');
  }
  if (!input.runToken) fail('Run challenge is required');
  if (!input.position) fail('Position is required');
  if (!input.careerTeam?.abbr) fail('Career team is required');
  if (input.buildSlots.length !== ATTRIBUTE_KEYS.length) {
    fail('A completed run must contain exactly 13 attributes');
  }

  if (input.mode !== 'classic') {
    const expectedPosition =
      POSITIONS[
        deterministicIndex(challenge.seed, 'position', POSITIONS.length)
      ];
    if (input.position !== expectedPosition) {
      fail('Position does not match the run challenge');
    }
  }

  const expectedCareerTeam =
    CAREER_TEAMS[
      deterministicIndex(
        challenge.seed,
        'career-team',
        CAREER_TEAMS.length
      )
    ];
  if (input.careerTeam.abbr !== expectedCareerTeam?.abbr) {
    fail('Career team does not match the run challenge');
  }

  const careerTeam = getCareerTeam(input.careerTeam.abbr);
  const attributes = new Set<string>();
  const rounds = new Set<number>();
  const playerIds = new Set<string>();
  const playerNames = new Set<string>();
  const normalized: BuildSlot[] = [];
  let rerollsUsed = 0;

  for (const slot of input.buildSlots) {
    if (!ATTRIBUTE_KEYS.includes(slot.attribute)) fail('Unknown attribute');
    if (attributes.has(slot.attribute)) fail('Duplicate attribute');
    attributes.add(slot.attribute);

    if (!slot.locked) fail('All attributes must be locked');
    if (!slot.teamId || !slot.playerId || !slot.playerName) {
      fail('Build source data is missing');
    }
    if (!slot.grade || typeof slot.overall !== 'number') {
      fail('Build rating data is missing');
    }
    if (!slot.round || slot.round < 1 || slot.round > ATTRIBUTE_KEYS.length) {
      fail('Invalid draft round');
    }
    if (rounds.has(slot.round)) fail('Duplicate draft round');
    rounds.add(slot.round);

    if (
      !Number.isInteger(slot.rollAttempt) ||
      slot.rollAttempt == null ||
      slot.rollAttempt < 0
    ) {
      fail('Invalid reroll provenance');
    }
    rerollsUsed += slot.rollAttempt;

    const expectedTeam =
      TEAM_SEASONS[
        deterministicIndex(
          challenge.seed,
          `build:${slot.round}:${slot.rollAttempt}`,
          TEAM_SEASONS.length
        )
      ];
    if (!expectedTeam || slot.teamId !== expectedTeam.id) {
      fail('Source team does not match the run challenge');
    }

    if (playerIds.has(slot.playerId) || playerNames.has(slot.playerName)) {
      fail('Duplicate player');
    }
    playerIds.add(slot.playerId);
    playerNames.add(slot.playerName);

    const player = expectedTeam.roster.find(
      (candidate) => candidate.id === slot.playerId
    );
    if (!player || player.name !== slot.playerName) fail('Unknown source player');

    const canonicalGrade = player.attributes[slot.attribute] as Grade | undefined;
    if (!canonicalGrade) fail('Player does not have this attribute');
    const canonicalOverall = GRADE_VALUES[canonicalGrade];
    if (
      slot.grade !== canonicalGrade ||
      slot.overall !== canonicalOverall
    ) {
      fail('Build rating does not match the source player');
    }

    const canonicalRookie = player.rookie ?? false;
    if ((slot.isRookie ?? false) !== canonicalRookie) {
      fail('Rookie flag does not match the source player');
    }

    normalized.push({
      attribute: slot.attribute,
      locked: true,
      grade: canonicalGrade,
      overall: canonicalOverall,
      playerName: player.name,
      playerId: player.id,
      teamId: expectedTeam.id,
      round: slot.round,
      rollAttempt: slot.rollAttempt,
      isRookie: canonicalRookie,
    });
  }

  if (rerollsUsed > REROLLS_BY_MODE[input.mode]) {
    fail('Run used too many rerolls');
  }
  if (
    ATTRIBUTE_KEYS.some((attribute) => !attributes.has(attribute)) ||
    rounds.size !== ATTRIBUTE_KEYS.length
  ) {
    fail('Incomplete build');
  }

  normalized.sort(
    (left, right) =>
      ATTRIBUTE_KEYS.indexOf(left.attribute) -
      ATTRIBUTE_KEYS.indexOf(right.attribute)
  );

  return {
    input: {
      engineVersion: HOOPER_ENGINE_VERSION,
      runToken: input.runToken,
      mode: input.mode,
      position: input.position,
      careerTeam: { abbr: careerTeam.abbr },
      buildSlots: normalized,
    },
    careerTeam,
    buildSlots: normalized,
  };
}

export function replayVerifiedRun(
  input: SubmitRunInput,
  challenge: VerifiedRunChallenge
) {
  const verified = validateRunInput(input, challenge);
  const { mode, position } = verified.input;
  let season = createSeasonState(
    verified.careerTeam,
    verified.buildSlots,
    position,
    mode
  );
  season = simulateToEnd(season);
  season = startPlayoffs(season);

  let playoffGames = 0;
  while (season.inPlayoffs && !season.seasonComplete) {
    season = simulatePlayoffGame(season);
    playoffGames += 1;
    if (playoffGames > 40) fail('Playoff replay exceeded the safety limit');
  }

  const seasonStats = buildSeasonStats(season);
  const fingerprint = createRunFingerprint({
    mode,
    position,
    careerTeamAbbr: verified.careerTeam.abbr,
    buildSlots: verified.buildSlots,
  });

  return {
    input: verified.input,
    careerTeam: verified.careerTeam,
    buildSlots: verified.buildSlots,
    seasonStats,
    overall: season.buildProfile.overall,
    rookieCount: verified.buildSlots.filter((slot) => slot.isRookie).length,
    fingerprint,
    runId: challenge.runId,
  };
}

export { HOOPER_ENGINE_VERSION };
