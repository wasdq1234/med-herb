# Coding Convention & AI Collaboration Guide

> 고품질/유지보수/보안을 위한 인간-AI 협업 운영 지침서입니다.
> Cloudflare Workers + React + TypeScript 환경에 맞춤화되었습니다.

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

## 1. 핵심 원칙

### 1.1 신뢰하되, 검증하라 (Don't Trust, Verify)

AI가 생성한 코드는 반드시 검증해야 합니다:

- [ ] 코드 리뷰: 생성된 코드 직접 확인
- [ ] 테스트 실행: 자동화 테스트 통과 확인
- [ ] 보안 검토: 민감 정보 노출 여부 확인
- [ ] 동작 확인: 실제로 실행하여 기대 동작 확인

### 1.2 최종 책임은 인간에게

- AI는 도구이고, 최종 결정과 책임은 개발자에게 있습니다
- 이해하지 못하는 코드는 사용하지 않습니다
- 의심스러운 부분은 반드시 질문합니다

---

## 2. 프로젝트 구조

### 2.1 디렉토리 구조

```
med-herb/
├── contracts/                    # API 계약 (BE/FE 공유)
│   ├── types.ts                 # 공통 타입 정의
│   ├── diagnosis.contract.ts   # 진단 API 계약
│   └── admin.contract.ts       # 관리자 API 계약
│
├── workers/                     # Cloudflare Workers (Backend)
│   ├── src/
│   │   ├── index.ts            # 엔트리 포인트 (Hono app)
│   │   ├── routes/             # API 라우트
│   │   │   ├── diagnosis.ts    # 진단 관련 API
│   │   │   └── admin.ts        # 관리자 API
│   │   ├── schemas/            # Zod 스키마
│   │   │   ├── diagnosis.ts
│   │   │   └── admin.ts
│   │   ├── services/           # 비즈니스 로직
│   │   │   ├── diagnosisService.ts
│   │   │   └── adminService.ts
│   │   ├── db/                 # D1 데이터베이스
│   │   │   ├── schema.ts       # Drizzle 스키마
│   │   │   └── migrations/     # 마이그레이션 파일
│   │   ├── middleware/         # 미들웨어
│   │   │   └── auth.ts         # 인증 미들웨어
│   │   └── utils/              # 유틸리티
│   ├── tests/                  # 테스트
│   │   ├── routes/
│   │   └── services/
│   ├── wrangler.toml           # Cloudflare 설정
│   └── package.json
│
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/         # 재사용 컴포넌트
│   │   │   ├── common/         # 공통 (Button, Input, Card)
│   │   │   ├── diagnosis/      # 진단 관련
│   │   │   └── admin/          # 관리자 관련
│   │   ├── pages/              # 페이지 컴포넌트
│   │   │   ├── Home.tsx
│   │   │   ├── Diagnosis.tsx
│   │   │   ├── Result.tsx
│   │   │   └── admin/
│   │   ├── hooks/              # 커스텀 훅
│   │   │   ├── useDiagnosis.ts
│   │   │   └── useAdmin.ts
│   │   ├── stores/             # Zustand 스토어
│   │   │   ├── diagnosisStore.ts
│   │   │   └── adminStore.ts
│   │   ├── api/                # API 클라이언트
│   │   │   ├── client.ts       # Axios 인스턴스
│   │   │   ├── diagnosis.ts
│   │   │   └── admin.ts
│   │   ├── mocks/              # MSW 모킹
│   │   │   ├── handlers/
│   │   │   └── data/
│   │   ├── types/              # 타입 정의
│   │   └── utils/              # 유틸리티
│   ├── __tests__/              # 테스트
│   ├── e2e/                    # E2E 테스트
│   ├── public/
│   ├── vite.config.ts
│   └── package.json
│
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   └── planning/               # 기획 문서
│       ├── 01-prd.md
│       ├── 02-trd.md
│       ├── 03-user-flow.md
│       ├── 04-database-design.md
│       ├── 05-design-system.md
│       ├── 06-tasks.md
│       └── 07-coding-convention.md
│
├── .github/
│   └── workflows/              # GitHub Actions
│       └── deploy.yml
│
├── package.json                # 루트 (워크스페이스)
├── pnpm-workspace.yaml
└── .gitignore
```

### 2.2 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일 (컴포넌트) | PascalCase | `DiagnosisForm.tsx` |
| 파일 (훅) | camelCase (use 접두사) | `useDiagnosis.ts` |
| 파일 (유틸) | camelCase | `formatDate.ts` |
| 파일 (API) | camelCase | `diagnosisApi.ts` |
| 파일 (스토어) | camelCase (Store 접미사) | `diagnosisStore.ts` |
| 컴포넌트 | PascalCase | `DiagnosisForm` |
| 함수/변수 | camelCase | `getDiagnosisResult` |
| 상수 | UPPER_SNAKE_CASE | `MAX_QUESTIONS` |
| 타입/인터페이스 | PascalCase | `DiagnosisResult` |
| Zod 스키마 | PascalCase + Schema | `DiagnosisRequestSchema` |
| DB 테이블 | snake_case | `diagnosis_log` |
| CSS 클래스 | kebab-case | `diagnosis-card` |
| 환경 변수 | UPPER_SNAKE_CASE | `DATABASE_URL` |

---

## 3. 아키텍처 원칙

### 3.1 뼈대 먼저 (Skeleton First)

1. 전체 구조를 먼저 잡고
2. 빈 함수/컴포넌트로 스켈레톤 생성
3. 하나씩 구현 채워나가기

### 3.2 작은 모듈로 분해

- 한 파일에 **200줄 이하** 권장
- 한 함수에 **50줄 이하** 권장
- 한 컴포넌트에 **100줄 이하** 권장

### 3.3 관심사 분리

| 레이어 | 역할 | 위치 |
|--------|------|------|
| UI | 화면 표시, 사용자 인터랙션 | `components/`, `pages/` |
| 상태 | 클라이언트 상태 관리 | `stores/` |
| API | 서버 통신 | `api/` |
| 훅 | 재사용 로직 | `hooks/` |
| 유틸 | 순수 함수 | `utils/` |

### 3.4 컴포넌트 분류

```
components/
├── common/           # 범용 컴포넌트 (프로젝트 무관하게 재사용)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ProgressBar.tsx
│
├── diagnosis/        # 진단 기능 전용 컴포넌트
│   ├── SymptomSelector.tsx
│   ├── QuestionCard.tsx
│   ├── SyndromeCard.tsx
│   └── HerbTable.tsx
│
└── admin/            # 관리자 기능 전용 컴포넌트
    ├── DataTable.tsx
    └── AdminNav.tsx
```

---

## 4. TypeScript 규칙

### 4.1 타입 정의

```typescript
// 인터페이스: 객체 형태 정의
interface DiagnosisRequest {
  symptomIds: string[];
  answers: QuestionAnswer[];
}

// 타입 별칭: 유니온, 유틸리티 타입
type QuestionType = 'radio' | 'slider';

// Zod 스키마에서 타입 추론 (권장)
import { z } from 'zod';

const DiagnosisRequestSchema = z.object({
  symptomIds: z.array(z.string()).min(1),
  answers: z.array(QuestionAnswerSchema),
});

type DiagnosisRequest = z.infer<typeof DiagnosisRequestSchema>;
```

### 4.2 타입 공유 (contracts/)

```typescript
// contracts/types.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: FieldError[];
}

// contracts/diagnosis.contract.ts
export interface DiagnosisRequest {
  symptomIds: string[];
  answers: QuestionAnswer[];
}

export interface DiagnosisResponse {
  syndromes: SyndromeResult[];
  treatmentAxes: TreatmentAxis[];
  herbs: HerbRecommendation[];
}
```

### 4.3 엄격한 타입 설정

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

---

## 5. React 규칙

### 5.1 함수형 컴포넌트

```typescript
// Good
const DiagnosisForm: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  // ...
};

// Also Good (반환 타입 명시)
function DiagnosisForm(): JSX.Element {
  // ...
}
```

### 5.2 훅 사용 규칙

```typescript
// 커스텀 훅: use 접두사 필수
function useDiagnosis() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const runDiagnosis = async (request: DiagnosisRequest) => {
    setIsLoading(true);
    try {
      const data = await diagnosisApi.run(request);
      setResult(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { result, isLoading, error, runDiagnosis };
}
```

### 5.3 Props 정의

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  children,
}) => {
  // ...
};
```

---

## 6. Workers (Backend) 규칙

### 6.1 Hono 라우트 구조

```typescript
// workers/src/routes/diagnosis.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { DiagnosisRequestSchema } from '../schemas/diagnosis';
import { DiagnosisService } from '../services/diagnosisService';

const diagnosis = new Hono();

diagnosis.get('/symptoms', async (c) => {
  const service = new DiagnosisService(c.env.DB);
  const symptoms = await service.getSymptoms();
  return c.json({ success: true, data: symptoms });
});

diagnosis.post(
  '/run',
  zValidator('json', DiagnosisRequestSchema),
  async (c) => {
    const request = c.req.valid('json');
    const service = new DiagnosisService(c.env.DB);
    const result = await service.runDiagnosis(request);
    return c.json({ success: true, data: result });
  }
);

export default diagnosis;
```

### 6.2 서비스 레이어

```typescript
// workers/src/services/diagnosisService.ts
import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export class DiagnosisService {
  constructor(private db: DrizzleD1Database<typeof schema>) {}

  async getSymptoms() {
    return this.db
      .select()
      .from(schema.symptom)
      .where(eq(schema.symptom.isActive, 1))
      .orderBy(schema.symptom.displayOrder);
  }

  async runDiagnosis(request: DiagnosisRequest): Promise<DiagnosisResult> {
    // 비즈니스 로직
  }
}
```

### 6.3 에러 처리

```typescript
// workers/src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

// 사용
throw new AppError('VALIDATION_ERROR', '최소 1개 이상의 증상을 선택해주세요');
```

---

## 7. AI 소통 원칙

### 7.1 하나의 채팅 = 하나의 작업

- 한 번에 하나의 명확한 작업만 요청
- 작업 완료 후 다음 작업 진행
- 컨텍스트가 길어지면 새 대화 시작

### 7.2 컨텍스트 명시

**좋은 예:**
> "TASKS.md의 T2.1-BE '증상 목록 API' 를 구현해주세요.
> Database Design의 SYMPTOM 테이블을 참조하고,
> TRD의 Hono 라우트 구조를 따라주세요."

**나쁜 예:**
> "API 만들어줘"

### 7.3 프롬프트 템플릿

```markdown
## 작업
{{무엇을 해야 하는지}}

## 참조 문서
- TASKS.md: T{{번호}}
- Database Design: {{테이블명}}
- TRD: 섹션 {{번호}}

## 제약 조건
- {{지켜야 할 것}}

## 예상 결과
- {{생성될 파일}}
- {{기대 동작}}
```

---

## 8. 보안 체크리스트

### 8.1 절대 금지

- [ ] 비밀정보 하드코딩 금지 (API 키, 비밀번호, 토큰)
- [ ] .env 파일 커밋 금지
- [ ] SQL 직접 문자열 조합 금지 (Drizzle ORM 사용)
- [ ] 사용자 입력 그대로 출력 금지 (XSS)

### 8.2 필수 적용

- [ ] 모든 사용자 입력 Zod로 검증
- [ ] 관리자 비밀번호 bcrypt 해싱
- [ ] HTTPS 사용 (Cloudflare 기본 제공)
- [ ] CORS 설정 (허용 도메인 제한)
- [ ] 관리자 API는 JWT 인증 필수

### 8.3 환경 변수 관리

```bash
# wrangler.toml (공개)
[vars]
ENVIRONMENT = "development"

# .dev.vars (로컬, 커밋 X)
JWT_SECRET=local-dev-secret
ADMIN_PASSWORD_HASH=...

# Cloudflare Dashboard (프로덕션)
# Settings > Variables에서 설정
```

---

## 9. 테스트 워크플로우

### 9.1 즉시 실행 검증

```bash
# Workers (Backend)
cd workers && npm run test

# Frontend
cd frontend && npm run test

# E2E
cd frontend && npx playwright test

# 전체 (루트에서)
npm run test:all
```

### 9.2 오류 로그 공유 규칙

오류 발생 시 AI에게 전달할 정보:

```markdown
## 에러
{{전체 에러 메시지}}

## 코드
{{관련 코드 스니펫}}

## 재현
1. {{단계 1}}
2. {{단계 2}}

## 시도한 것
- {{시도 1}}
- {{시도 2}}
```

---

## 10. Git 워크플로우

### 10.1 브랜치 전략

```
main              # 프로덕션 (Cloudflare Pages 자동 배포)
├── develop       # 개발 통합 (프리뷰 배포)
│   ├── feature/feat-1-diagnosis
│   ├── feature/feat-2-result
│   ├── feature/feat-3-herbs
│   ├── feature/feat-0-admin
│   └── fix/{{버그설명}}
```

### 10.2 커밋 메시지

```
<type>(<scope>): <subject>

<body>
```

**타입:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `docs`: 문서
- `test`: 테스트
- `chore`: 기타 (설정, 의존성 등)

**예시:**
```
feat(diagnosis): 증상 선택 API 구현

- GET /api/symptoms 엔드포인트 추가
- Zod 스키마 검증 적용
- TRD 섹션 8.2 구현 완료
```

### 10.3 PR 규칙

- 제목: `[FEAT-N] 기능 설명`
- 본문: 변경 내용, 테스트 방법, 관련 문서
- 리뷰어: 최소 1명
- 체크리스트: 테스트 통과, 린트 통과

---

## 11. 코드 품질 도구

### 11.1 필수 설정

| 도구 | Frontend | Workers |
|------|----------|---------|
| 린터 | ESLint | ESLint |
| 포매터 | Prettier | Prettier |
| 타입 체크 | TypeScript (strict) | TypeScript (strict) |

### 11.2 ESLint 설정

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

### 11.3 스크립트

```json
// package.json (루트)
{
  "scripts": {
    "lint": "npm run lint --workspaces",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "npm run type-check --workspaces",
    "test": "npm run test --workspaces",
    "test:all": "npm run test && cd frontend && npx playwright test"
  }
}
```

---

## Decision Log 참조

| ID | 항목 | 선택 | 근거 |
|----|------|------|------|
| D-07 | 백엔드 | Cloudflare Workers + Hono | Pages 통합, TypeScript 지원 |
| D-08 | 프론트엔드 | React + Vite | 문서 선호, 빠른 빌드 |
| D-09 | 데이터베이스 | Cloudflare D1 + Drizzle | Workers 통합, 타입 안전 |
| D-10 | 상태관리 | Zustand | 가볍고 간단, React 친화 |
| D-11 | 테스트 | Vitest + Playwright | Workers 호환, E2E 지원 |
| D-23 | 패키지 관리 | pnpm workspace | 모노레포 효율성 |
| D-24 | API 검증 | Zod | 런타임 검증, 타입 추론 |
