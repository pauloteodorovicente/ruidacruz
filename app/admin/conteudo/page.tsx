import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getContentOverridesForAdmin } from "@/lib/settings";
import { CONTENT_SOURCES, editableEntries, type ContentSourceId } from "@/lib/content-overrides";
import { isContentLocale, loadDefaultContent, type ContentLocale } from "@/lib/content-defaults";
import { ContentEditor } from "./ContentEditor";

const LOCALE_LABELS: Record<ContentLocale, string> = {
  "pt-PT": "Português (Portugal)",
  "pt-BR": "Português (Brasil)",
  en: "Inglês",
  es: "Espanhol",
  fr: "Francês",
  it: "Italiano",
  de: "Alemão",
};

const selectClass = "bg-background-raised border border-border px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";

// Admin → Textos das páginas: todo texto das landings e do site, no idioma escolhido, editável sem mexer em
// código. O texto original (em código) é o padrão e continua valendo para tudo o que não for editado; "Voltar ao
// original" devolve um texto ao que estava escrito.
export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ fonte?: string; idioma?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const params = await searchParams;
  const source = (CONTENT_SOURCES.find((s) => s.id === params.fonte)?.id ?? "verdelago") as ContentSourceId;
  const locale: ContentLocale = isContentLocale(params.idioma) ? params.idioma : "pt-PT";

  const [defaults, overrides] = await Promise.all([loadDefaultContent(source, locale), getContentOverridesForAdmin()]);
  const entries = editableEntries(defaults);
  const edited = overrides[source]?.[locale] ?? {};
  const editedCount = Object.keys(overrides[source]?.["pt-PT"] ?? {}).length;

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl">Textos das páginas</h1>
          <p className="text-sm text-foreground-muted max-w-2xl">
            Edite qualquer texto das landings e do site: títulos, parágrafos, comodidades, localização e números. O que
            você não editar continua como está escrito. Endereços de arquivo e links não aparecem aqui. As fotos têm a
            própria tela, em cada imóvel.
          </p>
        </div>

        <form method="get" className="flex flex-wrap items-end gap-3 border border-border p-4">
          <label className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
            Página
            <select name="fonte" defaultValue={source} className={selectClass}>
              {CONTENT_SOURCES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
            Idioma
            <select name="idioma" defaultValue={locale} className={selectClass}>
              {(Object.keys(LOCALE_LABELS) as ContentLocale[]).map((l) => (
                <option key={l} value={l}>
                  {LOCALE_LABELS[l]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="px-5 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong"
          >
            Abrir
          </button>
        </form>

        <ContentEditor
          key={`${source}-${locale}`}
          source={source}
          locale={locale}
          entries={entries}
          edited={edited}
          ptEditedCount={editedCount}
        />
      </div>
    </main>
  );
}
