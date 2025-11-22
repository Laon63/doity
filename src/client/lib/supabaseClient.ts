import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ylwjwnptevikhncmxuhw.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsd2p3bnB0ZXZpa2huY214dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTEzMTUsImV4cCI6MjA3ODk2NzMxNX0.ETjWVJijGRdydUn4dNhXqmciW-GBGDBJKj0YhdbEw0U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
