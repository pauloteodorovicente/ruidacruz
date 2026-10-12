import type { Metadata } from "next";
import "./globals.css";

// Fallback só — qualquer rota com generateMetadata/metadata próprio (Home,
// Sobre, Contacto, fichas de imóvel, Leça, Verdelago) sobrescreve isto.
// Não deixar isto com cara de imóvel específico de novo: como só
// title/description eram sobrescritos e openGraph não, toda página que não
// definia seu próprio openGraph "herdava" o da Leça — inclusive a Home —
// e isso é exatamente o que aparecia na prévia de link do WhatsApp.
export const metadata: Metadata = {
  metadataBase: new URL("https://ruidacruzconsultor.com"),
  title: "Rui Da Cruz | Consultoria Imobiliária Premium",
  description: "Consultoria imobiliária premium com Rui Da Cruz, RE/MAX Collection.",
  openGraph: {
    title: "Rui Da Cruz | Consultoria Imobiliária Premium",
    description: "Consultoria imobiliária premium com Rui Da Cruz, RE/MAX Collection.",
    images: ["/images/rui/hero-portrait.jpg"],
    locale: "pt_PT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

// Layout raiz "passa-adiante" (padrão do next-intl): quem gera <html> e <body>
// são os layouts de baixo — app/[locale]/layout.tsx (um por idioma, com
// lang={locale}) e app/admin/layout.tsx — ambos via RootShell. Assim o HTML
// que o servidor entrega já traz o idioma certo, sem custo de performance.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
