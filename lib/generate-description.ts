import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export type PropertyContext = {
  title: string;
  propertyType: string;
  zone: string | null;
  municipality: string | null;
  typology: string | null;
  constructionAreaSqm: number | null;
  landAreaSqm: number | null;
};

// Tom calibrado a partir das descrições reais já publicadas: factual,
// terceira pessoa, números concretos primeiro, zero adjetivo de efeito
// ("deslumbrante", "único", "oportunidade imperdível") — a doutrina de
// "quiet luxury" do site é deixar os fatos falarem, nunca vender com hype.
const SYSTEM_PROMPT = `Você escreve descrições de imóveis para o site da Rui Da Cruz Consultoria Imobiliária, RE/MAX Collection, Portugal.

Regras de tom, sem exceção:
- Terceira pessoa, factual, direto — como um relatório bem escrito, não um anúncio.
- Comece pelo essencial: tipo de imóvel, tipologia, área, localização.
- Cite números concretos (m², nº de divisões, distância) sempre que existirem nas notas.
- NUNCA use adjetivos de venda ("deslumbrante", "único", "imperdível", "sonho", "espetacular", "luxuoso").
- NUNCA invente informação que não esteja nas notas fornecidas — se uma nota não mencionar algo, não mencione.
- 2 a 4 frases, um parágrafo só, em português de Portugal.

Exemplos reais já publicados, pro calibre exato de tom:

"Quinta na península de Palmela, na Lagoa do Calvo (Poceirão e Marateca), com casa principal T2 (265 m² de área bruta, 156 m² úteis) e anexos. Terreno de 69.750 m² com cerca de 6.000 árvores de fruto e pinhal, vistas para o Castelo de Palmela e a Serra da Arrábida. Potencial para turismo rural ou exploração agrícola."

"Terreno urbano de 7.100 m² na Carrasqueira, freguesia de Malveira e São Miguel de Alcainça (Mafra), com viabilidade construtiva sujeita a confirmação camarária. Inclui uma ruína existente, acesso direto por via pública e infraestruturas de água e eletricidade nas proximidades. Zona residencial tranquila, a poucos minutos do centro da Malveira."

Responda só com o parágrafo final, sem títulos, sem aspas, sem comentário.`;

export async function generatePropertyDescription(notes: string, context: PropertyContext): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY não configurada");
  if (!notes.trim()) throw new Error("Escreva algumas notas soltas primeiro.");

  const client = new Anthropic({ apiKey });

  const facts = [
    `Título: ${context.title}`,
    `Tipo: ${context.propertyType}`,
    context.typology ? `Tipologia: ${context.typology}` : null,
    context.zone ? `Zona: ${context.zone}` : null,
    context.municipality ? `Concelho: ${context.municipality}` : null,
    context.constructionAreaSqm ? `Área de construção: ${context.constructionAreaSqm} m²` : null,
    context.landAreaSqm ? `Área do terreno: ${context.landAreaSqm} m²` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Dados do imóvel:\n${facts}\n\nNotas soltas do consultor:\n${notes}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("Resposta da IA sem texto.");
  return textBlock.text.trim();
}
