/**
 * Contracts 통합 Export
 * FE/BE 모두 사용 가능
 */

// 공통 타입
export type {
  ApiSuccess,
  ApiError,
  ApiResponse,
  Pagination,
  PaginatedResponse,
  PaginationQuery,
  SortQuery,
  FilterQuery,
} from './types';

// 스키마 (스키마와 타입 모두 export)
export * from './schemas';

// API 계약
export * as DiagnosisContract from './diagnosis.contract';
export * as AdminContract from './admin.contract';
