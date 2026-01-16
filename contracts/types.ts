/**
 * API 공통 타입 정의
 * FE/BE 모두 사용 가능
 */

/**
 * API 성공 응답 래퍼
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/**
 * API 에러 응답 래퍼
 */
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * API 응답 타입 (성공 또는 실패)
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * 페이지네이션 메타 정보
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

/**
 * 페이지네이션 쿼리 파라미터
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/**
 * 정렬 파라미터
 */
export interface SortQuery {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 필터 파라미터
 */
export interface FilterQuery {
  isActive?: boolean;
  category?: string;
}
