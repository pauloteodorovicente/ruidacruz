// Capa padrão de todo imóvel sem foto nenhuma visível: a assinatura do Rui (o
// "R" dentro do círculo, public/images/rui/assinatura.png). O PNG é de uma cor
// só sobre fundo transparente, então vira uma "máscara" pintada com a cor de
// destaque do site (--c-accent): acompanha o tema claro/escuro e a paleta de
// cor do imóvel sem precisar de uma imagem por tema. Pedido do Paulo
// (09/10/2026), pra qualquer imóvel — inclusive publicado — sem capa nem foto.
//
// variant "card": segue o tema (fundo e tinta do site) — cards da Home/Portfólio.
// variant "hero": fundo escuro fixo, porque o texto do Hero é branco por cima.
const MASK = 'url("/images/rui/assinatura.png")';

export function SignatureCover({ variant = "card", className = "" }: { variant?: "card" | "hero"; className?: string }) {
  const surface = variant === "hero" ? "bg-[#040815]" : "bg-background-raised";

  return (
    <div aria-hidden className={`relative flex h-full w-full items-center justify-center overflow-hidden ${surface} ${className}`}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--c-accent) 14%, transparent), transparent 68%)" }}
      />
      <span
        className="relative block aspect-[450/512] bg-accent opacity-80"
        style={{
          height: variant === "hero" ? "34%" : "46%",
          maskImage: MASK,
          WebkitMaskImage: MASK,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
    </div>
  );
}
