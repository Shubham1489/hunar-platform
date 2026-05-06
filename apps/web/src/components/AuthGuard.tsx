/**
 * Hunar Auth Guard — Protects routes based on authentication and roles.
 * Wraps pages that require login. Redirects to /login if unauthenticated.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, UserRole, getDashboardPath } from '@/lib/store';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, fetchUser, isLoading } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!user) {
        await fetchUser();
      }

      setChecked(true);
    };

    check();
  }, [isAuthenticated, user, fetchUser, router, pathname]);

  // Wait for auth check
  if (!checked || isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--surface-1)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, border: '3px solid var(--surface-3)',
            borderTopColor: 'var(--primary)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Role check
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    router.replace(getDashboardPath(user.role));
    return null;
  }

  return <>{children}</>;
}
