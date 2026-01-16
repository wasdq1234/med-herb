# TRD (기술 요구사항 정의서)

> 개발자/AI 코딩 파트너가 참조하는 기술 문서입니다.
> 기술 표현을 사용하되, "왜 이 선택인지"를 함께 설명합니다.

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 사용자 증상 입력 → 한의학적 변증 도출 → 치료법/약재 정보 제공 |
| 2 | 페르소나 | 건강에 관심 있는 30-50대 일반인 |
| 3 | 핵심 기능 | FEAT-1: 증상 진단 설문 → 변증 결과 → 치료축/약재 추천 |
| 4 | 성공 지표 (노스스타) | 진단 완료율 (설문 시작 → 결과 확인까지 완료한 비율) |
| 5 | 입력 지표 | 일일 진단 시작 수, 결과 페이지 체류 시간 |
| 6 | 비기능 요구 | 진단 결과 산출 3초 이내, 관리자 인증 보안 |
| 7 | Out-of-scope | 모바일 앱, 소셜 로그인, 결제 시스템 |
| 8 | Top 리스크 | 진단 로직/데이터가 클라이언트로부터 늦게 전달될 경우 |
| 9 | 완화/실험 | 샘플 데이터로 먼저 개발, 로직 인터페이스 추상화 |
| 10 | 다음 단계 | 샘플 질문/변증/약재 데이터로 프로토타입 구현 |

---

## 1. 시스템 아키텍처

### 1.1 고수준 아키텍처

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Cloudflare Edge Network                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐  │
│  │  Cloudflare     │────▶│  Cloudflare     │────▶│  Cloudflare  │  │
│  │  Pages          │     │  Workers        │     │  D1 (SQLite) │  │
│  │  (React SPA)    │     │  (API Server)   │     │              │  │
│  └─────────────────┘     └─────────────────┘     └──────────────┘  │
│        │                        │                                    │
│        │                        │                                    │
│        ▼                        ▼                                    │
│  ┌─────────────────┐     ┌─────────────────┐                        │
│  │  Static Assets  │     │  KV Storage     │                        │
│  │  (CSS, JS, etc) │     │  (Session/Cache)│                        │
│  └─────────────────┘     └─────────────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 컴포넌트 설명

| 컴포넌트 | 역할 | 왜 이 선택? |
|----------|------|-------------|
| Cloudflare Pages | React SPA 호스팅, 정적 자산 배포 | 사용자 요청대로 Pages 배포, 무료 SSL, 글로벌 CDN |
| Cloudflare Workers | API 서버, 비즈니스 로직 처리 | Pages와 네이티브 통합, 서버리스로 인프라 관리 불필요 |
| Cloudflare D1 | 메인 데이터베이스 (SQLite) | Workers와 네이티브 통합, 무료 티어로 MVP 충분 |
| Cloudflare KV | 세션 저장, 캐싱 | 관리자 세션 저장용, 빠른 읽기 성능 |

---

## 2. 권장 기술 스택

### 2.1 프론트엔드

| 항목 | 선택 | 이유 | 벤더 락인 리스크 |
|------|------|------|-----------------|
| 프레임워크 | React 18 | 요구사항 문서에서 선호 명시, 풍부한 생태계 | 낮음 |
| 빌드 도구 | Vite | 빠른 개발 서버, HMR 지원, 모던 번들링 | 낮음 |
| 언어 | TypeScript | 타입 안전성, 개발자 경험 향상 | - |
| 스타일링 | TailwindCSS | 유틸리티 기반, 빠른 스타일링, 번들 사이즈 최적화 | 낮음 |
| 상태관리 | Zustand | 가볍고 간단, React 친화적, 보일러플레이트 최소 | 낮음 |
| HTTP 클라이언트 | Axios | 인터셉터 지원, 에러 처리 편리 | 낮음 |
| 폼 관리 | React Hook Form | 성능 최적화, 유효성 검사 통합 | 낮음 |

### 2.2 백엔드 (Cloudflare Workers)

| 항목 | 선택 | 이유 | 벤더 락인 리스크 |
|------|------|------|-----------------|
| 런타임 | Cloudflare Workers | Pages 배포 요청, 서버리스, 글로벌 엣지 | 중간 (Cloudflare 종속) |
| 프레임워크 | Hono | Workers 최적화, Express 유사 API, 타입 안전 | 낮음 (표준 Web API 기반) |
| 언어 | TypeScript | 프론트엔드와 통일, 타입 공유 가능 | - |
| ORM | Drizzle ORM | D1 네이티브 지원, 타입 안전, 경량 | 낮음 |
| 검증 | Zod | TypeScript 네이티브, 런타임 검증 | 낮음 |
| 인증 | jose (JWT) | Workers 호환, 경량 JWT 라이브러리 | 낮음 |

### 2.3 데이터베이스

| 항목 | 선택 | 이유 |
|------|------|------|
| 메인 DB | Cloudflare D1 (SQLite) | Workers 네이티브 통합, SQL 기반 확장성, 무료 티어 충분 |
| 세션/캐시 | Cloudflare KV | 관리자 세션 저장, 빠른 읽기, Workers 네이티브 |

### 2.4 인프라

| 항목 | 선택 | 이유 |
|------|------|------|
| 배포 | Cloudflare Pages | 사용자 요청, Git 연동 자동 배포 |
| CI/CD | GitHub Actions | Pages와 연동, 무료 티어 충분 |
| 도메인 | Cloudflare DNS | Pages와 통합, 무료 SSL |

---

## 3. 비기능 요구사항

### 3.1 성능

| 항목 | 요구사항 | 측정 방법 |
|------|----------|----------|
| 진단 결과 산출 | < 3초 | API 응답 시간 모니터링 |
| 초기 로딩 (FCP) | < 2초 | Lighthouse |
| API 응답 (P95) | < 500ms | Workers Analytics |
| 번들 사이즈 | < 300KB (gzip) | Vite 빌드 리포트 |

### 3.2 보안

| 항목 | 요구사항 |
|------|----------|
| 관리자 인증 | JWT + Refresh Token (KV 저장) |
| 비밀번호 | bcrypt 해싱 (Workers 호환 라이브러리) |
| HTTPS | 필수 (Cloudflare 기본 제공) |
| 입력 검증 | Zod 스키마 기반 서버 측 검증 필수 |
| CORS | 허용 도메인 제한 |
| Rate Limiting | Workers 기반 요청 제한 |

### 3.3 확장성

| 항목 | 현재 (MVP) | 목표 (v2) |
|------|------------|----------|
| 동시 사용자 | 100명 | 1,000명 |
| 질문 데이터 | 100개 | 500개 |
| 변증 유형 | 20개 | 50개 |
| 약재 데이터 | 100개 | 300개 |

---

## 4. 외부 API 연동

### 4.1 인증

| 서비스 | 용도 | 필수/선택 | 연동 방식 |
|--------|------|----------|----------|
| 없음 (자체 인증) | 관리자 로그인 | 필수 | JWT + KV 세션 |

> MVP에서는 소셜 로그인 없이 자체 관리자 인증만 구현합니다.

### 4.2 기타 서비스

| 서비스 | 용도 | 필수/선택 | 비고 |
|--------|------|----------|------|
| 없음 | - | - | MVP는 외부 연동 없음 |

---

## 5. 접근제어/권한 모델

### 5.1 역할 정의

| 역할 | 설명 | 권한 |
|------|------|------|
| Guest | 비로그인 사용자 | 진단 설문 이용, 결과 조회 |
| Admin | 관리자 | 전체 데이터 CRUD, 로직 관리 |

> 일반 사용자 회원가입은 MVP에서 제외됩니다.

### 5.2 권한 매트릭스

| 리소스 | Guest | Admin |
|--------|-------|-------|
| 설문 질문 조회 | O | O |
| 진단 결과 생성 | O | O |
| 질문 데이터 관리 | - | O |
| 변증 데이터 관리 | - | O |
| 약재 데이터 관리 | - | O |
| 진단 로직 관리 | - | O |

---

## 6. 데이터 생명주기

### 6.1 원칙

- **최소 수집**: 진단에 필요한 증상/응답 데이터만 수집
- **비회원 기반**: 사용자 개인정보 수집하지 않음
- **세션 기반**: 진단 결과는 세션 동안만 유지 (저장하지 않음)

### 6.2 데이터 흐름

```
사용자 입력 → 진단 로직 처리 → 결과 표시 → 세션 종료 시 삭제
```

| 데이터 유형 | 보존 기간 | 삭제/익명화 |
|------------|----------|------------|
| 진단 응답 | 세션 동안만 | 세션 종료 시 삭제 |
| 관리자 계정 | 영구 | 수동 삭제 |
| 마스터 데이터 (질문/변증/약재) | 영구 | 관리자 관리 |
| 분석 로그 (익명) | 30일 | 자동 삭제 |

---

## 7. 테스트 전략 (Contract-First TDD)

### 7.1 개발 방식: Contract-First Development

본 프로젝트는 **계약 우선 개발(Contract-First Development)** 방식을 채택합니다.
BE/FE가 독립적으로 병렬 개발하면서도 통합 시 호환성을 보장합니다.

```
┌─────────────────────────────────────────────────────────────┐
│                    Contract-First 흐름                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 계약 정의 (Phase 0)                                     │
│     ├─ API 계약: contracts/*.contract.ts                   │
│     ├─ Zod 스키마: workers/src/schemas/*.ts                │
│     └─ 타입 동기화: FE/BE 공유 타입                         │
│                                                             │
│  2. 테스트 선행 작성 (RED)                                  │
│     ├─ BE 테스트: workers/tests/*.test.ts                  │
│     ├─ FE 테스트: frontend/src/__tests__/**/*.test.ts      │
│     └─ 모든 테스트가 실패하는 상태 (정상!)                  │
│                                                             │
│  3. Mock 생성 (FE 독립 개발용)                              │
│     └─ MSW 핸들러: frontend/src/mocks/handlers/*.ts        │
│                                                             │
│  4. 병렬 구현 (RED→GREEN)                                   │
│     ├─ BE: 테스트 통과 목표로 구현                          │
│     └─ FE: Mock API로 개발 → 나중에 실제 API 연결          │
│                                                             │
│  5. 통합 검증                                               │
│     └─ Mock 제거 → E2E 테스트                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 테스트 피라미드

| 레벨 | 도구 | 커버리지 목표 | 위치 |
|------|------|-------------|------|
| Unit | Vitest | >= 80% | workers/tests/, frontend/src/__tests__/ |
| Integration | Vitest + MSW | Critical paths | tests/integration/ |
| E2E | Playwright | Key user flows | e2e/ |

### 7.3 테스트 도구

**백엔드 (Workers):**
| 도구 | 용도 |
|------|------|
| Vitest | 테스트 실행 (Workers 호환) |
| Miniflare | Workers 로컬 에뮬레이션 |
| @cloudflare/vitest-pool-workers | Workers 테스트 풀 |

**프론트엔드:**
| 도구 | 용도 |
|------|------|
| Vitest | 테스트 실행 |
| React Testing Library | 컴포넌트 테스트 |
| MSW (Mock Service Worker) | API 모킹 |
| Playwright | E2E 테스트 |

### 7.4 계약 파일 구조

```
project/
├── contracts/                    # API 계약 (BE/FE 공유)
│   ├── types.ts                 # 공통 타입 정의
│   ├── diagnosis.contract.ts   # 진단 API 계약
│   └── admin.contract.ts       # 관리자 API 계약
│
├── workers/                     # Cloudflare Workers (Backend)
│   ├── src/
│   │   ├── schemas/            # Zod 스키마 (계약과 동기화)
│   │   │   ├── diagnosis.ts
│   │   │   └── admin.ts
│   │   ├── routes/             # API 라우트
│   │   └── services/           # 비즈니스 로직
│   └── tests/                  # API 테스트 (계약 기반)
│       ├── diagnosis.test.ts
│       └── admin.test.ts
│
└── frontend/                   # React SPA
    ├── src/
    │   ├── mocks/
    │   │   ├── handlers/       # MSW Mock 핸들러
    │   │   │   ├── diagnosis.ts
    │   │   │   └── admin.ts
    │   │   └── data/           # Mock 데이터
    │   └── __tests__/          # 컴포넌트 테스트
    └── e2e/                    # E2E 테스트
```

### 7.5 TDD 사이클

모든 기능 개발은 다음 사이클을 따릅니다:

```
RED    → 실패하는 테스트 먼저 작성 (Phase 0에서 완료)
GREEN  → 테스트를 통과하는 최소한의 코드 구현
REFACTOR → 테스트 통과 유지하며 코드 개선
```

### 7.6 품질 게이트

**병합 전 필수 통과:**
- [ ] 모든 단위 테스트 통과
- [ ] 커버리지 >= 80%
- [ ] 린트 통과 (ESLint)
- [ ] 타입 체크 통과 (tsc)
- [ ] E2E 테스트 통과 (해당 기능)

**검증 명령어:**
```bash
# 백엔드 (Workers)
cd workers && npm run test
npm run lint
npm run type-check

# 프론트엔드
cd frontend && npm run test -- --coverage
npm run lint
npm run type-check

# E2E
npx playwright test
```

---

## 8. API 설계 원칙

### 8.1 RESTful 규칙

| 메서드 | 용도 | 예시 |
|--------|------|------|
| GET | 조회 | GET /api/questions |
| POST | 생성/진단 실행 | POST /api/diagnosis |
| PUT | 전체 수정 | PUT /api/admin/questions/{id} |
| PATCH | 부분 수정 | PATCH /api/admin/questions/{id} |
| DELETE | 삭제 | DELETE /api/admin/questions/{id} |

### 8.2 API 엔드포인트 설계

**공개 API (Guest 접근 가능):**
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| /api/symptoms | GET | 증상 목록 조회 |
| /api/questions | GET | 설문 질문 조회 |
| /api/diagnosis | POST | 진단 실행 및 결과 반환 |

**관리자 API (Admin 전용):**
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| /api/admin/login | POST | 관리자 로그인 |
| /api/admin/symptoms | GET/POST/PUT/DELETE | 증상 CRUD |
| /api/admin/questions | GET/POST/PUT/DELETE | 질문 CRUD |
| /api/admin/syndromes | GET/POST/PUT/DELETE | 변증 CRUD |
| /api/admin/herbs | GET/POST/PUT/DELETE | 약재 CRUD |
| /api/admin/logic | GET/PUT | 진단 로직 관리 |

### 8.3 응답 형식

**성공 응답:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "totalPages": 10,
    "totalItems": 100
  }
}
```

**에러 응답:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": [
      { "field": "symptomIds", "message": "최소 1개 이상 선택해야 합니다" }
    ]
  }
}
```

### 8.4 API 버저닝

| 방식 | 예시 | 채택 여부 |
|------|------|----------|
| URL 경로 | /api/v1/diagnosis | 권장 (MVP에서는 v1 생략) |

---

## 9. 병렬 개발 지원 (Git Worktree)

### 9.1 개요

BE/FE를 완전히 독립된 환경에서 병렬 개발할 때 Git Worktree를 사용합니다.

### 9.2 Worktree 구조

```
~/projects/
├── med-herb/                    # 메인 (main 브랜치)
├── med-herb-diagnosis-be/       # Worktree: feature/diagnosis-be
├── med-herb-diagnosis-fe/       # Worktree: feature/diagnosis-fe
├── med-herb-admin-be/           # Worktree: feature/admin-be
└── med-herb-admin-fe/           # Worktree: feature/admin-fe
```

### 9.3 명령어

```bash
# Worktree 생성
git worktree add ../med-herb-diagnosis-be -b feature/diagnosis-be
git worktree add ../med-herb-diagnosis-fe -b feature/diagnosis-fe

# 각 Worktree에서 독립 작업
cd ../med-herb-diagnosis-be && npm run test
cd ../med-herb-diagnosis-fe && npm run test

# 테스트 통과 후 병합
git checkout main
git merge --no-ff feature/diagnosis-be
git merge --no-ff feature/diagnosis-fe

# Worktree 정리
git worktree remove ../med-herb-diagnosis-be
git worktree remove ../med-herb-diagnosis-fe
```

### 9.4 병합 규칙

| 조건 | 병합 가능 |
|------|----------|
| 단위 테스트 통과 (GREEN) | 필수 |
| 커버리지 >= 80% | 필수 |
| 린트/타입 체크 통과 | 필수 |
| E2E 테스트 통과 | 권장 |

---

## 10. 프로젝트 구조

```
med-herb/
├── contracts/                   # API 계약 (공유)
│   ├── types.ts
│   ├── diagnosis.contract.ts
│   └── admin.contract.ts
│
├── workers/                     # Cloudflare Workers (Backend)
│   ├── src/
│   │   ├── index.ts            # 엔트리 포인트
│   │   ├── routes/
│   │   │   ├── diagnosis.ts
│   │   │   └── admin.ts
│   │   ├── schemas/            # Zod 스키마
│   │   ├── services/           # 비즈니스 로직
│   │   ├── db/                 # D1 관련
│   │   │   ├── schema.ts       # Drizzle 스키마
│   │   │   └── migrations/
│   │   └── middleware/         # 인증 등
│   ├── tests/
│   ├── wrangler.toml
│   └── package.json
│
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── stores/             # Zustand
│   │   ├── api/                # API 클라이언트
│   │   ├── mocks/              # MSW
│   │   └── __tests__/
│   ├── public/
│   ├── e2e/
│   ├── vite.config.ts
│   └── package.json
│
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   └── planning/
│       ├── 01-prd.md
│       ├── 02-trd.md
│       └── ...
│
└── package.json                 # 루트 (워크스페이스)
```

---

## Decision Log 참조

| ID | 항목 | 선택 | 근거 | 영향 |
|----|------|------|------|------|
| D-07 | 백엔드 | Cloudflare Workers + D1 | Pages 배포 요청, 서버리스, 통합 환경 | Hono 프레임워크 사용 |
| D-08 | 프론트엔드 | React + Vite | 문서 선호, 빠른 개발, 풍부한 생태계 | TypeScript 기본 |
| D-09 | 데이터베이스 | Cloudflare D1 | Workers 통합, 무료 티어 충분 | Drizzle ORM 사용 |
| D-10 | 세션 저장 | Cloudflare KV | 관리자 세션용, 빠른 읽기 | JWT + KV 조합 |
| D-11 | 테스트 | Vitest + Playwright | Workers 호환, 프론트/백 통일 | MSW로 API 모킹 |
