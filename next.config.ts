import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "i.ytimg.com" }],
    // Gallery/Lightbox usam quality=90; Next 16 exige declarar quality fora
    // do default [75] explicitamente ou ele avisa (e futuramente bloqueia).
    qualities: [75, 90],
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

export default nextConfig;
