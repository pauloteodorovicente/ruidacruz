"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { recommendLayoutMode, normalizeSlug } from "@/lib/property-types";
import { translatePropertyToAllLocales } from "@/lib/translate-property";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function numOrNull(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  return value ? Number(value) : null;
}

export async function saveProperty(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = str(formData, "id");
  const propertyType = str(formData, "property_type") as "moradia" | "apartamento" | "terreno" | "outro";
  const architect = str(formData, "architect") || null;
  const layoutMode = str(formData, "layout_mode");
  const recommended = recommendLayoutMode({ property_type: propertyType, architect });

  const highlights = str(formData, "highlights")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const record = {
    reference: str(formData, "reference"),
    slug: normalizeSlug(str(formData, "slug")),
    title: str(formData, "title"),
    property_type: propertyType,
    typology: str(formData, "typology") || null,
    status: str(formData, "status") || "disponivel",
    business_type: str(formData, "business_type") || "venda",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    zone: str(formData, "zone") || null,
    ghl_zone: str(formData, "ghl_zone") || null,
    municipality: str(formData, "municipality") || null,
    map_url: str(formData, "map_url") || null,
    price: numOrNull(formData, "price"),
    price_on_application: formData.get("price_on_application") === "on",
    land_area_sqm: numOrNull(formData, "land_area_sqm"),
    construction_area_sqm: numOrNull(formData, "construction_area_sqm"),
    parking: str(formData, "parking") || null,
    construction_year: numOrNull(formData, "construction_year"),
    energy_certificate: str(formData, "energy_certificate") || null,
    description: str(formData, "description") || null,
    highlights,
    architect,
    landscaper: str(formData, "landscaper") || null,
    layout_mode: layoutMode || recommended,
    layout_mode_overridden: layoutMode !== recommended,
    color_theme: str(formData, "color_theme") || null,
  };

  if (!record.reference || !record.title) {
    throw new Error("Referência e título são obrigatórios.");
  }

  const supabase = createAdminClient();

  // O slug e a referência dividem o mesmo trecho de URL (/imoveis/{x}) — um
  // slug igual à referência de OUTRO imóvel faria as duas fichas disputarem o
  // mesmo endereço. (Slug repetido em outro slug já é barrado pelo índice único.)
  if (record.slug) {
    const { data: clash } = await supabase
      .from("properties")
      .select("id")
      .or(`reference.eq.${record.slug},slug.eq.${record.slug}`)
      .neq("id", id || "00000000-0000-0000-0000-000000000000")
      .limit(1);
    if (clash && clash.length > 0) {
      throw new Error(`A URL amigável "${record.slug}" já é usada por outro imóvel. Escolha outra.`);
    }
  }

  const { data: saved, error } = id
    ? await supabase.from("properties").update(record).eq("id", id).select("id").single()
    : await supabase.from("properties").insert(record).select("id").single();

  if (error) throw new Error(error.message);

  // Traduzir pros outros 6 idiomas só quando publicado (rascunho não é visto
  // por ninguém ainda) — roda depois da resposta (after), nunca bloqueia o
  // fluxo de publicar: se o DeepL demorar ou falhar, publicar já terminou.
  if (record.published) {
    after(() =>
      translatePropertyToAllLocales(saved.id, {
        title: record.title,
        description: record.description,
        highlights: record.highlights,
      }),
    );
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/imoveis/${record.reference}`);
  if (record.slug) revalidatePath(`/imoveis/${record.slug}`);
  redirect("/admin");
}

// Cópia rápida pra imóveis que compartilham estrutura/zona — nasce sempre em
// rascunho, sem fotos/plantas (ficam pro imóvel original; evita duplicar
// arquivos do Storage sem necessidade real). Referência nova, gerada aqui,
// nunca reaproveitada.
export async function duplicateProperty(id: string) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: original, error: fetchError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, reference, title, ...rest } = original;
  void _id;
  void _createdAt;
  void _updatedAt;

  let newReference = `${reference}-copia`;
  const { data: clash } = await supabase.from("properties").select("id").eq("reference", newReference).maybeSingle();
  if (clash) newReference = `${reference}-copia-${Date.now().toString(36)}`;

  const { data: copy, error } = await supabase
    .from("properties")
    .insert({
      ...rest,
      reference: newReference,
      title: `${title} (cópia)`,
      published: false,
      featured: false,
      // Achado (24/08): as 4 landings de campanha (Leça, Verdelago, Portimão,
      // One Green Way) têm conteúdo próprio fixo no código, não na tabela —
      // duplicar mantendo is_campaign_page/campaign_path criaria uma segunda
      // linha apontando pra mesma rota especial. A cópia sempre vira um
      // imóvel genérico normal (template /imoveis/[referencia]), usando os
      // números/localização originais como ponto de partida.
      is_campaign_page: false,
      campaign_path: null,
      // Slug é único — a cópia nunca herda o do original (senão o índice único
      // barraria a duplicação); quem duplica define o da cópia no admin.
      slug: null,
    })
    .select("reference")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  redirect(`/admin/imoveis/${copy.reference}/editar`);
}

// Gerar de novo invalida o link anterior (sobrescreve o token) — de propósito,
// pra o Rui poder "revogar" um link antigo só gerando outro. Expira sozinho
// checando a data na leitura (ver page.tsx do imóvel), sem precisar de cron.
export async function generatePreviewLink(propertyId: string, propertyReference: string): Promise<string> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const token = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("properties")
    .update({ preview_token: token, preview_token_expires_at: expiresAt })
    .eq("id", propertyId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  return token;
}
