import { getSellerCtaSettings } from "@/lib/settings";
import { SiteHeaderClient } from "./SiteHeaderClient";

// Server Component só pra buscar o toggle "Vender" (admin) antes de renderizar
// o header de verdade — mantém os ~11 call sites existentes (<SiteHeader />)
// intocados, sem precisar de prop-drilling em cada página. A parte
// interativa (scroll, cor de contraste) continua isolada em
// SiteHeaderClient.tsx, que precisa de "use client".
export async function SiteHeader() {
  const { enabled } = await getSellerCtaSettings();
  return <SiteHeaderClient sellerCtaEnabled={enabled} />;
}
