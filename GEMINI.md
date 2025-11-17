# 🚀 핵심 작업 원칙 (Core Principles)

1.  **단계별 개발**: `GEMINI.md`에 정의된 작업 순서(Phase)를 따릅니다.
2.  **중요 변경 전 확인**: 데이터베이스 스키마 변경 등 중요한 결정을 내리기 전에 항상 확인을 받습니다.
3.  **프론트엔드 수정 후 검증**: 프론트엔드 소스 코드(React, MUI 등) 수정 시, **Playwright를 사용**하여 화면이 정상적으로 렌더링되는지 반드시 확인합니다.

---

# To-Do 앱 MVP 개발

## 1. 프로젝트 개요

본 프로젝트는 '미니멀리즘과 감성'을 핵심 콘셉트로 하는 To-Do 앱의 MVP(Minimum Viable Product, 최소 기능 제품)를 개발하는 것을 목표로 합니다. 파스텔톤의 색상과 직관적인 카드 UI를 통해 사용자에게 깔끔하고 감성적인 경험을 제공하고자 합니다.

### ✨ 핵심 UI/UX 방향
- **메인 컬러**: 파스텔톤 (배경: `#F7F8FA`, 포인트: 민트/라벤더/코랄 중 택1)
- **핵심 UI**: 카드 기반의 Task UI
- **인터랙션**: 할 일 완료(체크) 시 부드러운 마이크로 애니메이션 적용

### 🧱 기술 스택
- **프론트엔드**: React, MUI, React Router, Zustand (또는 React Query)
- **백엔드**: Supabase (Database, Auth)
- **배포**: Vercel

---

## 2. MVP 작업 순서

본격적인 개발에 앞서, 아래와 같은 순서로 작업을 진행합니다.

### Phase 1: 프로젝트 기본 설정 (완료)
- `npm` 프로젝트 초기화 및 의존성 라이브러리 설치 (React, Vite, TypeScript)
- 코드 품질을 위한 Linter (ESLint) 및 Formatter (Prettier) 설정
- `src`, `public` 등 기본 디렉토리 구조 설정
- `node_modules` 등 불필요한 파일 관리를 위한 `.gitignore` 파일 생성

### Phase 2: 백엔드 설정 (Supabase)
- Supabase 프로젝트 생성 및 초기 설정
- 기획에 명시된 `tasks` 테이블 스키마 정의
- Supabase Auth (인증) 기능 활성화 및 설정
- React 앱 내 Supabase 클라이언트 연동

### Phase 3: UI 기반 및 핵심 컴포넌트 개발
- MUI 테마 프로바이더를 설정하고, 지정된 파스텔톤 색상 적용
- 페이지 레이아웃 컴포넌트(헤더, 푸터 등) 및 라우팅 설정 (React Router)
- 재사용 가능한 `TaskCard` UI 컴포넌트 개발

### Phase 4: 사용자 인증 기능 구현
- Supabase Auth와 연동하여 회원가입 (`/signup`) 및 로그인 (`/login`) 페이지 구현
- 인증 상태에 따른 접근 제어 (Protected Routes) 설정
- 사용자 세션 관리 및 로그아웃 기능 구현

### Phase 5: 할 일 CRUD 기능 구현
- **Create**: 새로운 할 일을 추가하는 기능 구현
- **Read**: 특정 날짜의 할 일 목록을 불러와 `TaskCard`로 표시
- **Update**: 할 일 완료(체크) 및 내용 수정 기능 구현
- **Delete**: 할 일 삭제 기능 구현

### Phase 6: 추가 기능 및 뷰 개발
- `react-calendar` 등을 활용한 캘린더 뷰 (`/calendar`) 구현
- 간단 통계 (오늘 완료한 할 일 개수) 표시 기능 구현

### Phase 7: 배포 및 최종 검토
- Vercel을 통해 프로젝트 배포
- 최종적인 UI/UX 개선 및 버그 수정
