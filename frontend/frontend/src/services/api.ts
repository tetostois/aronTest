import { AUTH_CONFIG, API_CONFIG } from '@/lib/config';
import { ApiResponse } from '@/types';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Classe utilitaire pour effectuer des requêtes HTTP avec gestion d'erreur centralisée
 */
class ApiClient {
  /**
   * Effectue une requête HTTP avec gestion d'erreur
   * @param endpoint - L'URL de l'endpoint
   * @param options - Les options de la requête
   * @returns La réponse de l'API
   */
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ajouter les en-têtes par défaut
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    });

    // Ajouter le token d'authentification s'il existe
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Préparer la requête
    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Important pour les cookies d'authentification
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data: ApiResponse<T> = await response.json();

      // Gérer les erreurs HTTP
      if (!response.ok) {
        // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        if (response.status === 401) {
          // Gérer la déconnexion
          localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
          localStorage.removeItem(AUTH_CONFIG.USER_KEY);
          window.location.href = '/auth/login';
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        // Afficher l'erreur à l'utilisateur
        const errorMessage = data.error || data.message || 'Une erreur est survenue';
        throw new Error(errorMessage);
      }

      // Retourner les données
      return data.data as T;
    } catch (error) {
      console.error('API Error:', error);
      
      // Afficher une notification d'erreur
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
      
      throw error;
    }
  }

  /**
   * Effectue une requête GET
   * @param endpoint - L'URL de l'endpoint
   * @param query - Les paramètres de requête
   * @param options - Les options de la requête
   * @returns Les données de la réponse
   */
  get<T = any>(
    endpoint: string,
    query: Record<string, any> = {},
    options: RequestInit = {}
  ): Promise<T> {
    const queryString = new URLSearchParams();
    
    // Ajouter les paramètres de requête
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => queryString.append(key, item.toString()));
        } else {
          queryString.append(key, value.toString());
        }
      }
    });

    const url = queryString.toString()
      ? `${endpoint}?${queryString}`
      : endpoint;

    return this.request<T>(url, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * Effectue une requête POST
   * @param endpoint - L'URL de l'endpoint
   * @param data - Les données à envoyer
   * @param options - Les options de la requête
   * @returns Les données de la réponse
   */
  post<T = any>(
    endpoint: string,
    data: any = {},
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Effectue une requête PUT
   * @param endpoint - L'URL de l'endpoint
   * @param data - Les données à envoyer
   * @param options - Les options de la requête
   * @returns Les données de la réponse
   */
  put<T = any>(
    endpoint: string,
    data: any = {},
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Effectue une requête PATCH
   * @param endpoint - L'URL de l'endpoint
   * @param data - Les données à envoyer
   * @param options - Les options de la requête
   * @returns Les données de la réponse
   */
  patch<T = any>(
    endpoint: string,
    data: any = {},
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Effectue une requête DELETE
   * @param endpoint - L'URL de l'endpoint
   * @param data - Les données à envoyer (optionnel)
   * @param options - Les options de la requête
   * @returns Les données de la réponse
   */
  delete<T = any>(
    endpoint: string,
    data: any = {},
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      body: Object.keys(data).length > 0 ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Télécharge un fichier
   * @param endpoint - L'URL de l'endpoint
   * @param filename - Le nom du fichier à télécharger
   * @param options - Les options de la requête
   */
  async download(
    endpoint: string,
    filename: string,
    options: RequestInit = {}
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error('Échec du téléchargement du fichier');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }
}

// Exporter une instance unique du client API
export const api = new ApiClient();

export default api;
