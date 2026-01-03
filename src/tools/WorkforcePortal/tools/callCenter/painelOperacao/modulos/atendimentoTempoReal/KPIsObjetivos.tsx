import { ObjectiveType } from "./objetivos";

/* ================================
   KPIs POR OBJETIVO DE NEGÓCIO
   Somente KPIs específicas do objetivo
================================ */
export const OBJECTIVE_KPIS: Record<ObjectiveType, string[]> = {
  aquisicao: ["conversionRate", "firstResponseTime", "abandonmentRate", "sla"],
  vendas: [
    "conversionRate",
    "revenuePerContact",
    "ticketMedio",
    "callsPerConversion",
    "conversionProbability",
    "firstResponseTime",
    "sla"
  ],
  onboarding: ["firstResponseTime", "fcr", "recontactRate", "sla"],
  entrega: ["avgHandleTime", "sla", "escalationRate"],
  suporte: [
    "queueSize",
    "firstResponseTime",
    "fcr",
    "recontactRate",
    "abandonmentRate",
    "escalationRate",
    "sla"
  ],
  relacionamento: ["fcr", "recontactRate", "avgHandleTime"],
  retencao: ["fcr", "recontactRate", "abandonmentRate", "sla"],
  cobranca: ["queueSize", "holdTime", "abandonmentRate", "fcr", "sla"],
  expansao: ["conversionRate", "revenuePerContact", "ticketMedio"],
  informacao: ["firstResponseTime", "sla"],
  compliance: ["escalationRate", "sla"],
  inteligencia: [
    "conversionRate",
    "recontactRate",
    "aiDecisionAccuracy",
    "demandForecastAccuracy",
    "learningVelocity",
    "humanVsAiEfficiency"
  ]
};
