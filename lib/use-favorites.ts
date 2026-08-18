"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "favoritos";

function readStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Sem login: a lista de favoritos vive só no localStorage deste navegador.
// Cada componente que usa o hook lê o valor guardado uma vez ao montar —
// como a troca de imóvel sempre passa por uma navegação de página (não há
// duas listas do mesmo imóvel na mesma página), não precisa sincronizar
// entre instâncias.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readStoredFavorites());
  }, []);

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites((current) => {
      const next = current.includes(propertyId)
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}
