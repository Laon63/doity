import { supabase } from 'client/lib/supabaseClient';

export interface Memo {
  id: string;
  user_id: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchMemos = async (userId: string): Promise<Memo[]> => {
  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch memos: ${error.message}`);
  }

  return data || [];
};

export const createMemo = async (
  userId: string,
  content: string
): Promise<Memo> => {
  const { data, error } = await supabase
    .from('memos')
    .insert([{ user_id: userId, content, is_pinned: false }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create memo: ${error.message}`);
  }

  return data;
};

export const updateMemo = async (
  memoId: string,
  updates: Partial<Omit<Memo, 'id' | 'user_id' | 'created_at'>>
): Promise<Memo> => {
  const { data, error } = await supabase
    .from('memos')
    .update(updates)
    .eq('id', memoId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update memo: ${error.message}`);
  }

  return data;
};

export const deleteMemo = async (memoId: string): Promise<void> => {
  const { error } = await supabase.from('memos').delete().eq('id', memoId);

  if (error) {
    throw new Error(`Failed to delete memo: ${error.message}`);
  }
};

export const toggleMemoPin = async (
  memoId: string,
  isPinned: boolean
): Promise<Memo> => {
  return updateMemo(memoId, { is_pinned: !isPinned });
};
