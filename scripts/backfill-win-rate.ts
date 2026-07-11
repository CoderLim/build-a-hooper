/**
 * Backfill hooper_legacy.win_rate from cumulative hooper_run wins/losses.
 *
 * Usage:
 *   pnpm hooper:backfill-win-rate
 */

import { backfillLegacyWinRates } from '../src/modules/hooper/service';

async function main() {
  const updated = await backfillLegacyWinRates();
  console.log(`Updated win_rate for ${updated} legacy row(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
