import { Language } from 'client/store/themeStore';

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

export interface Profile {
  id: string;
  updated_at: string;
  display_name: string;
  profile_picture_url: string | null;
  theme_color: string;
  language: Language;
}
