'use client';

import {
  login as loginAction,
  signup as signupAction,
  logout as logoutAction,
} from '@/app/actions/auth';
import { AuthContext, type UserProfile } from '@/hooks/use-auth';
import { useState, type ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (formData: FormData) => {
    const result = await loginAction(formData);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const signup = async (formData: FormData) => {
    const result = await signupAction(formData);
    return result;
  };

  const logout = async () => {
    const result = await logoutAction();
    if (result.success) {
      setUser(null);
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, setIsLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
