import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour vérifier si le composant est monté
 * Utile pour éviter les fuites de mémoire lors des mises à jour d'état asynchrones
 * @returns Une fonction qui renvoie true si le composant est monté, false sinon
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return () => isMounted;
}
