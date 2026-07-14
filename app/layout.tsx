import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://ruidacruzconsultor.pt"),
  title: "Moradia Leça do Balio | Rui da Cruz",
  description:
    "Uma propriedade rara onde a privacidade encontra a excelência — Leça do Balio, Matosinhos.",
  openGraph: {
    title: "Moradia Leça do Balio | Uma Propriedade Rara",
    description:
      "Loteamento fechado de vinte residências, 2.545 m² de terreno, piscina aquecida. A minutos do Porto.",
    images: ["/images/leca-do-balio/01-hero-fachada.jpg"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
