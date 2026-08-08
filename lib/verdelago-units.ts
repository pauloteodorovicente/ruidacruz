// Fonte: "Lista Unidades Disponíveis Verdelago_Fases_4_5_6_07.2026_RCxlsx.xlsx"
// no Drive do Paulo. Atualizar aqui quando o Rui mandar uma lista nova —
// não existe ainda um mecanismo automático de sincronia com o REMAX/planilha.
export type VerdelagoUnit = {
  lote: string;
  fracao: string;
  tipologia: string;
  valor: number | null; // null = "TBC", valor ainda não confirmado
};

export type VerdelagoPhase = {
  label: string;
  units: VerdelagoUnit[];
};

export const verdelagoPhases: VerdelagoPhase[] = [
  {
    label: "Fase 4",
    units: [
      { lote: "33", fracao: "0A", tipologia: "T2A", valor: 1150000 },
      { lote: "33", fracao: "0B", tipologia: "T2B", valor: 1150000 },
      { lote: "33", fracao: "0F", tipologia: "T2D", valor: 1050000 },
      { lote: "33", fracao: "0G", tipologia: "T2C", valor: 1050000 },
      { lote: "33", fracao: "0J", tipologia: "T2D", valor: 1050000 },
      { lote: "33", fracao: "0K", tipologia: "T2C", valor: 1050000 },
      { lote: "33", fracao: "0N", tipologia: "T2B", valor: 1075000 },
      { lote: "33", fracao: "0O", tipologia: "T2A", valor: 1050000 },
      { lote: "33", fracao: "0S", tipologia: "T2D", valor: 990000 },
      { lote: "33", fracao: "0T", tipologia: "T2C", valor: 990000 },
      { lote: "33", fracao: "1D", tipologia: "T2B", valor: 1125000 },
      { lote: "33", fracao: "1P", tipologia: "T2B", valor: 1100000 },
    ],
  },
  {
    label: "Fase 5",
    units: [
      { lote: "34", fracao: "0B", tipologia: "T2B", valor: 940000 },
      { lote: "46", fracao: "0A", tipologia: "T2A", valor: 900000 },
      { lote: "46", fracao: "0B", tipologia: "T2B", valor: 900000 },
      { lote: "46", fracao: "0F", tipologia: "T2B", valor: 900000 },
      { lote: "46", fracao: "1D", tipologia: "T2B", valor: 880000 },
      { lote: "46", fracao: "2J", tipologia: "T3B", valor: 1950000 },
      { lote: "44", fracao: "0A", tipologia: "T2A", valor: 1150000 },
      { lote: "44", fracao: "0B", tipologia: "T2B", valor: 1150000 },
      { lote: "44", fracao: "0F", tipologia: "T2B", valor: 950000 },
      { lote: "44", fracao: "0G", tipologia: "T2A", valor: 950000 },
      { lote: "44", fracao: "0K", tipologia: "T2B", valor: 950000 },
      { lote: "44", fracao: "0L", tipologia: "T2A", valor: 950000 },
      { lote: "44", fracao: "1C", tipologia: "T2A", valor: 1135000 },
      { lote: "44", fracao: "1D", tipologia: "T2B", valor: 1135000 },
      { lote: "44", fracao: "1H", tipologia: "T2B", valor: 880000 },
      { lote: "44", fracao: "1M", tipologia: "T2B", valor: 935000 },
      { lote: "44", fracao: "1N", tipologia: "T2A", valor: 935000 },
      { lote: "45", fracao: "0A", tipologia: "T2A", valor: 1270000 },
      { lote: "45", fracao: "0B", tipologia: "T2B", valor: 1270000 },
      { lote: "45", fracao: "0F", tipologia: "T2B", valor: 1250000 },
      { lote: "45", fracao: "1D", tipologia: "T2B", valor: 1130000 },
      { lote: "45", fracao: "1H", tipologia: "T2B", valor: 1270000 },
    ],
  },
  {
    label: "Fase 6",
    units: [
      { lote: "48", fracao: "0A", tipologia: "T2A", valor: null },
      { lote: "48", fracao: "0B", tipologia: "T2B", valor: null },
      { lote: "48", fracao: "0F", tipologia: "T2B", valor: null },
      { lote: "48", fracao: "0G", tipologia: "T2A", valor: null },
      { lote: "48", fracao: "1C", tipologia: "T2A", valor: null },
      { lote: "48", fracao: "1D", tipologia: "T2B", valor: null },
      { lote: "48", fracao: "1H", tipologia: "T2B", valor: null },
      { lote: "48", fracao: "1I", tipologia: "T2A", valor: null },
      { lote: "48", fracao: "2E", tipologia: "T3B", valor: null },
      { lote: "48", fracao: "2J", tipologia: "T3B", valor: null },
      { lote: "13", fracao: "0A", tipologia: "T2A", valor: null },
      { lote: "13", fracao: "0B", tipologia: "T2B", valor: null },
      { lote: "13", fracao: "0F", tipologia: "T2B", valor: null },
      { lote: "13", fracao: "0G", tipologia: "T2A", valor: null },
      { lote: "13", fracao: "0K", tipologia: "T2B", valor: null },
      { lote: "13", fracao: "0L", tipologia: "T2A", valor: null },
      { lote: "13", fracao: "1C", tipologia: "T2A", valor: null },
      { lote: "13", fracao: "1D", tipologia: "T2B", valor: null },
      { lote: "13", fracao: "1H", tipologia: "T2B", valor: null },
      { lote: "13", fracao: "1I", tipologia: "T2A", valor: null },
      { lote: "13", fracao: "1M", tipologia: "T2B", valor: null },
      { lote: "13", fracao: "1N", tipologia: "T2A", valor: null },
      { lote: "13", fracao: "2E", tipologia: "T3B", valor: null },
      { lote: "13", fracao: "2J", tipologia: "T3B", valor: null },
      { lote: "13", fracao: "2O", tipologia: "T3B", valor: null },
    ],
  },
];
