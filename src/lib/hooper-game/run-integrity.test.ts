import assert from 'node:assert/strict';
import test from 'node:test';

import type { SubmitRunInput } from '@/modules/hooper/types';

import { ATTRIBUTE_KEYS, GRADE_VALUES } from './constants';
import { TEAM_SEASONS } from './data';
import {
  createVerifiedRunId,
  replayVerifiedRun,
  validateRunInput,
} from './run-integrity';
import type { BuildSlot } from './types';

function createValidBuildSlots(): BuildSlot[] {
  const usedPlayerIds = new Set<string>();
  const usedPlayerNames = new Set<string>();

  return ATTRIBUTE_KEYS.map((attribute, index) => {
    for (const team of TEAM_SEASONS) {
      for (const player of team.roster) {
        if (
          usedPlayerIds.has(player.id) ||
          usedPlayerNames.has(player.name)
        ) {
          continue;
        }
        const grade = player.attributes[attribute];
        if (!grade) continue;

        usedPlayerIds.add(player.id);
        usedPlayerNames.add(player.name);
        return {
          attribute,
          locked: true,
          grade,
          overall: GRADE_VALUES[grade],
          playerName: player.name,
          playerId: player.id,
          teamId: team.id,
          round: index + 1,
          isRookie: player.rookie ?? false,
        };
      }
    }

    throw new Error(`No player found for ${attribute}`);
  });
}

function createValidInput(): SubmitRunInput {
  const careerTeam = TEAM_SEASONS[0]!;
  return {
    engineVersion: '2',
    mode: 'classic',
    position: 'PG',
    careerTeam: { abbr: careerTeam.abbr },
    buildSlots: createValidBuildSlots(),
  };
}

test('rejects a client-tampered attribute rating', () => {
  const input = createValidInput();
  input.buildSlots[0] = {
    ...input.buildSlots[0]!,
    overall: 99,
  };

  assert.throws(() => validateRunInput(input), /rating does not match/i);
});

test('rejects duplicate players across the 13 build slots', () => {
  const input = createValidInput();
  input.buildSlots[1] = {
    ...input.buildSlots[1]!,
    playerId: input.buildSlots[0]!.playerId,
    playerName: input.buildSlots[0]!.playerName,
    teamId: input.buildSlots[0]!.teamId,
  };

  assert.throws(() => validateRunInput(input), /duplicate player/i);
});

test('the same verified build always replays to the same season', () => {
  const input = createValidInput();
  const first = replayVerifiedRun(input);
  const second = replayVerifiedRun(structuredClone(input));

  assert.deepEqual(first.seasonStats, second.seasonStats);
  assert.equal(first.overall, second.overall);
  assert.equal(first.fingerprint, second.fingerprint);
});

test('client-claimed stats and awards are ignored by authoritative replay', () => {
  const input = createValidInput() as SubmitRunInput & {
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

  const verified = replayVerifiedRun(input);

  assert.notEqual(verified.overall, 99);
  assert.equal(
    verified.seasonStats.wins + verified.seasonStats.losses,
    82
  );
  assert.notDeepEqual(verified.seasonStats, input.seasonStats);
});

test('verified run IDs are stable per user and build', () => {
  const input = createValidInput();
  const verified = replayVerifiedRun(input);

  assert.equal(
    createVerifiedRunId('user-1', verified.fingerprint),
    createVerifiedRunId('user-1', verified.fingerprint)
  );
  assert.notEqual(
    createVerifiedRunId('user-1', verified.fingerprint),
    createVerifiedRunId('user-2', verified.fingerprint)
  );
});
