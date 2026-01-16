import type { D1Database } from '@cloudflare/workers-types';

/**
 * Cloudflare Workers 환경 바인딩 타입
 */
export interface Env {
  /** D1 데이터베이스 바인딩 */
  DB: D1Database;

  /** 환경 변수 */
  ENVIRONMENT?: 'development' | 'staging' | 'production';

  /** 관리자 비밀번호 (환경 변수로 설정) */
  ADMIN_PASSWORD?: string;

  /** JWT 시크릿 (환경 변수로 설정) */
  JWT_SECRET?: string;
}

/**
 * API 응답 기본 타입
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 페이지네이션 응답 타입
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
