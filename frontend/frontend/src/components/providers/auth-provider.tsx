'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AUTH_CONFIG } from '@/lib/config';
import { getCurrentUser } from '@/services/auth';
import type { User } from '@/types';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

/**
 * Fournisseur d'authentification pour l'application
 * Gère l'état d'authentification de l'utilisateur
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  // Récupérer l'utilisateur actuel
  const { data: userData, isLoading: isUserLoading, error } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mettre à jour l'utilisateur lorsque les données changent
  React.useEffect(() => {
    if (userData) {
      setUser(userData);
      setIsLoading(false);
    } else if (error) {
      // En cas d'erreur, déconnecter l'utilisateur
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
      setUser(null);
      setIsLoading(false);
    }
  }, [userData, error]);

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    return !!token && !!user;
  }, [user]);

  // Connecter l'utilisateur
  const login = React.useCallback((token: string, userData: User) => {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
  }, [router]);

  // Déconnecter l'utilisateur
  const logout = React.useCallback(() => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    setUser(null);
    
    // Invalider toutes les requêtes
    queryClient.clear();
    
    // Rediriger vers la page de connexion
    router.push('/auth/login');
  }, [queryClient, router]);

  // Mettre à jour les informations de l'utilisateur
  const updateUser = React.useCallback((userData: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...userData } : null));
    
    // Mettre à jour le stockage local si nécessaire
    const storedUser = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      localStorage.setItem(
        AUTH_CONFIG.USER_KEY, 
        JSON.stringify({ ...parsedUser, ...userData })
      );
    }
  }, []);

  // Vérifier l'authentification au chargement
  React.useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_CONFIG.USER_KEY);
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Erreur lors de la lecture des données utilisateur:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [logout]);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading: isLoading || isUserLoading,
      login,
      logout,
      updateUser,
    }),
    [user, isAuthenticated, isLoading, isUserLoading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * @returns Le contexte d'authentification
 * @throws Une erreur si utilisé en dehors d'un AuthProvider
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
