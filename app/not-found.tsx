import Link from "next/link";
import { RootShell } from "@/app/components/site/RootShell";

// 404 de último recurso — só aparece quando a requisição nem chega a um
// idioma (o middleware cobre o site inteiro, então é raro). O caminho normal
// é app/[locale]/not-found.tsx, já traduzido. Como o layout raiz é
// "passa-adiante", este arquivo gera o próprio <html>.
export default function GlobalNotFound() {
  return (
    <RootShell lang="pt-PT">
      <main className="flex-1 flex items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3">404</p>
          <h1 className="font-display text-3xl md:text-4xl mb-4">Página não encontrada</h1>
          <p className="text-foreground-muted mb-8">O endereço que tentou abrir não existe ou foi movido.</p>
          <Link
            href="/"
            className="inline-block border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase transition-all hover:border-accent hover:text-accent"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
    </RootShell>
  );
}
