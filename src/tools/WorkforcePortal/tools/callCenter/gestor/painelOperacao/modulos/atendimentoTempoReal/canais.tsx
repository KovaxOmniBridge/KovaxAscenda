import { ObjectiveType } from "./objetivos";
import { UNIVERSAL_KPIS } from "./KPIs";

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
  metrics: Partial<Record<keyof typeof UNIVERSAL_KPIS | string, number | string>>;
};

/* ================================
   FUNÇÃO AUXILIAR PARA CRIAR METRICS
================================ */

const createMetrics = (
  specificMetrics: Record<string, number | string>
): Record<string, number | string> => {
  // Inicializa todos os KPIs universais com valor padrão 0
  const universalMetrics: Record<string, number> = Object.keys(UNIVERSAL_KPIS).reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {}
  );

  // Merge: KPIs universais + KPIs específicas do canal
  return { ...universalMetrics, ...specificMetrics };
};

/* ================================
   CANAIS MOCK
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
      activeAgents: 12,
      occupancyRate: 85,
      utilizationRate: 78,
      absenteeismRate: 4,
      inputRate: 34,
      outputRate: 31,
      avgWaitTime: 15,
      avgHandleTime: 210,
      csat: 91,
      nps: 64,
      sentimentScore: 68,
      availability: 99.6,
      dropRate: 0.5,
      latencyMs: 120,
      automationRate: 23,
      riskScore: 18,
      conversionRate: 12,
      firstResponseTime: 18,
      abandonmentRate: 6,
      sla: 96
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
      activeAgents: 18,
      occupancyRate: 91,
      utilizationRate: 82,
      absenteeismRate: 5,
      inputRate: 42,
      outputRate: 39,
      avgWaitTime: 12,
      avgHandleTime: 380,
      csat: 89,
      nps: 68,
      sentimentScore: 71,
      availability: 99.4,
      dropRate: 0.3,
      latencyMs: 140,
      automationRate: 28,
      riskScore: 22,
      conversionRate: 14,
      revenuePerContact: 38.4,
      ticketMedio: 240,
      callsPerConversion: 3,
      conversionProbability: 55,
      firstResponseTime: 20,
      sla: 95
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
      activeAgents: 8,
      occupancyRate: 79,
      utilizationRate: 70,
      absenteeismRate: 3,
      inputRate: 26,
      outputRate: 25,
      avgWaitTime: 10,
      avgHandleTime: 260,
      csat: 93,
      nps: 72,
      sentimentScore: 75,
      availability: 99.8,
      dropRate: 0.2,
      latencyMs: 100,
      automationRate: 41,
      riskScore: 15,
      firstResponseTime: 22,
      fcr: 88,
      recontactRate: 9,
      sla: 97
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
      activeAgents: 52,
      occupancyRate: 74,
      utilizationRate: 68,
      absenteeismRate: 5,
      inputRate: 40,
      outputRate: 38,
      avgWaitTime: 40,
      avgHandleTime: 250,
      csat: 92,
      nps: 65,
      sentimentScore: 70,
      availability: 99.7,
      dropRate: 0.4,
      latencyMs: 130,
      automationRate: 36,
      riskScore: 20,
      queueSize: 3,
      firstResponseTime: 19,
      fcr: 85,
      abandonmentRate: 4,
      escalationRate: 6,
      sla: 96
    })
  },

  {
    id: "chat_expansao",
    name: "Chat Expansão",
    medium: "chat",
    objective: "expansao",
    status: "online",
    riskLevel: "low",
    metrics: createMetrics({
      activeAgents: 14,
      occupancyRate: 81,
      utilizationRate: 75,
      absenteeismRate: 4,
      inputRate: 19,
      outputRate: 18,
      avgWaitTime: 8,
      avgHandleTime: 290,
      csat: 94,
      nps: 70,
      sentimentScore: 77,
      availability: 99.6,
      dropRate: 0.3,
      latencyMs: 110,
      automationRate: 32,
      riskScore: 17,
      conversionRate: 21,
      revenuePerContact: 44.7,
      ticketMedio: 310
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
      activeAgents: 6,
      occupancyRate: 77,
      utilizationRate: 70,
      absenteeismRate: 2,
      inputRate: 5,
      outputRate: 5,
      avgWaitTime: 3,
      avgHandleTime: 15,
      csat: 95,
      nps: 75,
      sentimentScore: 80,
      availability: 99.9,
      dropRate: 0.4,
      latencyMs: 100,
      automationRate: 25,
      riskScore: 12,
      sla: 99,
      escalationRate: 1
    })
  },

  {
    id: "dash_inteligencia",
    name: "Central de Inteligência",
    medium: "chat",
    objective: "inteligencia",
    status: "online",
    riskLevel: "low",
    metrics: createMetrics({
      activeAgents: 10,
      occupancyRate: 80,
      utilizationRate: 72,
      absenteeismRate: 3,
      inputRate: 48,
      outputRate: 46,
      avgWaitTime: 12,
      avgHandleTime: 180,
      csat: 90,
      nps: 68,
      sentimentScore: 71,
      availability: 99.8,
      dropRate: 0.2,
      latencyMs: 90,
      automationRate: 40,
      riskScore: 15,
      conversionRate: 17,
      recontactRate: 8,
      aiDecisionAccuracy: 85,
      demandForecastAccuracy: 89,
      learningVelocity: 92,
      humanVsAiEfficiency: 88
    })
  },

  /* ==================== VOZ ==================== */

  {
    id: "voz_entrega",
    name: "Voz Entrega",
    medium: "voice",
    objective: "entrega",
    status: "degraded",
    riskLevel: "high",
    metrics: createMetrics({
      activeAgents: 9,
      occupancyRate: 86,
      utilizationRate: 78,
      absenteeismRate: 3,
      avgHandleTime: 410,
      sla: 84,
      availability: 97.2,
      latencyMs: 420,
      escalationRate: 9
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
      activeAgents: 7,
      occupancyRate: 79,
      utilizationRate: 73,
      absenteeismRate: 2,
      inputRate: 21,
      outputRate: 20,
      avgHandleTime: 330,
      fcr: 87,
      recontactRate: 11,
      csat: 91,
      availability: 99.5
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
      activeAgents: 8,
      occupancyRate: 82,
      utilizationRate: 76,
      absenteeismRate: 3,
      fcr: 74,
      recontactRate: 19,
      avgHandleTime: 490,
      abandonmentRate: 8,
      csat: 88,
      availability: 99.1,
      sla: 93
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
      activeAgents: 12,
      occupancyRate: 88,
      utilizationRate: 80,
      absenteeismRate: 4,
      queueSize: 7,
      avgWaitTime: 235,
      avgHandleTime: 520,
      holdTime: 68,
      abandonmentRate: 12,
      dropRate: 3.4,
      fcr: 61,
      sla: 82,
      availability: 96.8
    })
  },

  /* ==================== VÍDEO ==================== */

  {
    id: "video_informacao",
    name: "Vídeo Informação",
    medium: "video",
    objective: "informacao",
    status: "online",
    riskLevel: "low",
    metrics: createMetrics({
      activeAgents: 5,
      occupancyRate: 70,
      utilizationRate: 65,
      absenteeismRate: 2,
      inputRate: 9,
      outputRate: 11,
      firstResponseTime: 14,
      availability: 99.3,
      latencyMs: 320,
      sla: 98
    })
  }
];
