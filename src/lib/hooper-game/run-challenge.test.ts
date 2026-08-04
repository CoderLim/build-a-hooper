import assert from 'node:assert/strict';
import test from 'node:test';

import { issueRunChallenge, verifyRunChallenge } from './run-challenge';

test('signed run challenges bind the user, seed, and run ID', async () => {
  const issued = await issueRunChallenge('user-1', 'test-secret', {
    now: 1_000,
    runId: 'run_test',
    seed: 42,
  });
  const verified = await verifyRunChallenge(
    issued.runToken,
    'user-1',
    'test-secret',
    2_000
  );

  assert.equal(verified.runId, 'run_test');
  assert.equal(verified.seed, 42);
  assert.equal(verified.userId, 'user-1');
});

test('run challenges reject another user or modified signatures', async () => {
  const issued = await issueRunChallenge('user-1', 'test-secret', {
    now: 1_000,
    runId: 'run_test',
    seed: 42,
  });

  await assert.rejects(
    () => verifyRunChallenge(issued.runToken, 'user-2', 'test-secret', 2_000),
    /invalid|expired/i
  );
  await assert.rejects(
    () =>
      verifyRunChallenge(
        `${issued.runToken.slice(0, -1)}x`,
        'user-1',
        'test-secret',
        2_000
      ),
    /signature|invalid/i
  );
});

test('expired run challenges are rejected', async () => {
  const issued = await issueRunChallenge('user-1', 'test-secret', {
    now: 1_000,
    runId: 'run_test',
    seed: 42,
  });

  await assert.rejects(
    () =>
      verifyRunChallenge(
        issued.runToken,
        'user-1',
        'test-secret',
        3 * 60 * 60 * 1000
      ),
    /expired|invalid/i
  );
});
