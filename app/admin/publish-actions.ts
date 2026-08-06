"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function togglePropertyPublished(
  propertyId: string,
  reference: string,
  campaignPath: string | null,
  nextPublished: boolean
) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("properties")
    .update({ published: nextPublished })
    .eq("id", propertyId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(campaignPath ?? `/imoveis/${reference}`);
}
