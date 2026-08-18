"use client";

import { useTranslations } from "next-intl";
import { SiteLeadForm } from "@/app/components/site/SiteLeadForm";

export function VenderLeadForm() {
  const v = useTranslations("vender");

  return (
    <SiteLeadForm
      property={{ reference: "vender-imovel", title: "Quero Vender o Meu Imóvel", zone: null }}
      heading={{ eyebrow: v("eyebrow"), title: v("title"), subtitle: v("subtitle"), submitLabel: v("submit") }}
    />
  );
}
