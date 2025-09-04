import { API_CONFIG, AUTH_CONFIG } from '@/lib/config';

// Configuration des endpoints d'authentification
const AUTH_ENDPOINTS = API_CONFIG.ENDPOINTS.AUTH;

import { LoginFormData, RegisterFormData, User } from '@/types';

const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Service pour gérer l'authentification des utilisateurs
 */
export const authService = {
  /**
   * Connecte un utilisateur
   * @param credentials - Les identifiants de connexion
   * @returns Les informations de l'utilisateur et le token d'authentification
   */
  async login(credentials: LoginFormData) {
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Échec de la connexion');
    }

    return response.json();
  },

  /**
   * Enregistre un nouvel utilisateur
   * @param userData - Les données du nouvel utilisateur
   * @returns Les informations de l'utilisateur créé
   */
  async register(userData: RegisterFormData) {
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Échec de l\'inscription');
    }

    return response.json();
  },

  /**
   * Déconnecte l'utilisateur
   */
  async logout() {
    // Supprimer le token côté client
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    
    // Pas d'endpoint de déconnexion dans la configuration actuelle
    // On se contente de supprimer le token côté client
  },

  /**
   * Rafraîchit le token d'authentification
   * @returns Le nouveau token
   */
  async refreshToken() {
    // Pas d'endpoint de rafraîchissement dans la configuration actuelle
    // On pourrait implémenter une logique de rafraîchissement si nécessaire
    throw new Error('Refresh token not implemented');
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns true si l'utilisateur est authentifié, false sinon
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    return !!token;
  },

  /**
   * Récupère le token d'authentification
   * @returns Le token d'authentification ou null
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  },

  /**
   * Définit le token d'authentification
   * @param token - Le token d'authentification
   */
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
  },

  /**
   * Récupère les informations de l'utilisateur connecté
   * @returns Les informations de l'utilisateur ou null
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Définit les informations de l'utilisateur connecté
   * @param user - Les informations de l'utilisateur
   */
  setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
  },
};

/**
 * Récupère l'utilisateur actuellement connecté depuis le serveur
 * @returns Les informations de l'utilisateur connecté
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.PROFILE}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authService.getToken()}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Impossible de récupérer les informations utilisateur');
  }

  const data = await response.json();
  return data.user;
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * @param requiredRole - Le rôle requis
 * @returns true si l'utilisateur a le rôle requis, false sinon
 */
export function hasRole(requiredRole: string): boolean {
  const user = authService.getCurrentUser();
  return user?.role === requiredRole;
}

/**
 * Vérifie si l'utilisateur a l'un des rôles spécifiés
 * @param requiredRoles - Les rôles autorisés
 * @returns true si l'utilisateur a l'un des rôles requis, false sinon
 */
export function hasAnyRole(requiredRoles: string[]): boolean {
  const user = authService.getCurrentUser();
  return user?.role ? requiredRoles.includes(user.role) : false;
}
