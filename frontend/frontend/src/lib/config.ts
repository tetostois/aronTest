// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000, // 10 secondes
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/me',
    },
    RESTAURANTS: {
      BASE: '/restaurants',
      FEATURED: '/restaurants/featured',
      SEARCH: '/restaurants/search',
    },
    MEALS: {
      BASE: '/meals',
      BY_RESTAURANT: (restaurantId: string | number) => `/restaurants/${restaurantId}/meals`,
    },
    ORDERS: {
      BASE: '/orders',
      USER_ORDERS: '/orders/user',
      STATUS: (orderId: string | number) => `/orders/${orderId}/status`,
    },
  },
};

// Configuration de l'application
export const APP_CONFIG = {
  APP_NAME: 'Food Ordering App',
  DEFAULT_LOCALE: 'fr',
  DATE_FORMAT: 'dd/MM/yyyy',
  DATE_TIME_FORMAT: 'dd/MM/yyyy HH:mm',
  ITEMS_PER_PAGE: 10,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
};

// Configuration de l'authentification
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  TOKEN_EXPIRY: 60 * 60 * 24 * 7, // 7 jours en secondes
  REFRESH_TOKEN_EXPIRY: 60 * 60 * 24 * 30, // 30 jours en secondes
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PASSWORD_HINT: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
};

// Configuration du cache
export const CACHE_CONFIG = {
  ENABLED: true,
  TTL: 60 * 5, // 5 minutes en secondes
  VERSION: '1.0',
  PREFIX: 'food_app_',
};
