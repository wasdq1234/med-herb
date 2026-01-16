/**
 * 진단 페이지 테스트 스켈레톤
 *
 * 이 테스트는 RED 상태입니다.
 * Phase 2에서 컴포넌트 구현 후 GREEN 상태가 됩니다.
 *
 * 테스트 실패 이유: 컴포넌트가 아직 구현되지 않았습니다.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
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

describe('DiagnosisPage', () => {
  beforeEach(() => {
    // 각 테스트 전 초기화
  });

  describe('증상 선택 단계', () => {
    it('should render symptom list from API', async () => {
      // RED: DiagnosisPage 컴포넌트가 없어서 실패
      // 구현 시: render(<DiagnosisPage />, { wrapper: TestWrapper });
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      // 실제 테스트: 증상 목록이 표시되어야 함
      await waitFor(() => {
        expect(screen.getByText('두통')).toBeInTheDocument();
      });
    });

    it('should display loading state while fetching symptoms', async () => {
      // RED: 로딩 상태 표시 기능 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    });

    it('should allow selecting multiple symptoms', async () => {
      // RED: 증상 선택 기능 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole('checkbox', { name: '두통' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('checkbox', { name: '두통' }));
      expect(screen.getByRole('checkbox', { name: '두통' })).toBeChecked();
    });

    it('should enable next button when at least one symptom is selected', async () => {
      // RED: 다음 버튼 활성화 로직 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
      });

      await user.click(screen.getByRole('checkbox', { name: '두통' }));
      expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
    });

    it('should disable next button when no symptom is selected', async () => {
      // RED: 다음 버튼 비활성화 로직 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
      });
    });

    it('should show progress indicator (1/3)', async () => {
      // RED: 진행률 표시 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      expect(screen.getByText('1/3')).toBeInTheDocument();
    });
  });

  describe('질문 응답 단계', () => {
    it('should render questions based on selected symptoms', async () => {
      // RED: 질문 렌더링 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByText('두통이 주로 발생하는 시간대는 언제인가요?')).toBeInTheDocument();
      });
    });

    it('should render radio type question with options', async () => {
      // RED: 라디오 타입 질문 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole('radio', { name: '아침' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: '오후' })).toBeInTheDocument();
      });
    });

    it('should render slider type question with range', async () => {
      // RED: 슬라이더 타입 질문 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole('slider')).toBeInTheDocument();
      });
    });

    it('should allow navigating between questions', async () => {
      // RED: 질문 네비게이션 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
      });
    });

    it('should show question progress (Q1/10)', async () => {
      // RED: 질문 진행률 표시 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      expect(screen.getByText(/Q\d+\/\d+/)).toBeInTheDocument();
    });

    it('should persist answers when navigating back', async () => {
      // RED: 응답 저장 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      // 응답 선택 후 이전으로 갔다가 다시 오면 응답이 유지되어야 함
      await user.click(screen.getByRole('radio', { name: '아침' }));
      await user.click(screen.getByRole('button', { name: '이전' }));
      await user.click(screen.getByRole('button', { name: '다음' }));

      expect(screen.getByRole('radio', { name: '아침' })).toBeChecked();
    });
  });

  describe('진단 제출', () => {
    it('should submit diagnosis when all questions are answered', async () => {
      // RED: 진단 제출 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '진단받기' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: '진단받기' }));
    });

    it('should show loading state during diagnosis submission', async () => {
      // RED: 제출 중 로딩 상태 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.click(screen.getByRole('button', { name: '진단받기' }));

      expect(screen.getByText('진단 중...')).toBeInTheDocument();
    });

    it('should navigate to result page on successful diagnosis', async () => {
      // RED: 결과 페이지 이동 미구현
      const user = userEvent.setup();
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await user.click(screen.getByRole('button', { name: '진단받기' }));

      await waitFor(() => {
        expect(window.location.pathname).toBe('/result');
      });
    });

    it('should display error message on diagnosis failure', async () => {
      // RED: 에러 메시지 표시 미구현
      render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});

describe('SymptomSelector', () => {
  it('should render list of symptoms', async () => {
    // RED: SymptomSelector 컴포넌트 미구현
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('두통')).toBeInTheDocument();
      expect(screen.getByText('소화불량')).toBeInTheDocument();
    });
  });

  it('should group symptoms by category', async () => {
    // RED: 카테고리 그룹화 미구현
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('통증')).toBeInTheDocument();
      expect(screen.getByText('소화기')).toBeInTheDocument();
    });
  });

  it('should call onSelect when symptom is clicked', async () => {
    // RED: onSelect 콜백 미구현
    const onSelect = vi.fn();
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    const checkbox = screen.getByRole('checkbox', { name: '두통' });
    await userEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith('sym-001');
  });

  it('should highlight selected symptoms', async () => {
    // RED: 선택 강조 미구현
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    const symptom = screen.getByTestId('symptom-sym-001');
    expect(symptom).toHaveClass('selected');
  });

  it('should show symptom description on hover/focus', async () => {
    // RED: 설명 툴팁 미구현
    const user = userEvent.setup();
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    await user.hover(screen.getByText('두통'));

    await waitFor(() => {
      expect(screen.getByText('머리가 아픈 증상')).toBeInTheDocument();
    });
  });
});

describe('QuestionCard', () => {
  it('should render question text', async () => {
    // RED: QuestionCard 컴포넌트 미구현
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    expect(screen.getByText('두통이 주로 발생하는 시간대는 언제인가요?')).toBeInTheDocument();
  });

  it('should render radio options for radio type', async () => {
    // RED: 라디오 옵션 렌더링 미구현
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    expect(screen.getByRole('radio', { name: '아침' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '오후' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '저녁' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '밤' })).toBeInTheDocument();
  });

  it('should render slider for slider type', async () => {
    // RED: 슬라이더 렌더링 미구현
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveAttribute('min', '1');
    expect(screen.getByRole('slider')).toHaveAttribute('max', '10');
  });

  it('should call onChange when answer is selected', async () => {
    // RED: onChange 콜백 미구현
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    await user.click(screen.getByRole('radio', { name: '아침' }));

    expect(onChange).toHaveBeenCalledWith({ questionId: 'q-001', value: 'morning' });
  });

  it('should show current value for slider', async () => {
    // RED: 현재 값 표시 미구현
    render(<div data-testid="placeholder" />, { wrapper: TestWrapper });

    expect(screen.getByTestId('slider-value')).toHaveTextContent('5');
  });
});
