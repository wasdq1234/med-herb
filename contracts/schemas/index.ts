// Symptom
export * from './symptom';

// Question
export * from './question';

// Diagnosis
export * from './diagnosis';

// 공통 응답 스키마
import { z } from 'zod';

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type Pagination = z.infer<typeof PaginationSchema>;
