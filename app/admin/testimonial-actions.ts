"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function saveTestimonial(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = str(formData, "id");
  const record = {
    author_name: str(formData, "author_name"),
    quote: str(formData, "quote"),
    source: str(formData, "source") || null,
    featured: formData.get("featured") === "on",
  };

  if (!record.author_name || !record.quote) {
    throw new Error("Nome e depoimento são obrigatórios.");
  }

  const supabase = createAdminClient();
  const { error } = id
    ? await supabase.from("testimonials").update(record).eq("id", id)
    : await supabase.from("testimonials").insert(record);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
  redirect("/admin/depoimentos");
}

export async function deleteTestimonial(id: string) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}
