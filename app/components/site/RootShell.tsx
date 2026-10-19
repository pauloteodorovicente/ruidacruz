import { MetaPixel } from "../MetaPixel";
import { GlobalCursor } from "./GlobalCursor";
import { ThemeEnsure } from "./ThemeEnsure";
import { OrganizationSchema } from "../OrganizationSchema";
import { getMetaPixelSettings, getGrainSettings } from "@/lib/settings";
import { cormorant, dmSans } from "@/app/fonts";

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

// <html> + <body> do site. Antes ficava num único app/layout.tsx com
// lang="pt-PT" fixo — então o HTML que o servidor entregava dizia português
// até em /en e /de (o Chrome oferecia "traduzir do português" em páginas já
// em inglês, e leitores de tela e buscadores recebiam o idioma errado até o
// JavaScript corrigir). Agora quem gera o <html> é o layout de cada idioma
// (app/[locale]/layout.tsx, com lang={locale}) e o do painel
// (app/admin/layout.tsx, pt-PT), ambos por aqui — sem tornar nenhuma página
// dinâmica, que é o que aconteceria se o layout raiz lesse o idioma dos
// cabeçalhos da requisição.
export async function RootShell({ lang, children }: { lang: string; children: React.ReactNode }) {
  const pixelSettings = await getMetaPixelSettings();
  const grainSettings = await getGrainSettings();

  return (
    <html
      lang={lang}
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <OrganizationSchema />
      </head>
      <body
        className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300"
        style={{ "--grain-opacity": grainSettings.opacity } as React.CSSProperties}
      >
        <MetaPixel settings={pixelSettings} />
        <GlobalCursor />
        <ThemeEnsure locale={lang} />
        {children}
      </body>
    </html>
  );
}
