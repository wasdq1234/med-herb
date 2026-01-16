import { http, HttpResponse } from 'msw';

/**
 * MSW 핸들러
 * API 엔드포인트별 목 응답 정의
 */
export const handlers = [
  // Health Check
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }),

  // 진단 관련 핸들러는 contracts 완성 후 추가 예정
  // 예시:
  // http.post('/api/diagnosis', async ({ request }) => {
  //   const body = await request.json();
  //   return HttpResponse.json({
  //     diagnosisId: 'test-diagnosis-id',
  //     patternType: 'BLOOD_DEFICIENCY',
  //     confidence: 0.85,
  //   });
  // }),
];
