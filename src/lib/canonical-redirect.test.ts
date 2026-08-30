import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { canonicalRedirect } from './canonical-redirect.ts';

describe('canonicalRedirect', () => {
  it('redirects http www to https apex in one hop', () => {
    const req = new Request('http://www.buildahooper.org/pricing?x=1');
    const res = canonicalRedirect(req);

    assert.ok(res);
    assert.equal(res.status, 301);
    assert.equal(
      res.headers.get('location'),
      'https://buildahooper.org/pricing?x=1'
    );
  });

  it('redirects https www to https apex', () => {
    const req = new Request('https://www.buildahooper.org/leaderboard');
    const res = canonicalRedirect(req);

    assert.ok(res);
    assert.equal(
      res.headers.get('location'),
      'https://buildahooper.org/leaderboard'
    );
  });

  it('redirects bare http apex to https apex', () => {
    const req = new Request('http://buildahooper.org/game');
    const res = canonicalRedirect(req);

    assert.ok(res);
    assert.equal(res.headers.get('location'), 'https://buildahooper.org/game');
  });

  it('skips canonical https apex', () => {
    const req = new Request('https://buildahooper.org/pricing');
    assert.equal(canonicalRedirect(req), null);
  });

  it('skips localhost', () => {
    const req = new Request('http://localhost:3000/');
    assert.equal(canonicalRedirect(req), null);
  });
});
