import assert from 'node:assert/strict';
import test from 'node:test';

import type { SubmitRunInput } from '@/modules/hooper/types';

import { ATTRIBUTE_KEYS, GRADE_VALUES } from './constants';
import { CAREER_TEAMS, TEAM_SEASONS } from './data';
import type { VerifiedRunChallenge } from './run-challenge';
import { deterministicIndex } from './run-random';
import { replayVerifiedRun, validateRunInput } from './run-integrity';
import type { BuildSlot } from './types';

function buildFixtureForSeed(seed: number): BuildSlot[] | null {
  const usedPlayerIds = new Set<string>();
  const usedPlayerNames = new Set<string>();
  const slots: BuildSlot[] = [];

  for (let index = 0; index < ATTRIBUTE_KEYS.length; index += 1) {
    const round = index + 1;
    const attribute = ATTRIBUTE_KEYS[index]!;
    const team =
      TEAM_SEASONS[
        deterministicIndex(seed, `build:${round}:0`, TEAM_SEASONS.length)
      ]!;
    const player = team.roster.find(
      (candidate) =>
        !usedPlayerIds.has(candidate.id) &&
        !usedPlayerNames.has(candidate.name) &&
        Boolean(candidate.attributes[attribute])
    );
    if (!player) return null;

    const grade = player.attributes[attribute]!;
    usedPlayerIds.add(player.id);
    usedPlayerNames.add(player.name);
    slots.push({
      attribute,
      locked: true,
      grade,
      overall: GRADE_VALUES[grade],
      playerName: player.name,
      playerId: player.id,
      teamId: team.id,
      round,
      rollAttempt: 0,
      isRookie: player.rookie ?? false,
    });
  }

  return slots;
}

function createValidFixture(): {
  input: SubmitRunInput;
  challenge: VerifiedRunChallenge;
} {
  for (let seed = 1; seed < 10_000; seed += 1) {
    const buildSlots = buildFixtureForSeed(seed);
    if (!buildSlots) continue;
    const careerTeam =
      CAREER_TEAMS[
        deterministicIndex(seed, 'career-team', CAREER_TEAMS.length)
      ]!;
    const challenge: VerifiedRunChallenge = {
      engineVersion: '2',
      runId: `run_test_${seed}`,
      userId: 'user-1',
      seed,
      issuedAt: 1,
      expiresAt: Number.MAX_SAFE_INTEGER,
    };
    return {
      challenge,
      input: {
        engineVersion: '2',
        runToken: 'test-token',
        mode: 'classic',
        position: 'PG',
        careerTeam: { abbr: careerTeam.abbr },
        buildSlots,
      },
    };
  }

  throw new Error('Could not find a deterministic test seed');
}

test('rejects a client-tampered attribute rating', () => {
  const { input, challenge } = createValidFixture();
  input.buildSlots[0] = {
    ...input.buildSlots[0]!,
    overall: 99,
  };

  assert.throws(
    () => validateRunInput(input, challenge),
    /rating does not match/i
  );
});

test('rejects duplicate players across the 13 build slots', () => {
  const { input, challenge } = createValidFixture();
  input.buildSlots[1] = {
    ...input.buildSlots[1]!,
    playerId: input.buildSlots[0]!.playerId,
    playerName: input.buildSlots[0]!.playerName,
  };

  assert.throws(
    () => validateRunInput(input, challenge),
    /duplicate player|unknown source player/i
  );
});

test('rejects a source team not produced by the signed seed', () => {
  const { input, challenge } = createValidFixture();
  const currentTeamId = input.buildSlots[0]!.teamId;
  const otherTeam = TEAM_SEASONS.find((team) => team.id !== currentTeamId)!;
  input.buildSlots[0] = {
    ...input.buildSlots[0]!,
    teamId: otherTeam.id,
  };

  assert.throws(
    () => validateRunInput(input, challenge),
    /source team does not match/i
  );
});

test('rejects rerolls beyond the selected mode allowance', () => {
  const { input, challenge } = createValidFixture();
  input.mode = 'blind';
  input.position = ['PG', 'SG', 'SF', 'PF', 'C'][
    deterministicIndex(challenge.seed, 'position', 5)
  ] as SubmitRunInput['position'];
  input.buildSlots[0] = {
    ...input.buildSlots[0]!,
    rollAttempt: 2,
  };

  assert.throws(
    () => validateRunInput(input, challenge),
    /source team does not match|too many rerolls/i
  );
});

test('the same verified challenge always replays to the same season', () => {
  const { input, challenge } = createValidFixture();
  const first = replayVerifiedRun(input, challenge);
  const second = replayVerifiedRun(
    structuredClone(input),
    structuredClone(challenge)
  );

  assert.deepEqual(first.seasonStats, second.seasonStats);
  assert.equal(first.overall, second.overall);
  assert.equal(first.fingerprint, second.fingerprint);
  assert.equal(first.runId, challenge.runId);
});

test('client-claimed stats and awards are ignored by authoritative replay', () => {
  const fixture = createValidFixture();
  const input = fixture.input as SubmitRunInput & {
    overall: number;
    seasonStats: Record<string, unknown>;
    rookieCount: number;
  };
  input.overall = 99;
  input.rookieCount = 13;
  input.seasonStats = {
    wins: 82,
    losses: 0,
    ppg: 100,
    apg: 50,
    rpg: 50,
    champion: true,
    fmvp: true,
    awards: ['MVP', 'DPOY', 'Scoring Title', 'Finals MVP'],
  };

  const verified = replayVerifiedRun(input, fixture.challenge);

  assert.notEqual(verified.overall, 99);
  assert.equal(
    verified.seasonStats.wins + verified.seasonStats.losses,
    82
  );
  assert.notDeepEqual(verified.seasonStats, input.seasonStats);
});
