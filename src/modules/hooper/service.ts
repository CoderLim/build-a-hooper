import { and, asc, count, desc, eq, like, sum, type SQL } from 'drizzle-orm';

import { db } from '@/core/db';
import {
  hooperLegacy,
  hooperRun,
  user,
  type HooperLegacy,
  type HooperRun,
} from '@/config/db/schema';
import { computeLegacyPoints } from '@/modules/hooper/legacy-points';
import type {
  HooperLegacyView,
  HooperProfileView,
  HooperRunView,
  LeaderboardResult,
  LeaderboardSortBy,
  LeaderboardStats,
  SubmitRunInput,
} from '@/modules/hooper/types';
import { getUuid } from '@/lib/hash';
import {
  evaluateAchievements,
  lockedAchievementCatalog,
  type AchievementsResult,
} from '@/lib/hooper/achievements';
import { buildSummaryFromSlots } from '@/lib/hooper/build-run-payload';

function parseJsonArray<T>(raw: string): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toRunView(row: HooperRun): HooperRunView {
  return {
    id: row.id,
    completedAt: row.completedAt.toISOString(),
    mode: row.mode,
    position: row.position,
    careerTeamAbbr: row.careerTeamAbbr,
    careerTeamName: row.careerTeamName,
    overall: row.overall,
    wins: row.wins,
    losses: row.losses,
    ppg: row.ppg,
    apg: row.apg,
    rpg: row.rpg,
    champion: row.champion,
    fmvp: row.fmvp,
    playoffResult: row.playoffResult,
    awards: parseJsonArray<string>(row.awards),
    legacyPoints: row.legacyPoints,
    buildSummary: parseJsonArray(row.buildSummary),
    rookieCount: row.rookieCount,
    tripleDoubles: row.tripleDoubles,
    madeThroughPlayIn: row.madeThroughPlayIn,
    finalsComeback: row.finalsComeback,
    playoffPath: parseJsonArray<string>(row.playoffPath),
  };
}

function toLegacyView(row: HooperLegacy, rank?: number): HooperLegacyView {
  return {
    userId: row.userId,
    displayName: row.displayName,
    preferredPosition: row.preferredPosition,
    totalRuns: row.totalRuns,
    totalChampionships: row.totalChampionships,
    totalLegacyPoints: row.totalLegacyPoints,
    bestOverall: row.bestOverall,
    totalAwards: row.totalAwards,
    winRate: row.winRate,
    lastRunAt: row.lastRunAt?.toISOString() ?? null,
    rank,
  };
}

function computeWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  return total > 0 ? Math.round((wins / total) * 100) : 0;
}

function sortColumn(sortBy: LeaderboardSortBy) {
  switch (sortBy) {
    case 'championships':
      return hooperLegacy.totalChampionships;
    case 'winRate':
      return hooperLegacy.winRate;
    case 'bestOverall':
      return hooperLegacy.bestOverall;
    case 'runs':
      return hooperLegacy.totalRuns;
    case 'awards':
      return hooperLegacy.totalAwards;
    case 'points':
    default:
      return hooperLegacy.totalLegacyPoints;
  }
}

export async function submitRun(
  userId: string,
  displayName: string,
  input: SubmitRunInput
): Promise<HooperRunView> {
  const { seasonStats } = input;
  const buildSummary = buildSummaryFromSlots(input.buildSlots);
  const legacyPoints = computeLegacyPoints(
    seasonStats,
    input.overall,
    seasonStats.wins
  );
  const awardsCount = seasonStats.awards.length;
  const runId = getUuid();
  const now = new Date();

  await db().transaction(async (tx) => {
    await tx.insert(hooperRun).values({
      id: runId,
      userId,
      completedAt: now,
      mode: input.mode,
      position: input.position,
      careerTeamAbbr: input.careerTeam?.abbr ?? null,
      careerTeamName: input.careerTeam?.name ?? null,
      overall: input.overall,
      wins: seasonStats.wins,
      losses: seasonStats.losses,
      ppg: seasonStats.ppg,
      apg: seasonStats.apg,
      rpg: seasonStats.rpg,
      champion: seasonStats.champion,
      fmvp: seasonStats.fmvp,
      playoffResult: seasonStats.playoffResult,
      awards: JSON.stringify(seasonStats.awards),
      legacyPoints,
      buildSummary: JSON.stringify(buildSummary),
      rookieCount: input.rookieCount,
      tripleDoubles: seasonStats.tripleDoubles,
      madeThroughPlayIn: seasonStats.madeThroughPlayIn,
      finalsComeback: seasonStats.finalsComeback,
      playoffPath: JSON.stringify(seasonStats.playoffPath),
    });

    const existing = await tx
      .select()
      .from(hooperLegacy)
      .where(eq(hooperLegacy.userId, userId))
      .limit(1);

    const current = existing[0];
    const totalRuns = (current?.totalRuns ?? 0) + 1;
    const totalChampionships =
      (current?.totalChampionships ?? 0) + (seasonStats.champion ? 1 : 0);
    const totalLegacyPoints = (current?.totalLegacyPoints ?? 0) + legacyPoints;
    const bestOverall = Math.max(current?.bestOverall ?? 0, input.overall);
    const totalAwards = (current?.totalAwards ?? 0) + awardsCount;

    const [totals] = await tx
      .select({
        totalWins: sum(hooperRun.wins),
        totalLosses: sum(hooperRun.losses),
      })
      .from(hooperRun)
      .where(eq(hooperRun.userId, userId));

    const winRate = computeWinRate(
      Number(totals?.totalWins ?? 0),
      Number(totals?.totalLosses ?? 0)
    );

    if (current) {
      await tx
        .update(hooperLegacy)
        .set({
          displayName,
          preferredPosition: input.position,
          totalRuns,
          totalChampionships,
          totalLegacyPoints,
          bestOverall,
          totalAwards,
          winRate,
          lastRunAt: now,
        })
        .where(eq(hooperLegacy.userId, userId));
    } else {
      await tx.insert(hooperLegacy).values({
        userId,
        displayName,
        preferredPosition: input.position,
        totalRuns,
        totalChampionships,
        totalLegacyPoints,
        bestOverall,
        totalAwards,
        winRate,
        lastRunAt: now,
      });
    }
  });

  const [row] = await db()
    .select()
    .from(hooperRun)
    .where(eq(hooperRun.id, runId))
    .limit(1);

  if (!row) throw new Error('Failed to save run');
  return toRunView(row);
}

export async function getMyLegacy(
  userId: string
): Promise<HooperLegacyView | null> {
  const [row] = await db()
    .select()
    .from(hooperLegacy)
    .where(eq(hooperLegacy.userId, userId))
    .limit(1);
  return row ? toLegacyView(row) : null;
}

export async function getLeaderboardStats(): Promise<LeaderboardStats> {
  const [row] = await db()
    .select({
      totalPlayers: count(hooperLegacy.userId),
      totalPoints: sum(hooperLegacy.totalLegacyPoints),
      totalChampionships: sum(hooperLegacy.totalChampionships),
    })
    .from(hooperLegacy);

  return {
    totalPlayers: Number(row?.totalPlayers ?? 0),
    totalPoints: Number(row?.totalPoints ?? 0),
    totalChampionships: Number(row?.totalChampionships ?? 0),
  };
}

export async function getLeaderboard(options: {
  sortBy?: LeaderboardSortBy;
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<LeaderboardResult> {
  const sortBy = options.sortBy ?? 'points';
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 50));
  const offset = (page - 1) * pageSize;
  const search = options.search?.trim();

  const filters: SQL[] = [];
  if (search) {
    filters.push(like(hooperLegacy.displayName, `%${search}%`));
  }
  const whereClause = filters.length ? and(...filters) : undefined;

  const orderCol = sortColumn(sortBy);
  const tieBreaker = hooperLegacy.totalChampionships;

  const [stats, totalRow, rows] = await Promise.all([
    getLeaderboardStats(),
    db().select({ total: count() }).from(hooperLegacy).where(whereClause),
    db()
      .select()
      .from(hooperLegacy)
      .where(whereClause)
      .orderBy(desc(orderCol), desc(tieBreaker), asc(hooperLegacy.displayName))
      .limit(pageSize)
      .offset(offset),
  ]);

  const total = Number(totalRow[0]?.total ?? 0);

  return {
    stats,
    items: rows.map((row, index) => toLegacyView(row, offset + index + 1)),
    total,
    page,
    pageSize,
  };
}

export async function getUserRuns(
  userId: string,
  page = 1,
  pageSize = 10
): Promise<{ items: HooperRunView[]; total: number }> {
  const offset = (page - 1) * pageSize;
  const whereClause = eq(hooperRun.userId, userId);

  const [totalRow, rows] = await Promise.all([
    db().select({ total: count() }).from(hooperRun).where(whereClause),
    db()
      .select()
      .from(hooperRun)
      .where(whereClause)
      .orderBy(desc(hooperRun.completedAt))
      .limit(pageSize)
      .offset(offset),
  ]);

  return {
    items: rows.map(toRunView),
    total: Number(totalRow[0]?.total ?? 0),
  };
}

export async function getPublicProfile(
  userId: string
): Promise<HooperProfileView | null> {
  const [legacyRow, userRow] = await Promise.all([
    db()
      .select()
      .from(hooperLegacy)
      .where(eq(hooperLegacy.userId, userId))
      .limit(1),
    db()
      .select({ id: user.id, name: user.name })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1),
  ]);

  if (!userRow[0]) return null;

  let legacy = legacyRow[0];
  if (!legacy) {
    legacy = {
      userId,
      displayName: userRow[0].name,
      preferredPosition: null,
      totalRuns: 0,
      totalChampionships: 0,
      totalLegacyPoints: 0,
      bestOverall: 0,
      totalAwards: 0,
      winRate: 0,
      lastRunAt: null,
      updatedAt: new Date(),
    };
  }

  const rankRows = await db()
    .select({ userId: hooperLegacy.userId })
    .from(hooperLegacy)
    .orderBy(
      desc(hooperLegacy.totalLegacyPoints),
      desc(hooperLegacy.totalChampionships),
      asc(hooperLegacy.displayName)
    );

  const rank =
    rankRows.findIndex((row) => row.userId === userId) >= 0
      ? rankRows.findIndex((row) => row.userId === userId) + 1
      : undefined;

  const { items: recentRuns } = await getUserRuns(userId, 1, 5);

  return {
    legacy: toLegacyView(legacy, rank),
    recentRuns,
  };
}

export async function getAllUserRuns(userId: string): Promise<HooperRunView[]> {
  const rows = await db()
    .select()
    .from(hooperRun)
    .where(eq(hooperRun.userId, userId))
    .orderBy(desc(hooperRun.completedAt));

  return rows.map(toRunView);
}

export async function getMyAchievements(
  userId: string | null
): Promise<AchievementsResult> {
  if (!userId) {
    return lockedAchievementCatalog();
  }

  const runs = await getAllUserRuns(userId);
  return evaluateAchievements(runs);
}

/** Recalculate win_rate for all legacy rows from hooper_run totals. */
export async function backfillLegacyWinRates(): Promise<number> {
  const legacyRows = await db().select().from(hooperLegacy);
  let updated = 0;

  for (const legacy of legacyRows) {
    const [totals] = await db()
      .select({
        totalWins: sum(hooperRun.wins),
        totalLosses: sum(hooperRun.losses),
      })
      .from(hooperRun)
      .where(eq(hooperRun.userId, legacy.userId));

    const winRate = computeWinRate(
      Number(totals?.totalWins ?? 0),
      Number(totals?.totalLosses ?? 0)
    );

    if (winRate !== legacy.winRate) {
      await db()
        .update(hooperLegacy)
        .set({ winRate })
        .where(eq(hooperLegacy.userId, legacy.userId));
      updated += 1;
    }
  }

  return updated;
}
