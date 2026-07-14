"use client";

import { useLanguage } from "@/lib/language-context";

export function WhatsAppFloating() {
  const { t } = useLanguage();

  return (
    <a
      href={`https://wa.me/351939081583?text=${encodeURIComponent(t.whatsappMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.nav.whatsapp}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.3.38-.44.51-.14.14-.29.29-.13.58.17.29.75 1.23 1.6 1.99 1.11.99 2.04 1.3 2.33 1.44.29.14.46.12.63-.07.17-.19.72-.84.92-1.13.19-.29.39-.24.65-.14.27.1 1.68.79 1.97.93.29.14.48.22.55.34.07.12.07.7-.17 1.38Z" />
      </svg>
    </a>
  );
}
