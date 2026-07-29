#!/usr/bin/env node
/**
 * Ensure wrangler.jsonc exists for CI / Workers Builds.
 * Local dev: keeps an existing gitignored copy; CI uses the committed file.
 */
import { copyFileSync, existsSync } from 'node:fs';

const target = 'wrangler.jsonc';
const source = 'wrangler.example.jsonc';

if (existsSync(target)) {
  process.exit(0);
}

if (!existsSync(source)) {
  console.error(`Missing ${source}; cannot materialize ${target}.`);
  process.exit(1);
}

copyFileSync(source, target);
console.log(`Created ${target} from ${source}.`);
