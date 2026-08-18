"use client";

import { useFavorites } from "@/lib/use-favorites";

// Coração sobreposto a uma foto (capa do card ou hero do imóvel) — por isso
// é sempre branco com contorno, não segue as cores do tema claro/escuro.
export function FavoriteButton({ propertyId, className = "" }: { propertyId: string; className?: string }) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(propertyId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(propertyId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      aria-pressed={isFavorite}
      className={`text-white transition-colors hover:text-accent-strong ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.6" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
        <path
          d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.4 4.5 5.8 4c2-.3 3.9.6 5.2 2.4a1 1 0 0 0 1 0C13.3 4.6 15.2 3.7 17.2 4c3.4.5 5.3 3.8 3.8 7.2-2.5 4.7-10 9.3-10 9.3Z"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
        />
      </svg>
    </button>
  );
}
