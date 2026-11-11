import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUser: User = {
  id: 'u1',
  email: 'admin@gs1sa.org',
  full_name: 'Ali Hasan Sheikh',
  role: 'super_admin',
  created_at: '2024-01-01',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('gs1_user');
      return stored ? JSON.parse(stored) as User : demoUser;
    } catch { return demoUser; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo credentials
    if (email === 'admin@gs1sa.org' && password === 'Admin@123') {
      setUser(demoUser);
      localStorage.setItem('gs1_user', JSON.stringify(demoUser));
      return true;
    }
    if (email === 'manager@gs1sa.org' && password === 'Manager@123') {
      const managerUser: User = { ...demoUser, id: 'u2', email, full_name: 'Asset Manager', role: 'asset_manager' };
      setUser(managerUser);
      localStorage.setItem('gs1_user', JSON.stringify(managerUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gs1_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
