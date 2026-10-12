import { Cormorant_Garamond, DM_Sans } from "next/font/google";

// Fontes do site inteiro — ficam num módulo próprio porque o <html> agora é
// gerado por mais de um layout (um por idioma e o do /admin), ver
// app/components/site/RootShell.tsx.
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});
