/**
 * 진단 API 클라이언트
 */

import axios from 'axios';
import type {
  Symptom,
  Question,
  DiagnosisRequest,
  DiagnosisResponse,
} from '@contracts/schemas';

const API_BASE = import.meta.env.VITE_API_URL || '';

const diagnosisApi = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * 활성 증상 목록 조회
 */
export async function getSymptoms(category?: string): Promise<Symptom[]> {
  const params = category ? { category } : {};
  const response = await diagnosisApi.get<ApiResponse<Symptom[]>>('/symptoms', { params });

  if (!response.data.success) {
    throw new Error('증상 목록을 불러오는데 실패했습니다');
  }

  return response.data.data;
}

/**
 * 활성 질문 목록 조회
 */
export async function getQuestions(symptomId?: string): Promise<Question[]> {
  const params = symptomId ? { symptomId } : {};
  const response = await diagnosisApi.get<ApiResponse<Question[]>>('/questions', { params });

  if (!response.data.success) {
    throw new Error('질문 목록을 불러오는데 실패했습니다');
  }

  return response.data.data;
}

/**
 * 진단 요청
 */
export async function submitDiagnosis(
  request: DiagnosisRequest
): Promise<DiagnosisResponse['data']> {
  const response = await diagnosisApi.post<DiagnosisResponse>('/diagnosis', request);

  if (!response.data.success) {
    throw new Error('진단에 실패했습니다');
  }

  return response.data.data;
}
