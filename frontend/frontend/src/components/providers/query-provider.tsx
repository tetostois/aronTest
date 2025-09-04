'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isDev } from '@/lib/utils';

// Configuration du client React Query
const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Désactiver le rechargement lors du focus de la fenêtre
        refetchOnWindowFocus: false,
        // Désactiver les nouvelles requêtes sur reconnexion
        refetchOnReconnect: false,
        // Désactiver la nouvelle tentative en cas d'erreur
        retry: false,
        // Temps d'invalidation du cache par défaut (5 minutes)
        staleTime: 5 * 60 * 1000,
        // Temps avant que les données obsolètes ne soient considérées comme périmées (10 minutes)
        gcTime: 10 * 60 * 1000,
      },
      mutations: {
        // Désactiver la nouvelle tentative en cas d'erreur
        retry: false,
      },
    },
  });
};

// Variable pour stocker le client React Query
let browserQueryClient: QueryClient | undefined = undefined;

// Fonction pour obtenir le client React Query
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // En mode serveur, retourner un nouveau client à chaque fois
    return makeQueryClient();
  } else {
    // En mode navigateur, réutiliser le même client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
};

/**
 * Fournisseur de requêtes pour React Query
 * Gère les requêtes et le cache de l'application
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDev() && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
