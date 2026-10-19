import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "i.ytimg.com" }, { hostname: "lpxgfeomokqnsetttwri.supabase.co" }],
    // Gallery/Lightbox usam quality=90; Next 16 exige declarar quality fora
    // do default [75] explicitamente ou ele avisa (e futuramente bloqueia).
    qualities: [75, 90],
  },
  // Os PDFs do Verdelago (brochuras e Documentos Comerciais da Fase 6) continuam abrindo nas MESMAS
  // URLs de sempre (/docs/verdelago/<arquivo>.pdf, já enviadas por e-mail), mas passam por
  // app/api/docs/verdelago/[file]/route.ts, que conta o download e devolve o arquivo igual. O
  // cabeçalho x-internal-doc é o que a própria rota usa para buscar o PDF estático sem cair aqui de novo.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/docs/verdelago/:file(.+\\.pdf)",
          missing: [{ type: "header" as const, key: "x-internal-doc" }],
          destination: "/api/docs/verdelago/:file",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    // .com é o domínio canônico (maioria dos compradores é internacional).
    // .pt e .org (e seus "www") redirecionam pra ele. Cada host tem sua
    // própria regra — "has" dentro do mesmo objeto funciona como E, não OU,
    // então dois hosts diferentes nunca poderiam casar na mesma regra.
    const aliasHosts = [
      "ruidacruzconsultor.pt",
      "www.ruidacruzconsultor.pt",
      "ruidacruzconsultor.org",
      "www.ruidacruzconsultor.org",
      "www.ruidacruzconsultor.com",
    ];
    return aliasHosts.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://ruidacruzconsultor.com/:path*",
      permanent: true,
    }));
  },
};

export default withNextIntl(nextConfig);
