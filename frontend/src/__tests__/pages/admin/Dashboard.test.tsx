/**
 * 관리자 대시보드 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../../../pages/admin/Dashboard';
import AdminNav from '../../../components/admin/AdminNav';
import DataTable from '../../../components/admin/DataTable';
import { useAdminStore } from '../../../stores/adminStore';
import { mockSymptoms } from '../../../mocks/data/mockData';

/**
 * 테스트 래퍼
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

describe('AdminDashboard', () => {
  beforeEach(() => {
    // 인증 상태 설정 (persist 초기화 포함)
    useAdminStore.setState({
      admin: { id: 'admin-1', username: 'admin', createdAt: '2024-01-01' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }, true);
  });

  describe('인증 확인', () => {
    it('should redirect to login when not authenticated', async () => {
      useAdminStore.setState({ admin: null, isAuthenticated: false }, true);

      render(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminDashboard />
        </MemoryRouter>
      );

      // 로그인 페이지로 리다이렉트 확인
      await waitFor(() => {
        expect(screen.getByText('로그인이 필요합니다')).toBeInTheDocument();
      });
    });

    it('should show dashboard when authenticated', async () => {
      render(<AdminDashboard />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('관리자 대시보드')).toBeInTheDocument();
      });
    });
  });

  describe('네비게이션', () => {
    it('should show admin navigation', async () => {
      render(<AdminDashboard />, { wrapper: createTestWrapper() });

      // 네비게이션 항목 확인 (빠른 시작 섹션에서도 동일 텍스트 있음)
      await waitFor(() => {
        expect(screen.getAllByText('증상 관리').length).toBeGreaterThan(0);
        expect(screen.getAllByText('질문 관리').length).toBeGreaterThan(0);
        expect(screen.getAllByText('변증 관리').length).toBeGreaterThan(0);
        expect(screen.getAllByText('약재 관리').length).toBeGreaterThan(0);
      });
    });

    it('should have logout button', async () => {
      render(<AdminDashboard />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
      });
    });
  });

  describe('통계 표시', () => {
    it('should display data counts', async () => {
      render(<AdminDashboard />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('증상')).toBeInTheDocument();
        expect(screen.getByText('질문')).toBeInTheDocument();
        expect(screen.getByText('변증')).toBeInTheDocument();
        expect(screen.getByText('약재')).toBeInTheDocument();
      });
    });
  });
});

describe('AdminNav', () => {
  const mockOnNavigate = vi.fn();
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    mockOnNavigate.mockClear();
    mockOnLogout.mockClear();
  });

  it('should render navigation items', () => {
    render(
      <AdminNav
        currentPath="/admin/symptoms"
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('증상 관리')).toBeInTheDocument();
    expect(screen.getByText('질문 관리')).toBeInTheDocument();
    expect(screen.getByText('변증 관리')).toBeInTheDocument();
    expect(screen.getByText('약재 관리')).toBeInTheDocument();
  });

  it('should highlight current path', () => {
    render(
      <AdminNav
        currentPath="/admin/symptoms"
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />,
      { wrapper: TestWrapper }
    );

    const symptomsLink = screen.getByText('증상 관리').closest('a');
    expect(symptomsLink).toHaveClass('bg-primary-50');
  });

  it('should call onNavigate when nav item clicked', async () => {
    const user = userEvent.setup();
    render(
      <AdminNav
        currentPath="/admin/symptoms"
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />,
      { wrapper: TestWrapper }
    );

    await user.click(screen.getByText('질문 관리'));

    expect(mockOnNavigate).toHaveBeenCalledWith('/admin/questions');
  });

  it('should call onLogout when logout button clicked', async () => {
    const user = userEvent.setup();
    render(
      <AdminNav
        currentPath="/admin/symptoms"
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />,
      { wrapper: TestWrapper }
    );

    await user.click(screen.getByRole('button', { name: '로그아웃' }));

    expect(mockOnLogout).toHaveBeenCalled();
  });
});

describe('DataTable', () => {
  const columns = [
    { key: 'name', label: '이름' },
    { key: 'category', label: '카테고리' },
    { key: 'isActive', label: '활성', render: (value: unknown) => (value ? '활성' : '비활성') },
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    mockOnAdd.mockClear();
  });

  it('should render table headers', () => {
    render(
      <DataTable
        columns={columns}
        data={mockSymptoms}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />,
      { wrapper: TestWrapper }
    );

    // 헤더 행에서 확인
    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells.some(cell => cell.textContent === '이름')).toBe(true);
    expect(headerCells.some(cell => cell.textContent === '카테고리')).toBe(true);
    expect(headerCells.some(cell => cell.textContent === '활성')).toBe(true);
  });

  it('should render data rows', () => {
    render(
      <DataTable
        columns={columns}
        data={mockSymptoms}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('두통')).toBeInTheDocument();
    expect(screen.getByText('소화불량')).toBeInTheDocument();
  });

  it('should have add button', () => {
    render(
      <DataTable
        columns={columns}
        data={mockSymptoms}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
        addButtonLabel="증상 추가"
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByRole('button', { name: '증상 추가' })).toBeInTheDocument();
  });

  it('should call onAdd when add button clicked', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={mockSymptoms}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
        addButtonLabel="증상 추가"
      />,
      { wrapper: TestWrapper }
    );

    await user.click(screen.getByRole('button', { name: '증상 추가' }));

    expect(mockOnAdd).toHaveBeenCalled();
  });

  it('should have edit buttons for each row', () => {
    render(
      <DataTable
        columns={columns}
        data={mockSymptoms}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />,
      { wrapper: TestWrapper }
    );

    const editButtons = screen.getAllByRole('button', { name: '수정' });
    expect(editButtons.length).toBe(mockSymptoms.length);
  });

  it('should call onEdit with item when edit button clicked', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={mockSymptoms}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />,
      { wrapper: TestWrapper }
    );

    const editButtons = screen.getAllByRole('button', { name: '수정' });
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockSymptoms[0]);
  });

  it('should have delete buttons for each row', () => {
    render(
      <DataTable
        columns={columns}
        data={mockSymptoms}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />,
      { wrapper: TestWrapper }
    );

    const deleteButtons = screen.getAllByRole('button', { name: '삭제' });
    expect(deleteButtons.length).toBe(mockSymptoms.length);
  });

  it('should call onDelete with item when delete button clicked', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={mockSymptoms}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />,
      { wrapper: TestWrapper }
    );

    const deleteButtons = screen.getAllByRole('button', { name: '삭제' });
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockSymptoms[0]);
  });

  it('should show empty state when no data', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
        emptyMessage="데이터가 없습니다"
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
        isLoading={true}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });
});
