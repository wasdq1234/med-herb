/**
 * 관리자 API 클라이언트
 */

import axios from 'axios';
import type { LoginResponse, PostAdminLogin } from '@contracts/admin.contract';
import type { ApiResponse } from '@contracts/types';

const API_BASE = '/api/admin';

/**
 * Axios 인스턴스 (관리자 API용)
 */
export const adminApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터 - 인증 토큰 자동 추가
 */
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 응답 인터셉터 - 401 에러 처리
 */
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

/**
 * 로그인 API
 */
export async function login(credentials: PostAdminLogin.Body): Promise<LoginResponse> {
  const response = await adminApi.post<ApiResponse<LoginResponse>>('/login', credentials);

  if (!response.data.success) {
    throw new Error(response.data.message || '로그인에 실패했습니다');
  }

  return response.data.data;
}

/**
 * 로그아웃 API
 */
export async function logout(): Promise<void> {
  await adminApi.post('/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/**
 * 토큰 갱신 API
 */
export async function refreshToken(): Promise<{ accessToken: string; expiresIn: number }> {
  const refreshTokenValue = localStorage.getItem('refreshToken');
  if (!refreshTokenValue) {
    throw new Error('리프레시 토큰이 없습니다');
  }

  const response = await adminApi.post<
    ApiResponse<{ accessToken: string; expiresIn: number }>
  >('/refresh', { refreshToken: refreshTokenValue });

  if (!response.data.success) {
    throw new Error(response.data.message || '토큰 갱신에 실패했습니다');
  }

  return response.data.data;
}

// ==================== 페이지네이션 타입 ====================

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== 증상 CRUD ====================

export async function getAdminSymptoms(params?: { page?: number; limit?: number; isActive?: boolean }) {
  const response = await adminApi.get<ApiResponse<PaginatedResponse<unknown>>>('/symptoms', { params });
  if (!response.data.success) throw new Error('Failed to fetch symptoms');
  return response.data.data;
}

export async function getAdminSymptom(id: string) {
  const response = await adminApi.get<ApiResponse<unknown>>(`/symptoms/${id}`);
  if (!response.data.success) throw new Error('Failed to fetch symptom');
  return response.data.data;
}

export async function createAdminSymptom(data: { name: string; description?: string; category?: string; displayOrder?: number; isActive?: boolean }) {
  const response = await adminApi.post<ApiResponse<unknown>>('/symptoms', data);
  if (!response.data.success) throw new Error('Failed to create symptom');
  return response.data.data;
}

export async function updateAdminSymptom(id: string, data: Partial<{ name: string; description: string; category: string; displayOrder: number; isActive: boolean }>) {
  const response = await adminApi.put<ApiResponse<unknown>>(`/symptoms/${id}`, data);
  if (!response.data.success) throw new Error('Failed to update symptom');
  return response.data.data;
}

export async function deleteAdminSymptom(id: string) {
  const response = await adminApi.delete<ApiResponse<{ message: string }>>(`/symptoms/${id}`);
  if (!response.data.success) throw new Error('Failed to delete symptom');
  return response.data.data;
}

// ==================== 질문 CRUD ====================

export async function getAdminQuestions(params?: { page?: number; limit?: number; symptomId?: string }) {
  const response = await adminApi.get<ApiResponse<PaginatedResponse<unknown>>>('/questions', { params });
  if (!response.data.success) throw new Error('Failed to fetch questions');
  return response.data.data;
}

export async function getAdminQuestion(id: string) {
  const response = await adminApi.get<ApiResponse<unknown>>(`/questions/${id}`);
  if (!response.data.success) throw new Error('Failed to fetch question');
  return response.data.data;
}

export async function createAdminQuestion(data: unknown) {
  const response = await adminApi.post<ApiResponse<unknown>>('/questions', data);
  if (!response.data.success) throw new Error('Failed to create question');
  return response.data.data;
}

export async function updateAdminQuestion(id: string, data: unknown) {
  const response = await adminApi.put<ApiResponse<unknown>>(`/questions/${id}`, data);
  if (!response.data.success) throw new Error('Failed to update question');
  return response.data.data;
}

export async function deleteAdminQuestion(id: string) {
  const response = await adminApi.delete<ApiResponse<{ message: string }>>(`/questions/${id}`);
  if (!response.data.success) throw new Error('Failed to delete question');
  return response.data.data;
}

// ==================== 변증 CRUD ====================

export async function getAdminSyndromes(params?: { page?: number; limit?: number; isActive?: boolean }) {
  const response = await adminApi.get<ApiResponse<PaginatedResponse<unknown>>>('/syndromes', { params });
  if (!response.data.success) throw new Error('Failed to fetch syndromes');
  return response.data.data;
}

export async function getAdminSyndrome(id: string) {
  const response = await adminApi.get<ApiResponse<unknown>>(`/syndromes/${id}`);
  if (!response.data.success) throw new Error('Failed to fetch syndrome');
  return response.data.data;
}

export async function createAdminSyndrome(data: { name: string; description?: string; category?: string; characteristics?: string; isActive?: boolean }) {
  const response = await adminApi.post<ApiResponse<unknown>>('/syndromes', data);
  if (!response.data.success) throw new Error('Failed to create syndrome');
  return response.data.data;
}

export async function updateAdminSyndrome(id: string, data: Partial<{ name: string; description: string; category: string; characteristics: string; isActive: boolean }>) {
  const response = await adminApi.put<ApiResponse<unknown>>(`/syndromes/${id}`, data);
  if (!response.data.success) throw new Error('Failed to update syndrome');
  return response.data.data;
}

export async function deleteAdminSyndrome(id: string) {
  const response = await adminApi.delete<ApiResponse<{ message: string }>>(`/syndromes/${id}`);
  if (!response.data.success) throw new Error('Failed to delete syndrome');
  return response.data.data;
}

// ==================== 약재 CRUD ====================

export async function getAdminHerbs(params?: { page?: number; limit?: number; isActive?: boolean }) {
  const response = await adminApi.get<ApiResponse<PaginatedResponse<unknown>>>('/herbs', { params });
  if (!response.data.success) throw new Error('Failed to fetch herbs');
  return response.data.data;
}

export async function getAdminHerb(id: string) {
  const response = await adminApi.get<ApiResponse<unknown>>(`/herbs/${id}`);
  if (!response.data.success) throw new Error('Failed to fetch herb');
  return response.data.data;
}

export async function createAdminHerb(data: { name: string; scientificName?: string; effect?: string; category?: string; isActive?: boolean }) {
  const response = await adminApi.post<ApiResponse<unknown>>('/herbs', data);
  if (!response.data.success) throw new Error('Failed to create herb');
  return response.data.data;
}

export async function updateAdminHerb(id: string, data: Partial<{ name: string; scientificName: string; effect: string; category: string; isActive: boolean }>) {
  const response = await adminApi.put<ApiResponse<unknown>>(`/herbs/${id}`, data);
  if (!response.data.success) throw new Error('Failed to update herb');
  return response.data.data;
}

export async function deleteAdminHerb(id: string) {
  const response = await adminApi.delete<ApiResponse<{ message: string }>>(`/herbs/${id}`);
  if (!response.data.success) throw new Error('Failed to delete herb');
  return response.data.data;
}
