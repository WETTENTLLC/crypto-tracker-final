'use client';

/**
 * AdminUtils.tsx
 * Utility functions for admin functionality
 */

import { useState, useEffect } from 'react';

/**
 * Check if current user is an admin
 * @returns {boolean} True if user is admin
 */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
      setIsLoading(false);
    }
  }, []);

  return { isAdmin, isLoading };
}

/**
 * Set admin status
 * @param {boolean} status - Admin status to set
 */
export function setAdminStatus(status: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isAdmin', status ? 'true' : 'false');
  }
}

/**
 * Login as admin
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {boolean} True if login successful
 */
export function loginAsAdmin(email: string, password: string): boolean {
  // Demo credentials check
  if (email === 'admin@example.com' && password === 'password') {
    setAdminStatus(true);
    return true;
  }
  return false;
}

/**
 * Logout admin
 */
export function logoutAdmin() {
  setAdminStatus(false);
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/**
 * Admin Navigation Guard
 * Component to ensure only admins can access protected pages
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useIsAdmin();

  useEffect(() => {
    // Redirect non-admins to login page
    if (!isLoading && !isAdmin && typeof window !== 'undefined') {
      const isLoginPage = window.location.pathname === '/admin/login';
      if (!isLoginPage) {
        window.location.href = '/admin/login';
      }
    }
  }, [isAdmin, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // On login page, always render children
  if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  // For other admin pages, only render if admin
  return isAdmin ? <>{children}</> : null;
}
