import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from 'client/lib/supabaseClient';
import { Profile } from 'client/types';

type ProfileUpdatePayload = Partial<Omit<Profile, 'id' | 'updated_at'>>;

const updateProfile = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: ProfileUpdatePayload;
}): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useUpdateProfileMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => {
      if (!userId) {
        throw new Error('User ID is not defined');
      }
      return updateProfile({ userId, payload });
    },
    onSuccess: (updatedProfile) => {
      // Directly update the cache with the new data
      queryClient.setQueryData(['profile', userId], updatedProfile);
    },
  });
};
