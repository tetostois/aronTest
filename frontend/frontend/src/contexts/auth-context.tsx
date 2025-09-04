'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>(() => {
    // Vérifier si on est côté client avant d'accéder à localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const login = async (email: string, password: string) => {
    try {
      // Ici, vous feriez normalement un appel à votre API
      // Pour l'exemple, on simule une connexion réussie
      const mockUser = {
        id: '1',
        name: 'Utilisateur Test',
        email,
      };
      
      setUser(mockUser);
      
      // Stocker l'utilisateur dans le localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Ici, vous feriez normalement un appel à votre API
      // Pour l'exemple, on simule une inscription réussie
      const newUser = {
        id: '1',
        name,
        email,
      };
      
      setUser(newUser);
      
      // Stocker l'utilisateur dans le localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      
      return true;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
