/**
 * 진단 API용 Zod 스키마 (백엔드 전용)
 * contracts의 스키마를 import하고 추가 검증 로직 포함
 */

import { z } from 'zod';
import {
  SymptomSchema,
  QuestionSchema,
  DiagnosisRequestSchema,
  DiagnosisResponseSchema,
  ApiSuccessSchema,
} from '../../../contracts/schemas';

/**
 * GET /api/symptoms - Query 파라미터 검증
 */
export const GetSymptomsQuerySchema = z.object({
  category: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

/**
 * GET /api/symptoms - Response 검증
 */
export const GetSymptomsResponseSchema = ApiSuccessSchema(
  z.array(SymptomSchema)
);

/**
 * GET /api/questions - Query 파라미터 검증
 */
export const GetQuestionsQuerySchema = z.object({
  symptomId: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

/**
 * GET /api/questions - Response 검증
 */
export const GetQuestionsResponseSchema = ApiSuccessSchema(
  z.array(QuestionSchema)
);

/**
 * POST /api/diagnosis - Request Body 검증 (추가 검증 포함)
 */
export const PostDiagnosisBodySchema = DiagnosisRequestSchema.superRefine(
  (data, ctx) => {
    // 증상 ID 중복 검증
    const uniqueSymptomIds = new Set(data.symptomIds);
    if (uniqueSymptomIds.size !== data.symptomIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '중복된 증상이 선택되었습니다',
        path: ['symptomIds'],
      });
    }

    // 질문 ID 중복 검증
    const questionIds = data.answers.map((a) => a.questionId);
    const uniqueQuestionIds = new Set(questionIds);
    if (uniqueQuestionIds.size !== questionIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '중복된 질문 응답이 있습니다',
        path: ['answers'],
      });
    }
  }
);

/**
 * POST /api/diagnosis - Response 검증
 */
export const PostDiagnosisResponseSchema = DiagnosisResponseSchema;

/**
 * 타입 export
 */
export type GetSymptomsQuery = z.infer<typeof GetSymptomsQuerySchema>;
export type GetQuestionsQuery = z.infer<typeof GetQuestionsQuerySchema>;
export type PostDiagnosisBody = z.infer<typeof PostDiagnosisBodySchema>;
