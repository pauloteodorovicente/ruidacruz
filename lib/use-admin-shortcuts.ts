"use client";

import { useCallback, useEffect, useState } from "react";
import { readShortcutOverrides, writeShortcutOverrides, resolveShortcuts, type ShortcutMap } from "./admin-shortcuts";

export function useAdminShortcuts() {
  const [overrides, setOverrides] = useState<ShortcutMap>({});

  useEffect(() => {
    setOverrides(readShortcutOverrides());
  }, []);

  const setActionKeys = useCallback((actionId: string, keys: string[]) => {
    setOverrides((current) => {
      const next = { ...current, [actionId]: keys };
      writeShortcutOverrides(next);
      return next;
    });
  }, []);

  const resetActionKeys = useCallback((actionId: string) => {
    setOverrides((current) => {
      const next = { ...current };
      delete next[actionId];
      writeShortcutOverrides(next);
      return next;
    });
  }, []);

  return { shortcuts: resolveShortcuts(overrides), setActionKeys, resetActionKeys };
}
