/**
 * 진단 결과 페이지 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import ResultPage from '../../pages/Result';
import SyndromeCard from '../../components/diagnosis/SyndromeCard';
import EvidenceModal from '../../components/diagnosis/EvidenceModal';
import { mockSyndromeResults } from '../../mocks/data/mockData';
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

describe('ResultPage', () => {
  beforeEach(() => {
    // 각 테스트 전 스토어 초기화
    useDiagnosisStore.getState().reset();
  });

  describe('결과 표시', () => {
    it('should render syndrome cards', async () => {
      render(<ResultPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('기허증')).toBeInTheDocument();
        expect(screen.getByText('혈허증')).toBeInTheDocument();
        expect(screen.getByText('담음증')).toBeInTheDocument();
      });
    });

    it('should display match score for each syndrome', async () => {
      render(<ResultPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('85%')).toBeInTheDocument();
        expect(screen.getByText('72%')).toBeInTheDocument();
        expect(screen.getByText('58%')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      render(<ResultPage />, { wrapper: createTestWrapper() });

      expect(screen.getByText('결과 분석 중...')).toBeInTheDocument();
    });

    it('should display page title', async () => {
      render(<ResultPage />, { wrapper: createTestWrapper() });

      // 로딩 완료 후 제목 표시
      await waitFor(() => {
        expect(screen.getByText('진단 결과')).toBeInTheDocument();
      });
    });
  });

  describe('상세 정보', () => {
    it('should open evidence modal when card is clicked', async () => {
      const user = userEvent.setup();
      render(<ResultPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('기허증')).toBeInTheDocument();
      });

      await user.click(screen.getByText('기허증'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('피로감이 지속됨')).toBeInTheDocument();
      });
    });

    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<ResultPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('기허증')).toBeInTheDocument();
      });

      await user.click(screen.getByText('기허증'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // 모달 내의 닫기 버튼 클릭 (여러 개 중 마지막 것)
      const closeButtons = screen.getAllByRole('button', { name: '닫기' });
      await user.click(closeButtons[closeButtons.length - 1]);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('네비게이션', () => {
    it('should have treatment view button', async () => {
      render(<ResultPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '치료법 보기' })).toBeInTheDocument();
      });
    });

    it('should have restart button', async () => {
      render(<ResultPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '다시 진단하기' })).toBeInTheDocument();
      });
    });
  });
});

describe('SyndromeCard', () => {
  const mockSyndrome = mockSyndromeResults[0];
  const onClick = vi.fn();

  beforeEach(() => {
    onClick.mockClear();
  });

  it('should render syndrome name', () => {
    render(
      <SyndromeCard syndrome={mockSyndrome} rank={1} onClick={onClick} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('기허증')).toBeInTheDocument();
  });

  it('should render syndrome description', () => {
    render(
      <SyndromeCard syndrome={mockSyndrome} rank={1} onClick={onClick} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('기가 허약하여 발생하는 증상군')).toBeInTheDocument();
  });

  it('should render match score as percentage', () => {
    render(
      <SyndromeCard syndrome={mockSyndrome} rank={1} onClick={onClick} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should render rank badge', () => {
    render(
      <SyndromeCard syndrome={mockSyndrome} rank={1} onClick={onClick} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('1위')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    render(
      <SyndromeCard syndrome={mockSyndrome} rank={1} onClick={onClick} />,
      { wrapper: TestWrapper }
    );

    await user.click(screen.getByText('기허증'));

    expect(onClick).toHaveBeenCalledWith(mockSyndrome);
  });

  it('should show evidences count', () => {
    render(
      <SyndromeCard syndrome={mockSyndrome} rank={1} onClick={onClick} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('근거 3개')).toBeInTheDocument();
  });
});

describe('EvidenceModal', () => {
  const mockSyndrome = mockSyndromeResults[0];
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('should render syndrome name in title', () => {
    render(
      <EvidenceModal syndrome={mockSyndrome} isOpen={true} onClose={onClose} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('기허증')).toBeInTheDocument();
  });

  it('should render all evidences', () => {
    render(
      <EvidenceModal syndrome={mockSyndrome} isOpen={true} onClose={onClose} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('피로감이 지속됨')).toBeInTheDocument();
    expect(screen.getByText('소화기능 저하')).toBeInTheDocument();
    expect(screen.getByText('면역력 약화')).toBeInTheDocument();
  });

  it('should render syndrome description', () => {
    render(
      <EvidenceModal syndrome={mockSyndrome} isOpen={true} onClose={onClose} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('기가 허약하여 발생하는 증상군')).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(
      <EvidenceModal syndrome={mockSyndrome} isOpen={true} onClose={onClose} />,
      { wrapper: TestWrapper }
    );

    // 모달 내의 닫기 버튼 클릭 (여러 개 중 마지막 것 - 메인 닫기 버튼)
    const closeButtons = screen.getAllByRole('button', { name: '닫기' });
    await user.click(closeButtons[closeButtons.length - 1]);

    expect(onClose).toHaveBeenCalled();
  });

  it('should not render when isOpen is false', () => {
    render(
      <EvidenceModal syndrome={mockSyndrome} isOpen={false} onClose={onClose} />,
      { wrapper: TestWrapper }
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should show match score', () => {
    render(
      <EvidenceModal syndrome={mockSyndrome} isOpen={true} onClose={onClose} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('일치도: 85%')).toBeInTheDocument();
  });
});
