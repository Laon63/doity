import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMemo,
  updateMemo,
  deleteMemo,
  toggleMemoPin,
} from 'client/hooks/api/memos';
import useAuthStore from 'client/store/authStore';
import { Memo } from 'client/hooks/api/memos';

export const useCreateMemoMutation = () => {
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);

  return useMutation({
    mutationFn: (content: string) => {
      if (!session?.user?.id) {
        throw new Error('User not logged in');
      }
      return createMemo(session.user.id, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] });
    },
  });
};

export const useUpdateMemoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memoId,
      payload,
    }: {
      memoId: string;
      payload: Partial<Omit<Memo, 'id' | 'user_id' | 'created_at'>>;
    }) => updateMemo(memoId, payload),
    onMutate: async ({ memoId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['memos'] });

      const previousMemos = queryClient.getQueryData(['memos']);

      queryClient.setQueryData(['memos'], (old: Memo[] | undefined) => {
        return old?.map((memo) =>
          memo.id === memoId ? { ...memo, ...payload } : memo
        );
      });

      return { previousMemos };
    },
    onError: (err, variables, context) => {
      if (context?.previousMemos) {
        queryClient.setQueryData(['memos'], context.previousMemos);
      }
    },
  });
};

export const useDeleteMemoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memoId: string) => deleteMemo(memoId),
    onMutate: async (memoId) => {
      await queryClient.cancelQueries({ queryKey: ['memos'] });

      const previousMemos = queryClient.getQueryData(['memos']);

      queryClient.setQueryData(['memos'], (old: Memo[] | undefined) => {
        return old?.filter((memo) => memo.id !== memoId);
      });

      return { previousMemos };
    },
    onError: (err, memoId, context) => {
      if (context?.previousMemos) {
        queryClient.setQueryData(['memos'], context.previousMemos);
      }
    },
  });
};

export const useToggleMemoPinMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memoId, isPinned }: { memoId: string; isPinned: boolean }) =>
      toggleMemoPin(memoId, isPinned),
    onMutate: async ({ memoId, isPinned }) => {
      await queryClient.cancelQueries({ queryKey: ['memos'] });

      const previousMemos = queryClient.getQueryData(['memos']);

      queryClient.setQueryData(['memos'], (old: Memo[] | undefined) => {
        return old?.map((memo) =>
          memo.id === memoId ? { ...memo, is_pinned: !isPinned } : memo
        );
      });

      return { previousMemos };
    },
    onError: (err, variables, context) => {
      if (context?.previousMemos) {
        queryClient.setQueryData(['memos'], context.previousMemos);
      }
    },
  });
};

export const useDeleteMultipleMemosMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memoIds: string[]) => {
      await Promise.all(memoIds.map((id) => deleteMemo(id)));
    },
    onMutate: async (memoIds) => {
      await queryClient.cancelQueries({ queryKey: ['memos'] });

      const previousMemos = queryClient.getQueryData(['memos']);

      queryClient.setQueryData(['memos'], (old: Memo[] | undefined) => {
        return old?.filter((memo) => !memoIds.includes(memo.id));
      });

      return { previousMemos };
    },
    onError: (err, memoIds, context) => {
      if (context?.previousMemos) {
        queryClient.setQueryData(['memos'], context.previousMemos);
      }
    },
  });
};
