'use client';

/**
 * useAuth — Shared authentication guard hook.
 * Checks if user is authenticated and redirects to login if not.
 * Fetches user profile on mount.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export function useAuth(requiredRole?: string) {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, fetchUser, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    if (!user && !isLoading) {
      fetchUser().catch(() => {
        // Token invalid — redirect to login
        logout();
        router.replace('/login');
      });
    }
  }, [token, user, isLoading, fetchUser, logout, router]);

  useEffect(() => {
    if (user && requiredRole && user.role !== requiredRole) {
      router.replace('/login');
    }
  }, [user, requiredRole, router]);

  return { user, isLoading: isLoading || (!user && !!token), isAuthenticated, logout };
}
