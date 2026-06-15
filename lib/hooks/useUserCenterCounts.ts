import { useEffect, useState } from 'react';
import { applicationService, favoriteService, messageService } from '@/lib/services/data';
import { getStoredUser } from '@/lib/utils/auth-client';

export interface UserCenterCounts {
  applications: number;
  favorites: number;
  unreadMessages: number;
}

const initialCounts: UserCenterCounts = {
  applications: 0,
  favorites: 0,
  unreadMessages: 0,
};

export default function useUserCenterCounts() {
  const [counts, setCounts] = useState<UserCenterCounts>(initialCounts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadCounts() {
      try {
        const [applications, favorites, messages] = await Promise.all([
          applicationService.getMine(),
          favoriteService.getMine(),
          messageService.getMine(),
        ]);

        if (cancelled) return;

        setCounts({
          applications: applications.length,
          favorites: favorites.length,
          unreadMessages: messages.filter((message) => !message.read).length,
        });
      } catch (error) {
        console.error('加载用户中心统计数据失败', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCounts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { counts, loading };
}
