import { useQuery } from '@tanstack/react-query';
import { supabase } from 'client/lib/supabaseClient';
import { Profile } from 'client/types';

const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, updated_at, display_name, profile_picture_url, theme_color, language')
    .eq('id', userId)
    .single();

  if (error) {
    // single() throws an error if no rows are found, but we want to return null
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data;
};

export const useProfileQuery = (userId: string | undefined) => {
  return useQuery<Profile | null, Error>({
    queryKey: ['profile', userId],
    queryFn: () => {
      if (!userId) {
        return Promise.resolve(null);
      }
      return fetchProfile(userId);
    },
    enabled: !!userId, // Only run the query if the userId is available
  });
};
