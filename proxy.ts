import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclui /leca-do-balio e /verdelago (páginas de campanha com PT/EN
  // próprio, não podem ganhar prefixo de idioma nem passar pelo redirect de
  // locale) e /admin (painel interno, só português, sem SEO multilíngue).
  // O resto (api, _next, arquivos estáticos) já é padrão do next-intl.
  matcher: ["/((?!api|admin|leca-do-balio|verdelago|portimao-praia-da-rocha|_next|_vercel|flags|images|.*\\..*).*)"],
};
