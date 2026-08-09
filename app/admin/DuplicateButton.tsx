"use client";

import { useTransition } from "react";
import { duplicateProperty } from "./actions";

export function DuplicateButton({ propertyId }: { propertyId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => {
      duplicateProperty(propertyId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-[11px] tracking-[0.08em] uppercase px-2 py-0.5 border border-border text-foreground-muted transition-colors hover:text-accent hover:border-accent disabled:opacity-50"
    >
      {isPending ? "A duplicar..." : "Duplicar"}
    </button>
  );
}
