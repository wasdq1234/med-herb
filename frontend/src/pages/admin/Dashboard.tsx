/**
 * 관리자 대시보드 페이지
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAdminStore } from '../../stores/adminStore';
import AdminNav from '../../components/admin/AdminNav';
import DataTable from '../../components/admin/DataTable';
import {
  getAdminSymptoms,
  getAdminQuestions,
  getAdminSyndromes,
  getAdminHerbs,
} from '../../api/admin';

type ResourceType = 'symptoms' | 'questions' | 'syndromes' | 'herbs';

interface StatCard {
  label: string;
  path: string;
  queryKey: string;
}

const statCards: StatCard[] = [
  { label: '증상', path: '/admin/symptoms', queryKey: 'adminSymptoms' },
  { label: '질문', path: '/admin/questions', queryKey: 'adminQuestions' },
  { label: '변증', path: '/admin/syndromes', queryKey: 'adminSyndromes' },
  { label: '약재', path: '/admin/herbs', queryKey: 'adminHerbs' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAdminStore();

  // 인증 확인
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-heading-md text-neutral-700 mb-4">로그인이 필요합니다</p>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // 데이터 카운트 조회
  const { data: symptomsData } = useQuery({
    queryKey: ['adminSymptoms'],
    queryFn: () => getAdminSymptoms(),
  });

  const { data: questionsData } = useQuery({
    queryKey: ['adminQuestions'],
    queryFn: () => getAdminQuestions(),
  });

  const { data: syndromesData } = useQuery({
    queryKey: ['adminSyndromes'],
    queryFn: () => getAdminSyndromes(),
  });

  const { data: herbsData } = useQuery({
    queryKey: ['adminHerbs'],
    queryFn: () => getAdminHerbs(),
  });

  const counts = {
    symptoms: symptomsData?.pagination?.total ?? 0,
    questions: questionsData?.pagination?.total ?? 0,
    syndromes: syndromesData?.pagination?.total ?? 0,
    herbs: herbsData?.pagination?.total ?? 0,
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* 사이드 네비게이션 */}
      <AdminNav
        currentPath={location.pathname}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-8">
        <h1 className="text-heading-lg text-neutral-900 mb-8">관리자 대시보드</h1>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const count = counts[card.queryKey.replace('admin', '').toLowerCase() as keyof typeof counts];
            return (
              <div
                key={card.path}
                onClick={() => handleNavigate(card.path)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <p className="text-body-md text-neutral-500 mb-2">{card.label}</p>
                <p className="text-heading-xl text-primary-600 font-bold">{count}</p>
              </div>
            );
          })}
        </div>

        {/* 빠른 액션 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-heading-md text-neutral-800 mb-4">빠른 시작</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleNavigate('/admin/symptoms')}
              className="p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
            >
              <span className="text-2xl block mb-2">🩺</span>
              <span className="text-body-md text-neutral-700">증상 관리</span>
            </button>
            <button
              onClick={() => handleNavigate('/admin/questions')}
              className="p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
            >
              <span className="text-2xl block mb-2">❓</span>
              <span className="text-body-md text-neutral-700">질문 관리</span>
            </button>
            <button
              onClick={() => handleNavigate('/admin/syndromes')}
              className="p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
            >
              <span className="text-2xl block mb-2">📋</span>
              <span className="text-body-md text-neutral-700">변증 관리</span>
            </button>
            <button
              onClick={() => handleNavigate('/admin/herbs')}
              className="p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
            >
              <span className="text-2xl block mb-2">🌿</span>
              <span className="text-body-md text-neutral-700">약재 관리</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
