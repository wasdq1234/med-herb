# 한방진단 (Med-Herb)

한의학 기반 증상 진단 및 치료 추천 서비스

## 소개

사용자가 증상을 입력하면 한의학적 변증(체질 경향)을 도출하고, 그에 맞는 치료 방향과 약재 정보를 제공하는 웹 서비스입니다.

- **타겟**: 건강에 관심 있는 30-50대 일반인
- **핵심 기능**: 증상 진단 설문 → 변증 결과 → 치료축/약재 추천

## 배포 URL

| 서비스 | URL |
|--------|-----|
| Frontend | https://med-herb-frontend.pages.dev |
| Backend API | https://med-herb-api.wasdq123.workers.dev |
| Admin | https://med-herb-frontend.pages.dev/admin/login |

## Admin 로그인 정보

> **개발/테스트 환경 전용**

| 항목 | 값 |
|------|-----|
| ID | admin |
| Password | password123 |

## 기술 스택

### Frontend
- React 19 + TypeScript
- Vite (Build Tool)
- TailwindCSS (Styling)
- Zustand (State Management)
- TanStack Query (Data Fetching)
- Axios (HTTP Client)

### Backend
- Cloudflare Workers (Edge Serverless)
- Hono (Web Framework)
- TypeScript
- Drizzle ORM
- Zod (Validation)

### Database
- Cloudflare D1 (SQLite)

### Testing
- Vitest (Unit/Integration)
- Playwright (E2E)
- MSW (API Mocking)

## 프로젝트 구조

```
med-herb/
├── workers/              # Cloudflare Workers 백엔드
│   ├── src/
│   │   ├── routes/       # API 라우트
│   │   ├── handlers/     # 핸들러 로직
│   │   ├── services/     # 비즈니스 로직
│   │   ├── db/           # 데이터베이스 스키마
│   │   └── middleware/   # 미들웨어
│   ├── drizzle/          # 마이그레이션
│   └── wrangler.toml     # Workers 설정
├── frontend/             # React 프론트엔드
│   └── src/
│       ├── components/   # UI 컴포넌트
│       ├── pages/        # 페이지 컴포넌트
│       ├── hooks/        # 커스텀 훅
│       ├── api/          # API 클라이언트
│       ├── stores/       # Zustand 스토어
│       └── mocks/        # MSW 핸들러
├── contracts/            # API 계약 (공유 스키마)
├── e2e/                  # E2E 테스트
└── docs/                 # 문서
    └── planning/         # 기획 문서
```

## 개발 환경 설정

### 요구사항
- Node.js 18+
- npm 9+

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/med-herb.git
cd med-herb

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# Frontend 개발 서버 (http://localhost:5173)
cd frontend && npm run dev

# Backend 개발 서버 (http://localhost:8787)
cd workers && npm run dev
```

### 테스트 실행

```bash
# 전체 테스트
npm run test

# Frontend 테스트
cd frontend && npm run test

# Backend 테스트
cd workers && npm run test

# E2E 테스트
npx playwright test
```

### 빌드

```bash
# Frontend 빌드
cd frontend && npm run build

# Backend 빌드
cd workers && npm run build
```

## 배포

### Frontend (Cloudflare Pages)

```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=med-herb-frontend
```

### Backend (Cloudflare Workers)

```bash
cd workers
npm run deploy
```

## 주요 기능

### 사용자 기능
1. **증상 진단 설문** - 증상 선택 + 상황 질문 10~15개
2. **변증 결과** - 한의학적 변증 후보 3개 + 근거
3. **치료축/약재 추천** - 치료 방향 3개 + 약재 5개 + 문헌 근거

### 관리자 기능
- 증상 데이터 CRUD
- 질문 데이터 CRUD
- 변증 데이터 CRUD
- 약재 데이터 CRUD

## API 엔드포인트

### Public API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/symptoms | 증상 목록 조회 |
| GET | /api/questions | 설문 질문 조회 |
| POST | /api/diagnosis | 진단 실행 |

### Admin API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/login | 관리자 로그인 |
| GET/POST/PUT/DELETE | /api/admin/symptoms | 증상 CRUD |
| GET/POST/PUT/DELETE | /api/admin/questions | 질문 CRUD |
| GET/POST/PUT/DELETE | /api/admin/syndromes | 변증 CRUD |
| GET/POST/PUT/DELETE | /api/admin/herbs | 약재 CRUD |

## 문서

- [PRD (제품 요구사항)](docs/planning/01-prd.md)
- [TRD (기술 요구사항)](docs/planning/02-trd.md)
- [User Flow (사용자 흐름도)](docs/planning/03-user-flow.md)
- [Database Design (DB 설계)](docs/planning/04-database-design.md)
- [Design System (디자인 시스템)](docs/planning/05-design-system.md)
- [Tasks (개발 태스크)](docs/planning/06-tasks.md)

## 라이선스

MIT License
