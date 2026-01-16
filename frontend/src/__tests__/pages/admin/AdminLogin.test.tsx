/**
 * 관리자 로그인 페이지 테스트 스켈레톤
 *
 * 이 테스트는 RED 상태입니다.
 * Phase 1에서 컴포넌트 구현 후 GREEN 상태가 됩니다.
 *
 * 테스트 실패 이유: 컴포넌트가 아직 구현되지 않았습니다.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

/**
 * 테스트 래퍼 (쿼리 클라이언트 + 라우터)
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('AdminLoginPage', () => {
  beforeEach(() => {
    // 각 테스트 전 초기화
  });

  describe('렌더링', () => {
    it('should render login form', async () => {
      // RED: AdminLoginPage 컴포넌트가 없어서 실패
      // 구현 시: render(<AdminLoginPage />, { wrapper: TestWrapper });
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('should render username input field', async () => {
      // RED: 아이디 입력 필드 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      expect(screen.getByLabelText('아이디')).toBeInTheDocument();
    });

    it('should render password input field', async () => {
      // RED: 비밀번호 입력 필드 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    });

    it('should render submit button', async () => {
      // RED: 로그인 버튼 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    });

    it('should have password field with type="password"', async () => {
      // RED: 비밀번호 마스킹 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      const passwordInput = screen.getByLabelText('비밀번호');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('유효성 검사', () => {
    it('should show error when username is empty', async () => {
      // RED: 빈 아이디 에러 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.click(screen.getByRole('button', { name: '로그인' }));

      await waitFor(() => {
        expect(screen.getByText('아이디를 입력해주세요')).toBeInTheDocument();
      });
    });

    it('should show error when password is empty', async () => {
      // RED: 빈 비밀번호 에러 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.type(screen.getByLabelText('아이디'), 'admin');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      await waitFor(() => {
        expect(screen.getByText('비밀번호를 입력해주세요')).toBeInTheDocument();
      });
    });

    it('should disable submit button when form is invalid', async () => {
      // RED: 유효성 검사 비활성화 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
    });
  });

  describe('로그인 성공', () => {
    it('should call login API with credentials', async () => {
      // RED: 로그인 API 호출 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.type(screen.getByLabelText('아이디'), 'admin');
      await user.type(screen.getByLabelText('비밀번호'), 'password');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      // MSW 핸들러가 호출되어야 함
      await waitFor(() => {
        expect(screen.queryByText('로그인 중...')).not.toBeInTheDocument();
      });
    });

    it('should store token on successful login', async () => {
      // RED: 토큰 저장 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.type(screen.getByLabelText('아이디'), 'admin');
      await user.type(screen.getByLabelText('비밀번호'), 'password');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      await waitFor(() => {
        expect(localStorage.getItem('accessToken')).toBe('mock-access-token-12345');
      });
    });

    it('should redirect to dashboard on successful login', async () => {
      // RED: 대시보드 리다이렉트 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.type(screen.getByLabelText('아이디'), 'admin');
      await user.type(screen.getByLabelText('비밀번호'), 'password');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      await waitFor(() => {
        expect(window.location.pathname).toBe('/admin/dashboard');
      });
    });

    it('should show loading state during login', async () => {
      // RED: 로딩 상태 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.type(screen.getByLabelText('아이디'), 'admin');
      await user.type(screen.getByLabelText('비밀번호'), 'password');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      expect(screen.getByText('로그인 중...')).toBeInTheDocument();
    });
  });

  describe('로그인 실패', () => {
    it('should display error message on wrong credentials', async () => {
      // RED: 에러 메시지 표시 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.type(screen.getByLabelText('아이디'), 'admin');
      await user.type(screen.getByLabelText('비밀번호'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      await waitFor(() => {
        expect(screen.getByText('아이디 또는 비밀번호가 올바르지 않습니다')).toBeInTheDocument();
      });
    });

    it('should clear password field on error', async () => {
      // RED: 비밀번호 필드 초기화 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.type(screen.getByLabelText('아이디'), 'admin');
      await user.type(screen.getByLabelText('비밀번호'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      await waitFor(() => {
        expect(screen.getByLabelText('비밀번호')).toHaveValue('');
      });
    });

    it('should keep username on error', async () => {
      // RED: 아이디 유지 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.type(screen.getByLabelText('아이디'), 'admin');
      await user.type(screen.getByLabelText('비밀번호'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      await waitFor(() => {
        expect(screen.getByLabelText('아이디')).toHaveValue('admin');
      });
    });

    it('should display network error message', async () => {
      // RED: 네트워크 에러 메시지 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByText('네트워크 오류가 발생했습니다')).toBeInTheDocument();
      });
    });
  });

  describe('접근성', () => {
    it('should have proper form labels', async () => {
      // RED: 폼 라벨 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      expect(screen.getByLabelText('아이디')).toBeInTheDocument();
      expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      // RED: 키보드 내비게이션 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.tab();
      expect(screen.getByLabelText('아이디')).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('비밀번호')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: '로그인' })).toHaveFocus();
    });

    it('should submit form on Enter key', async () => {
      // RED: Enter 키 제출 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.type(screen.getByLabelText('아이디'), 'admin');
      await user.type(screen.getByLabelText('비밀번호'), 'password{enter}');

      await waitFor(() => {
        expect(screen.getByText('로그인 중...')).toBeInTheDocument();
      });
    });
  });
});
