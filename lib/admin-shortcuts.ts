export type ShortcutAction = {
  id: string;
  label: string;
  href: string;
  defaultKeys: string[];
};

// As 5 ações do backlog (G I, N, G H, G D, G A) — Integrações fica de fora
// da lista padrão de propósito (é a página menos visitada no dia a dia),
// mas nada impede o Rui/Paulo de trocar qualquer tecla aqui na tela de
// configuração (/admin/atalhos).
export const SHORTCUT_ACTIONS: ShortcutAction[] = [
  { id: "imoveis", label: "Imóveis", href: "/admin", defaultKeys: ["g", "i"] },
  { id: "novo", label: "+ Novo Imóvel", href: "/admin/imoveis/novo", defaultKeys: ["n"] },
  { id: "hero", label: "Hero da Home", href: "/admin/hero", defaultKeys: ["g", "h"] },
  { id: "depoimentos", label: "Depoimentos", href: "/admin/depoimentos", defaultKeys: ["g", "d"] },
  { id: "analytics", label: "Analytics", href: "/admin/analytics", defaultKeys: ["g", "a"] },
];

const STORAGE_KEY = "admin-shortcuts";

export type ShortcutMap = Record<string, string[]>;

export function readShortcutOverrides(): ShortcutMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writeShortcutOverrides(overrides: ShortcutMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function resolveShortcuts(overrides: ShortcutMap): (ShortcutAction & { keys: string[] })[] {
  return SHORTCUT_ACTIONS.map((action) => ({ ...action, keys: overrides[action.id] ?? action.defaultKeys }));
}

export function keysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((key, i) => key === b[i]);
}

export function formatKeys(keys: string[]): string {
  return keys.map((k) => k.toUpperCase()).join(" ");
}
