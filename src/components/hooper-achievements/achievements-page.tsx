'use client';

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/core/auth/client';
import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import type {
  AchievementCatalogItem,
  AchievementCategory,
  AchievementRarity,
} from '@/lib/hooper/achievements';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { useHooperAchievements } from '@/hooks/use-hooper-achievements';
import {
  GameButton,
  GameEyebrow,
  GamePanel,
  GameShell,
  GameTitle,
} from '@/components/hooper-game/game-ui';

type StatusFilter = 'all' | 'unlocked' | 'locked';

const CATEGORY_OPTIONS: {
  id: AchievementCategory | 'all';
  labelKey: string;
}[] = [
  { id: 'all', labelKey: 'achievements.filters.all_categories' },
  { id: 'modes', labelKey: 'achievements.categories.modes' },
  {
    id: 'competitive_titles',
    labelKey: 'achievements.categories.competitive_titles',
  },
  { id: 'positions', labelKey: 'achievements.categories.positions' },
  { id: 'rookies', labelKey: 'achievements.categories.rookies' },
  { id: 'underdog', labelKey: 'achievements.categories.underdog' },
  { id: 'builds', labelKey: 'achievements.categories.builds' },
  { id: 'awards', labelKey: 'achievements.categories.awards' },
  { id: 'legacy', labelKey: 'achievements.categories.legacy' },
];

const RARITY_OPTIONS: { id: AchievementRarity | 'all'; labelKey: string }[] = [
  { id: 'all', labelKey: 'achievements.filters.all_rarities' },
  { id: 'common', labelKey: 'achievements.rarities.common' },
  { id: 'rare', labelKey: 'achievements.rarities.rare' },
  { id: 'epic', labelKey: 'achievements.rarities.epic' },
  { id: 'legendary', labelKey: 'achievements.rarities.legendary' },
  { id: 'special', labelKey: 'achievements.rarities.special' },
  { id: 'goat', labelKey: 'achievements.rarities.goat' },
];

const STATUS_OPTIONS: { id: StatusFilter; labelKey: string }[] = [
  { id: 'all', labelKey: 'achievements.filters.all_status' },
  { id: 'unlocked', labelKey: 'achievements.filters.unlocked' },
  { id: 'locked', labelKey: 'achievements.filters.locked' },
];

const RARITY_STYLES: Record<AchievementRarity, string> = {
  common: 'border-white/15 bg-white/5 text-white/70',
  rare: 'border-sky-400/40 bg-sky-400/10 text-sky-200',
  epic: 'border-violet-400/40 bg-violet-400/10 text-violet-200',
  legendary: 'border-orange-300/50 bg-orange-300/10 text-orange-200',
  special: 'border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-200',
  goat: 'border-amber-300/60 bg-amber-300/10 text-amber-200',
};

function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; labelKey: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            'rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase transition',
            value === option.id
              ? 'border-orange-300/70 bg-orange-300/10 text-orange-200'
              : 'border-white/10 bg-white/3 text-white/50 hover:border-white/20'
          )}
        >
          {tDynamic(option.labelKey)}
        </button>
      ))}
    </div>
  );
}

function AchievementCard({ item }: { item: AchievementCatalogItem }) {
  const name = tDynamic(item.nameKey);
  const description = tDynamic(item.descKey);
  const categoryLabel = tDynamic(`achievements.categories.${item.category}`);
  const rarityLabel = tDynamic(`achievements.rarities.${item.rarity}`);

  return (
    <article
      className={cn(
        'rounded-2xl border p-5 transition',
        item.unlocked
          ? 'border-orange-300/40 bg-orange-300/[0.06] shadow-[0_0_30px_rgba(251,191,36,0.08)]'
          : 'border-white/10 bg-white/[0.03] opacity-90'
      )}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase',
            item.unlocked
              ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
              : 'border-white/10 bg-black/20 text-white/45'
          )}
        >
          {item.unlocked
            ? m['achievements.status.unlocked']()
            : m['achievements.status.locked']()}
        </span>
        <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white/45 uppercase">
          {categoryLabel}
        </span>
        <span
          className={cn(
            'rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase',
            RARITY_STYLES[item.rarity]
          )}
        >
          {rarityLabel}
        </span>
      </div>

      <h3 className="text-lg font-black tracking-tight">{name}</h3>
      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>

      {item.progress && !item.unlocked && item.progress.target > 1 && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10px] tracking-wider text-white/40 uppercase">
            <span>{m['achievements.progress']()}</span>
            <span>
              {item.progress.current}/{item.progress.target}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-orange-300 transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (item.progress.current / item.progress.target) * 100
                  )
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 text-xs">
        <span className="font-bold text-orange-300">
          {m['achievements.reward']({ points: item.points })}
        </span>
        <span className="text-white/40">
          {item.unlocked
            ? m['achievements.completed']()
            : m['achievements.complete_objective']()}
        </span>
      </div>

      {item.unlocked && item.unlockedAt && (
        <p className="mt-2 text-[10px] tracking-wide text-white/35 uppercase">
          {m['achievements.unlocked_at']({
            date: new Date(item.unlockedAt).toLocaleDateString(),
          })}
        </p>
      )}
    </article>
  );
}

export function AchievementsPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { data, isLoading, isFetching } = useHooperAchievements();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<
    AchievementCategory | 'all'
  >('all');
  const [rarityFilter, setRarityFilter] = useState<AchievementRarity | 'all'>(
    'all'
  );
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (data?.items ?? []).filter((item) => {
      if (statusFilter === 'unlocked' && !item.unlocked) return false;
      if (statusFilter === 'locked' && item.unlocked) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;
      if (!query) return true;

      const haystack = [
        tDynamic(item.nameKey),
        tDynamic(item.descKey),
        tDynamic(`achievements.categories.${item.category}`),
        tDynamic(`achievements.rarities.${item.rarity}`),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [categoryFilter, data?.items, rarityFilter, search, statusFilter]);

  return (
    <GameShell>
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← {m['landing.nav.play']()}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {session?.user && (
              <Link href="/settings/profile">
                <GameButton variant="ghost" className="px-4 py-2 text-xs">
                  {m['achievements.profile']()}
                </GameButton>
              </Link>
            )}
            <GameButton
              variant="ghost"
              className="px-4 py-2 text-xs"
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ['hooper-achievements'],
                })
              }
            >
              {m['achievements.refresh']()}
              {isFetching ? '…' : ''}
            </GameButton>
          </div>
        </div>

        <div className="mb-8">
          <GameEyebrow>{m['achievements.eyebrow']()}</GameEyebrow>
          <GameTitle className="mt-3">{m['achievements.title']()}</GameTitle>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
            {m['achievements.subtitle']()}
          </p>
        </div>

        {!session?.user && (
          <GamePanel className="mb-8 border-orange-300/20 bg-orange-300/[0.04]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-white/60">
                {m['achievements.guest_notice']()}
              </p>
              <Link href="/sign-in">
                <GameButton className="px-6 py-3 text-xs">
                  {m['landing.nav.login']()}
                </GameButton>
              </Link>
            </div>
          </GamePanel>
        )}

        {data?.stats && (
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                `${data.stats.unlocked}/${data.stats.total}`,
                m['achievements.stats.unlocked'](),
              ],
              [
                `${data.stats.progressPercent}%`,
                m['achievements.stats.progress'](),
              ],
              [
                `${data.stats.points}/${data.stats.maxPoints}`,
                m['achievements.stats.points'](),
              ],
              [data.stats.remaining, m['achievements.stats.remaining']()],
            ].map(([value, label]) => (
              <div
                key={String(label)}
                className="rounded-2xl border border-white/10 bg-white/3 p-4 text-center"
              >
                <p className="text-2xl font-black text-orange-300">{value}</p>
                <p className="mt-1 text-[10px] tracking-wider text-white/40 uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6 space-y-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={m['achievements.search_placeholder']()}
            className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/50"
          />

          <FilterPills
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterPills
            options={CATEGORY_OPTIONS}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
          <FilterPills
            options={RARITY_OPTIONS}
            value={rarityFilter}
            onChange={setRarityFilter}
          />
        </div>

        <p className="mb-4 text-xs tracking-wide text-white/40 uppercase">
          {m['achievements.showing']({ count: filteredItems.length })}
        </p>

        {isLoading ? (
          <GamePanel>
            <p className="text-sm text-white/50">
              {m['achievements.loading']()}
            </p>
          </GamePanel>
        ) : filteredItems.length === 0 ? (
          <GamePanel>
            <p className="text-sm text-white/50">{m['achievements.empty']()}</p>
          </GamePanel>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <AchievementCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </GameShell>
  );
}
