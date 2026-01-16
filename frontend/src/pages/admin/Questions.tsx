/**
 * 질문 관리 페이지
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAdminStore } from '../../stores/adminStore';
import AdminNav from '../../components/admin/AdminNav';
import DataTable from '../../components/admin/DataTable';
import { getAdminQuestions } from '../../api/admin';

export default function QuestionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAdminStore();

  const { data, isLoading } = useQuery({
    queryKey: ['adminQuestions'],
    queryFn: () => getAdminQuestions(),
  });

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const columns = [
    { key: 'questionText', label: '질문' },
    { key: 'questionType', label: '유형' },
    { key: 'isActive', label: '활성', render: (value: unknown) => (value ? '✅' : '❌') },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <AdminNav
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8">
        <h1 className="text-heading-lg text-neutral-900 mb-8">질문 관리</h1>

        <DataTable
          columns={columns}
          data={(data?.items as Array<{ id: string; questionText: string; questionType: string; isActive: boolean }>) || []}
          onEdit={(item) => alert(`수정: ${item.questionText}`)}
          onDelete={(item) => alert(`삭제: ${item.questionText}`)}
          onAdd={() => alert('추가 기능은 준비 중입니다')}
          addButtonLabel="질문 추가"
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
