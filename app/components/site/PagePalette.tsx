import { paletteCss } from "@/lib/property-colors";

// Recolore a página inteira com a paleta escolhida (ver lib/property-colors.ts).
// Renderiza só um <style> que troca as variáveis de cor no <html> — por isso
// vale pra fundo, cartões, menu, rodapé e janelas, e some sozinho ao navegar
// pra outra página. Sem paleta (ou "Clássico", o padrão, slug "terracota"), não renderiza nada:
// a página fica exatamente como sempre foi.
export function PagePalette({ slug }: { slug: string | null | undefined }) {
  const css = paletteCss(slug);
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
