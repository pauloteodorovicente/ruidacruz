// Bandeiras em SVG, não emoji: o Windows (Segoe UI Emoji) não tem os glifos
// de bandeira e cai para o fallback textual ("GB"/"PT"), então o emoji de
// bandeira nunca aparece nesse sistema — só em macOS/iOS/Android.

export function FlagGB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#00247d" />
      <path d="M0 0L24 18M24 0L0 18" stroke="#fff" strokeWidth="3.6" />
      <path d="M0 0L24 18M24 0L0 18" stroke="#cf142b" strokeWidth="1.4" />
      <path d="M12 0V18M0 9H24" stroke="#fff" strokeWidth="6" />
      <path d="M12 0V18M0 9H24" stroke="#cf142b" strokeWidth="2.2" />
    </svg>
  );
}

export function FlagPT({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#ff0000" />
      <rect width="9.6" height="18" fill="#046a38" />
      <circle cx="9.6" cy="9" r="3.4" fill="#ffcc00" stroke="#046a38" strokeWidth="0.5" />
      <circle cx="9.6" cy="9" r="1.5" fill="#fff" stroke="#00205b" strokeWidth="0.4" />
    </svg>
  );
}
