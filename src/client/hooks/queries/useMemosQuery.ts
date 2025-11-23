import { useQuery } from '@tanstack/react-query';
import { fetchMemos } from 'client/hooks/api/memos';
import useAuthStore from 'client/store/authStore';
import { QUERY_STALE_TIME_MS } from 'client/contants';

export const useMemosQuery = () => {
  const session = useAuthStore((state) => state.session);
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['memos'],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error('User not logged in'));
      }
      return fetchMemos(userId);
    },
    enabled: !!userId,
    staleTime: QUERY_STALE_TIME_MS,
  });
};
