import { HOOPER_ENGINE_VERSION } from './run-random';

const CHALLENGE_TTL_MS = 2 * 60 * 60 * 1000;

export interface VerifiedRunChallenge {
  engineVersion: string;
  runId: string;
  userId: string;
  seed: number;
  issuedAt: number;
  expiresAt: number;
}

export interface RunChallengeResponse {
  engineVersion: string;
  runToken: string;
  seed: number;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '='
  );
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function importSigningKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload)
  );
  return base64UrlEncode(new Uint8Array(signature));
}

export async function issueRunChallenge(
  userId: string,
  secret: string,
  options: {
    now?: number;
    runId?: string;
    seed?: number;
  } = {}
): Promise<RunChallengeResponse> {
  if (!secret) throw new Error('Run challenge secret is not configured');
  const now = options.now ?? Date.now();
  const seedBytes = new Uint32Array(1);
  crypto.getRandomValues(seedBytes);
  const challenge: VerifiedRunChallenge = {
    engineVersion: HOOPER_ENGINE_VERSION,
    runId: options.runId ?? `run_${crypto.randomUUID()}`,
    userId,
    seed: options.seed ?? seedBytes[0]!,
    issuedAt: now,
    expiresAt: now + CHALLENGE_TTL_MS,
  };
  const encodedPayload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(challenge))
  );
  const signature = await signPayload(encodedPayload, secret);
  return {
    engineVersion: HOOPER_ENGINE_VERSION,
    runToken: `${encodedPayload}.${signature}`,
    seed: challenge.seed,
  };
}

export async function verifyRunChallenge(
  runToken: string,
  userId: string,
  secret: string,
  now = Date.now()
): Promise<VerifiedRunChallenge> {
  if (!secret) throw new Error('Run challenge secret is not configured');
  const [encodedPayload, encodedSignature, ...extra] = runToken.split('.');
  if (!encodedPayload || !encodedSignature || extra.length > 0) {
    throw new Error('Invalid run challenge');
  }

  const key = await importSigningKey(secret);
  const validSignature = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlDecode(encodedSignature),
    new TextEncoder().encode(encodedPayload)
  );
  if (!validSignature) throw new Error('Invalid run challenge signature');

  let challenge: VerifiedRunChallenge;
  try {
    challenge = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(encodedPayload))
    ) as VerifiedRunChallenge;
  } catch {
    throw new Error('Invalid run challenge payload');
  }

  if (
    challenge.engineVersion !== HOOPER_ENGINE_VERSION ||
    challenge.userId !== userId ||
    !challenge.runId.startsWith('run_') ||
    !Number.isInteger(challenge.seed) ||
    challenge.seed < 0 ||
    challenge.seed > 0xffffffff ||
    !Number.isFinite(challenge.issuedAt) ||
    !Number.isFinite(challenge.expiresAt) ||
    challenge.issuedAt > now + 60_000 ||
    challenge.expiresAt <= now
  ) {
    throw new Error('Expired or invalid run challenge');
  }

  return challenge;
}
