import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from 'client/lib/supabaseClient';
import { Profile } from 'client/types';

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, updated_at, display_name, profile_picture_url, theme_color, language')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  return data;
};

export const profileQueryOptions = (userId: string) => ({
  queryKey: ['profile', userId],
  queryFn: () => fetchProfile(userId),
});

export const useProfileQuery = (userId: string | undefined, options?: Omit<UseQueryOptions<Profile | null>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Profile | null>({
    ...profileQueryOptions(userId!),
    enabled: !!userId,
    ...options,
  });
};