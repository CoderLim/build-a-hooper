import { useQuery } from '@tanstack/react-query';

import { apiGet } from '@/lib/api-client';
import type { AchievementsResult } from '@/lib/hooper/achievements';

export function useHooperAchievements() {
  return useQuery({
    queryKey: ['hooper-achievements'],
    queryFn: () => apiGet<AchievementsResult>('/api/hooper/achievements'),
  });
}
