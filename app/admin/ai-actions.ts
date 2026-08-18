"use server";

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { generatePropertyDescription, type PropertyContext } from "@/lib/generate-description";

// Retorna um objeto tipado em vez de deixar o erro subir — Server Actions
// no Next escondem a mensagem real de erro em produção por segurança
// (vira "An error occurred"), e aqui a mensagem específica (chave não
// configurada, notas vazias) é exatamente o que a pessoa precisa ver.
export async function generateDescriptionAction(
  notes: string,
  context: PropertyContext,
): Promise<{ text: string } | { error: string }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  try {
    const text = await generatePropertyDescription(notes, context);
    return { text };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao gerar descrição." };
  }
}
