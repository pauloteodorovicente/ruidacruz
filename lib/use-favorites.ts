"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "favoritos";
const EMPTY: string[] = [];

// useSyncExternalStore exige que getSnapshot devolva a MESMA referência
// enquanto o valor não muda de verdade — senão o React acha que o store
// mudou a cada render e entra em loop (achado ao testar: "Maximum update
// depth exceeded"). Por isso um cache simples aqui: só reprocessa o JSON e
// cria um array novo quando a string crua do localStorage muda de verdade.
let cachedRaw: string | null = null;
let cachedValue: string[] = EMPTY;

function readStoredFavorites(): string[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    cachedValue = raw ? JSON.parse(raw) : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

// Pub-sub local — escrita em localStorage não dispara o evento nativo
// "storage" na própria aba que escreveu (só nas outras abas), então
// precisa de um jeito de avisar os outros componentes montados nesta
// mesma aba quando toggleFavorite muda a lista.
const listeners = new Set<() => void>();
function notify() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

// useSyncExternalStore em vez de useState+useEffect — resolve de vez a
// "janela" em que o coração aparecia desmarcado por um instante logo após
// recarregar a página (achado pelo Paulo, 24/08): o valor real já vem
// pronto no primeiro render no cliente, sem passar por um estado
// intermediário vazio esperando um efeito rodar. Também corrige o mesmo
// padrão de lint (react-hooks/set-state-in-effect) que já existia aqui
// antes, documentado como pendência conhecida no Checklist de Construção.
export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, readStoredFavorites, getServerSnapshot);

  const toggleFavorite = useCallback((propertyId: string) => {
    const current = readStoredFavorites();
    const next = current.includes(propertyId)
      ? current.filter((id) => id !== propertyId)
      : [...current, propertyId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
  }, []);

  return { favorites, toggleFavorite };
}
