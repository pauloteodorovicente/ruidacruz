import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Toda página pública passa pelo middleware de idioma — as landings de
  // campanha (Leça, Verdelago, Verdelago Fase 6, Portimão, One Green Way)
  // também, já que vivem em app/[locale] (ver lib/campaign-i18n.ts). Só ficam
  // de fora: /admin (painel interno, só português, sem SEO multilíngue) e o
  // que o next-intl já exclui por padrão (api, _next, arquivos estáticos).
  matcher: ["/((?!api|admin|_next|_vercel|flags|images|.*\\..*).*)"],
};
