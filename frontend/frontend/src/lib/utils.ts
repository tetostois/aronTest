import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine des classes CSS en utilisant clsx et tailwind-merge pour éviter les conflits
 * @param inputs - Classes CSS à combiner
 * @returns Les classes combinées et optimisées
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un nombre en tant que devise
 * @param amount - Montant à formater
 * @param currency - Devise (par défaut: 'XAF')
 * @returns Le montant formaté avec le symbole de la devise
 */
export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formate une date en français
 * @param date - Date à formater (string, number ou Date)
 * @param options - Options de formatage
 * @returns La date formatée en français
 */
export function formatDate(
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  return new Date(date).toLocaleDateString('fr-FR', options);
}

/**
 * Tronque une chaîne de caractères si elle dépasse une certaine longueur
 * @param str - Chaîne à tronquer
 * @param length - Longueur maximale (par défaut: 100)
 * @returns La chaîne tronquée avec "..." si nécessaire
 */
export function truncate(str: string, length: number = 100): string {
  if (!str || str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

/**
 * Génère un identifiant unique
 * @returns Un identifiant unique
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Vérifie si une valeur est vide (null, undefined, chaîne vide, tableau vide, objet vide)
 * @param value - Valeur à vérifier
 * @returns true si la valeur est vide, false sinon
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Met la première lettre d'une chaîne en majuscule
 * @param str - Chaîne à formater
 * @returns La chaîne avec la première lettre en majuscule
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Met en forme un numéro de téléphone
 * @param phone - Numéro de téléphone à formater
 * @returns Le numéro de téléphone formaté
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  // Supprime tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Vérifie si c'est un numéro camerounais
  if (cleaned.startsWith('237') && cleaned.length === 12) {
    return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8, 12)}`;
  }
  
  // Format par défaut
  return cleaned.replace(/(\d{2})(?=\d)/g, '$1 ');
}

/**
 * Vérifie si l'environnement actuel est un environnement de développement
 * @returns true si en développement, false sinon
 */
export const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Retourne l'URL de base de l'API
 * @returns L'URL de base de l'API
 */
export const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};
