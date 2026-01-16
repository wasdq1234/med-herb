import { z } from 'zod';

/**
 * 증상 스키마
 */
export const SymptomSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '증상명은 필수입니다'),
  description: z.string().nullable(),
  category: z.string().nullable(),
  displayOrder: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Symptom = z.infer<typeof SymptomSchema>;

/**
 * 증상 생성 스키마
 */
export const CreateSymptomSchema = SymptomSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  displayOrder: z.number().int().nonnegative().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export type CreateSymptom = z.infer<typeof CreateSymptomSchema>;

/**
 * 증상 수정 스키마
 */
export const UpdateSymptomSchema = CreateSymptomSchema.partial();

export type UpdateSymptom = z.infer<typeof UpdateSymptomSchema>;

/**
 * 증상 목록 응답 스키마
 */
export const SymptomListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SymptomSchema),
});

export type SymptomListResponse = z.infer<typeof SymptomListResponseSchema>;
