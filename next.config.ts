import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "i.ytimg.com" }],
  },
  async redirects() {
    // Duas regras separadas: "has" dentro do mesmo objeto funciona como E,
    // não OU — um request não pode ter dois hosts ao mesmo tempo.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ruidacruzconsultor.com" }],
        destination: "https://ruidacruzconsultor.pt/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ruidacruzconsultor.com" }],
        destination: "https://ruidacruzconsultor.pt/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
