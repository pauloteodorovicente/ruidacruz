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

export function FlagBR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#009c3b" />
      <polygon points="12,2.2 21.5,9 12,15.8 2.5,9" fill="#ffdf00" />
      <circle cx="12" cy="9" r="3.6" fill="#002776" />
    </svg>
  );
}

export function FlagUS({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#b22234" />
      <rect y="2.77" width="24" height="2.77" fill="#fff" />
      <rect y="8.31" width="24" height="2.77" fill="#fff" />
      <rect y="13.85" width="24" height="2.77" fill="#fff" />
      <rect width="10" height="9.7" fill="#3c3b6e" />
    </svg>
  );
}

function StripeFlag({
  className,
  colors,
  direction,
  ratios,
}: {
  className?: string;
  colors: string[];
  direction: "v" | "h";
  ratios?: number[];
}) {
  const total = 24;
  const heightOrWidth = 18;
  const shares = ratios ?? colors.map(() => 1);
  const sum = shares.reduce((a, b) => a + b, 0);
  let pos = 0;
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      {colors.map((c, i) => {
        const size = ((direction === "v" ? total : heightOrWidth) * shares[i]) / sum;
        const rect =
          direction === "v" ? (
            <rect key={i} x={pos} width={size} height={18} fill={c} />
          ) : (
            <rect key={i} y={pos} width={24} height={size} fill={c} />
          );
        pos += size;
        return rect;
      })}
    </svg>
  );
}

export function FlagFR({ className }: { className?: string }) {
  return <StripeFlag className={className} direction="v" colors={["#002395", "#fff", "#ed2939"]} />;
}

export function FlagIT({ className }: { className?: string }) {
  return <StripeFlag className={className} direction="v" colors={["#009246", "#fff", "#ce2b37"]} />;
}

export function FlagIE({ className }: { className?: string }) {
  return <StripeFlag className={className} direction="v" colors={["#169b62", "#fff", "#ff883e"]} />;
}

export function FlagBE({ className }: { className?: string }) {
  return <StripeFlag className={className} direction="v" colors={["#000", "#fae042", "#ed2939"]} />;
}

export function FlagDE({ className }: { className?: string }) {
  return <StripeFlag className={className} direction="h" colors={["#000", "#dd0000", "#ffce00"]} />;
}

export function FlagNL({ className }: { className?: string }) {
  return <StripeFlag className={className} direction="h" colors={["#ae1c28", "#fff", "#21468b"]} />;
}

export function FlagLU({ className }: { className?: string }) {
  return <StripeFlag className={className} direction="h" colors={["#ed2939", "#fff", "#00a1de"]} />;
}

export function FlagES({ className }: { className?: string }) {
  return <StripeFlag className={className} direction="h" colors={["#aa151b", "#f1bf00", "#aa151b"]} ratios={[1, 2, 1]} />;
}

export function FlagCH({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#d52b1e" />
      <rect x="10" y="4" width="4" height="10" fill="#fff" />
      <rect x="7" y="7" width="10" height="4" fill="#fff" />
    </svg>
  );
}

export const flagComponents = {
  PT: FlagPT,
  GB: FlagGB,
  BR: FlagBR,
  US: FlagUS,
  FR: FlagFR,
  ES: FlagES,
  IT: FlagIT,
  DE: FlagDE,
  NL: FlagNL,
  BE: FlagBE,
  CH: FlagCH,
  IE: FlagIE,
  LU: FlagLU,
} as const;

export type FlagCode = keyof typeof flagComponents;
