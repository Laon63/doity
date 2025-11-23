import { supabase } from 'client/lib/supabaseClient';
import { Task } from 'client/types';
import { getRangeOfDay } from 'client/utils/date';

export const fetchTask = async (taskId: string): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Task not found');
  }

  return data;
};

export const fetchTasks = async (
  userId: string,
  date: Date
): Promise<Task[]> => {
  const [startOfDay, endOfDay] = getRangeOfDay(date);

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startOfDay.toISOString())
    .lt('created_at', endOfDay.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

type TaskUpdatePayload = Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>;

export const updateTask = async ({
  taskId,
  payload,
}: {
  taskId: string;
  payload: TaskUpdatePayload;
}) => {
  const { error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', taskId);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);

  if (error) {
    throw new Error(error.message);
  }
};

export const toggleTask = async ({
  taskId,
  isCompleted,
}: {
  taskId: string;
  isCompleted: boolean;
}) => {
  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: isCompleted })
    .eq('id', taskId);

  if (error) {
    throw new Error(error.message);
  }
};
