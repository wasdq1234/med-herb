/**
 * 진단 API 계약 정의
 *
 * 엔드포인트:
 * - GET /api/symptoms - 활성 증상 목록 조회
 * - GET /api/questions - 활성 질문 목록 조회
 * - POST /api/diagnosis - 진단 요청 및 결과 반환
 */

import type { ApiResponse } from './types';
import type {
  Symptom,
  Question,
  DiagnosisRequest,
  DiagnosisResponse,
} from './schemas';

/**
 * GET /api/symptoms
 * 활성 증상 목록 조회
 */
export namespace GetSymptoms {
  export type Query = {
    category?: string;
  };

  export type Response = ApiResponse<Symptom[]>;
}

/**
 * GET /api/questions
 * 활성 질문 목록 조회
 */
export namespace GetQuestions {
  export type Query = {
    symptomId?: string;
  };

  export type Response = ApiResponse<Question[]>;
}

/**
 * POST /api/diagnosis
 * 진단 요청 및 결과 반환
 */
export namespace PostDiagnosis {
  export type Body = DiagnosisRequest;

  export type Response = DiagnosisResponse;
}
