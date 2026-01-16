/**
 * 약재 관리 페이지
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAdminStore } from '../../stores/adminStore';
import AdminNav from '../../components/admin/AdminNav';
import DataTable from '../../components/admin/DataTable';
import { getAdminHerbs } from '../../api/admin';

export default function HerbsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAdminStore();

  const { data, isLoading } = useQuery({
    queryKey: ['adminHerbs'],
    queryFn: () => getAdminHerbs(),
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
    { key: 'name', label: '이름' },
    { key: 'scientificName', label: '학명' },
    { key: 'effect', label: '효능' },
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
        <h1 className="text-heading-lg text-neutral-900 mb-8">약재 관리</h1>

        <DataTable
          columns={columns}
          data={(data?.items as Array<{ id: string; name: string; scientificName: string; effect: string; isActive: boolean }>) || []}
          onEdit={(item) => alert(`수정: ${item.name}`)}
          onDelete={(item) => alert(`삭제: ${item.name}`)}
          onAdd={() => alert('추가 기능은 준비 중입니다')}
          addButtonLabel="약재 추가"
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
