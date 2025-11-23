import { useQuery } from '@tanstack/react-query';
import { fetchTasksForDateRange } from 'client/hooks/api/tasks';
import useAuthStore from 'client/store/authStore';
import { getRangeOfMonth } from 'client/utils/date';
import { QUERY_STALE_TIME_MS } from 'client/contants';

export const useCalendarTasksQuery = (date: Date) => {
  const session = useAuthStore((state) => state.session);
  const userId = session?.user?.id;
  const [startOfMonth, endOfMonth] = getRangeOfMonth(date);

  return useQuery({
    queryKey: [
      'tasks',
      {
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
      },
    ],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error('User not logged in'));
      }
      return fetchTasksForDateRange(userId, startOfMonth, endOfMonth);
    },
    enabled: !!userId,
    staleTime: QUERY_STALE_TIME_MS,
  });
};
