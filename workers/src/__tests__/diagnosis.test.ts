/**
 * 진단 API 테스트
 *
 * 테스트 대상:
 * - GET /api/symptoms - 활성 증상 목록 조회
 * - GET /api/questions - 활성 질문 목록 조회
 * - GET /api/questions?symptomId=xxx - 특정 증상 관련 질문
 * - POST /api/diagnosis - 진단 요청 및 결과
 *
 * Phase 0 (RED): 아직 라우트가 구현되지 않아 모든 테스트 FAIL 예상
 */

// @ts-expect-error - cloudflare:test types not available in typecheck
import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import app from '../index';
import { mockSymptoms, mockQuestions, mockDiagnosisRequest } from './utils/testClient';

describe('Diagnosis API', () => {
  describe('GET /api/symptoms', () => {
    it('should return active symptoms list', async () => {
      const response = await app.request('/api/symptoms', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should filter symptoms by category', async () => {
      const response = await app.request('/api/symptoms?category=통증', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');

      // 카테고리 필터링 검증
      if (data.data.length > 0) {
        data.data.forEach((symptom: any) => {
          expect(symptom.category).toBe('통증');
        });
      }
    });

    it('should only return active symptoms', async () => {
      const response = await app.request('/api/symptoms', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();

      // 모든 증상이 활성 상태인지 검증
      if (data.data && data.data.length > 0) {
        data.data.forEach((symptom: any) => {
          expect(symptom.isActive).toBe(true);
        });
      }
    });

    it('should return symptoms ordered by displayOrder', async () => {
      const response = await app.request('/api/symptoms', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();

      // displayOrder 정렬 검증
      if (data.data && data.data.length > 1) {
        for (let i = 0; i < data.data.length - 1; i++) {
          expect(data.data[i].displayOrder).toBeLessThanOrEqual(data.data[i + 1].displayOrder);
        }
      }
    });
  });

  describe('GET /api/questions', () => {
    it('should return active questions list', async () => {
      const response = await app.request('/api/questions', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should filter questions by symptomId', async () => {
      const symptomId = 'symptom-1';
      const response = await app.request(`/api/questions?symptomId=${symptomId}`, {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');

      // symptomId 필터링 검증
      if (data.data.length > 0) {
        data.data.forEach((question: any) => {
          // null (공통 질문) 또는 해당 symptomId
          expect([null, symptomId]).toContain(question.symptomId);
        });
      }
    });

    it('should only return active questions', async () => {
      const response = await app.request('/api/questions', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();

      // 모든 질문이 활성 상태인지 검증
      if (data.data && data.data.length > 0) {
        data.data.forEach((question: any) => {
          expect(question.isActive).toBe(true);
        });
      }
    });

    it('should return questions ordered by displayOrder', async () => {
      const response = await app.request('/api/questions', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();

      // displayOrder 정렬 검증
      if (data.data && data.data.length > 1) {
        for (let i = 0; i < data.data.length - 1; i++) {
          expect(data.data[i].displayOrder).toBeLessThanOrEqual(data.data[i + 1].displayOrder);
        }
      }
    });

    it('should include question options for radio type', async () => {
      const response = await app.request('/api/questions', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();

      // radio 타입 질문은 options를 가져야 함
      const radioQuestions = data.data?.filter((q: any) => q.questionType === 'radio') || [];
      radioQuestions.forEach((question: any) => {
        expect(question.options).toBeTruthy();
        expect(Array.isArray(question.options)).toBe(true);
        expect(question.options.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should include slider min/max for slider type', async () => {
      const response = await app.request('/api/questions', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json();

      // slider 타입 질문은 sliderMin, sliderMax를 가져야 함
      const sliderQuestions = data.data?.filter((q: any) => q.questionType === 'slider') || [];
      sliderQuestions.forEach((question: any) => {
        expect(question.sliderMin).not.toBeNull();
        expect(question.sliderMax).not.toBeNull();
        expect(question.sliderMin).toBeLessThan(question.sliderMax);
      });
    });
  });

  describe('POST /api/diagnosis', () => {
    it('should return diagnosis result', async () => {
      const response = await app.request('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockDiagnosisRequest),
      }, env);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(data.data).toHaveProperty('sessionId');
      expect(data.data).toHaveProperty('syndromes');
      expect(data.data).toHaveProperty('treatmentAxes');
      expect(data.data).toHaveProperty('herbs');
      expect(data.data).toHaveProperty('createdAt');
    });

    it('should reject request without symptomIds', async () => {
      const invalidRequest = {
        symptomIds: [],
        answers: [],
      };

      const response = await app.request('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRequest),
      }, env);

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should reject request with invalid answer format', async () => {
      const invalidRequest = {
        symptomIds: ['symptom-1'],
        answers: [
          { questionId: 'question-1' }, // value 누락
        ],
      };

      const response = await app.request('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRequest),
      }, env);

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should return syndromes with match scores', async () => {
      const response = await app.request('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockDiagnosisRequest),
      }, env);

      expect(response.status).toBe(200);

      const data = await response.json();

      // 변증 결과 검증
      if (data.data?.syndromes && data.data.syndromes.length > 0) {
        data.data.syndromes.forEach((syndrome: any) => {
          expect(syndrome).toHaveProperty('id');
          expect(syndrome).toHaveProperty('name');
          expect(syndrome).toHaveProperty('matchScore');
          expect(syndrome.matchScore).toBeGreaterThanOrEqual(0);
          expect(syndrome.matchScore).toBeLessThanOrEqual(100);
          expect(syndrome).toHaveProperty('evidences');
          expect(Array.isArray(syndrome.evidences)).toBe(true);
        });
      }
    });

    it('should return herbs with relevance scores', async () => {
      const response = await app.request('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockDiagnosisRequest),
      }, env);

      expect(response.status).toBe(200);

      const data = await response.json();

      // 약재 추천 검증
      if (data.data?.herbs && data.data.herbs.length > 0) {
        data.data.herbs.forEach((herb: any) => {
          expect(herb).toHaveProperty('id');
          expect(herb).toHaveProperty('name');
          expect(herb).toHaveProperty('relevanceScore');
          expect(herb.relevanceScore).toBeGreaterThan(0);
        });
      }
    });

    it('should return treatment axes', async () => {
      const response = await app.request('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockDiagnosisRequest),
      }, env);

      expect(response.status).toBe(200);

      const data = await response.json();

      // 치료축 검증
      if (data.data?.treatmentAxes && data.data.treatmentAxes.length > 0) {
        data.data.treatmentAxes.forEach((axis: any) => {
          expect(axis).toHaveProperty('id');
          expect(axis).toHaveProperty('name');
        });
      }
    });

    it('should generate unique sessionId', async () => {
      const response1 = await app.request('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockDiagnosisRequest),
      }, env);

      const response2 = await app.request('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockDiagnosisRequest),
      }, env);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);

      const data1 = await response1.json();
      const data2 = await response2.json();

      // 세션 ID는 매번 달라야 함
      expect(data1.data?.sessionId).not.toBe(data2.data?.sessionId);
    });
  });
});
