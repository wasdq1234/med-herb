/**
 * Mock 데이터 정의
 * MSW 핸들러에서 사용되는 테스트용 데이터
 */

import type { Symptom, Question, SyndromeResult, HerbRecommendation, TreatmentAxisResult } from '@contracts/schemas';
import type { Admin, Syndrome, Herb } from '@contracts/admin.contract';

/**
 * Mock 증상 데이터
 */
export const mockSymptoms: Symptom[] = [
  {
    id: 'sym-001',
    name: '두통',
    description: '머리가 아픈 증상',
    category: '통증',
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'sym-002',
    name: '소화불량',
    description: '음식물 소화가 잘 안되는 증상',
    category: '소화기',
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'sym-003',
    name: '불면',
    description: '잠들기 어렵거나 수면 유지가 어려운 증상',
    category: '신경',
    displayOrder: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'sym-004',
    name: '피로',
    description: '쉽게 피곤하고 기운이 없는 증상',
    category: '전신',
    displayOrder: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'sym-005',
    name: '어지럼증',
    description: '머리가 어지러운 증상',
    category: '신경',
    displayOrder: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * Mock 질문 데이터
 */
export const mockQuestions: Question[] = [
  {
    id: 'q-001',
    symptomId: 'sym-001',
    questionText: '두통이 주로 발생하는 시간대는 언제인가요?',
    questionType: 'radio',
    options: [
      { value: 'morning', label: '아침' },
      { value: 'afternoon', label: '오후' },
      { value: 'evening', label: '저녁' },
      { value: 'night', label: '밤' },
    ],
    sliderMin: null,
    sliderMax: null,
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'q-002',
    symptomId: 'sym-001',
    questionText: '두통의 강도를 선택해주세요 (1-10)',
    questionType: 'slider',
    options: null,
    sliderMin: 1,
    sliderMax: 10,
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'q-003',
    symptomId: null,
    questionText: '평소 수면 시간은 어느 정도인가요?',
    questionType: 'radio',
    options: [
      { value: 'less4', label: '4시간 미만' },
      { value: '4to6', label: '4-6시간' },
      { value: '6to8', label: '6-8시간' },
      { value: 'more8', label: '8시간 이상' },
    ],
    sliderMin: null,
    sliderMax: null,
    displayOrder: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * Mock 변증 결과 데이터
 */
export const mockSyndromeResults: SyndromeResult[] = [
  {
    id: 'snd-001',
    name: '기허증',
    description: '기가 허약하여 발생하는 증상군',
    matchScore: 85,
    evidences: [
      '피로감이 지속됨',
      '소화기능 저하',
      '면역력 약화',
    ],
  },
  {
    id: 'snd-002',
    name: '혈허증',
    description: '혈이 부족하여 발생하는 증상군',
    matchScore: 72,
    evidences: [
      '어지럼증 호소',
      '안색이 창백함',
      '수면 장애',
    ],
  },
  {
    id: 'snd-003',
    name: '담음증',
    description: '담음이 정체되어 발생하는 증상군',
    matchScore: 58,
    evidences: [
      '두통이 있음',
      '속이 더부룩함',
    ],
  },
];

/**
 * Mock 치료축 결과 데이터
 */
export const mockTreatmentAxes: TreatmentAxisResult[] = [
  {
    id: 'tax-001',
    name: '보기(補氣)',
    description: '기를 보충하는 치료 방향',
  },
  {
    id: 'tax-002',
    name: '보혈(補血)',
    description: '혈을 보충하는 치료 방향',
  },
  {
    id: 'tax-003',
    name: '거담(祛痰)',
    description: '담음을 제거하는 치료 방향',
  },
];

/**
 * Mock 약재 추천 데이터
 */
export const mockHerbs: HerbRecommendation[] = [
  {
    id: 'herb-001',
    name: '인삼',
    scientificName: 'Panax ginseng',
    effect: '기력 보충, 면역력 강화',
    relevanceScore: 95,
    evidence: '기허증 치료에 대표적인 약재',
    referenceUrl: 'https://example.com/herbs/ginseng',
  },
  {
    id: 'herb-002',
    name: '당귀',
    scientificName: 'Angelica gigas',
    effect: '보혈, 활혈, 진통',
    relevanceScore: 88,
    evidence: '혈허증 치료에 효과적',
    referenceUrl: 'https://example.com/herbs/angelica',
  },
  {
    id: 'herb-003',
    name: '백출',
    scientificName: 'Atractylodes macrocephala',
    effect: '건비, 거습, 이수',
    relevanceScore: 82,
    evidence: '소화기능 강화에 도움',
    referenceUrl: 'https://example.com/herbs/atractylodes',
  },
  {
    id: 'herb-004',
    name: '황기',
    scientificName: 'Astragalus membranaceus',
    effect: '보기, 고표, 이수',
    relevanceScore: 78,
    evidence: '기력 회복에 효과적',
    referenceUrl: 'https://example.com/herbs/astragalus',
  },
  {
    id: 'herb-005',
    name: '천궁',
    scientificName: 'Cnidium officinale',
    effect: '활혈, 행기, 진통',
    relevanceScore: 72,
    evidence: '두통 완화에 효과적',
    referenceUrl: 'https://example.com/herbs/cnidium',
  },
];

/**
 * Mock 관리자 데이터
 */
export const mockAdmin: Admin = {
  id: 'admin-001',
  username: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

/**
 * Mock 변증 (관리자용) 데이터
 */
export const mockAdminSyndromes: Syndrome[] = [
  {
    id: 'snd-001',
    name: '기허증',
    description: '기가 허약하여 발생하는 증상군',
    category: '허증',
    characteristics: '피로, 무기력, 소화불량',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'snd-002',
    name: '혈허증',
    description: '혈이 부족하여 발생하는 증상군',
    category: '허증',
    characteristics: '어지럼증, 창백, 불면',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'snd-003',
    name: '담음증',
    description: '담음이 정체되어 발생하는 증상군',
    category: '실증',
    characteristics: '두통, 더부룩함, 구역질',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * Mock 약재 (관리자용) 데이터
 */
export const mockAdminHerbs: Herb[] = [
  {
    id: 'herb-001',
    name: '인삼',
    scientificName: 'Panax ginseng',
    effect: '기력 보충, 면역력 강화',
    category: '보기약',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'herb-002',
    name: '당귀',
    scientificName: 'Angelica gigas',
    effect: '보혈, 활혈, 진통',
    category: '보혈약',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'herb-003',
    name: '백출',
    scientificName: 'Atractylodes macrocephala',
    effect: '건비, 거습, 이수',
    category: '보기약',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'herb-004',
    name: '황기',
    scientificName: 'Astragalus membranaceus',
    effect: '보기, 고표, 이수',
    category: '보기약',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'herb-005',
    name: '천궁',
    scientificName: 'Cnidium officinale',
    effect: '활혈, 행기, 진통',
    category: '활혈약',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * Mock JWT 토큰
 */
export const mockTokens = {
  accessToken: 'mock-access-token-12345',
  refreshToken: 'mock-refresh-token-67890',
  expiresIn: 3600,
};

/**
 * 페이지네이션 헬퍼
 */
export function paginate<T>(items: T[], page: number = 1, limit: number = 20) {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    items: items.slice(start, end),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
