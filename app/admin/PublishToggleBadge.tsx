"use client";

import { useState, useTransition } from "react";
import { togglePropertyPublished } from "./publish-actions";

export function PublishToggleBadge({
  propertyId,
  reference,
  campaignPath,
  initialPublished,
}: {
  propertyId: string;
  reference: string;
  campaignPath: string | null;
  initialPublished: boolean;
}) {
  const [published, setPublished] = useState(initialPublished);
  const [isPending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !published;
    setPublished(next);
    startTransition(async () => {
      try {
        await togglePropertyPublished(propertyId, reference, campaignPath, next);
      } catch {
        setPublished(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className="text-[11px] tracking-[0.08em] uppercase px-2 py-0.5 border transition-opacity hover:opacity-75 disabled:opacity-50"
      style={
        published
          ? { color: "#3d6b4a", borderColor: "#3d6b4a" }
          : { color: "#a3623a", borderColor: "#a3623a" }
      }
    >
      {published ? "Publicado" : "Despublicado"}
    </button>
  );
}
