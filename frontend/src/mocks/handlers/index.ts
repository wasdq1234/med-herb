import { http, HttpResponse } from 'msw';
import { diagnosisHandlers } from './diagnosis';
import { adminHandlers } from './admin';

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

  // 진단 API 핸들러
  ...diagnosisHandlers,

  // 관리자 API 핸들러
  ...adminHandlers,
];
