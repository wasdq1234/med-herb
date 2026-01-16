/**
 * 관리자 API 계약 정의
 *
 * 엔드포인트:
 * - POST /api/admin/login - 관리자 로그인
 * - GET/POST/PUT/DELETE /api/admin/symptoms - 증상 CRUD
 * - GET/POST/PUT/DELETE /api/admin/questions - 질문 CRUD
 * - GET/POST/PUT/DELETE /api/admin/syndromes - 변증 CRUD
 * - GET/POST/PUT/DELETE /api/admin/herbs - 약재 CRUD
 */

import type { ApiResponse, PaginatedResponse, PaginationQuery } from './types';
import type { Symptom, CreateSymptom, UpdateSymptom } from './schemas/symptom';
import type { Question, CreateQuestion } from './schemas/question';

/**
 * 관리자 타입 정의
 */
export interface Admin {
  id: string;
  username: string;
  createdAt: string;
}

/**
 * 로그인 응답 타입
 */
export interface LoginResponse {
  admin: Admin;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * 변증 타입 정의
 */
export interface Syndrome {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  characteristics: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSyndrome {
  name: string;
  description?: string | null;
  category?: string | null;
  characteristics?: string | null;
  isActive?: boolean;
}

export interface UpdateSyndrome {
  name?: string;
  description?: string | null;
  category?: string | null;
  characteristics?: string | null;
  isActive?: boolean;
}

/**
 * 약재 타입 정의
 */
export interface Herb {
  id: string;
  name: string;
  scientificName: string | null;
  effect: string | null;
  category: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHerb {
  name: string;
  scientificName?: string | null;
  effect?: string | null;
  category?: string | null;
  isActive?: boolean;
}

export interface UpdateHerb {
  name?: string;
  scientificName?: string | null;
  effect?: string | null;
  category?: string | null;
  isActive?: boolean;
}

/**
 * POST /api/admin/login
 * 관리자 로그인
 */
export namespace PostAdminLogin {
  export type Body = {
    username: string;
    password: string;
  };

  export type Response = ApiResponse<LoginResponse>;
}

/**
 * POST /api/admin/logout
 * 관리자 로그아웃
 */
export namespace PostAdminLogout {
  export type Response = ApiResponse<{ message: string }>;
}

/**
 * POST /api/admin/refresh
 * 토큰 갱신
 */
export namespace PostAdminRefresh {
  export type Body = {
    refreshToken: string;
  };

  export type Response = ApiResponse<{
    accessToken: string;
    expiresIn: number;
  }>;
}

/**
 * GET /api/admin/symptoms
 * 증상 목록 조회 (페이지네이션)
 */
export namespace GetAdminSymptoms {
  export type Query = PaginationQuery & {
    isActive?: boolean;
    category?: string;
  };

  export type Response = ApiResponse<PaginatedResponse<Symptom>>;
}

/**
 * GET /api/admin/symptoms/:id
 * 증상 상세 조회
 */
export namespace GetAdminSymptom {
  export type Params = {
    id: string;
  };

  export type Response = ApiResponse<Symptom>;
}

/**
 * POST /api/admin/symptoms
 * 증상 생성
 */
export namespace PostAdminSymptom {
  export type Body = CreateSymptom;

  export type Response = ApiResponse<Symptom>;
}

/**
 * PUT /api/admin/symptoms/:id
 * 증상 수정
 */
export namespace PutAdminSymptom {
  export type Params = {
    id: string;
  };

  export type Body = UpdateSymptom;

  export type Response = ApiResponse<Symptom>;
}

/**
 * DELETE /api/admin/symptoms/:id
 * 증상 삭제
 */
export namespace DeleteAdminSymptom {
  export type Params = {
    id: string;
  };

  export type Response = ApiResponse<{ message: string }>;
}

/**
 * GET /api/admin/questions
 * 질문 목록 조회 (페이지네이션)
 */
export namespace GetAdminQuestions {
  export type Query = PaginationQuery & {
    isActive?: boolean;
    symptomId?: string;
  };

  export type Response = ApiResponse<PaginatedResponse<Question>>;
}

/**
 * GET /api/admin/questions/:id
 * 질문 상세 조회
 */
export namespace GetAdminQuestion {
  export type Params = {
    id: string;
  };

  export type Response = ApiResponse<Question>;
}

/**
 * POST /api/admin/questions
 * 질문 생성
 */
export namespace PostAdminQuestion {
  export type Body = CreateQuestion;

  export type Response = ApiResponse<Question>;
}

/**
 * PUT /api/admin/questions/:id
 * 질문 수정
 */
export namespace PutAdminQuestion {
  export type Params = {
    id: string;
  };

  export type Body = Partial<CreateQuestion>;

  export type Response = ApiResponse<Question>;
}

/**
 * DELETE /api/admin/questions/:id
 * 질문 삭제
 */
export namespace DeleteAdminQuestion {
  export type Params = {
    id: string;
  };

  export type Response = ApiResponse<{ message: string }>;
}

/**
 * GET /api/admin/syndromes
 * 변증 목록 조회 (페이지네이션)
 */
export namespace GetAdminSyndromes {
  export type Query = PaginationQuery & {
    isActive?: boolean;
    category?: string;
  };

  export type Response = ApiResponse<PaginatedResponse<Syndrome>>;
}

/**
 * GET /api/admin/syndromes/:id
 * 변증 상세 조회
 */
export namespace GetAdminSyndrome {
  export type Params = {
    id: string;
  };

  export type Response = ApiResponse<Syndrome>;
}

/**
 * POST /api/admin/syndromes
 * 변증 생성
 */
export namespace PostAdminSyndrome {
  export type Body = CreateSyndrome;

  export type Response = ApiResponse<Syndrome>;
}

/**
 * PUT /api/admin/syndromes/:id
 * 변증 수정
 */
export namespace PutAdminSyndrome {
  export type Params = {
    id: string;
  };

  export type Body = UpdateSyndrome;

  export type Response = ApiResponse<Syndrome>;
}

/**
 * DELETE /api/admin/syndromes/:id
 * 변증 삭제
 */
export namespace DeleteAdminSyndrome {
  export type Params = {
    id: string;
  };

  export type Response = ApiResponse<{ message: string }>;
}

/**
 * GET /api/admin/herbs
 * 약재 목록 조회 (페이지네이션)
 */
export namespace GetAdminHerbs {
  export type Query = PaginationQuery & {
    isActive?: boolean;
    category?: string;
  };

  export type Response = ApiResponse<PaginatedResponse<Herb>>;
}

/**
 * GET /api/admin/herbs/:id
 * 약재 상세 조회
 */
export namespace GetAdminHerb {
  export type Params = {
    id: string;
  };

  export type Response = ApiResponse<Herb>;
}

/**
 * POST /api/admin/herbs
 * 약재 생성
 */
export namespace PostAdminHerb {
  export type Body = CreateHerb;

  export type Response = ApiResponse<Herb>;
}

/**
 * PUT /api/admin/herbs/:id
 * 약재 수정
 */
export namespace PutAdminHerb {
  export type Params = {
    id: string;
  };

  export type Body = UpdateHerb;

  export type Response = ApiResponse<Herb>;
}

/**
 * DELETE /api/admin/herbs/:id
 * 약재 삭제
 */
export namespace DeleteAdminHerb {
  export type Params = {
    id: string;
  };

  export type Response = ApiResponse<{ message: string }>;
}
