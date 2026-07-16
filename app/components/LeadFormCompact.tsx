"use client";

import { useLanguage } from "@/lib/language-context";
import { useLeadForm } from "@/lib/use-lead-form";

export function LeadFormCompact() {
  const { t } = useLanguage();
  const f = t.form;
  const { status, handleSubmit } = useLeadForm();

  if (status === "success") {
    return (
      <p className="font-display text-base text-accent py-3">{f.success}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        name="name"
        required
        placeholder={f.name}
        className="bg-transparent border border-border px-4 py-3 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors"
      />
      <input
        name="phone"
        required
        placeholder={f.phone}
        className="bg-transparent border border-border px-4 py-3 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors"
      />
      <label className="flex items-start gap-2 text-[11px] text-foreground-muted leading-relaxed">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        {f.consent}
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {status === "submitting" ? f.submitting : f.submit}
      </button>
      {status === "error" && <p className="text-xs text-red-400 text-center">{f.error}</p>}
    </form>
  );
}
