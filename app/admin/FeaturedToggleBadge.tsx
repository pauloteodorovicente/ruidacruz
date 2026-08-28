"use client";

import { useState, useTransition } from "react";
import { togglePropertyFeatured } from "./publish-actions";

export function FeaturedToggleBadge({
  propertyId,
  reference,
  campaignPath,
  initialFeatured,
}: {
  propertyId: string;
  reference: string;
  campaignPath: string | null;
  initialFeatured: boolean;
}) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [isPending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !featured;
    setFeatured(next);
    startTransition(async () => {
      try {
        await togglePropertyFeatured(propertyId, reference, campaignPath, next);
      } catch {
        setFeatured(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className="text-[10px] tracking-[0.06em] uppercase px-1.5 py-0.5 border whitespace-nowrap transition-opacity hover:opacity-75 disabled:opacity-50"
      style={
        featured
          ? { color: "#a3623a", borderColor: "#a3623a" }
          : { color: "var(--foreground-muted)", borderColor: "var(--border)" }
      }
    >
      {featured ? "Destaque" : "Sem Destaque"}
    </button>
  );
}
