/**
 * 관리자 인증 스토어 (Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Admin } from '@contracts/admin.contract';

interface AdminState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAdmin: (admin: Admin | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (admin: Admin, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAdmin: (admin) =>
        set({
          admin,
          isAuthenticated: !!admin,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: (admin, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({
          admin,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          admin: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
