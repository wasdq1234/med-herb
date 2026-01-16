/**
 * 관리자 API용 Zod 스키마 (백엔드 전용)
 * 로그인, CRUD 검증 로직 포함
 */

import { z } from 'zod';
import {
  SymptomSchema,
  CreateSymptomSchema,
  UpdateSymptomSchema,
  QuestionSchema,
  CreateQuestionSchema,
  ApiSuccessSchema,
  PaginationQuerySchema,
  PaginatedResponseSchema,
} from '../../../contracts/schemas';

/**
 * 관리자 스키마
 */
export const AdminSchema = z.object({
  id: z.string(),
  username: z.string(),
  createdAt: z.string().datetime(),
});

export type Admin = z.infer<typeof AdminSchema>;

/**
 * POST /api/admin/login - Request Body
 */
export const PostAdminLoginBodySchema = z.object({
  username: z
    .string()
    .min(3, '사용자명은 최소 3자 이상이어야 합니다')
    .max(50, '사용자명은 최대 50자까지 가능합니다'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(100, '비밀번호는 최대 100자까지 가능합니다'),
});

/**
 * 로그인 응답 스키마
 */
export const LoginResponseSchema = z.object({
  admin: AdminSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int().positive(),
});

export const PostAdminLoginResponseSchema = ApiSuccessSchema(
  LoginResponseSchema
);

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type PostAdminLoginBody = z.infer<typeof PostAdminLoginBodySchema>;

/**
 * POST /api/admin/refresh - Request Body
 */
export const PostAdminRefreshBodySchema = z.object({
  refreshToken: z.string().min(1, '리프레시 토큰이 필요합니다'),
});

export const RefreshResponseSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number().int().positive(),
});

export const PostAdminRefreshResponseSchema = ApiSuccessSchema(
  RefreshResponseSchema
);

export type PostAdminRefreshBody = z.infer<typeof PostAdminRefreshBodySchema>;

/**
 * POST /api/admin/logout - Response
 */
export const PostAdminLogoutResponseSchema = ApiSuccessSchema(
  z.object({
    message: z.string(),
  })
);

/**
 * 변증 스키마
 */
export const SyndromeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  characteristics: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateSyndromeSchema = z.object({
  name: z.string().min(1, '변증명은 필수입니다'),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  characteristics: z.string().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

export const UpdateSyndromeSchema = CreateSyndromeSchema.partial();

export type Syndrome = z.infer<typeof SyndromeSchema>;
export type CreateSyndrome = z.infer<typeof CreateSyndromeSchema>;
export type UpdateSyndrome = z.infer<typeof UpdateSyndromeSchema>;

/**
 * 약재 스키마
 */
export const HerbSchema = z.object({
  id: z.string(),
  name: z.string(),
  scientificName: z.string().nullable(),
  effect: z.string().nullable(),
  category: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateHerbSchema = z.object({
  name: z.string().min(1, '약재명은 필수입니다'),
  scientificName: z.string().nullable().optional(),
  effect: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

export const UpdateHerbSchema = CreateHerbSchema.partial();

export type Herb = z.infer<typeof HerbSchema>;
export type CreateHerb = z.infer<typeof CreateHerbSchema>;
export type UpdateHerb = z.infer<typeof UpdateHerbSchema>;

/**
 * 증상 CRUD 스키마
 */
export const GetAdminSymptomsQuerySchema = PaginationQuerySchema.extend({
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  category: z.string().optional(),
});

export const GetAdminSymptomsResponseSchema = ApiSuccessSchema(
  PaginatedResponseSchema(SymptomSchema)
);

export const GetAdminSymptomResponseSchema = ApiSuccessSchema(SymptomSchema);

export const PostAdminSymptomBodySchema = CreateSymptomSchema;
export const PostAdminSymptomResponseSchema = ApiSuccessSchema(SymptomSchema);

export const PutAdminSymptomBodySchema = UpdateSymptomSchema;
export const PutAdminSymptomResponseSchema = ApiSuccessSchema(SymptomSchema);

export const DeleteAdminSymptomResponseSchema = ApiSuccessSchema(
  z.object({
    message: z.string(),
  })
);

/**
 * 질문 CRUD 스키마
 */
export const GetAdminQuestionsQuerySchema = PaginationQuerySchema.extend({
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  symptomId: z.string().optional(),
});

export const GetAdminQuestionsResponseSchema = ApiSuccessSchema(
  PaginatedResponseSchema(QuestionSchema)
);

export const GetAdminQuestionResponseSchema = ApiSuccessSchema(QuestionSchema);

export const PostAdminQuestionBodySchema = CreateQuestionSchema;
export const PostAdminQuestionResponseSchema = ApiSuccessSchema(QuestionSchema);

export const PutAdminQuestionBodySchema = z
  .object({
    symptomId: z.string().nullable().optional(),
    questionText: z.string().min(1, '질문 내용은 필수입니다').optional(),
    questionType: z.enum(['radio', 'slider']).optional(),
    options: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .nullable()
      .optional(),
    sliderMin: z.number().nullable().optional(),
    sliderMax: z.number().nullable().optional(),
    displayOrder: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // questionType이 제공된 경우에만 검증
      if (data.questionType === 'radio') {
        return !data.options || data.options.length >= 2;
      }
      if (data.questionType === 'slider') {
        return (
          data.sliderMin === undefined ||
          data.sliderMax === undefined ||
          (data.sliderMin !== null &&
            data.sliderMax !== null &&
            data.sliderMin < data.sliderMax)
        );
      }
      return true;
    },
    {
      message: '질문 유형에 맞는 옵션을 설정해주세요',
    }
  );
export const PutAdminQuestionResponseSchema = ApiSuccessSchema(QuestionSchema);

export const DeleteAdminQuestionResponseSchema = ApiSuccessSchema(
  z.object({
    message: z.string(),
  })
);

/**
 * 변증 CRUD 스키마
 */
export const GetAdminSyndromesQuerySchema = PaginationQuerySchema.extend({
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  category: z.string().optional(),
});

export const GetAdminSyndromesResponseSchema = ApiSuccessSchema(
  PaginatedResponseSchema(SyndromeSchema)
);

export const GetAdminSyndromeResponseSchema = ApiSuccessSchema(SyndromeSchema);

export const PostAdminSyndromeBodySchema = CreateSyndromeSchema;
export const PostAdminSyndromeResponseSchema = ApiSuccessSchema(SyndromeSchema);

export const PutAdminSyndromeBodySchema = UpdateSyndromeSchema;
export const PutAdminSyndromeResponseSchema = ApiSuccessSchema(SyndromeSchema);

export const DeleteAdminSyndromeResponseSchema = ApiSuccessSchema(
  z.object({
    message: z.string(),
  })
);

/**
 * 약재 CRUD 스키마
 */
export const GetAdminHerbsQuerySchema = PaginationQuerySchema.extend({
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  category: z.string().optional(),
});

export const GetAdminHerbsResponseSchema = ApiSuccessSchema(
  PaginatedResponseSchema(HerbSchema)
);

export const GetAdminHerbResponseSchema = ApiSuccessSchema(HerbSchema);

export const PostAdminHerbBodySchema = CreateHerbSchema;
export const PostAdminHerbResponseSchema = ApiSuccessSchema(HerbSchema);

export const PutAdminHerbBodySchema = UpdateHerbSchema;
export const PutAdminHerbResponseSchema = ApiSuccessSchema(HerbSchema);

export const DeleteAdminHerbResponseSchema = ApiSuccessSchema(
  z.object({
    message: z.string(),
  })
);

/**
 * 타입 export
 */
export type GetAdminSymptomsQuery = z.infer<
  typeof GetAdminSymptomsQuerySchema
>;
export type GetAdminQuestionsQuery = z.infer<
  typeof GetAdminQuestionsQuerySchema
>;
export type GetAdminSyndromesQuery = z.infer<
  typeof GetAdminSyndromesQuerySchema
>;
export type GetAdminHerbsQuery = z.infer<typeof GetAdminHerbsQuerySchema>;
