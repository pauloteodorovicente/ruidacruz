import { getSchedulingSettings } from "@/lib/settings";

// Server Component de propósito — só um link, sem interatividade nenhuma,
// então não precisa de "use client" nem de prop-drilling do link a partir
// de cada página. Fica escondido até alguém configurar o link no admin.
export async function ScheduleCallFloating() {
  const { link } = await getSchedulingSettings();
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar uma chamada"
      className="fixed bottom-[88px] right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="h-6 w-6">
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path strokeLinecap="round" d="M3 9.5h18M8 2.5v4M16 2.5v4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4" />
      </svg>
    </a>
  );
}
