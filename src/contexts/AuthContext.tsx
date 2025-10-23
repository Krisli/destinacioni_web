'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout, type AuthUser } from '@/lib/auth/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.isAuthenticated) return false;
    return user.roles.includes(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user || !user.isAuthenticated) return false;
    return roles.some(role => user.roles.includes(role));
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout: handleLogout,
    refreshUser,
    isAuthenticated: user?.isAuthenticated ?? false,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
