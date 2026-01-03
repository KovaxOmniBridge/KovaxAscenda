/* ================================ 
   TIPOS BASE 
================================ */
export type KPIValue = string | number;

export type KPI = {
  key: string;
  label: string;
  description?: string;
  format?: (value: KPIValue) => string;
  requiresPermission?: string;
};

/* ================================ 
   KPIs DE QUALIDADE (UNIFICADOS)
================================ */
export const QUALITY_KPIS: Record<string, KPI> = {
  /* ================= Experiência do Cliente ================= */
  csat: {
    key: "csat",
    label: "CSAT",
    description: "Satisfação do cliente",
    format: v => `${v}%`
  },

  nps: {
    key: "nps",
    label: "NPS",
    description: "Net Promoter Score"
  },

  customerEffortScore: {
    key: "customerEffortScore",
    label: "CES",
    description: "Esforço do cliente para resolver a demanda",
    format: v => `${v}/5`
  },

  sentimentScore: {
    key: "sentimentScore",
    label: "Sentimento",
    description: "Análise de sentimento do cliente"
  },

  /* ================= Qualidade da Resolução ================= */
  fcrRate: {
    key: "fcrRate",
    label: "FCR",
    description: "Resolução no primeiro contato",
    format: v => `${v}%`
  },

  recontactRate: {
    key: "recontactRate",
    label: "Recontato",
    description: "Clientes que retornam pelo mesmo motivo",
    format: v => `${v}%`
  },

  escalationRate: {
    key: "escalationRate",
    label: "Escalonamento",
    description: "Casos que exigem níveis superiores",
    format: v => `${v}%`
  },

  complaintRate: {
    key: "complaintRate",
    label: "Reclamações",
    description: "Incidência de reclamações formais",
    format: v => `${v}%`
  },

  /* ================= Conformidade ================= */
  complianceScore: {
    key: "complianceScore",
    label: "Compliance",
    description: "Aderência a scripts, políticas e normas",
    format: v => `${v}%`
  },

  auditFindings: {
    key: "auditFindings",
    label: "Achados de Auditoria",
    description: "Incidentes ou não conformidades detectadas"
  },

  /* ================= Estabilidade & Tecnologia ================= */
  availability: {
    key: "availability",
    label: "Disponibilidade",
    description: "Uptime dos sistemas de atendimento",
    format: v => `${v}%`
  },

  dropRate: {
    key: "dropRate",
    label: "Quedas",
    description: "Falhas técnicas percebidas pelo cliente",
    format: v => `${v}%`
  },

  latencyMs: {
    key: "latencyMs",
    label: "Latência",
    description: "Tempo de resposta técnico",
    format: v => `${v}ms`
  },

  /* ================= Automação & IA (Qualidade) ================= */
  automationRate: {
    key: "automationRate",
    label: "Automação com Sucesso",
    description: "Resoluções automáticas sem recontato",
    format: v => `${v}%`
  },

  aiDecisionAccuracy: {
    key: "aiDecisionAccuracy",
    label: "Acurácia da IA",
    description: "Precisão das decisões automatizadas",
    format: v => `${v}%`
  },

  /* ================= Risco Operacional ================= */
  riskScore: {
    key: "riskScore",
    label: "Risco Operacional",
    description: "Probabilidade de impacto negativo na experiência"
  }
};
