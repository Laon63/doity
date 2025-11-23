import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from 'client/hooks/api/tasks';
import useAuthStore from 'client/store/authStore';
import { QUERY_STALE_TIME_MS } from 'client/contants';

export const useTasksQuery = (date: Date) => {
  const session = useAuthStore((state) => state.session);
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['tasks', { date: date.toDateString() }],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error('User not logged in'));
      }
      return fetchTasks(userId, date);
    },
    enabled: !!userId,
    staleTime: QUERY_STALE_TIME_MS,
  });
};
