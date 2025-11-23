import { useQuery } from '@tanstack/react-query';
import { fetchTask } from 'client/hooks/api/tasks';
import { QUERY_STALE_TIME_MS } from 'client/contants';

export const useTaskQuery = (taskId: string | null) => {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => {
      if (!taskId) {
        return Promise.reject(new Error('Task ID is required'));
      }
      return fetchTask(taskId);
    },
    enabled: !!taskId, // Only run the query if taskId is not null
    staleTime: QUERY_STALE_TIME_MS,
  });
};
