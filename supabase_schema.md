# Supabase 데이터베이스 스키마

이 파일은 Do-itY 애플리케이션에 필요한 데이터베이스 테이블과 정책을 정의합니다.
아래 스크립트를 복사하여 Supabase 프로젝트의 **SQL Editor**에 붙여넣고 실행하세요.

```sql
-- 1. tasks 테이블 생성
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  is_completed boolean DEFAULT false NOT NULL,
  due_date date
);

-- 2. 테이블에 대한 Row Level Security 활성화
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. 사용자가 자신의 tasks만 SELECT 할 수 있는 정책
CREATE POLICY "Allow individual select access"
ON public.tasks FOR SELECT
USING (auth.uid() = user_id);

-- 4. 사용자가 자신의 tasks만 INSERT 할 수 있는 정책
CREATE POLICY "Allow individual insert access"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. 사용자가 자신의 tasks만 UPDATE 할 수 있는 정책
CREATE POLICY "Allow individual update access"
ON public.tasks FOR UPDATE
USING (auth.uid() = user_id);

-- 6. 사용자가 자신의 tasks만 DELETE 할 수 있는 정책
CREATE POLICY "Allow individual delete access"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);
```
