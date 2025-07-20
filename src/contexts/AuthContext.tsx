import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { encryptData, decryptData } from '../utils/crypto';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const is_logged_in = localStorage.getItem('b');
    const token = localStorage.getItem('j');
    if (token && is_logged_in) {
      const decryptedToken = decryptData(token);
      const decryptedIsLoggedIn = decryptData(is_logged_in);
      setUser({
        token: decryptedToken,
        is_logged_in: decryptedIsLoggedIn
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });

      if (response.status === 200) {
        const { token, is_logged_in } = response.data;
        setUser({ ...response.data });
        localStorage.setItem('b', encryptData(is_logged_in));
        localStorage.setItem('j', encryptData(token));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('b');
    localStorage.removeItem('j');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};