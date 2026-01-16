import { z } from 'zod';

/**
 * 질문 유형
 */
export const QuestionTypeSchema = z.enum(['radio', 'slider']);

export type QuestionType = z.infer<typeof QuestionTypeSchema>;

/**
 * 라디오 옵션 스키마
 */
export const RadioOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export type RadioOption = z.infer<typeof RadioOptionSchema>;

/**
 * 질문 스키마
 */
export const QuestionSchema = z.object({
  id: z.string(),
  symptomId: z.string().nullable(),
  questionText: z.string().min(1, '질문 내용은 필수입니다'),
  questionType: QuestionTypeSchema,
  options: z.array(RadioOptionSchema).nullable(),
  sliderMin: z.number().nullable(),
  sliderMax: z.number().nullable(),
  displayOrder: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Question = z.infer<typeof QuestionSchema>;

/**
 * 질문 생성 스키마
 */
export const CreateQuestionSchema = z
  .object({
    symptomId: z.string().nullable().optional(),
    questionText: z.string().min(1, '질문 내용은 필수입니다'),
    questionType: QuestionTypeSchema,
    options: z.array(RadioOptionSchema).nullable().optional(),
    sliderMin: z.number().nullable().optional(),
    sliderMax: z.number().nullable().optional(),
    displayOrder: z.number().int().nonnegative().optional().default(0),
    isActive: z.boolean().optional().default(true),
  })
  .refine(
    (data) => {
      if (data.questionType === 'radio') {
        return data.options && data.options.length >= 2;
      }
      if (data.questionType === 'slider') {
        return (
          data.sliderMin !== null &&
          data.sliderMax !== null &&
          data.sliderMin! < data.sliderMax!
        );
      }
      return true;
    },
    {
      message: '질문 유형에 맞는 옵션을 설정해주세요',
    }
  );

export type CreateQuestion = z.infer<typeof CreateQuestionSchema>;

/**
 * 질문 목록 응답 스키마
 */
export const QuestionListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(QuestionSchema),
});

export type QuestionListResponse = z.infer<typeof QuestionListResponseSchema>;
