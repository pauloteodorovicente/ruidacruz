import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclui as landings de campanha que ainda NÃO migraram pra app/[locale]
  // (/leca-do-balio, /verdelago e /verdelago6 — o prefixo "verdelago" cobre
  // as duas —, /portimao-praia-da-rocha): têm idioma próprio escolhido no
  // navegador e não podem ganhar prefixo nem passar pelo middleware de
  // locale. /onegreenway já migrou (ver lib/campaign-i18n.ts) e passa pelo
  // middleware como o resto do site. /admin é painel interno, só português,
  // sem SEO multilíngue. O resto (api, _next, arquivos estáticos) já é
  // padrão do next-intl.
  matcher: ["/((?!api|admin|leca-do-balio|verdelago|portimao-praia-da-rocha|_next|_vercel|flags|images|.*\\..*).*)"],
};
