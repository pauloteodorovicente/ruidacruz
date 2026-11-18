"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeInstagramPostUrl, sanitizeInstagramSettings } from "@/lib/instagram";
import type { InstagramPost, InstagramSettings } from "@/lib/instagram";

const BUCKET = "property-photos";
const PREFIX = "instagram/";
const CAPTION_MAX = 160;

function refresh() {
  revalidatePath("/admin/instagram");
  revalidatePath("/", "layout");
}

function cleanCaption(value: string | null | undefined): string | null {
  const text = (value ?? "").replace(/\s+/g, " ").trim().slice(0, CAPTION_MAX);
  return text || null;
}

function parsePostUrl(input: string) {
  const parsed = normalizeInstagramPostUrl(input);
  if (!parsed) {
    throw new Error("Link inválido. Cole o endereço de uma publicação ou reel do Instagram (instagram.com/p/… ou instagram.com/reel/…).");
  }
  return parsed;
}

// A imagem vai direto do navegador ao armazenamento (link assinado), como o vídeo da galeria: o servidor
// só autoriza o envio e depois registra o post.
export async function createInstagramUpload(): Promise<{ path: string; token: string }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const path = `${PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { data, error } = await createAdminClient().storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "Não consegui preparar o envio da imagem.");
  return { path, token: data.token };
}

export async function addInstagramPost(input: { path: string; postUrl: string; caption: string }): Promise<InstagramPost> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  if (!input.path.startsWith(PREFIX) || input.path.includes("..")) throw new Error("Caminho de imagem inválido.");
  const { url, isVideo } = parsePostUrl(input.postUrl);

  const supabase = createAdminClient();
  const { data: last } = await supabase.from("instagram_posts").select("position").order("position", { ascending: false }).limit(1);
  const position = (last?.[0]?.position ?? -1) + 1;
  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(input.path);

  const { data, error } = await supabase
    .from("instagram_posts")
    .insert({ image_url: publicUrl.publicUrl, post_url: url, caption: cleanCaption(input.caption), is_video: isVideo, position })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Não consegui guardar o post.");

  refresh();
  return data as InstagramPost;
}

export async function updateInstagramPost(
  id: string,
  input: { postUrl: string; caption: string; isVideo: boolean },
): Promise<InstagramPost> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { url } = parsePostUrl(input.postUrl);

  const { data, error } = await createAdminClient()
    .from("instagram_posts")
    .update({ post_url: url, caption: cleanCaption(input.caption), is_video: input.isVideo })
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Não consegui guardar o post.");

  refresh();
  return data as InstagramPost;
}

export async function setInstagramPostVisible(id: string, visible: boolean) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { error } = await createAdminClient().from("instagram_posts").update({ visible }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function reorderInstagramPosts(orderedIds: string[]) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const supabase = createAdminClient();
  const results = await Promise.all(
    orderedIds.map((id, position) => supabase.from("instagram_posts").update({ position }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);
  refresh();
}

export async function deleteInstagramPost(id: string) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const supabase = createAdminClient();
  const { data: post } = await supabase.from("instagram_posts").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("instagram_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Apaga também o arquivo da imagem (só se for um dos que o painel enviou para esta pasta).
  const path = post?.image_url?.split(`/${BUCKET}/`)[1];
  if (path?.startsWith(PREFIX)) await supabase.storage.from(BUCKET).remove([path]);
  refresh();
}

// Liga/desliga, layout e limite. Sem redirect: o formulário mantém o estado e mostra "Guardado".
export async function saveInstagramSettings(settings: InstagramSettings): Promise<{ ok: true; settings: InstagramSettings }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const clean = sanitizeInstagramSettings(settings);
  const { error } = await createAdminClient()
    .from("settings")
    .upsert({ key: "instagram_section", value: clean, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  refresh();
  return { ok: true, settings: clean };
}
