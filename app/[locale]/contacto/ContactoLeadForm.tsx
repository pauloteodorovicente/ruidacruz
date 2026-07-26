"use client";

import { useTranslations } from "next-intl";
import { SiteLeadForm } from "@/app/components/site/SiteLeadForm";

export function ContactoLeadForm() {
  const c = useTranslations("contacto");

  return (
    <SiteLeadForm
      property={{ reference: "contacto-geral", title: "Contacto Geral", zone: null }}
      heading={{ eyebrow: c("eyebrow"), title: c("title"), subtitle: c("subtitle"), submitLabel: c("submit") }}
    />
  );
}
