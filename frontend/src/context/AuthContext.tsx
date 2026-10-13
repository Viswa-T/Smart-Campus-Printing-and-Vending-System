import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { authApi, removeToken, setToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: { fullName: string; email: string; password: string; confirmPassword: string; collegeId?: number }) => Promise<User>;
  logout: () => Promise<void>;
  googleLogin: (credential: string) => Promise<User>;
  refreshUser: () => Promise<void>;
  updateProfile: (fullName?: string, selectedCollegeId?: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('xeroxgo_token');
      if (token) {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
        } catch {
          removeToken();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  
  const login = async (email: string, password: string): Promise<User> => {
    const res = await authApi.login({ email, password });
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const googleLogin = async (credential: string): Promise<User> => {
    const res = await authApi.googleLogin(credential);

    setToken(res.token);
    setUser(res.user);

    return res.user;
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    collegeId?: number;
  }): Promise<User> => {
    const res = await authApi.register(payload);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      removeToken();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const profile = await authApi.getMe();
      setUser(profile);
    } catch {
      // Ignored
    }
  };

  const updateProfile = async (fullName?: string, selectedCollegeId?: number) => {
    const updated = await authApi.updateProfile({ fullName, selectedCollegeId });
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        googleLogin,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
