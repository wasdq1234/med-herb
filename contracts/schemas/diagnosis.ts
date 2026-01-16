import { z } from 'zod';

/**
 * 질문 응답 스키마
 */
export const AnswerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.number()]),
});

export type Answer = z.infer<typeof AnswerSchema>;

/**
 * 진단 요청 스키마
 */
export const DiagnosisRequestSchema = z.object({
  symptomIds: z.array(z.string()).min(1, '최소 1개 이상의 증상을 선택해주세요'),
  answers: z.array(AnswerSchema),
});

export type DiagnosisRequest = z.infer<typeof DiagnosisRequestSchema>;

/**
 * 변증 결과 스키마
 */
export const SyndromeResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  matchScore: z.number().min(0).max(100),
  evidences: z.array(z.string()),
});

export type SyndromeResult = z.infer<typeof SyndromeResultSchema>;

/**
 * 약재 추천 스키마
 */
export const HerbRecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  scientificName: z.string().nullable(),
  effect: z.string().nullable(),
  relevanceScore: z.number(),
  evidence: z.string().nullable(),
  referenceUrl: z.string().url().nullable(),
});

export type HerbRecommendation = z.infer<typeof HerbRecommendationSchema>;

/**
 * 치료축 스키마
 */
export const TreatmentAxisResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export type TreatmentAxisResult = z.infer<typeof TreatmentAxisResultSchema>;

/**
 * 진단 결과 응답 스키마
 */
export const DiagnosisResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    sessionId: z.string(),
    syndromes: z.array(SyndromeResultSchema),
    treatmentAxes: z.array(TreatmentAxisResultSchema),
    herbs: z.array(HerbRecommendationSchema),
    createdAt: z.string().datetime(),
  }),
});

export type DiagnosisResponse = z.infer<typeof DiagnosisResponseSchema>;
