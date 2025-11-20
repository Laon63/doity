import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL 및 anon 키를 환경 변수에서 가져옵니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 클라이언트를 생성합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
