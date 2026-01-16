/**
 * 테스트 유틸리티 함수
 *
 * Hono 앱 테스트용 헬퍼 함수 제공:
 * - 인증 토큰 생성
 * - 공통 테스트 픽스처
 * - API 요청 헬퍼
 */

import type { Env } from '../../types';

/**
 * API 응답 타입 (테스트용)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse = any;

/**
 * 테스트용 관리자 인증 토큰 생성
 *
 * 실제 구현 시 JWT를 사용하지만, 테스트에서는 고정된 토큰 사용
 */
export function createAuthToken(adminId: string = 'test-admin-1'): string {
  // Phase 1에서 실제 JWT 구현 시 업데이트 필요
  return `Bearer test-token-${adminId}`;
}

/**
 * 테스트용 증상 픽스처
 */
export const mockSymptoms = [
  {
    id: 'symptom-1',
    name: '두통',
    description: '머리가 아픈 증상',
    category: '통증',
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'symptom-2',
    name: '피로',
    description: '만성적인 피로감',
    category: '전신',
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * 테스트용 질문 픽스처
 */
export const mockQuestions = [
  {
    id: 'question-1',
    symptomId: 'symptom-1',
    questionText: '두통의 위치는 어디입니까?',
    questionType: 'radio' as const,
    options: [
      { value: 'front', label: '앞머리' },
      { value: 'back', label: '뒷머리' },
      { value: 'side', label: '옆머리' },
    ],
    sliderMin: null,
    sliderMax: null,
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'question-2',
    symptomId: 'symptom-1',
    questionText: '두통의 강도는 어느 정도입니까?',
    questionType: 'slider' as const,
    options: null,
    sliderMin: 1,
    sliderMax: 10,
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * 테스트용 변증 픽스처
 */
export const mockSyndromes = [
  {
    id: 'syndrome-1',
    name: '간기울결',
    description: '간의 기운이 울체된 상태',
    category: '기울',
    characteristics: '스트레스, 감정 불안정',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'syndrome-2',
    name: '기혈양허',
    description: '기와 혈이 모두 부족한 상태',
    category: '허증',
    characteristics: '피로, 무기력',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * 테스트용 약재 픽스처
 */
export const mockHerbs = [
  {
    id: 'herb-1',
    name: '시호',
    scientificName: 'Bupleurum falcatum',
    effect: '간기울결 개선',
    category: '해표약',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'herb-2',
    name: '당귀',
    scientificName: 'Angelica sinensis',
    effect: '보혈 작용',
    category: '보익약',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * 테스트용 진단 요청 픽스처
 */
export const mockDiagnosisRequest = {
  symptomIds: ['symptom-1', 'symptom-2'],
  answers: [
    { questionId: 'question-1', value: 'front' },
    { questionId: 'question-2', value: 7 },
  ],
};

/**
 * 테스트용 진단 응답 픽스처
 */
export const mockDiagnosisResponse = {
  success: true,
  data: {
    sessionId: 'session-123',
    syndromes: [
      {
        id: 'syndrome-1',
        name: '간기울결',
        description: '간의 기운이 울체된 상태',
        matchScore: 85,
        evidences: ['두통 (앞머리)', '스트레스성 증상'],
      },
    ],
    treatmentAxes: [
      {
        id: 'axis-1',
        name: '소간해울',
        description: '간기를 풀어주는 치료',
      },
    ],
    herbs: [
      {
        id: 'herb-1',
        name: '시호',
        scientificName: 'Bupleurum falcatum',
        effect: '간기울결 개선',
        relevanceScore: 90,
        evidence: '간기울결에 효과적',
        referenceUrl: null,
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
  },
};

/**
 * 테스트용 관리자 픽스처
 */
export const mockAdmin = {
  id: 'admin-1',
  username: 'testadmin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

/**
 * 테스트용 로그인 응답 픽스처
 */
export const mockLoginResponse = {
  success: true,
  data: {
    admin: mockAdmin,
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    expiresIn: 3600,
  },
};

/**
 * 페이지네이션 응답 헬퍼
 */
export function createPaginatedResponse<T>(items: T[], page = 1, limit = 20) {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = items.slice(start, end);

  return {
    success: true,
    data: {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
  };
}

/**
 * API 에러 응답 헬퍼
 */
export function createErrorResponse(error: string, message?: string, details?: Array<{ field: string; message: string }>) {
  return {
    success: false,
    error,
    message,
    details,
  };
}
