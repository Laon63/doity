import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask, toggleTask } from 'client/hooks/api/tasks';
import { Task } from 'client/types';

type TaskUpdatePayload = Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>;

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: TaskUpdatePayload;
    }) => updateTask({ taskId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
  });
};

export const useToggleTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      isCompleted,
    }: {
      taskId: string;
      isCompleted: boolean;
    }) => toggleTask({ taskId, isCompleted }),
    // Optimistic update
    onMutate: async ({ taskId, isCompleted }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update the tasks list
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return old?.map((task) =>
          task.id === taskId ? { ...task, is_completed: isCompleted } : task
        );
      });

      // Optimistically update the single task detail
      queryClient.setQueryData(['tasks', taskId], (old: Task | undefined) => {
        return old ? { ...old, is_completed: isCompleted } : old;
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails, use the context we returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    // No onSettled to prevent unnecessary refetches after optimistic update
  });
};

export const useUpdateTaskTitleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, newTitle }: { taskId: string; newTitle: string }) =>
      updateTask({ taskId, payload: { title: newTitle } }),
    // Optimistic update
    onMutate: async ({ taskId, newTitle }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return old?.map((task) =>
          task.id === taskId ? { ...task, title: newTitle } : task
        );
      });

      queryClient.setQueryData(['tasks', taskId], (old: Task | undefined) => {
        return old ? { ...old, title: newTitle } : old;
      });

      return { previousTasks };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    // No onSettled to prevent unnecessary refetches after optimistic update
  });
};
