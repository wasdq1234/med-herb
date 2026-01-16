/**
 * 관리자 API 라우트
 *
 * 엔드포인트:
 * - POST /api/admin/login - 로그인
 * - POST /api/admin/logout - 로그아웃
 * - POST /api/admin/refresh - 토큰 갱신
 * - CRUD /api/admin/symptoms
 * - CRUD /api/admin/questions
 * - CRUD /api/admin/syndromes
 * - CRUD /api/admin/herbs
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { nanoid } from 'nanoid';

import type { Env } from '../types';
import { authMiddleware, type AuthVariables } from '../middleware/auth';
import { AuthService, generateAdminId } from '../services/authService';
import {
  PostAdminLoginBodySchema,
  PostAdminRefreshBodySchema,
  PostAdminSymptomBodySchema,
  PutAdminSymptomBodySchema,
  PostAdminQuestionBodySchema,
  PutAdminQuestionBodySchema,
  PostAdminSyndromeBodySchema,
  PutAdminSyndromeBodySchema,
  PostAdminHerbBodySchema,
  PutAdminHerbBodySchema,
} from '../schemas/admin';
import * as schema from '../db/schema';

const adminRouter = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// ==================== 인증 ====================

/**
 * POST /api/admin/login
 * 관리자 로그인
 */
adminRouter.post(
  '/login',
  zValidator('json', PostAdminLoginBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
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
    const { username, password } = c.req.valid('json');

    const db = drizzle(c.env.DB, { schema });
    const authService = new AuthService(c.env);

    // 관리자 조회
    const adminRecord = await db.query.admin.findFirst({
      where: eq(schema.admin.username, username),
    });

    if (!adminRecord) {
      return c.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: '아이디 또는 비밀번호가 올바르지 않습니다',
        },
        401
      );
    }

    // 비밀번호 검증
    const isValidPassword = await authService.verifyPassword(
      password,
      adminRecord.passwordHash
    );

    if (!isValidPassword) {
      return c.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: '아이디 또는 비밀번호가 올바르지 않습니다',
        },
        401
      );
    }

    // 토큰 생성
    const tokens = await authService.generateTokens(
      adminRecord.id,
      adminRecord.username
    );

    return c.json({
      success: true,
      data: {
        admin: {
          id: adminRecord.id,
          username: adminRecord.username,
          createdAt: adminRecord.createdAt,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
    });
  }
);

/**
 * POST /api/admin/logout
 * 관리자 로그아웃
 */
adminRouter.post('/logout', authMiddleware, async (c) => {
  // 클라이언트에서 토큰 삭제하도록 안내
  // 향후 토큰 블랙리스트 구현 가능
  return c.json({
    success: true,
    data: {
      message: '로그아웃 되었습니다',
    },
  });
});

/**
 * POST /api/admin/refresh
 * 토큰 갱신
 */
adminRouter.post(
  '/refresh',
  zValidator('json', PostAdminRefreshBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '리프레시 토큰이 필요합니다',
        },
        400
      );
    }
  }),
  async (c) => {
    const { refreshToken } = c.req.valid('json');

    const authService = new AuthService(c.env);
    const result = await authService.refreshAccessToken(refreshToken);

    if (!result) {
      return c.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: '유효하지 않은 리프레시 토큰입니다',
        },
        401
      );
    }

    return c.json({
      success: true,
      data: result,
    });
  }
);

// ==================== 증상 CRUD ====================

/**
 * GET /api/admin/symptoms
 */
adminRouter.get('/symptoms', authMiddleware, async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
  const isActive = c.req.query('isActive');
  const category = c.req.query('category');

  const symptoms = await db.query.symptom.findMany({
    orderBy: (symptom, { asc }) => [asc(symptom.displayOrder)],
  });

  let filtered = symptoms;

  if (isActive !== undefined) {
    const active = isActive === 'true';
    filtered = filtered.filter((s) => s.isActive === active);
  }

  if (category) {
    filtered = filtered.filter((s) => s.category === category);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return c.json({
    success: true,
    data: {
      items,
      pagination: { page, limit, total, totalPages },
    },
  });
});

/**
 * GET /api/admin/symptoms/:id
 */
adminRouter.get('/symptoms/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB, { schema });

  const symptomRecord = await db.query.symptom.findFirst({
    where: eq(schema.symptom.id, id),
  });

  if (!symptomRecord) {
    return c.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: '증상을 찾을 수 없습니다',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: symptomRecord,
  });
});

/**
 * POST /api/admin/symptoms
 */
adminRouter.post(
  '/symptoms',
  authMiddleware,
  zValidator('json', PostAdminSymptomBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
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
    const body = c.req.valid('json');
    const db = drizzle(c.env.DB, { schema });

    const now = new Date().toISOString();
    const newSymptom = {
      id: `symptom-${nanoid(12)}`,
      name: body.name,
      description: body.description ?? null,
      category: body.category ?? null,
      displayOrder: body.displayOrder ?? 0,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(schema.symptom).values(newSymptom);

    return c.json({ success: true, data: newSymptom }, 201);
  }
);

/**
 * PUT /api/admin/symptoms/:id
 */
adminRouter.put(
  '/symptoms/:id',
  authMiddleware,
  zValidator('json', PutAdminSymptomBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
        },
        400
      );
    }
  }),
  async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const db = drizzle(c.env.DB, { schema });

    const existing = await db.query.symptom.findFirst({
      where: eq(schema.symptom.id, id),
    });

    if (!existing) {
      return c.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: '증상을 찾을 수 없습니다',
        },
        404
      );
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await db
      .update(schema.symptom)
      .set(updated)
      .where(eq(schema.symptom.id, id));

    return c.json({ success: true, data: updated });
  }
);

/**
 * DELETE /api/admin/symptoms/:id
 */
adminRouter.delete('/symptoms/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB, { schema });

  const existing = await db.query.symptom.findFirst({
    where: eq(schema.symptom.id, id),
  });

  if (!existing) {
    return c.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: '증상을 찾을 수 없습니다',
      },
      404
    );
  }

  await db.delete(schema.symptom).where(eq(schema.symptom.id, id));

  return c.json({ success: true, data: { message: '삭제되었습니다' } });
});

// ==================== 질문 CRUD ====================

/**
 * GET /api/admin/questions
 */
adminRouter.get('/questions', authMiddleware, async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
  const isActive = c.req.query('isActive');
  const symptomId = c.req.query('symptomId');

  const questions = await db.query.question.findMany({
    orderBy: (q, { asc }) => [asc(q.displayOrder)],
  });

  let filtered = questions.map((q) => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null,
  }));

  if (isActive !== undefined) {
    const active = isActive === 'true';
    filtered = filtered.filter((q) => q.isActive === active);
  }

  if (symptomId) {
    filtered = filtered.filter((q) => q.symptomId === symptomId);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return c.json({
    success: true,
    data: {
      items,
      pagination: { page, limit, total, totalPages },
    },
  });
});

/**
 * GET /api/admin/questions/:id
 */
adminRouter.get('/questions/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB, { schema });

  const questionRecord = await db.query.question.findFirst({
    where: eq(schema.question.id, id),
  });

  if (!questionRecord) {
    return c.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: '질문을 찾을 수 없습니다',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: {
      ...questionRecord,
      options: questionRecord.options
        ? JSON.parse(questionRecord.options)
        : null,
    },
  });
});

/**
 * POST /api/admin/questions
 */
adminRouter.post(
  '/questions',
  authMiddleware,
  zValidator('json', PostAdminQuestionBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
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
    const body = c.req.valid('json');
    const db = drizzle(c.env.DB, { schema });

    const now = new Date().toISOString();
    const newQuestion = {
      id: `question-${nanoid(12)}`,
      symptomId: body.symptomId ?? null,
      questionText: body.questionText,
      questionType: body.questionType,
      options: body.options ? JSON.stringify(body.options) : null,
      sliderMin: body.sliderMin ?? null,
      sliderMax: body.sliderMax ?? null,
      displayOrder: body.displayOrder ?? 0,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(schema.question).values(newQuestion);

    return c.json(
      {
        success: true,
        data: {
          ...newQuestion,
          options: body.options ?? null,
        },
      },
      201
    );
  }
);

/**
 * PUT /api/admin/questions/:id
 */
adminRouter.put(
  '/questions/:id',
  authMiddleware,
  zValidator('json', PutAdminQuestionBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
        },
        400
      );
    }
  }),
  async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const db = drizzle(c.env.DB, { schema });

    const existing = await db.query.question.findFirst({
      where: eq(schema.question.id, id),
    });

    if (!existing) {
      return c.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: '질문을 찾을 수 없습니다',
        },
        404
      );
    }

    const updated = {
      ...existing,
      ...body,
      options:
        body.options !== undefined
          ? body.options
            ? JSON.stringify(body.options)
            : null
          : existing.options,
      updatedAt: new Date().toISOString(),
    };

    await db
      .update(schema.question)
      .set(updated)
      .where(eq(schema.question.id, id));

    return c.json({
      success: true,
      data: {
        ...updated,
        options: updated.options ? JSON.parse(updated.options) : null,
      },
    });
  }
);

/**
 * DELETE /api/admin/questions/:id
 */
adminRouter.delete('/questions/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB, { schema });

  const existing = await db.query.question.findFirst({
    where: eq(schema.question.id, id),
  });

  if (!existing) {
    return c.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: '질문을 찾을 수 없습니다',
      },
      404
    );
  }

  await db.delete(schema.question).where(eq(schema.question.id, id));

  return c.json({ success: true, data: { message: '삭제되었습니다' } });
});

// ==================== 변증 CRUD ====================

/**
 * GET /api/admin/syndromes
 */
adminRouter.get('/syndromes', authMiddleware, async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
  const isActive = c.req.query('isActive');
  const category = c.req.query('category');

  const syndromes = await db.query.syndrome.findMany();

  let filtered = syndromes;

  if (isActive !== undefined) {
    const active = isActive === 'true';
    filtered = filtered.filter((s) => s.isActive === active);
  }

  if (category) {
    filtered = filtered.filter((s) => s.category === category);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return c.json({
    success: true,
    data: {
      items,
      pagination: { page, limit, total, totalPages },
    },
  });
});

/**
 * GET /api/admin/syndromes/:id
 */
adminRouter.get('/syndromes/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB, { schema });

  const syndromeRecord = await db.query.syndrome.findFirst({
    where: eq(schema.syndrome.id, id),
  });

  if (!syndromeRecord) {
    return c.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: '변증을 찾을 수 없습니다',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: syndromeRecord,
  });
});

/**
 * POST /api/admin/syndromes
 */
adminRouter.post(
  '/syndromes',
  authMiddleware,
  zValidator('json', PostAdminSyndromeBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
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
    const body = c.req.valid('json');
    const db = drizzle(c.env.DB, { schema });

    const now = new Date().toISOString();
    const newSyndrome = {
      id: `syndrome-${nanoid(12)}`,
      name: body.name,
      description: body.description ?? null,
      category: body.category ?? null,
      characteristics: body.characteristics ?? null,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(schema.syndrome).values(newSyndrome);

    return c.json({ success: true, data: newSyndrome }, 201);
  }
);

/**
 * PUT /api/admin/syndromes/:id
 */
adminRouter.put(
  '/syndromes/:id',
  authMiddleware,
  zValidator('json', PutAdminSyndromeBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
        },
        400
      );
    }
  }),
  async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const db = drizzle(c.env.DB, { schema });

    const existing = await db.query.syndrome.findFirst({
      where: eq(schema.syndrome.id, id),
    });

    if (!existing) {
      return c.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: '변증을 찾을 수 없습니다',
        },
        404
      );
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await db
      .update(schema.syndrome)
      .set(updated)
      .where(eq(schema.syndrome.id, id));

    return c.json({ success: true, data: updated });
  }
);

/**
 * DELETE /api/admin/syndromes/:id
 */
adminRouter.delete('/syndromes/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB, { schema });

  const existing = await db.query.syndrome.findFirst({
    where: eq(schema.syndrome.id, id),
  });

  if (!existing) {
    return c.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: '변증을 찾을 수 없습니다',
      },
      404
    );
  }

  await db.delete(schema.syndrome).where(eq(schema.syndrome.id, id));

  return c.json({ success: true, data: { message: '삭제되었습니다' } });
});

// ==================== 약재 CRUD ====================

/**
 * GET /api/admin/herbs
 */
adminRouter.get('/herbs', authMiddleware, async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
  const isActive = c.req.query('isActive');
  const category = c.req.query('category');

  const herbs = await db.query.herb.findMany();

  let filtered = herbs;

  if (isActive !== undefined) {
    const active = isActive === 'true';
    filtered = filtered.filter((h) => h.isActive === active);
  }

  if (category) {
    filtered = filtered.filter((h) => h.category === category);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return c.json({
    success: true,
    data: {
      items,
      pagination: { page, limit, total, totalPages },
    },
  });
});

/**
 * GET /api/admin/herbs/:id
 */
adminRouter.get('/herbs/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB, { schema });

  const herbRecord = await db.query.herb.findFirst({
    where: eq(schema.herb.id, id),
  });

  if (!herbRecord) {
    return c.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: '약재를 찾을 수 없습니다',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: herbRecord,
  });
});

/**
 * POST /api/admin/herbs
 */
adminRouter.post(
  '/herbs',
  authMiddleware,
  zValidator('json', PostAdminHerbBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
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
    const body = c.req.valid('json');
    const db = drizzle(c.env.DB, { schema });

    const now = new Date().toISOString();
    const newHerb = {
      id: `herb-${nanoid(12)}`,
      name: body.name,
      scientificName: body.scientificName ?? null,
      effect: body.effect ?? null,
      category: body.category ?? null,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(schema.herb).values(newHerb);

    return c.json({ success: true, data: newHerb }, 201);
  }
);

/**
 * PUT /api/admin/herbs/:id
 */
adminRouter.put(
  '/herbs/:id',
  authMiddleware,
  zValidator('json', PutAdminHerbBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
        },
        400
      );
    }
  }),
  async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const db = drizzle(c.env.DB, { schema });

    const existing = await db.query.herb.findFirst({
      where: eq(schema.herb.id, id),
    });

    if (!existing) {
      return c.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: '약재를 찾을 수 없습니다',
        },
        404
      );
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await db.update(schema.herb).set(updated).where(eq(schema.herb.id, id));

    return c.json({ success: true, data: updated });
  }
);

/**
 * DELETE /api/admin/herbs/:id
 */
adminRouter.delete('/herbs/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB, { schema });

  const existing = await db.query.herb.findFirst({
    where: eq(schema.herb.id, id),
  });

  if (!existing) {
    return c.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: '약재를 찾을 수 없습니다',
      },
      404
    );
  }

  await db.delete(schema.herb).where(eq(schema.herb.id, id));

  return c.json({ success: true, data: { message: '삭제되었습니다' } });
});

export default adminRouter;
