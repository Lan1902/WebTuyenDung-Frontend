'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { authApi } from './api';

// ===== Token helpers =====
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const setAuth = (token: string, refreshToken: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = async (): Promise<void> => {
  try {
    await authApi.logout();
  } catch {
    // Ignore errors on logout
  }
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// A01:2021 - Higher-order component for route protection with role checking
export function withAuth(
  Component: React.ComponentType,
  allowedRoles?: ('admin' | 'employer' | 'candidate')[]
) {
  return function ProtectedRoute(props: Record<string, unknown>) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = getAccessToken();
      const user = getUser();

      if (!token || !user) {
        router.push('/login');
        return;
      }

      // Check role-based access
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          router.push('/');
          return;
        }
      }

      setAuthorized(true);
      setLoading(false);
    }, [router]);

    if (loading) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-slate-600">Đang xác thực...</p>
        </div>
      );
    }

    if (!authorized) return null;

    return <Component {...props} />;
  };
}

// Hook for auth state
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = getUser();
    const token = getAccessToken();
    if (storedUser && token) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback((token: string, refreshToken: string, userData: User) => {
    setAuth(token, refreshToken, userData);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { user, isAuthenticated, login, logout };
}

// Simple sanitize for display (XSS prevention on client side)
export function sanitizeDisplay(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
