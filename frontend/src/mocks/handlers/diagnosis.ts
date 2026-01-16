/**
 * 진단 API MSW 핸들러
 *
 * 엔드포인트:
 * - GET /api/symptoms - 활성 증상 목록 조회
 * - GET /api/questions - 활성 질문 목록 조회
 * - POST /api/diagnosis - 진단 요청 및 결과 반환
 */

import { http, HttpResponse, delay } from 'msw';
import {
  mockSymptoms,
  mockQuestions,
  mockSyndromeResults,
  mockTreatmentAxes,
  mockHerbs,
} from '../data/mockData';
import type { DiagnosisRequest } from '@contracts/schemas';

const API_BASE = '/api';

/**
 * GET /api/symptoms
 * 활성 증상 목록 조회
 */
const getSymptoms = http.get(`${API_BASE}/symptoms`, async ({ request }) => {
  await delay(100);

  const url = new URL(request.url);
  const category = url.searchParams.get('category');

  let symptoms = mockSymptoms.filter((s) => s.isActive);

  if (category) {
    symptoms = symptoms.filter((s) => s.category === category);
  }

  return HttpResponse.json({
    success: true,
    data: symptoms,
  });
});

/**
 * GET /api/questions
 * 활성 질문 목록 조회
 */
const getQuestions = http.get(`${API_BASE}/questions`, async ({ request }) => {
  await delay(100);

  const url = new URL(request.url);
  const symptomId = url.searchParams.get('symptomId');

  let questions = mockQuestions.filter((q) => q.isActive);

  if (symptomId) {
    questions = questions.filter(
      (q) => q.symptomId === symptomId || q.symptomId === null
    );
  }

  // display_order로 정렬
  questions.sort((a, b) => a.displayOrder - b.displayOrder);

  return HttpResponse.json({
    success: true,
    data: questions,
  });
});

/**
 * POST /api/diagnosis
 * 진단 요청 및 결과 반환
 */
const postDiagnosis = http.post(`${API_BASE}/diagnosis`, async ({ request }) => {
  await delay(300);

  const body = (await request.json()) as DiagnosisRequest;

  // 유효성 검사
  if (!body.symptomIds || body.symptomIds.length === 0) {
    return HttpResponse.json(
      {
        success: false,
        error: 'VALIDATION_ERROR',
        message: '최소 1개 이상의 증상을 선택해주세요',
        details: [
          {
            field: 'symptomIds',
            message: '최소 1개 이상의 증상을 선택해주세요',
          },
        ],
      },
      { status: 400 }
    );
  }

  // 진단 결과 반환
  return HttpResponse.json({
    success: true,
    data: {
      sessionId: `session-${Date.now()}`,
      syndromes: mockSyndromeResults,
      treatmentAxes: mockTreatmentAxes,
      herbs: mockHerbs,
      createdAt: new Date().toISOString(),
    },
  });
});

/**
 * 진단 API 핸들러 목록
 */
export const diagnosisHandlers = [
  getSymptoms,
  getQuestions,
  postDiagnosis,
];
