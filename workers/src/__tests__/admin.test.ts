/**
 * 관리자 API 테스트
 *
 * 테스트 대상:
 * - POST /api/admin/login - 로그인 성공/실패
 * - 인증 미들웨어 테스트
 * - CRUD /api/admin/symptoms
 * - CRUD /api/admin/questions
 * - CRUD /api/admin/syndromes
 * - CRUD /api/admin/herbs
 *
 * Phase 0 (RED): 아직 라우트가 구현되지 않아 모든 테스트 FAIL 예상
 */

// @ts-expect-error - cloudflare:test types not available in typecheck
import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import app from '../index';
import {
  createAuthToken,
  mockSymptoms,
  mockQuestions,
  mockSyndromes,
  mockHerbs,
} from './utils/testClient';

describe('Admin API', () => {
  describe('POST /api/admin/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await app.request('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testadmin',
          password: 'testpass123',
        }),
      }, env);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data.data).toHaveProperty('admin');
      expect(data.data).toHaveProperty('accessToken');
      expect(data.data).toHaveProperty('refreshToken');
      expect(data.data).toHaveProperty('expiresIn');
      expect(data.data.admin).toHaveProperty('username', 'testadmin');
    });

    it('should reject login with invalid username', async () => {
      const response = await app.request('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'nonexistent',
          password: 'testpass123',
        }),
      }, env);

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should reject login with invalid password', async () => {
      const response = await app.request('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testadmin',
          password: 'wrongpassword',
        }),
      }, env);

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should reject login with missing credentials', async () => {
      const response = await app.request('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }, env);

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });
  });

  describe('Auth Middleware', () => {
    it('should reject requests without auth token', async () => {
      const response = await app.request('/api/admin/symptoms', {}, env);

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should reject requests with invalid auth token', async () => {
      const response = await app.request('/api/admin/symptoms', {
        headers: {
          'Authorization': 'Bearer invalid-token',
        },
      }, env);

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should accept requests with valid auth token', async () => {
      const authToken = createAuthToken();
      const response = await app.request('/api/admin/symptoms', {
        headers: {
          'Authorization': authToken,
        },
      }, env);

      // 401이 아니면 인증 통과 (구현 전이므로 404 가능)
      expect(response.status).not.toBe(401);
    });
  });

  describe('Symptoms CRUD', () => {
    describe('GET /api/admin/symptoms', () => {
      it('should return paginated symptoms list', async () => {
        const authToken = createAuthToken();
        const response = await app.request('/api/admin/symptoms', {
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('items');
        expect(data.data).toHaveProperty('pagination');
        expect(Array.isArray(data.data.items)).toBe(true);
      });

      it('should support pagination query params', async () => {
        const authToken = createAuthToken();
        const response = await app.request('/api/admin/symptoms?page=2&limit=10', {
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.data.pagination.page).toBe(2);
        expect(data.data.pagination.limit).toBe(10);
      });

      it('should filter by isActive', async () => {
        const authToken = createAuthToken();
        const response = await app.request('/api/admin/symptoms?isActive=true', {
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        if (data.data?.items && data.data.items.length > 0) {
          data.data.items.forEach((item: any) => {
            expect(item.isActive).toBe(true);
          });
        }
      });
    });

    describe('GET /api/admin/symptoms/:id', () => {
      it('should return symptom detail', async () => {
        const authToken = createAuthToken();
        const symptomId = mockSymptoms[0].id;
        const response = await app.request(`/api/admin/symptoms/${symptomId}`, {
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('id', symptomId);
      });

      it('should return 404 for non-existent symptom', async () => {
        const authToken = createAuthToken();
        const response = await app.request('/api/admin/symptoms/non-existent-id', {
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(404);

        const data = await response.json();
        expect(data).toHaveProperty('success', false);
      });
    });

    describe('POST /api/admin/symptoms', () => {
      it('should create new symptom', async () => {
        const authToken = createAuthToken();
        const newSymptom = {
          name: '불면증',
          description: '잠을 잘 수 없는 증상',
          category: '수면',
          displayOrder: 10,
          isActive: true,
        };

        const response = await app.request('/api/admin/symptoms', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSymptom),
        }, env);

        expect(response.status).toBe(201);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('id');
        expect(data.data).toHaveProperty('name', newSymptom.name);
      });

      it('should reject invalid symptom data', async () => {
        const authToken = createAuthToken();
        const invalidSymptom = {
          // name 누락
          description: '설명',
        };

        const response = await app.request('/api/admin/symptoms', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invalidSymptom),
        }, env);

        expect(response.status).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty('success', false);
        expect(data).toHaveProperty('error');
      });
    });

    describe('PUT /api/admin/symptoms/:id', () => {
      it('should update symptom', async () => {
        const authToken = createAuthToken();
        const symptomId = mockSymptoms[0].id;
        const updateData = {
          name: '수정된 증상명',
          description: '수정된 설명',
        };

        const response = await app.request(`/api/admin/symptoms/${symptomId}`, {
          method: 'PUT',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('id', symptomId);
        expect(data.data.name).toBe(updateData.name);
      });

      it('should return 404 for non-existent symptom', async () => {
        const authToken = createAuthToken();
        const response = await app.request('/api/admin/symptoms/non-existent-id', {
          method: 'PUT',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: '수정' }),
        }, env);

        expect(response.status).toBe(404);
      });
    });

    describe('DELETE /api/admin/symptoms/:id', () => {
      it('should delete symptom', async () => {
        const authToken = createAuthToken();
        const symptomId = mockSymptoms[0].id;

        const response = await app.request(`/api/admin/symptoms/${symptomId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('message');
      });

      it('should return 404 for non-existent symptom', async () => {
        const authToken = createAuthToken();
        const response = await app.request('/api/admin/symptoms/non-existent-id', {
          method: 'DELETE',
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(404);
      });
    });
  });

  describe('Questions CRUD', () => {
    describe('GET /api/admin/questions', () => {
      it('should return paginated questions list', async () => {
        const authToken = createAuthToken();
        const response = await app.request('/api/admin/questions', {
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('items');
        expect(data.data).toHaveProperty('pagination');
      });

      it('should filter by symptomId', async () => {
        const authToken = createAuthToken();
        const symptomId = mockSymptoms[0].id;
        const response = await app.request(`/api/admin/questions?symptomId=${symptomId}`, {
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        if (data.data?.items && data.data.items.length > 0) {
          data.data.items.forEach((item: any) => {
            expect([null, symptomId]).toContain(item.symptomId);
          });
        }
      });
    });

    describe('POST /api/admin/questions', () => {
      it('should create new radio question', async () => {
        const authToken = createAuthToken();
        const newQuestion = {
          symptomId: mockSymptoms[0].id,
          questionText: '새로운 질문입니까?',
          questionType: 'radio' as const,
          options: [
            { value: 'yes', label: '예' },
            { value: 'no', label: '아니오' },
          ],
          displayOrder: 1,
        };

        const response = await app.request('/api/admin/questions', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newQuestion),
        }, env);

        expect(response.status).toBe(201);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('id');
        expect(data.data.questionType).toBe('radio');
      });

      it('should create new slider question', async () => {
        const authToken = createAuthToken();
        const newQuestion = {
          symptomId: mockSymptoms[0].id,
          questionText: '정도를 선택하세요',
          questionType: 'slider' as const,
          sliderMin: 1,
          sliderMax: 10,
          displayOrder: 2,
        };

        const response = await app.request('/api/admin/questions', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newQuestion),
        }, env);

        expect(response.status).toBe(201);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data.questionType).toBe('slider');
      });

      it('should reject radio question without options', async () => {
        const authToken = createAuthToken();
        const invalidQuestion = {
          symptomId: mockSymptoms[0].id,
          questionText: '질문',
          questionType: 'radio' as const,
          // options 누락
        };

        const response = await app.request('/api/admin/questions', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invalidQuestion),
        }, env);

        expect(response.status).toBe(400);
      });

      it('should reject slider question without min/max', async () => {
        const authToken = createAuthToken();
        const invalidQuestion = {
          symptomId: mockSymptoms[0].id,
          questionText: '질문',
          questionType: 'slider' as const,
          // sliderMin, sliderMax 누락
        };

        const response = await app.request('/api/admin/questions', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invalidQuestion),
        }, env);

        expect(response.status).toBe(400);
      });
    });
  });

  describe('Syndromes CRUD', () => {
    describe('GET /api/admin/syndromes', () => {
      it('should return paginated syndromes list', async () => {
        const authToken = createAuthToken();
        const response = await app.request('/api/admin/syndromes', {
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('items');
        expect(data.data).toHaveProperty('pagination');
      });
    });

    describe('POST /api/admin/syndromes', () => {
      it('should create new syndrome', async () => {
        const authToken = createAuthToken();
        const newSyndrome = {
          name: '음허화왕',
          description: '음이 허하여 화가 왕성한 상태',
          category: '허증',
          characteristics: '입마름, 열감',
        };

        const response = await app.request('/api/admin/syndromes', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSyndrome),
        }, env);

        expect(response.status).toBe(201);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('id');
        expect(data.data.name).toBe(newSyndrome.name);
      });

      it('should reject invalid syndrome data', async () => {
        const authToken = createAuthToken();
        const invalidSyndrome = {
          // name 누락
          description: '설명',
        };

        const response = await app.request('/api/admin/syndromes', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invalidSyndrome),
        }, env);

        expect(response.status).toBe(400);
      });
    });

    describe('PUT /api/admin/syndromes/:id', () => {
      it('should update syndrome', async () => {
        const authToken = createAuthToken();
        const syndromeId = mockSyndromes[0].id;
        const updateData = {
          name: '수정된 변증명',
        };

        const response = await app.request(`/api/admin/syndromes/${syndromeId}`, {
          method: 'PUT',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.data.name).toBe(updateData.name);
      });
    });

    describe('DELETE /api/admin/syndromes/:id', () => {
      it('should delete syndrome', async () => {
        const authToken = createAuthToken();
        const syndromeId = mockSyndromes[0].id;

        const response = await app.request(`/api/admin/syndromes/${syndromeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);
      });
    });
  });

  describe('Herbs CRUD', () => {
    describe('GET /api/admin/herbs', () => {
      it('should return paginated herbs list', async () => {
        const authToken = createAuthToken();
        const response = await app.request('/api/admin/herbs', {
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('items');
        expect(data.data).toHaveProperty('pagination');
      });
    });

    describe('POST /api/admin/herbs', () => {
      it('should create new herb', async () => {
        const authToken = createAuthToken();
        const newHerb = {
          name: '황기',
          scientificName: 'Astragalus membranaceus',
          effect: '보기 작용',
          category: '보익약',
        };

        const response = await app.request('/api/admin/herbs', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newHerb),
        }, env);

        expect(response.status).toBe(201);

        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data.data).toHaveProperty('id');
        expect(data.data.name).toBe(newHerb.name);
      });

      it('should reject invalid herb data', async () => {
        const authToken = createAuthToken();
        const invalidHerb = {
          // name 누락
          effect: '효능',
        };

        const response = await app.request('/api/admin/herbs', {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invalidHerb),
        }, env);

        expect(response.status).toBe(400);
      });
    });

    describe('PUT /api/admin/herbs/:id', () => {
      it('should update herb', async () => {
        const authToken = createAuthToken();
        const herbId = mockHerbs[0].id;
        const updateData = {
          name: '수정된 약재명',
        };

        const response = await app.request(`/api/admin/herbs/${herbId}`, {
          method: 'PUT',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }, env);

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.data.name).toBe(updateData.name);
      });
    });

    describe('DELETE /api/admin/herbs/:id', () => {
      it('should delete herb', async () => {
        const authToken = createAuthToken();
        const herbId = mockHerbs[0].id;

        const response = await app.request(`/api/admin/herbs/${herbId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authToken,
          },
        }, env);

        expect(response.status).toBe(200);
      });
    });
  });
});
