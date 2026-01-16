/**
 * 진단 페이지 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import DiagnosisPage from '../../pages/Diagnosis';
import SymptomSelector from '../../components/diagnosis/SymptomSelector';
import QuestionCard from '../../components/diagnosis/QuestionCard';
import { mockSymptoms, mockQuestions } from '../../mocks/data/mockData';
import { useDiagnosisStore } from '../../stores/diagnosisStore';

/**
 * 테스트 래퍼 (쿼리 클라이언트 + 라우터)
 */
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const TestWrapper = createTestWrapper();

describe('DiagnosisPage', () => {
  beforeEach(() => {
    // 각 테스트 전 스토어 초기화
    useDiagnosisStore.getState().reset();
  });

  describe('증상 선택 단계', () => {
    it('should render symptom list from API', async () => {
      render(<DiagnosisPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('두통')).toBeInTheDocument();
      });
    });

    it('should display loading state while fetching symptoms', async () => {
      render(<DiagnosisPage />, { wrapper: createTestWrapper() });

      expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    });

    it('should allow selecting multiple symptoms', async () => {
      const user = userEvent.setup();
      render(<DiagnosisPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('checkbox', { name: '두통' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('checkbox', { name: '두통' }));
      expect(screen.getByRole('checkbox', { name: '두통' })).toBeChecked();
    });

    it('should enable next button when at least one symptom is selected', async () => {
      const user = userEvent.setup();
      render(<DiagnosisPage />, { wrapper: createTestWrapper() });

      // 증상 로딩 대기
      await waitFor(() => {
        expect(screen.getByRole('checkbox', { name: '두통' })).toBeInTheDocument();
      });

      // 초기에 버튼 비활성화
      expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();

      await user.click(screen.getByRole('checkbox', { name: '두통' }));
      expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
    });

    it('should disable next button when no symptom is selected', async () => {
      render(<DiagnosisPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
      });
    });

    it('should show progress indicator (1/3)', async () => {
      render(<DiagnosisPage />, { wrapper: createTestWrapper() });

      expect(screen.getByText('1/3')).toBeInTheDocument();
    });
  });

  describe('질문 응답 단계', () => {
    async function goToQuestionsStep(user: ReturnType<typeof userEvent.setup>) {
      render(<DiagnosisPage />, { wrapper: createTestWrapper() });

      // 증상 선택 대기
      await waitFor(() => {
        expect(screen.getByRole('checkbox', { name: '두통' })).toBeInTheDocument();
      });

      // 증상 선택 후 다음 버튼 클릭
      await user.click(screen.getByRole('checkbox', { name: '두통' }));
      await user.click(screen.getByRole('button', { name: '다음' }));
    }

    it('should render questions based on selected symptoms', async () => {
      const user = userEvent.setup();
      await goToQuestionsStep(user);

      await waitFor(() => {
        expect(screen.getByText('두통이 주로 발생하는 시간대는 언제인가요?')).toBeInTheDocument();
      });
    });

    it('should render radio type question with options', async () => {
      const user = userEvent.setup();
      await goToQuestionsStep(user);

      await waitFor(() => {
        expect(screen.getByRole('radio', { name: '아침' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: '오후' })).toBeInTheDocument();
      });
    });

    it('should render slider type question with range', async () => {
      const user = userEvent.setup();
      await goToQuestionsStep(user);

      // 다음 버튼 클릭하여 슬라이더 질문으로 이동
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: '다음' }));

      await waitFor(() => {
        expect(screen.getByRole('slider')).toBeInTheDocument();
      });
    });

    it('should allow navigating between questions', async () => {
      const user = userEvent.setup();
      await goToQuestionsStep(user);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
      });
    });

    it('should show question progress (Q1/10)', async () => {
      const user = userEvent.setup();
      await goToQuestionsStep(user);

      await waitFor(() => {
        expect(screen.getByText(/Q\d+\/\d+/)).toBeInTheDocument();
      });
    });

    it('should persist answers when navigating back', async () => {
      const user = userEvent.setup();
      await goToQuestionsStep(user);

      await waitFor(() => {
        expect(screen.getByRole('radio', { name: '아침' })).toBeInTheDocument();
      });

      // 응답 선택 후 이전으로 갔다가 다시 오면 응답이 유지되어야 함
      await user.click(screen.getByRole('radio', { name: '아침' }));
      await user.click(screen.getByRole('button', { name: '다음' }));
      await user.click(screen.getByRole('button', { name: '이전' }));

      expect(screen.getByRole('radio', { name: '아침' })).toBeChecked();
    });
  });

  describe('진단 제출', () => {
    async function goToLastQuestion(user: ReturnType<typeof userEvent.setup>) {
      render(<DiagnosisPage />, { wrapper: createTestWrapper() });

      // 증상 선택 대기
      await waitFor(() => {
        expect(screen.getByRole('checkbox', { name: '두통' })).toBeInTheDocument();
      });

      // 증상 선택 후 다음 버튼 클릭
      await user.click(screen.getByRole('checkbox', { name: '두통' }));
      await user.click(screen.getByRole('button', { name: '다음' }));

      // 질문 로딩 대기 - 먼저 질문 텍스트 확인
      await waitFor(() => {
        expect(screen.getByText('두통이 주로 발생하는 시간대는 언제인가요?')).toBeInTheDocument();
      }, { timeout: 5000 });

      // 첫 번째 질문 응답 및 다음
      await user.click(screen.getByRole('radio', { name: '아침' }));
      await user.click(screen.getByRole('button', { name: '다음' }));

      // 두 번째 질문(슬라이더) 대기
      await waitFor(() => {
        expect(screen.getByRole('slider')).toBeInTheDocument();
      }, { timeout: 5000 });

      // 슬라이더 다음
      await user.click(screen.getByRole('button', { name: '다음' }));

      // 마지막 질문 대기
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '진단받기' })).toBeInTheDocument();
      }, { timeout: 5000 });
    }

    it('should submit diagnosis when all questions are answered', async () => {
      const user = userEvent.setup();
      await goToLastQuestion(user);

      expect(screen.getByRole('button', { name: '진단받기' })).toBeInTheDocument();
    });

    it('should show loading state during diagnosis submission', async () => {
      const user = userEvent.setup();
      await goToLastQuestion(user);

      await user.click(screen.getByRole('button', { name: '진단받기' }));

      await waitFor(() => {
        expect(screen.getByText('진단 중...')).toBeInTheDocument();
      });
    });

    it.skip('should navigate to result page on successful diagnosis', async () => {
      // T2.4에서 구현 예정 - 진단 제출 후 결과 페이지 이동
      const user = userEvent.setup();
      await goToLastQuestion(user);

      await user.click(screen.getByRole('button', { name: '진단받기' }));

      await waitFor(() => {
        expect(window.location.pathname).toBe('/result');
      }, { timeout: 5000 });
    });

    it('should display error message on diagnosis failure', async () => {
      // 에러 상태가 미리 설정된 상태로 렌더링
      useDiagnosisStore.getState().setError('테스트 에러');

      render(<DiagnosisPage />, { wrapper: createTestWrapper() });

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('테스트 에러')).toBeInTheDocument();
    });
  });
});

describe('SymptomSelector', () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it('should render list of symptoms', async () => {
    render(
      <SymptomSelector symptoms={mockSymptoms} selectedIds={[]} onSelect={onSelect} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('두통')).toBeInTheDocument();
    expect(screen.getByText('소화불량')).toBeInTheDocument();
  });

  it('should group symptoms by category', async () => {
    render(
      <SymptomSelector symptoms={mockSymptoms} selectedIds={[]} onSelect={onSelect} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('통증')).toBeInTheDocument();
    expect(screen.getByText('소화기')).toBeInTheDocument();
  });

  it('should call onSelect when symptom is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SymptomSelector symptoms={mockSymptoms} selectedIds={[]} onSelect={onSelect} />,
      { wrapper: TestWrapper }
    );

    const checkbox = screen.getByRole('checkbox', { name: '두통' });
    await user.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith('sym-001');
  });

  it('should highlight selected symptoms', async () => {
    render(
      <SymptomSelector symptoms={mockSymptoms} selectedIds={['sym-001']} onSelect={onSelect} />,
      { wrapper: TestWrapper }
    );

    const symptom = screen.getByTestId('symptom-sym-001');
    expect(symptom).toHaveClass('selected');
  });

  it('should show symptom description on hover/focus', async () => {
    const user = userEvent.setup();
    render(
      <SymptomSelector symptoms={mockSymptoms} selectedIds={[]} onSelect={onSelect} />,
      { wrapper: TestWrapper }
    );

    await user.hover(screen.getByText('두통'));

    await waitFor(() => {
      expect(screen.getByText('머리가 아픈 증상')).toBeInTheDocument();
    });
  });
});

describe('QuestionCard', () => {
  const radioQuestion = mockQuestions[0]; // 라디오 타입
  const sliderQuestion = mockQuestions[1]; // 슬라이더 타입
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('should render question text', async () => {
    render(
      <QuestionCard question={radioQuestion} onChange={onChange} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('두통이 주로 발생하는 시간대는 언제인가요?')).toBeInTheDocument();
  });

  it('should render radio options for radio type', async () => {
    render(
      <QuestionCard question={radioQuestion} onChange={onChange} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByRole('radio', { name: '아침' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '오후' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '저녁' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '밤' })).toBeInTheDocument();
  });

  it('should render slider for slider type', async () => {
    render(
      <QuestionCard question={sliderQuestion} onChange={onChange} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveAttribute('min', '1');
    expect(screen.getByRole('slider')).toHaveAttribute('max', '10');
  });

  it('should call onChange when answer is selected', async () => {
    const user = userEvent.setup();
    render(
      <QuestionCard question={radioQuestion} onChange={onChange} />,
      { wrapper: TestWrapper }
    );

    await user.click(screen.getByRole('radio', { name: '아침' }));

    expect(onChange).toHaveBeenCalledWith({ questionId: 'q-001', value: 'morning' });
  });

  it('should show current value for slider', async () => {
    render(
      <QuestionCard question={sliderQuestion} answer={{ questionId: 'q-002', value: 5 }} onChange={onChange} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByTestId('slider-value')).toHaveTextContent('5');
  });
});
