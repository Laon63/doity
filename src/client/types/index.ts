export interface Task {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  description?: string;
  category?: string;
}
