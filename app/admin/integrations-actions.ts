"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MetaPixelSettings, GhlSettings } from "@/lib/settings";

async function upsertSetting(key: string, value: unknown) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

export async function saveMetaPixelSettings(settings: MetaPixelSettings) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  await upsertSetting("meta_pixel", settings);

  revalidatePath("/admin/integracoes");
  revalidatePath("/", "layout");
  redirect("/admin/integracoes");
}

export async function saveGhlSettings(settings: GhlSettings) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  await upsertSetting("ghl", settings);

  revalidatePath("/admin/integracoes");
  redirect("/admin/integracoes");
}
