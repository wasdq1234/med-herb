/**
 * 치료법/약재 페이지 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import TreatmentPage from '../../pages/Treatment';
import TreatmentAxisCard from '../../components/diagnosis/TreatmentAxisCard';
import HerbTable from '../../components/diagnosis/HerbTable';
import { mockTreatmentAxes, mockHerbs } from '../../mocks/data/mockData';
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

describe('TreatmentPage', () => {
  beforeEach(() => {
    useDiagnosisStore.getState().reset();
  });

  describe('치료축 표시', () => {
    it('should render treatment axis cards', async () => {
      render(<TreatmentPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('보기(補氣)')).toBeInTheDocument();
        expect(screen.getByText('보혈(補血)')).toBeInTheDocument();
        expect(screen.getByText('거담(祛痰)')).toBeInTheDocument();
      });
    });

    it('should display treatment axis descriptions', async () => {
      render(<TreatmentPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('기를 보충하는 치료 방향')).toBeInTheDocument();
      });
    });

    it('should show page title', async () => {
      render(<TreatmentPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('치료 방향 및 약재')).toBeInTheDocument();
      });
    });
  });

  describe('약재 테이블', () => {
    it('should render herb table with all herbs', async () => {
      render(<TreatmentPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('인삼')).toBeInTheDocument();
        expect(screen.getByText('당귀')).toBeInTheDocument();
        expect(screen.getByText('백출')).toBeInTheDocument();
      });
    });

    it('should display herb effects', async () => {
      render(<TreatmentPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('기력 보충, 면역력 강화')).toBeInTheDocument();
      });
    });

    it('should display herb scientific names', async () => {
      render(<TreatmentPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Panax ginseng')).toBeInTheDocument();
      });
    });
  });

  describe('네비게이션', () => {
    it('should have restart diagnosis button', async () => {
      render(<TreatmentPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '다시 진단하기' })).toBeInTheDocument();
      });
    });

    it('should have back to results button', async () => {
      render(<TreatmentPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '결과로 돌아가기' })).toBeInTheDocument();
      });
    });
  });
});

describe('TreatmentAxisCard', () => {
  const mockAxis = mockTreatmentAxes[0];

  it('should render treatment axis name', () => {
    render(
      <TreatmentAxisCard axis={mockAxis} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('보기(補氣)')).toBeInTheDocument();
  });

  it('should render treatment axis description', () => {
    render(
      <TreatmentAxisCard axis={mockAxis} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('기를 보충하는 치료 방향')).toBeInTheDocument();
  });

  it('should render with proper styling', () => {
    render(
      <TreatmentAxisCard axis={mockAxis} />,
      { wrapper: TestWrapper }
    );

    const card = screen.getByText('보기(補氣)').closest('div');
    expect(card).toHaveClass('bg-white');
  });
});

describe('HerbTable', () => {
  it('should render table headers', () => {
    render(
      <HerbTable herbs={mockHerbs} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('약재명')).toBeInTheDocument();
    expect(screen.getByText('효능')).toBeInTheDocument();
    expect(screen.getByText('근거')).toBeInTheDocument();
  });

  it('should render all herbs', () => {
    render(
      <HerbTable herbs={mockHerbs} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('인삼')).toBeInTheDocument();
    expect(screen.getByText('당귀')).toBeInTheDocument();
    expect(screen.getByText('백출')).toBeInTheDocument();
    expect(screen.getByText('황기')).toBeInTheDocument();
    expect(screen.getByText('천궁')).toBeInTheDocument();
  });

  it('should render scientific names', () => {
    render(
      <HerbTable herbs={mockHerbs} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('Panax ginseng')).toBeInTheDocument();
  });

  it('should render herb effects', () => {
    render(
      <HerbTable herbs={mockHerbs} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('기력 보충, 면역력 강화')).toBeInTheDocument();
    expect(screen.getByText('보혈, 활혈, 진통')).toBeInTheDocument();
  });

  it('should render reference links that open in new tab', () => {
    render(
      <HerbTable herbs={mockHerbs} />,
      { wrapper: TestWrapper }
    );

    const links = screen.getAllByRole('link', { name: '자세히 보기' });
    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should display relevance score badges', () => {
    render(
      <HerbTable herbs={mockHerbs} />,
      { wrapper: TestWrapper }
    );

    // 인삼의 관련도 95%
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('should show empty state when no herbs', () => {
    render(
      <HerbTable herbs={[]} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('추천 약재가 없습니다')).toBeInTheDocument();
  });
});
