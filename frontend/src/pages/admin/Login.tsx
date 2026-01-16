/**
 * 관리자 로그인 페이지
 */

import { useState, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/admin';
import { useAdminStore } from '../../stores/adminStore';
import type { AxiosError } from 'axios';
import type { ApiError } from '@contracts/types';

interface FormErrors {
  username?: string;
  password?: string;
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login: storeLogin, setError, error: storeError, clearError } = useAdminStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ username: false, password: false });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      storeLogin(data.admin, data.accessToken, data.refreshToken);
      navigate('/admin/dashboard');
    },
    onError: (error: AxiosError<ApiError>) => {
      // 비밀번호 필드 초기화
      setPassword('');

      if (error.response?.status === 401) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다');
      } else if (error.code === 'ERR_NETWORK') {
        setError('네트워크 오류가 발생했습니다');
      } else {
        setError(error.response?.data?.message || '로그인에 실패했습니다');
      }
    },
  });

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = '아이디를 입력해주세요';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, password]);

  // 버튼은 사용자가 어떤 입력이라도 시작하면 활성화
  // 제출 시 유효성 검사
  const hasAnyInput = username !== '' || password !== '';

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      clearError();
      setTouched({ username: true, password: true });

      if (!validateForm()) {
        return;
      }

      loginMutation.mutate({ username: username.trim(), password });
    },
    [username, password, validateForm, loginMutation, clearError]
  );

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
      if (touched.username && e.target.value.trim()) {
        setErrors((prev) => ({ ...prev, username: undefined }));
      }
    },
    [touched.username]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      if (touched.password && e.target.value) {
        setErrors((prev) => ({ ...prev, password: undefined }));
      }
    },
    [touched.password]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-heading-lg text-center text-neutral-900 mb-8">관리자 로그인</h1>

          <form role="form" onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 입력 */}
            <div>
              <label htmlFor="username" className="block text-body-md font-medium text-neutral-700 mb-2">
                아이디
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.username ? 'border-error-500' : 'border-neutral-300'
                }`}
                placeholder="아이디를 입력하세요"
                autoComplete="username"
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
              {errors.username && (
                <p id="username-error" className="mt-2 text-body-sm text-error-500" role="alert">
                  {errors.username}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-body-md font-medium text-neutral-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.password ? 'border-error-500' : 'border-neutral-300'
                }`}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-2 text-body-sm text-error-500" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* API 에러 메시지 */}
            {storeError && (
              <div className="p-4 bg-error-50 border border-error-200 rounded-lg" role="alert">
                <p className="text-body-md text-error-700">{storeError}</p>
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={!hasAnyInput || loginMutation.isPending}
              className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
