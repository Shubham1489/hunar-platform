/**
 * Hunar Auth Store — Zustand with localStorage persistence
 * Manages user session, roles, and OTP verification flow
 */

import { create } from 'zustand';
import { authAPI } from './api';

export type UserRole = 'WORKER' | 'EMPLOYER' | 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // OTP flow
  otpSent: boolean;
  otpPhone: string | null;

  // Actions
  sendOtp: (phone: string) => Promise<void>;
  requestOtp: (phone: string) => Promise<{ otpId: string; otp?: string }>;
  verifyOtp: (phone: string, otp: string, otpId?: string, role?: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
  clearOtp: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('hunar_token') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('hunar_refresh_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('hunar_token') : false,
  isLoading: false,
  error: null,
  otpSent: false,
  otpPhone: null,

  sendOtp: async (phone: string) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.sendOtp(phone);
      set({ otpSent: true, otpPhone: phone, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to send OTP',
        isLoading: false,
      });
    }
  },

  requestOtp: async (phone: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.sendOtp(phone);
      set({ otpSent: true, otpPhone: phone, isLoading: false });
      return { otpId: data?.otpId || data?.data?.otpId || '', otp: data?.otp || data?.data?.otp };
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to send OTP',
        isLoading: false,
      });
      throw err;
    }
  },

  verifyOtp: async (phone: string, otp: string, otpId?: string, role?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.verifyOtp(phone, otp, otpId, role);
      const { accessToken, refreshToken, user } = data;

      localStorage.setItem('hunar_token', accessToken);
      localStorage.setItem('hunar_refresh_token', refreshToken);

      set({
        user,
        token: accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        otpSent: false,
        otpPhone: null,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Invalid OTP',
        isLoading: false,
      });
      throw err;
    }
  },

  fetchUser: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true });
    try {
      const { data } = await authAPI.me();
      set({ user: data.user, isLoading: false, isAuthenticated: true });
    } catch {
      // Token expired — will be handled by interceptor
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('hunar_token');
    localStorage.removeItem('hunar_refresh_token');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      otpSent: false,
      otpPhone: null,
      error: null,
    });
  },

  setError: (error) => set({ error }),
  clearOtp: () => set({ otpSent: false, otpPhone: null }),
}));

// ─── Role-based redirect helper ─────────────
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'WORKER': return '/worker/dashboard';
    case 'EMPLOYER': return '/employer/dashboard';
    case 'CUSTOMER': return '/customer/dashboard';
    case 'ADMIN': return '/admin/dashboard';
    default: return '/login';
  }
}
