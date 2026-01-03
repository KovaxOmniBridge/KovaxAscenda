import { ObjectiveType } from "./objetivos";
import { QUALITY_KPIS } from "./KPIs";

/* ================================
   TIPAGENS DE CANAL
================================ */

export type ChannelStatus = "online" | "degraded" | "offline";
export type RiskLevel = "low" | "medium" | "high";
export type ChannelMedium = "voice" | "video" | "chat";

export type ChannelInstance<T extends ObjectiveType = ObjectiveType> = {
  id: string;
  name: string;
  medium: ChannelMedium;
  objective: T;
  status: ChannelStatus;
  riskLevel: RiskLevel;
  metrics: Partial<Record<keyof typeof QUALITY_KPIS, number | string>>;
};

/* ================================
   FUNÇÃO AUXILIAR PARA CRIAR METRICS
================================ */

const createMetrics = (
  specificMetrics: Partial<Record<keyof typeof QUALITY_KPIS, number | string>>
): Partial<Record<keyof typeof QUALITY_KPIS, number | string>> => {
  return specificMetrics;
};

/* ================================
   CANAIS MOCK (QUALIDADE)
================================ */

export const CHANNELS: ChannelInstance[] = [
  {
    id: "chat_aquisicao",
    name: "Chat Aquisição",
    medium: "chat",
    objective: "aquisicao",
    status: "online",
    riskLevel: "medium",
    metrics: createMetrics({
      csat: 91,
      nps: 64,
      sentimentScore: 68,
      availability: 99.6,
      dropRate: 0.5,
      latencyMs: 120,
      automationRate: 23,
      riskScore: 18
    })
  },

  {
    id: "chat_vendas",
    name: "Chat Vendas",
    medium: "chat",
    objective: "vendas",
    status: "online",
    riskLevel: "medium",
    metrics: createMetrics({
      csat: 89,
      nps: 68,
      sentimentScore: 71,
      availability: 99.4,
      dropRate: 0.3,
      latencyMs: 140,
      automationRate: 28,
      riskScore: 22
    })
  },

  {
    id: "chat_onboarding",
    name: "Chat Onboarding",
    medium: "chat",
    objective: "onboarding",
    status: "online",
    riskLevel: "low",
    metrics: createMetrics({
      csat: 93,
      nps: 72,
      sentimentScore: 75,
      availability: 99.8,
      dropRate: 0.2,
      latencyMs: 100,
      automationRate: 41,
      riskScore: 15,
      fcrRate: 88,
      recontactRate: 9
    })
  },

  {
    id: "chat_suporte",
    name: "Chat Suporte",
    medium: "chat",
    objective: "suporte",
    status: "online",
    riskLevel: "low",
    metrics: createMetrics({
      csat: 92,
      nps: 65,
      sentimentScore: 70,
      availability: 99.7,
      dropRate: 0.4,
      latencyMs: 130,
      automationRate: 36,
      riskScore: 20,
      fcrRate: 85,
      escalationRate: 6
    })
  },

  {
    id: "chat_compliance",
    name: "Chat Compliance",
    medium: "chat",
    objective: "compliance",
    status: "online",
    riskLevel: "low",
    metrics: createMetrics({
      csat: 95,
      nps: 75,
      sentimentScore: 80,
      availability: 99.9,
      dropRate: 0.4,
      latencyMs: 100,
      riskScore: 12,
      complianceScore: 99,
      auditFindings: 0
    })
  },

  {
    id: "voz_relacionamento",
    name: "Voz Relacionamento",
    medium: "voice",
    objective: "relacionamento",
    status: "online",
    riskLevel: "low",
    metrics: createMetrics({
      csat: 91,
      availability: 99.5,
      fcrRate: 87,
      recontactRate: 11
    })
  },

  {
    id: "voz_retencao",
    name: "Voz Retenção",
    medium: "voice",
    objective: "retencao",
    status: "online",
    riskLevel: "medium",
    metrics: createMetrics({
      csat: 88,
      availability: 99.1,
      fcrRate: 74,
      recontactRate: 19
    })
  },

  {
    id: "voz_cobranca",
    name: "Voz Cobrança",
    medium: "voice",
    objective: "cobranca",
    status: "degraded",
    riskLevel: "high",
    metrics: createMetrics({
      availability: 96.8,
      dropRate: 3.4,
      fcrRate: 61,
      riskScore: 35
    })
  },

  {
    id: "video_informacao",
    name: "Vídeo Informação",
    medium: "video",
    objective: "informacao",
    status: "online",
    riskLevel: "low",
    metrics: createMetrics({
      availability: 99.3,
      latencyMs: 320,
      riskScore: 10
    })
  }
];
