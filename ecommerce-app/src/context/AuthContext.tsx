'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Order } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      } catch {}
    }
  }, [user, isLoading]);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const stored = localStorage.getItem('users');
    const users: Record<string, { name: string; password: string }> = stored ? JSON.parse(stored) : {};
    const found = users[email];
    if (!found) return false;
    const u: User = {
      id: `user-${Date.now()}`,
      name: found.name,
      email,
      joinedDate: new Date().toISOString().split('T')[0],
      orders: [],
    };
    setUser(u);
    return true;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const stored = localStorage.getItem('users');
    const users: Record<string, { name: string; password: string }> = stored ? JSON.parse(stored) : {};
    if (users[email]) return false;
    users[email] = { name, password };
    localStorage.setItem('users', JSON.stringify(users));
    const u: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      joinedDate: new Date().toISOString().split('T')[0],
      orders: [],
    };
    setUser(u);
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((name: string, email: string) => {
    setUser(prev => prev ? { ...prev, name, email } : null);
  }, []);

  const addOrder = useCallback((order: Order) => {
    setUser(prev => prev ? { ...prev, orders: [order, ...prev.orders] } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
