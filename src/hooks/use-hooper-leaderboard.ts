import { useQuery } from '@tanstack/react-query';

import type {
  HooperLegacyView,
  LeaderboardResult,
  LeaderboardSortBy,
} from '@/modules/hooper/types';
import { apiGet } from '@/lib/api-client';

export function useLeaderboard(options: {
  sortBy: LeaderboardSortBy;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const params = new URLSearchParams({
    sortBy: options.sortBy,
    page: String(options.page ?? 1),
    pageSize: String(options.pageSize ?? 50),
  });
  if (options.search?.trim()) {
    params.set('search', options.search.trim());
  }

  return useQuery({
    queryKey: ['hooper-leaderboard', options],
    queryFn: () =>
      apiGet<LeaderboardResult>(`/api/hooper/leaderboard?${params.toString()}`),
  });
}

export function useHooperProfile(userId: string) {
  return useQuery({
    queryKey: ['hooper-profile', userId],
    queryFn: () =>
      apiGet<{ legacy: HooperLegacyView; recentRuns: unknown[] }>(
        `/api/hooper/profile/${userId}`
      ),
    enabled: Boolean(userId),
  });
}
