import type { LeadStage } from "@/generated/prisma/enums";

export const LEAD_STAGE_ORDER: LeadStage[] = [
  "NOVO_LEAD",
  "PRE_QUALIFICACAO",
  "PRIMEIRO_CONTATO",
  "REUNIAO_AGENDADA",
  "DIAGNOSTICO",
  "PROPOSTA",
  "APRESENTACAO",
  "FOLLOW_UP",
  "NEGOCIACAO",
  "FECHADO_GANHO",
];

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  NOVO_LEAD: "1. Novo lead",
  PRE_QUALIFICACAO: "2. Pré-qualificação",
  PRIMEIRO_CONTATO: "3. Primeiro contato",
  REUNIAO_AGENDADA: "4. Reunião agendada",
  DIAGNOSTICO: "5. Diagnóstico",
  PROPOSTA: "6. Proposta",
  APRESENTACAO: "7. Apresentação",
  FOLLOW_UP: "8. Follow-up",
  NEGOCIACAO: "9. Negociação",
  FECHADO_GANHO: "✅ Fechado ganho",
  PERDIDO: "❌ Perdido",
};

export function nextStage(stage: LeadStage): LeadStage | null {
  const idx = LEAD_STAGE_ORDER.indexOf(stage);
  if (idx === -1 || idx === LEAD_STAGE_ORDER.length - 1) return null;
  return LEAD_STAGE_ORDER[idx + 1];
}
