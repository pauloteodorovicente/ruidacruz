import { notFound } from "next/navigation";

// Pega qualquer endereço que não existe dentro de um idioma (/en/xyz, /xyz...)
// e dispara o 404 localizado de app/[locale]/not-found.tsx — padrão do
// next-intl pra o 404 sair no idioma certo, com o layout do site em volta.
export default function CatchAllNotFound() {
  notFound();
}
