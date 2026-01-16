/**
 * 진단 API 라우트
 *
 * 엔드포인트:
 * - GET /symptoms - 활성 증상 목록 조회
 * - GET /questions - 활성 질문 목록 조회
 * - POST /diagnosis - 진단 요청 및 결과 반환
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../types';
import { DiagnosisService } from '../services/diagnosisService';
import { DiagnosisRequestSchema } from '@contracts/schemas/diagnosis';

const diagnosisRouter = new Hono<{ Bindings: Env }>();

/**
 * GET /symptoms
 * 활성 증상 목록 조회
 */
diagnosisRouter.get('/symptoms', async (c) => {
  const category = c.req.query('category');

  const diagnosisService = new DiagnosisService(c.env);
  const symptoms = await diagnosisService.getActiveSymptoms(category);

  return c.json({
    success: true,
    data: symptoms,
  });
});

/**
 * GET /questions
 * 활성 질문 목록 조회
 */
diagnosisRouter.get('/questions', async (c) => {
  const symptomId = c.req.query('symptomId');

  const diagnosisService = new DiagnosisService(c.env);
  const questions = await diagnosisService.getActiveQuestions(symptomId);

  return c.json({
    success: true,
    data: questions,
  });
});

/**
 * POST /diagnosis
 * 진단 요청 및 결과 반환
 */
diagnosisRouter.post(
  '/diagnosis',
  zValidator('json', DiagnosisRequestSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력 값이 올바르지 않습니다',
          details: result.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        400
      );
    }
  }),
  async (c) => {
    const request = c.req.valid('json');

    const diagnosisService = new DiagnosisService(c.env);
    const result = await diagnosisService.runDiagnosis(request);

    return c.json({
      success: true,
      data: result,
    });
  }
);

export default diagnosisRouter;
