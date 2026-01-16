# 한방진단 (Med-Herb) 프로젝트

## 프로젝트 개요

한의학 기반 증상 진단 및 치료 추천 서비스입니다.
사용자가 증상을 입력하면 변증(변별진단)을 통해 치료 방향과 약재를 추천합니다.

## 기술 스택

### Backend
- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Validation**: Zod

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Styling**: TailwindCSS
- **HTTP Client**: Axios

### Testing
- **Unit/Integration**: Vitest
- **E2E**: Playwright
- **API Mocking**: MSW

## 프로젝트 구조

```
med-herb/
├── workers/              # Cloudflare Workers 백엔드
│   ├── src/
│   │   ├── routes/       # API 라우트
│   │   ├── handlers/     # 핸들러 로직
│   │   ├── services/     # 비즈니스 로직
│   │   ├── db/           # 데이터베이스 스키마
│   │   ├── middleware/   # 미들웨어
│   │   └── __tests__/    # Workers 테스트
│   ├── drizzle/          # 마이그레이션
│   └── wrangler.toml     # Workers 설정
├── frontend/             # React 프론트엔드
│   └── src/
│       ├── components/   # UI 컴포넌트
│       ├── hooks/        # 커스텀 훅
│       ├── api/          # API 클라이언트
│       ├── types/        # 타입 정의
│       ├── routes/       # 라우트 컴포넌트
│       ├── stores/       # Zustand 스토어
│       └── __tests__/    # Frontend 테스트
├── contracts/            # API 계약 (공유 스키마)
│   └── schemas/          # Zod 스키마
├── e2e/                  # E2E 테스트
├── docs/                 # 문서
│   └── planning/         # 기획 문서
└── .claude/              # Claude 에이전트 설정
    ├── agents/           # 서브 에이전트
    └── commands/         # 오케스트레이터 커맨드
```

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 테스트 실행
npm run test                 # 전체 테스트
npm run test:workers         # Workers 테스트만
npm run test:frontend        # Frontend 테스트만
npm run test:e2e             # E2E 테스트

# 빌드
npm run build

# 배포 (Cloudflare)
npm run deploy

# 데이터베이스
npm run db:generate          # 마이그레이션 생성
npm run db:migrate           # 마이그레이션 적용
```

## 에이전트 사용법

```bash
# 오케스트레이터 호출
/orchestrate T1.1 구현해줘

# 개별 에이전트 직접 호출 (필요시)
# backend-specialist, frontend-specialist, database-specialist, test-specialist
```

## 주요 기획 문서

- `docs/planning/01-prd.md` - 제품 요구사항
- `docs/planning/02-trd.md` - 기술 요구사항
- `docs/planning/03-user-flow.md` - 사용자 흐름
- `docs/planning/04-database-design.md` - 데이터베이스 설계
- `docs/planning/05-design-system.md` - 디자인 시스템
- `docs/planning/06-tasks.md` - 개발 태스크
- `docs/planning/07-coding-convention.md` - 코딩 컨벤션

## Lessons Learned

<!-- 개발 중 해결한 문제들을 여기에 기록합니다 -->

### [Template] 제목 (키워드1, 키워드2)
- **상황**: 무엇을 하려다
- **문제**: 어떤 에러가 발생
- **원인**: 왜 발생했는지
- **해결**: 어떻게 해결
- **교훈**: 다음에 주의할 점
