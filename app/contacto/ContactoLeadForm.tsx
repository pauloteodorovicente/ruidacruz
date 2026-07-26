"use client";

import { useLanguage } from "@/lib/language-context";
import { LeadForm } from "@/app/components/LeadForm";

export function ContactoLeadForm() {
  const { t } = useLanguage();
  const c = t.contacto;

  return (
    <LeadForm
      property={{ reference: "contacto-geral", title: "Contacto Geral", zone: null }}
      heading={{ eyebrow: c.eyebrow, title: c.title, subtitle: c.subtitle, submitLabel: c.submit }}
    />
  );
}
