import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL 및 anon 키를 환경 변수에서 가져옵니다.
const supabaseUrl = 'https://ylwjwnptevikhncmxuhw.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsd2p3bnB0ZXZpa2huY214dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTEzMTUsImV4cCI6MjA3ODk2NzMxNX0.ETjWVJijGRdydUn4dNhXqmciW-GBGDBJKj0YhdbEw0U';

// Supabase 클라이언트를 생성합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
