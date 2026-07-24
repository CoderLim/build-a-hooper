import { m } from '@/paraglide/messages.js';

const REWARD_ROWS = [
  {
    rarityKey: 'achievements.rarities.common' as const,
    pointsKey: 'achievements.guide.table.common_pts' as const,
    noteKey: 'achievements.guide.table.common_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.rare' as const,
    pointsKey: 'achievements.guide.table.rare_pts' as const,
    noteKey: 'achievements.guide.table.rare_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.epic' as const,
    pointsKey: 'achievements.guide.table.epic_pts' as const,
    noteKey: 'achievements.guide.table.epic_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.legendary' as const,
    pointsKey: 'achievements.guide.table.legendary_pts' as const,
    noteKey: 'achievements.guide.table.legendary_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.special' as const,
    pointsKey: 'achievements.guide.table.special_pts' as const,
    noteKey: 'achievements.guide.table.special_note' as const,
  },
  {
    rarityKey: 'achievements.rarities.goat' as const,
    pointsKey: 'achievements.guide.table.goat_pts' as const,
    noteKey: 'achievements.guide.table.goat_note' as const,
  },
];

/**
 * SSR-visible achievements explainer for /achievements.
 * Keeps AdSense content pages above thin-content thresholds.
 */
export function AchievementsGuide() {
  return (
    <article className="space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <header>
        <p className="text-xs font-bold tracking-[0.2em] text-orange-300/80 uppercase">
          {m['achievements.guide.eyebrow']()}
        </p>
        <h2 className="mt-3 text-xl font-black tracking-tight text-white sm:text-2xl">
          {m['achievements.guide.title']()}
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/60">
          {m['achievements.guide.intro']()}
        </p>
      </header>

      <section className="space-y-3">
        <h3 className="text-base font-bold text-white">
          {m['achievements.guide.unlock_title']()}
        </h3>
        <p className="text-sm leading-7 text-white/60">
          {m['achievements.guide.unlock_body']()}
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-white/60">
          <li>{m['achievements.guide.unlock_1']()}</li>
          <li>{m['achievements.guide.unlock_2']()}</li>
          <li>{m['achievements.guide.unlock_3']()}</li>
        </ol>
        <p className="text-sm leading-7 text-white/60">
          {m['achievements.guide.unlock_note']()}
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-bold text-white">
          {m['achievements.guide.categories_title']()}
        </h3>
        <p className="text-sm leading-7 text-white/60">
          {m['achievements.guide.categories_body']()}
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-bold text-white">
          {m['achievements.guide.table_title']()}
        </h3>
        <p className="text-sm leading-7 text-white/60">
          {m['achievements.guide.table_intro']()}
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead className="bg-white/5 text-xs tracking-wider text-white/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-bold">
                  {m['achievements.guide.table.col_rarity']()}
                </th>
                <th className="px-4 py-3 font-bold">
                  {m['achievements.guide.table.col_points']()}
                </th>
                <th className="px-4 py-3 font-bold">
                  {m['achievements.guide.table.col_note']()}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white/65">
              {REWARD_ROWS.map((row) => (
                <tr key={row.rarityKey}>
                  <td className="px-4 py-3 font-semibold text-white/80">
                    {m[row.rarityKey]()}
                  </td>
                  <td className="px-4 py-3">{m[row.pointsKey]()}</td>
                  <td className="px-4 py-3 leading-6">{m[row.noteKey]()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-7 text-white/60">
          {m['achievements.guide.table_outro']()}
        </p>
      </section>
    </article>
  );
}
