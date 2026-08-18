import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { MetaPixel } from "./components/MetaPixel";
import { GlobalCursor } from "./components/site/GlobalCursor";
import { OrganizationSchema } from "./components/OrganizationSchema";
import { getMetaPixelSettings } from "@/lib/settings";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

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

// Evita flash do tema errado no primeiro paint: lê a preferência salva
// (ou do sistema) antes do React hidratar e aplica no <html> de imediato.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pixelSettings = await getMetaPixelSettings();

  return (
    <html
      lang="pt-PT"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <OrganizationSchema />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <MetaPixel settings={pixelSettings} />
        <GlobalCursor />
        {children}
      </body>
    </html>
  );
}
