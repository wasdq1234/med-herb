# Design System (기초 디자인 시스템)

> 비기술자도 이해할 수 있는 디자인 언어로 작성합니다.
> 의료/진단 서비스에 적합한 신뢰감 있는 톤앤매너를 반영합니다.

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

## 1. 디자인 철학

### 1.1 핵심 가치

| 가치 | 설명 | 구현 방법 |
|------|------|----------|
| **신뢰감** | 의료 정보를 다루므로 전문적이고 믿을 수 있는 느낌 | 차분한 컬러, 깔끔한 레이아웃, 근거 명시 |
| **간결함** | 복잡한 정보를 쉽게 이해할 수 있도록 | 단계별 진행, 충분한 여백, 명확한 계층 |
| **안내감** | 사용자가 헤매지 않고 진행할 수 있도록 | 진행률 표시, 명확한 CTA, 설명 텍스트 |

### 1.2 참고 서비스 (무드보드)

| 서비스 | 참고할 점 | 참고하지 않을 점 |
|--------|----------|-----------------|
| 토스 | 깔끔한 카드 UI, 단계별 진행 | 금융 특화 용어 |
| 헤드스페이스 | 차분한 컬러, 여유로운 여백 | 과한 일러스트, 애니메이션 |
| 네이버 건강 | 신뢰감 있는 의료 정보 표현 | 정보 과부하, 광고 배치 |

### 1.3 톤앤매너

- **존댓말 사용**: 정중하고 전문적인 느낌
- **쉬운 말 사용**: 전문 용어는 괄호로 쉬운 설명 병기
- **안심 문구**: "참고용 정보입니다" 등 법적 고지 포함

---

## 2. 컬러 팔레트

### 2.1 역할 기반 컬러

| 역할 | 컬러명 | Hex | 사용처 |
|------|--------|-----|--------|
| **Primary** | 한방 그린 | `#2D8F6F` | 주요 버튼, 강조, 진행 바 |
| **Primary Light** | 라이트 그린 | `#E8F5F0` | 호버 배경, 선택 상태 |
| **Primary Dark** | 다크 그린 | `#1E6B52` | 버튼 호버, 활성 상태 |
| **Secondary** | 웜 브라운 | `#8B6F47` | 보조 강조, 전통 느낌 |
| **Surface** | 화이트 | `#FFFFFF` | 카드, 컨테이너 |
| **Background** | 소프트 그레이 | `#F8F9FA` | 페이지 배경 |
| **Border** | 라이트 그레이 | `#E5E7EB` | 테두리, 구분선 |
| **Text Primary** | 다크 그레이 | `#1F2937` | 주요 텍스트 |
| **Text Secondary** | 미디엄 그레이 | `#6B7280` | 보조 텍스트, 설명 |
| **Text Muted** | 라이트 그레이 | `#9CA3AF` | 비활성 텍스트, 힌트 |

### 2.2 피드백 컬러

| 상태 | 컬러명 | Hex | 사용처 |
|------|--------|-----|--------|
| **Success** | 성공 그린 | `#22C55E` | 완료, 성공 메시지 |
| **Warning** | 경고 옐로우 | `#EAB308` | 주의 사항 |
| **Error** | 에러 레드 | `#EF4444` | 오류, 필수 입력 |
| **Info** | 정보 블루 | `#3B82F6` | 도움말, 안내 |

### 2.3 변증 결과 카드 컬러

| 변증 유형 | 배경 컬러 | Hex | 의미 |
|----------|----------|-----|------|
| 기허 계열 | 연한 노랑 | `#FEF9E7` | 기운 부족 |
| 담음 계열 | 연한 파랑 | `#EBF5FF` | 수분 정체 |
| 어혈 계열 | 연한 보라 | `#F5F0FF` | 혈액 순환 |

### 2.4 다크 모드

- MVP에서는 라이트 모드만 지원
- 다크 모드는 v2에서 추가 예정

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

| 용도 | 폰트 | 대안 |
|------|------|------|
| 본문 | Pretendard | -apple-system, BlinkMacSystemFont, system-ui, sans-serif |
| 한자/영문 | Noto Sans KR | sans-serif |

### 3.2 타입 스케일

| 이름 | 크기 | 줄높이 | 굵기 | 용도 |
|------|------|--------|------|------|
| Display | 32px | 1.2 | Bold (700) | 메인 페이지 제목 |
| H1 | 26px | 1.3 | Bold (700) | 페이지 제목 |
| H2 | 22px | 1.4 | SemiBold (600) | 섹션 제목 |
| H3 | 18px | 1.4 | SemiBold (600) | 카드 제목, 변증명 |
| Body Large | 16px | 1.6 | Regular (400) | 강조 본문, 질문 텍스트 |
| Body | 15px | 1.6 | Regular (400) | 기본 본문 |
| Body Small | 14px | 1.5 | Regular (400) | 설명, 보조 텍스트 |
| Caption | 12px | 1.4 | Regular (400) | 부가 정보, 법적 고지 |

### 3.3 텍스트 스타일 예시

```css
/* 질문 텍스트 */
.question-text {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: #1F2937;
}

/* 변증 카드 제목 */
.syndrome-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: #1F2937;
}

/* 근거 텍스트 */
.evidence-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #6B7280;
}
```

---

## 4. 간격 토큰 (Spacing)

| 이름 | 값 | CSS Variable | 용도 |
|------|-----|--------------|------|
| xs | 4px | `--spacing-xs` | 아이콘-텍스트 간격 |
| sm | 8px | `--spacing-sm` | 인라인 요소 간격 |
| md | 16px | `--spacing-md` | 요소 내부 패딩 |
| lg | 24px | `--spacing-lg` | 카드 내부 패딩 |
| xl | 32px | `--spacing-xl` | 섹션 간 간격 |
| 2xl | 48px | `--spacing-2xl` | 페이지 상하 여백 |
| 3xl | 64px | `--spacing-3xl` | 대형 섹션 구분 |

---

## 5. 기본 컴포넌트

### 5.1 버튼 (Button)

#### Primary Button (주요 액션)

| 상태 | 배경 | 텍스트 | 기타 |
|------|------|--------|------|
| 기본 | `#2D8F6F` | `#FFFFFF` | border-radius: 8px |
| 호버 | `#1E6B52` | `#FFFFFF` | cursor: pointer |
| 포커스 | `#1E6B52` | `#FFFFFF` | 포커스 링 2px |
| 비활성 | `#2D8F6F` 50% | `#FFFFFF` | cursor: not-allowed |
| 로딩 | `#2D8F6F` | 스피너 | pointer-events: none |

#### Secondary Button (보조 액션)

| 상태 | 배경 | 텍스트 | 테두리 |
|------|------|--------|--------|
| 기본 | 투명 | `#2D8F6F` | 1px solid `#2D8F6F` |
| 호버 | `#E8F5F0` | `#1E6B52` | 1px solid `#1E6B52` |

#### Ghost Button (최소 강조)

| 상태 | 배경 | 텍스트 | 기타 |
|------|------|--------|------|
| 기본 | 투명 | `#6B7280` | 밑줄 없음 |
| 호버 | 투명 | `#1F2937` | text-decoration: underline |

#### 버튼 크기

| 크기 | 높이 | 패딩 (좌우) | 폰트 |
|------|------|------------|------|
| Large | 48px | 24px | 16px SemiBold |
| Medium | 40px | 20px | 15px Medium |
| Small | 32px | 16px | 14px Medium |

### 5.2 입력 필드 (Input)

#### 상태별 스타일

| 상태 | 테두리 | 배경 | 기타 |
|------|--------|------|------|
| 기본 | 1px `#E5E7EB` | `#FFFFFF` | border-radius: 8px |
| 포커스 | 2px `#2D8F6F` | `#FFFFFF` | 포커스 링 |
| 에러 | 2px `#EF4444` | `#FEF2F2` | 에러 메시지 표시 |
| 비활성 | 1px `#E5E7EB` | `#F3F4F6` | 입력 불가 |

#### 입력 필드 크기

- 높이: 44px (접근성 최소 기준)
- 내부 패딩: 12px 16px
- 폰트: 15px

### 5.3 체크박스 (Checkbox) - 증상 선택용

| 상태 | 스타일 |
|------|--------|
| 기본 | 20x20px, 테두리 `#D1D5DB`, 배경 흰색 |
| 호버 | 테두리 `#2D8F6F` |
| 선택됨 | 배경 `#2D8F6F`, 체크 아이콘 흰색 |
| 포커스 | 포커스 링 2px `#2D8F6F` |

### 5.4 라디오 버튼 (Radio) - 질문 응답용

| 상태 | 스타일 |
|------|--------|
| 기본 | 20x20px 원형, 테두리 `#D1D5DB` |
| 호버 | 테두리 `#2D8F6F` |
| 선택됨 | 테두리 `#2D8F6F`, 내부 원 `#2D8F6F` |

### 5.5 슬라이더 (Slider) - 정도 선택용

- 트랙: 높이 4px, 배경 `#E5E7EB`
- 채워진 트랙: 배경 `#2D8F6F`
- 핸들: 24x24px 원형, 배경 `#FFFFFF`, 테두리 `#2D8F6F`
- 라벨: 양끝에 텍스트 표시

### 5.6 카드 (Card)

#### 기본 카드

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

#### 변증 결과 카드

```css
.syndrome-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-left: 4px solid #2D8F6F; /* 강조 */
  border-radius: 12px;
  padding: 24px;
}

.syndrome-card:hover {
  border-color: #2D8F6F;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

#### 약재 테이블 카드

```css
.herb-table-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden; /* 테이블 모서리 라운드 */
}
```

### 5.7 진행률 표시 (Progress)

```css
.progress-bar {
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
}

.progress-fill {
  height: 100%;
  background: #2D8F6F;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #6B7280;
  margin-top: 8px;
}
```

---

## 6. 레이아웃

### 6.1 페이지 구조

```
┌─────────────────────────────────────────────────────┐
│  Header (로고, 네비게이션)            height: 64px  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Main Content                                       │
│  max-width: 800px (진단 페이지)                     │
│  max-width: 1200px (관리자 페이지)                  │
│  padding: 48px (상하)                               │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer (법적 고지, 링크)             height: auto  │
└─────────────────────────────────────────────────────┘
```

### 6.2 그리드 시스템

- 기본 컨테이너: `max-width: 800px` (진단 플로우)
- 관리자 컨테이너: `max-width: 1200px`
- 거터: 24px
- 여백: 16px (모바일), 24px (태블릿), 48px (데스크톱)

### 6.3 질문 카드 레이아웃

```
┌─────────────────────────────────────────────────────┐
│  진행률: 3/10                          [이전] [다음]│
├─────────────────────────────────────────────────────┤
│  ═══════════════════════════░░░░░░░░░░  30%        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Q3. 평소 피로감을 느끼는 정도는?                   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ○ 거의 없다                                 │   │
│  ├─────────────────────────────────────────────┤   │
│  │ ○ 가끔 느낀다                               │   │
│  ├─────────────────────────────────────────────┤   │
│  │ ● 자주 느낀다                               │   │
│  ├─────────────────────────────────────────────┤   │
│  │ ○ 항상 느낀다                               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│                              [ 다음으로 ]           │
└─────────────────────────────────────────────────────┘
```

---

## 7. 접근성 체크리스트

### 7.1 필수 (MVP)

- [x] **색상 대비**: 텍스트/배경 대비율 4.5:1 이상 (WCAG AA)
- [x] **포커스 링**: 키보드 탐색 시 포커스 표시 명확 (2px solid)
- [x] **클릭 영역**: 버튼/링크 최소 44x44px
- [x] **에러 표시**: 색상만으로 구분하지 않음 (아이콘 + 텍스트)
- [x] **폰트 크기**: 본문 최소 14px, 권장 15px
- [x] **줄 간격**: 본문 최소 1.5
- [x] **레이블**: 모든 입력 필드에 레이블 또는 aria-label

### 7.2 권장 (v2)

- [ ] 키보드 전체 탐색 가능 (Tab, Enter, Space, Arrow)
- [ ] 스크린 리더 호환 (ARIA 라벨, 역할)
- [ ] 애니메이션 줄이기 옵션 (prefers-reduced-motion)
- [ ] 고대비 모드 지원

---

## 8. 아이콘

### 8.1 아이콘 라이브러리

| 옵션 | 설명 | 선택 이유 |
|------|------|----------|
| **Lucide** | 깔끔한 라인 아이콘 | 의료 서비스에 적합한 깔끔함 |

### 8.2 주요 아이콘 목록

| 용도 | 아이콘명 | 크기 |
|------|---------|------|
| 체크 | Check | 20px |
| 화살표 (다음) | ChevronRight | 20px |
| 화살표 (이전) | ChevronLeft | 20px |
| 정보 | Info | 16px |
| 경고 | AlertTriangle | 16px |
| 외부 링크 | ExternalLink | 16px |
| 로딩 | Loader2 | 20px (애니메이션) |
| 근거 | FileText | 16px |
| 약재 | Leaf | 20px |

### 8.3 아이콘 사용 규칙

- 크기: 16px (작음), 20px (기본), 24px (큼)
- 색상: 텍스트와 동일하게 상속 (`currentColor`)
- 버튼 내: 텍스트 왼쪽에 배치, 8px 간격
- 단독 사용 시: aria-label 필수

---

## 9. TailwindCSS 설정

### 9.1 tailwind.config.js

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D8F6F',
          light: '#E8F5F0',
          dark: '#1E6B52',
        },
        secondary: '#8B6F47',
        surface: '#FFFFFF',
        background: '#F8F9FA',
        border: '#E5E7EB',
        success: '#22C55E',
        warning: '#EAB308',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['26px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['22px', { lineHeight: '1.4', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        'DEFAULT': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
```

---

## Decision Log 참조

| ID | 항목 | 선택 | 근거 | 영향 |
|----|------|------|------|------|
| D-05 | UI 톤 | 신뢰감 + 깔끔함 | 의료 서비스 특성, 사용자 요청 | 컬러, 타이포그래피 결정 |
| D-20 | Primary Color | 한방 그린 #2D8F6F | 한의학 느낌 + 신뢰감 | 전체 UI 강조색 |
| D-21 | 폰트 | Pretendard | 가독성, 한글 최적화 | 시스템 폰트 대안 확보 |
| D-22 | 아이콘 | Lucide | 깔끔함, React 지원 | 일관된 아이콘 스타일 |
