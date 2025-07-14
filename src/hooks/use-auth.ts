'use client';

import { createContext, useContext } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  login: (formData: FormData) => Promise<{ error?: string; success?: boolean, user?: UserProfile }>;
  signup: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  logout: () => Promise<{ success: boolean }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
