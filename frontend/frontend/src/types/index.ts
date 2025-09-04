// Types de base
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'USER' | 'RESTAURANT_OWNER' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: Address;
  phoneNumber: string;
  email: string;
  openingHours: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  coverImageUrl: string;
  isOpen: boolean;
  categories: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  category: string;
  ingredients: string[];
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Meal {
  quantity: number;
}

export interface OrderItem {
  id: string;
  meal: Meal;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY_FOR_PICKUP' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: Address;
  deliveryFee: number;
  taxAmount: number;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Types pour les formulaires
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

// Types pour les paramètres d'API
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RestaurantFilterParams extends PaginationParams {
  search?: string;
  category?: string;
  minRating?: number;
  isOpenNow?: boolean;
  deliveryAvailable?: boolean;
}

// Types pour les props des composants
export interface LayoutProps {
  children: React.ReactNode;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: User['role'];
  redirectTo?: string;
}

// Types pour les événements
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;

// Types pour les thèmes
export type Theme = 'light' | 'dark' | 'system';

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  createdAt: string;
}
