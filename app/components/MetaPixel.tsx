"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import type { MetaPixelSettings } from "@/lib/settings";

// Casa uma rota atual (ex. "/pt-PT/imoveis/122481641-38") com uma entrada da
// lista configurada no admin (ex. "/imoveis") — ignora o prefixo de locale.
function matchesPage(pathname: string, page: string): boolean {
  const withoutLocale = pathname.replace(/^\/(pt-PT|pt-BR|en|es|fr|it|de)(?=\/|$)/, "") || "/";
  if (page === "/") return withoutLocale === "/";
  return withoutLocale === page || withoutLocale.startsWith(`${page}/`);
}

export function MetaPixel({ settings }: { settings: MetaPixelSettings }) {
  const pathname = usePathname();
  // /admin não é tráfego real e não deve poluir os dados do Pixel — exceção
  // fixa, não configurável pelo painel.
  if (pathname?.startsWith("/admin")) return null;

  const installHere = settings.autoInstallNewPages
    ? true
    : settings.pages.some((page) => matchesPage(pathname ?? "/", page));

  if (!installHere) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${settings.pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${settings.pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
