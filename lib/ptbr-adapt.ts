// Português de Portugal -> português do Brasil, automático e sem dependências.
//
// O site é escrito primeiro em pt-PT. A versão pt-BR passa por este adaptador sempre que o texto é carregado
// (mensagens, páginas de campanha, tradução de imóveis), então um texto novo em pt-PT nunca aparece "europeu" para
// quem escolhe pt-BR. As regras só mexem em padrões que existem apenas em Portugal; texto já brasileiro passa
// sem alteração (a função é idempotente).

const LETTERS = "\\p{L}\\p{N}_";
const START = "(?<![" + LETTERS + "])";
const END = "(?![" + LETTERS + "])";
const escapeRe = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Mantém a capitalização do original: "Morada" -> "Endereço", "MORADA" -> "ENDEREÇO".
function matchCase(source: string, replacement: string): string {
  if (source.length > 1 && source === source.toUpperCase() && source !== source.toLowerCase()) return replacement.toUpperCase();
  if (source[0] !== source[0].toLowerCase()) return replacement[0].toUpperCase() + replacement.slice(1);
  return replacement;
}

// Palavras que mudam de gênero ao passar para o Brasil: o artigo (e, quando há, o adjetivo) acompanha.
// toF = masculino em Portugal -> feminino no Brasil; toM = o contrário.
const M_TO_F: Record<string, string> = {
  o: "a", um: "uma", do: "da", dum: "duma", no: "na", ao: "à", pelo: "pela", este: "esta", esse: "essa",
  aquele: "aquela", meu: "minha", teu: "tua", seu: "sua", nosso: "nossa", vosso: "vossa", outro: "outra", novo: "nova",
  os: "as", dos: "das", nos: "nas", pelos: "pelas", uns: "umas", estes: "estas", esses: "essas", aqueles: "aquelas", meus: "minhas", teus: "tuas", seus: "suas", nossos: "nossas", outros: "outras", novos: "novas",
};
const F_TO_M: Record<string, string> = Object.fromEntries(Object.entries(M_TO_F).filter(([m]) => m !== "ao").map(([m, f]) => [f, m]));
const ADJ_TO_F: Record<string, string> = {
  próprio: "própria", próprios: "próprias", reservado: "reservada", coberto: "coberta", privativo: "privativa",
  exclusivo: "exclusiva", incluído: "incluída", fechado: "fechada",
};
const ADJ_TO_M: Record<string, string> = { completa: "completo", equipada: "equipado", privativa: "privativo", própria: "próprio", exclusiva: "exclusivo", nova: "novo", renovada: "renovado", moderna: "moderno" };
const FLIP_TERMS: { from: string; to: string; dir: "toF" | "toM" }[] = [
  { from: "lugares de estacionamento", to: "vagas de garagem", dir: "toF" },
  { from: "lugar de estacionamento", to: "vaga de garagem", dir: "toF" },
  { from: "ecrãs", to: "telas", dir: "toF" },
  { from: "ecrã", to: "tela", dir: "toF" },
  { from: "frigoríficos", to: "geladeiras", dir: "toF" },
  { from: "frigorífico", to: "geladeira", dir: "toF" },
  { from: "ligações", to: "links", dir: "toM" },
  { from: "ligação", to: "link", dir: "toM" },
  { from: "moradas", to: "endereços", dir: "toM" },
  { from: "morada", to: "endereço", dir: "toM" },
  { from: "casas de banho", to: "banheiros", dir: "toM" },
  { from: "casa de banho", to: "banheiro", dir: "toM" },
];
const FLIP_RULES = FLIP_TERMS.map(({ from, to, dir }) => {
  const dets = Object.keys(dir === "toF" ? M_TO_F : F_TO_M).join("|");
  const adjs = Object.keys(dir === "toF" ? ADJ_TO_F : ADJ_TO_M).join("|");
  return {
    re: new RegExp(
      "(?:" + START + "(" + dets + ")\\s+)?" + START + "(" + escapeRe(from) + ")" + END + "(?:\\s+(" + adjs + ")" + END + ")?",
      "giu",
    ),
    to,
    dir,
  };
});

// Frases e palavras só de Portugal. Frases primeiro, para vencerem as palavras soltas.
const TERMS: [string, string][] = [
  ["arrendamento de férias", "aluguel por temporada"],
  ["rés-do-chão", "térreo"],
  ["pequeno-almoço", "café da manhã"],
  ["sítio web", "site"],
  ["fale connosco", "fale conosco"],
  ["connosco", "conosco"],
  ["desporto", "esporte"],
  ["arrendamento", "aluguel"],
  ["arrendar", "alugar"],
  ["arrendado", "alugado"],
  ["arrendada", "alugada"],
  ["arrendatário", "locatário"],
  ["telemóvel", "celular"],
  ["telemóveis", "celulares"],
  ["ficheiro", "arquivo"],
  ["ficheiros", "arquivos"],
  ["utilizador", "usuário"],
  ["utilizadores", "usuários"],
  ["equipa", "equipe"],
  ["equipas", "equipes"],
  ["registo", "registro"],
  ["registos", "registros"],
  ["contacto", "contato"],
  ["contactos", "contatos"],
  ["contactar", "contatar"],
  ["descarregar", "baixar"],
  ["partilhar", "compartilhar"],
  ["autocarro", "ônibus"],
  ["comboio", "trem"],
  ["facto", "fato"],
  ["recolhemos", "coletamos"],
  ["recolhidos", "coletados"],
  ["recolhidas", "coletadas"],
  ["recolhido", "coletado"],
  ["recolha", "coleta"],
  ["registados", "registrados"],
  ["registadas", "registradas"],
  ["registado", "registrado"],
  ["registada", "registrada"],
  ["respetivas", "respectivas"],
  ["respetivos", "respectivos"],
  ["respetiva", "respectiva"],
  ["respetivo", "respectivo"],
  ["aceder", "acessar"],
  ["descargas", "downloads"],
  ["alojados", "hospedados"],
  ["alojado", "hospedado"],
  ["alojamento", "hospedagem"],
  ["subscrição", "inscrição"],
];
const TERM_RULES = TERMS.map(([from, to]) => ({
  re: new RegExp(START + escapeRe(from) + END, "giu"),
  to,
}));

// Infinitivos curtos ou irregulares que o padrão geral não cobre.
const IRREGULAR_GERUND: Record<string, string> = { dar: "dando", ser: "sendo", ver: "vendo", ter: "tendo", vir: "vindo", ir: "indo", pôr: "pondo", ler: "lendo" };
const ESTAR = "est[áa]|estou|estamos|est[ãa]o|estava|estavam|estiver|continua|continuam|ficam";

export function toPtBr(text: string): string {
  if (!text) return text;
  let out = text;

  // 1) palavras que mudam de gênero (o artigo e o adjetivo acompanham)
  for (const { re, to, dir } of FLIP_RULES) {
    out = out.replace(re, (m: string, det: string | undefined, core: string, adj: string | undefined) => {
      const map = dir === "toF" ? M_TO_F : F_TO_M;
      const newDet = det ? matchCase(det, map[det.toLowerCase()] ?? det) + " " : "";
      const adjMap = dir === "toF" ? ADJ_TO_F : ADJ_TO_M;
      const newAdj = adj ? " " + matchCase(adj, adjMap[adj.toLowerCase()] ?? adj) : "";
      return newDet + matchCase(core, to) + newAdj;
    });
  }

  // 2) vocabulário de Portugal
  for (const { re, to } of TERM_RULES) out = out.replace(re, (m: string) => matchCase(m, to));

  // 3) "Ajudamo-lo a apresentar" -> "Ajudamos você a apresentar"; "Fale-nos" -> "Fale conosco"
  out = out.replace(new RegExp(START + "([\\p{L}]+)mo-(?:lo|la)" + END, "giu"), (m: string, stem: string) => stem + "mos você");
  out = out.replace(new RegExp(START + "(fale|ligue|escreva)-nos" + END, "giu"), (m: string, v: string) => matchCase(m, v.toLowerCase() + " conosco"));
  out = out.replace(new RegExp(START + "(contacte|contacta)-nos" + END, "giu"), (m: string) => matchCase(m, "entre em contato conosco"));

  // Verbo no infinitivo + "nos": "Pode contatar-nos" -> "Pode nos contatar"
  out = out.replace(new RegExp(START + "([\\p{L}]+(?:ar|er|ir|or))-nos" + END, "giu"), (m: string, inf: string) => "nos " + inf);
  // "partilhamos" -> "compartilhamos"; grafias de Portugal
  out = out.replace(new RegExp(START + "(partilh)(ar|a|am|amos|ado|ados|ada|adas|e|em|o)" + END, "giu"), (m: string, st: string, end: string) => matchCase(m, "compartilh" + end.toLowerCase()));
  out = out.replace(/([Ee])conómic/gu, "$1conômic").replace(/([Cc])arácter/gu, "$1aráter").replace(/([Ee])le?c?trónic/gu, "$1letrônic");

  // 4) "está a pensar" -> "está pensando" (infinitivo regular com 3+ letras antes da terminação, ou irregular conhecido)
  out = out.replace(new RegExp(START + "(" + ESTAR + ")\\s+a\\s+([\\p{L}]+)" + END, "giu"), (m: string, verb: string, inf: string) => {
    const lower = inf.toLowerCase();
    let gerund: string | undefined = IRREGULAR_GERUND[lower];
    if (!gerund && /^\p{L}{3,}(ar|er|ir|or)$/u.test(lower)) gerund = lower.slice(0, -1) + "ndo";
    if (!gerund) return m;
    return verb + " " + matchCase(inf, gerund);
  });
  // "pensando vender" -> "pensando em vender"
  out = out.replace(
    new RegExp(START + "(pensando)\\s+(vender|comprar|investir|mudar|alugar|ficar|arrendar)" + END, "giu"),
    (m: string, p: string, v: string) => p + " em " + v,
  );
  // Vocativo: "Senhor proprietário Está" -> "Senhor proprietário, Está"
  out = out.replace(new RegExp("(" + START + "[Ss]enhor(?:a)? propriet[áa]ri[oa]) (?=[Ee]st[áa]" + END + ")", "gu"), "$1, ");

  return out;
}

// Aplica toPtBr em todas as folhas de texto de um objeto/array (sem mexer em chaves nem em números).
export function adaptPtBrDeep<T>(value: T): T {
  if (typeof value === "string") return toPtBr(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => adaptPtBrDeep(v)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = adaptPtBrDeep(v);
    return out as T;
  }
  return value;
}

// Versão que altera o objeto original (usada nos arquivos de conteúdo das páginas de campanha).
export function adaptPtBrInPlace(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      if (typeof v === "string") value[i] = toPtBr(v);
      else adaptPtBrInPlace(v);
    });
  } else if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === "string") obj[k] = toPtBr(obj[k] as string);
      else adaptPtBrInPlace(obj[k]);
    }
  }
}
