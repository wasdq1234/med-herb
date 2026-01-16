/**
 * 관리자 API MSW 핸들러
 *
 * 엔드포인트:
 * - POST /api/admin/login - 관리자 로그인
 * - POST /api/admin/logout - 관리자 로그아웃
 * - POST /api/admin/refresh - 토큰 갱신
 * - GET/POST/PUT/DELETE /api/admin/symptoms - 증상 CRUD
 * - GET/POST/PUT/DELETE /api/admin/questions - 질문 CRUD
 * - GET/POST/PUT/DELETE /api/admin/syndromes - 변증 CRUD
 * - GET/POST/PUT/DELETE /api/admin/herbs - 약재 CRUD
 */

import { http, HttpResponse, delay } from 'msw';
import {
  mockAdmin,
  mockSymptoms,
  mockQuestions,
  mockAdminSyndromes,
  mockAdminHerbs,
  mockTokens,
  paginate,
} from '../data/mockData';

const API_BASE = '/api/admin';

// 임시 저장소 (테스트용)
let symptoms = [...mockSymptoms];
let questions = [...mockQuestions];
let syndromes = [...mockAdminSyndromes];
let herbs = [...mockAdminHerbs];

/**
 * 인증 헤더 검증 헬퍼
 */
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  return authHeader?.startsWith('Bearer ') ?? false;
}

/**
 * 401 Unauthorized 응답
 */
function unauthorizedResponse() {
  return HttpResponse.json(
    {
      success: false,
      error: 'UNAUTHORIZED',
      message: '인증이 필요합니다',
    },
    { status: 401 }
  );
}

/**
 * 404 Not Found 응답
 */
function notFoundResponse(resource: string) {
  return HttpResponse.json(
    {
      success: false,
      error: 'NOT_FOUND',
      message: `${resource}을(를) 찾을 수 없습니다`,
    },
    { status: 404 }
  );
}

// ==================== 인증 ====================

/**
 * POST /api/admin/login
 */
const postLogin = http.post(`${API_BASE}/login`, async ({ request }) => {
  await delay(200);

  const body = (await request.json()) as { username: string; password: string };

  if (body.username === 'admin' && body.password === 'password') {
    return HttpResponse.json({
      success: true,
      data: {
        admin: mockAdmin,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        expiresIn: mockTokens.expiresIn,
      },
    });
  }

  return HttpResponse.json(
    {
      success: false,
      error: 'UNAUTHORIZED',
      message: '아이디 또는 비밀번호가 올바르지 않습니다',
    },
    { status: 401 }
  );
});

/**
 * POST /api/admin/logout
 */
const postLogout = http.post(`${API_BASE}/logout`, async ({ request }) => {
  await delay(100);

  if (!checkAuth(request)) {
    return unauthorizedResponse();
  }

  return HttpResponse.json({
    success: true,
    data: { message: '로그아웃 되었습니다' },
  });
});

/**
 * POST /api/admin/refresh
 */
const postRefresh = http.post(`${API_BASE}/refresh`, async ({ request }) => {
  await delay(100);

  const body = (await request.json()) as { refreshToken: string };

  if (body.refreshToken === mockTokens.refreshToken) {
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: `new-${mockTokens.accessToken}`,
        expiresIn: mockTokens.expiresIn,
      },
    });
  }

  return HttpResponse.json(
    {
      success: false,
      error: 'INVALID_TOKEN',
      message: '유효하지 않은 토큰입니다',
    },
    { status: 401 }
  );
});

// ==================== 증상 CRUD ====================

const getSymptoms = http.get(`${API_BASE}/symptoms`, async ({ request }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const isActive = url.searchParams.get('isActive');
  const category = url.searchParams.get('category');

  let filtered = [...symptoms];
  if (isActive !== null) {
    filtered = filtered.filter((s) => s.isActive === (isActive === 'true'));
  }
  if (category) {
    filtered = filtered.filter((s) => s.category === category);
  }

  return HttpResponse.json({
    success: true,
    data: paginate(filtered, page, limit),
  });
});

const getSymptom = http.get(`${API_BASE}/symptoms/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const symptom = symptoms.find((s) => s.id === params.id);
  if (!symptom) return notFoundResponse('증상');

  return HttpResponse.json({ success: true, data: symptom });
});

const postSymptom = http.post(`${API_BASE}/symptoms`, async ({ request }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const body = await request.json();
  const newSymptom = {
    id: `sym-${Date.now()}`,
    ...body,
    isActive: body.isActive ?? true,
    displayOrder: body.displayOrder ?? 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  symptoms.push(newSymptom);

  return HttpResponse.json({ success: true, data: newSymptom }, { status: 201 });
});

const putSymptom = http.put(`${API_BASE}/symptoms/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const index = symptoms.findIndex((s) => s.id === params.id);
  if (index === -1) return notFoundResponse('증상');

  const body = await request.json();
  symptoms[index] = {
    ...symptoms[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return HttpResponse.json({ success: true, data: symptoms[index] });
});

const deleteSymptom = http.delete(`${API_BASE}/symptoms/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const index = symptoms.findIndex((s) => s.id === params.id);
  if (index === -1) return notFoundResponse('증상');

  symptoms.splice(index, 1);

  return HttpResponse.json({ success: true, data: { message: '삭제되었습니다' } });
});

// ==================== 질문 CRUD ====================

const getQuestions = http.get(`${API_BASE}/questions`, async ({ request }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const isActive = url.searchParams.get('isActive');
  const symptomId = url.searchParams.get('symptomId');

  let filtered = [...questions];
  if (isActive !== null) {
    filtered = filtered.filter((q) => q.isActive === (isActive === 'true'));
  }
  if (symptomId) {
    filtered = filtered.filter((q) => q.symptomId === symptomId);
  }

  return HttpResponse.json({
    success: true,
    data: paginate(filtered, page, limit),
  });
});

const getQuestion = http.get(`${API_BASE}/questions/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const question = questions.find((q) => q.id === params.id);
  if (!question) return notFoundResponse('질문');

  return HttpResponse.json({ success: true, data: question });
});

const postQuestion = http.post(`${API_BASE}/questions`, async ({ request }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const body = await request.json();
  const newQuestion = {
    id: `q-${Date.now()}`,
    ...body,
    isActive: body.isActive ?? true,
    displayOrder: body.displayOrder ?? 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  questions.push(newQuestion);

  return HttpResponse.json({ success: true, data: newQuestion }, { status: 201 });
});

const putQuestion = http.put(`${API_BASE}/questions/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const index = questions.findIndex((q) => q.id === params.id);
  if (index === -1) return notFoundResponse('질문');

  const body = await request.json();
  questions[index] = {
    ...questions[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return HttpResponse.json({ success: true, data: questions[index] });
});

const deleteQuestion = http.delete(`${API_BASE}/questions/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const index = questions.findIndex((q) => q.id === params.id);
  if (index === -1) return notFoundResponse('질문');

  questions.splice(index, 1);

  return HttpResponse.json({ success: true, data: { message: '삭제되었습니다' } });
});

// ==================== 변증 CRUD ====================

const getSyndromes = http.get(`${API_BASE}/syndromes`, async ({ request }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const isActive = url.searchParams.get('isActive');
  const category = url.searchParams.get('category');

  let filtered = [...syndromes];
  if (isActive !== null) {
    filtered = filtered.filter((s) => s.isActive === (isActive === 'true'));
  }
  if (category) {
    filtered = filtered.filter((s) => s.category === category);
  }

  return HttpResponse.json({
    success: true,
    data: paginate(filtered, page, limit),
  });
});

const getSyndrome = http.get(`${API_BASE}/syndromes/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const syndrome = syndromes.find((s) => s.id === params.id);
  if (!syndrome) return notFoundResponse('변증');

  return HttpResponse.json({ success: true, data: syndrome });
});

const postSyndrome = http.post(`${API_BASE}/syndromes`, async ({ request }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const body = await request.json();
  const newSyndrome = {
    id: `snd-${Date.now()}`,
    ...body,
    isActive: body.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  syndromes.push(newSyndrome);

  return HttpResponse.json({ success: true, data: newSyndrome }, { status: 201 });
});

const putSyndrome = http.put(`${API_BASE}/syndromes/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const index = syndromes.findIndex((s) => s.id === params.id);
  if (index === -1) return notFoundResponse('변증');

  const body = await request.json();
  syndromes[index] = {
    ...syndromes[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return HttpResponse.json({ success: true, data: syndromes[index] });
});

const deleteSyndrome = http.delete(`${API_BASE}/syndromes/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const index = syndromes.findIndex((s) => s.id === params.id);
  if (index === -1) return notFoundResponse('변증');

  syndromes.splice(index, 1);

  return HttpResponse.json({ success: true, data: { message: '삭제되었습니다' } });
});

// ==================== 약재 CRUD ====================

const getHerbs = http.get(`${API_BASE}/herbs`, async ({ request }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const isActive = url.searchParams.get('isActive');
  const category = url.searchParams.get('category');

  let filtered = [...herbs];
  if (isActive !== null) {
    filtered = filtered.filter((h) => h.isActive === (isActive === 'true'));
  }
  if (category) {
    filtered = filtered.filter((h) => h.category === category);
  }

  return HttpResponse.json({
    success: true,
    data: paginate(filtered, page, limit),
  });
});

const getHerb = http.get(`${API_BASE}/herbs/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const herb = herbs.find((h) => h.id === params.id);
  if (!herb) return notFoundResponse('약재');

  return HttpResponse.json({ success: true, data: herb });
});

const postHerb = http.post(`${API_BASE}/herbs`, async ({ request }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const body = await request.json();
  const newHerb = {
    id: `herb-${Date.now()}`,
    ...body,
    isActive: body.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  herbs.push(newHerb);

  return HttpResponse.json({ success: true, data: newHerb }, { status: 201 });
});

const putHerb = http.put(`${API_BASE}/herbs/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const index = herbs.findIndex((h) => h.id === params.id);
  if (index === -1) return notFoundResponse('약재');

  const body = await request.json();
  herbs[index] = {
    ...herbs[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return HttpResponse.json({ success: true, data: herbs[index] });
});

const deleteHerb = http.delete(`${API_BASE}/herbs/:id`, async ({ request, params }) => {
  await delay(100);
  if (!checkAuth(request)) return unauthorizedResponse();

  const index = herbs.findIndex((h) => h.id === params.id);
  if (index === -1) return notFoundResponse('약재');

  herbs.splice(index, 1);

  return HttpResponse.json({ success: true, data: { message: '삭제되었습니다' } });
});

/**
 * Mock 데이터 리셋 (테스트용)
 */
export function resetMockData() {
  symptoms = [...mockSymptoms];
  questions = [...mockQuestions];
  syndromes = [...mockAdminSyndromes];
  herbs = [...mockAdminHerbs];
}

/**
 * 관리자 API 핸들러 목록
 */
export const adminHandlers = [
  // 인증
  postLogin,
  postLogout,
  postRefresh,
  // 증상
  getSymptoms,
  getSymptom,
  postSymptom,
  putSymptom,
  deleteSymptom,
  // 질문
  getQuestions,
  getQuestion,
  postQuestion,
  putQuestion,
  deleteQuestion,
  // 변증
  getSyndromes,
  getSyndrome,
  postSyndrome,
  putSyndrome,
  deleteSyndrome,
  // 약재
  getHerbs,
  getHerb,
  postHerb,
  putHerb,
  deleteHerb,
];
