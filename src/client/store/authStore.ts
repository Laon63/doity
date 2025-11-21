import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from 'client/lib/supabaseClient';

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (newSession) =>
    set((state) => {
      if (state.session?.access_token !== newSession?.access_token) {
        return { session: newSession };
      }
      return state;
    }),
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      // Optionally, handle error state or notification
    } else {
      set({ session: null });
    }
  },
}));

export default useAuthStore;
