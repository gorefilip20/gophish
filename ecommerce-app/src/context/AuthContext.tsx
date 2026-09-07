'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCredits: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('studio_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        if (user) {
          localStorage.setItem('studio_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('studio_user');
        }
      } catch {}
    }
  }, [user, isLoading]);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600));
    const stored = localStorage.getItem('studio_users');
    const users: Record<string, { name: string; password: string }> = stored ? JSON.parse(stored) : {};
    const found = users[email];
    if (!found) return false;
    setUser({
      id: `user-${Date.now()}`,
      name: found.name,
      email,
      joinedDate: new Date().toISOString().split('T')[0],
      credits: 500,
      plan: 'pro',
    });
    return true;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600));
    const stored = localStorage.getItem('studio_users');
    const users: Record<string, { name: string; password: string }> = stored ? JSON.parse(stored) : {};
    if (users[email]) return false;
    users[email] = { name, password };
    localStorage.setItem('studio_users', JSON.stringify(users));
    setUser({
      id: `user-${Date.now()}`,
      name,
      email,
      joinedDate: new Date().toISOString().split('T')[0],
      credits: 250,
      plan: 'free',
    });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateCredits = useCallback((amount: number) => {
    setUser(prev => prev ? { ...prev, credits: prev.credits + amount } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateCredits }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
