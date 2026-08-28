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
      className="text-[10px] tracking-[0.06em] uppercase px-1.5 py-0.5 border border-border text-foreground-muted whitespace-nowrap transition-colors hover:text-accent hover:border-accent disabled:opacity-50"
    >
      {isPending ? "A duplicar..." : "Duplicar"}
    </button>
  );
}
