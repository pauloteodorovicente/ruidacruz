import { getSellerCtaSettings } from "@/lib/settings";
import { SiteFooterClient } from "./SiteFooterClient";

// Mesmo padrão do SiteHeader.tsx — Server Component só pra buscar o toggle
// "Vender" (admin) antes de renderizar o rodapé de verdade, mantendo os
// call sites existentes (<SiteFooter />) intocados.
export async function SiteFooter() {
  const { enabled } = await getSellerCtaSettings();
  return <SiteFooterClient sellerCtaEnabled={enabled} />;
}
