/* ================================
   TIPAGENS ESTRATÉGICAS
================================ */

export type KPIStatus = "healthy" | "warning" | "critical";

export type KPITrend = "up" | "down" | "stable";

export type KPIDomain =
  | "financeiro"
  | "eficiencia"
  | "qualidade"
  | "automacao"
  | "risco"
  | "sales";

export type ChannelType =
  | "chat"
  | "voice"
  | "whatsapp"
  | "video"
  | "email"
  | "multichannel";

export type KPICompositeConfig = {
  id: string;
  title: string;
  description: string;

  /** Valor principal exibido no card */
  valueFormatter: (data: any) => string;

  /** Variação percentual ou absoluta */
  deltaFormatter?: (data: any) => string;

  /** Status calculado com base em thresholds */
  statusEvaluator: (data: any) => KPIStatus;

  /** Direciona qual modal será aberto */
  modalKey: string;

  /** KPIs base que alimentam este KPI composto */
  sourceKPIs: string[];

  /** Domínio estratégico */
  domain: KPIDomain;

  /** Canais impactados */
  channels?: ChannelType[];

  /** Exclusivo para time de vendas */
  salesExclusive?: boolean;

  /** Usado futuramente para IA / insights */
  insightsEnabled?: boolean;
};

/* ================================
   CONFIGURAÇÃO DOS KPIs COMPOSTOS
================================ */

export const KPI_COMPOSITES: KPICompositeConfig[] = [
  /* ================================
     FINANCEIRO
  ================================ */

  {
    id: "lucratividade_liquida",
    title: "Lucratividade Líquida",
    description:
      "Resultado financeiro consolidado considerando receita, custos e perdas.",
    domain: "financeiro",
    modalKey: "lucratividade",
    sourceKPIs: [
      "receita_total",
      "custo_operacional",
      "perda_financeira",
      "margem"
    ],

    valueFormatter: (data) =>
      `R$ ${(data.receita_total - data.custo_operacional - data.perda_financeira).toLocaleString()}`,

    deltaFormatter: (data) =>
      `${data.variacao_percentual > 0 ? "+" : ""}${data.variacao_percentual}%`,

    statusEvaluator: (data) => {
      if (data.margem < 10) return "critical";
      if (data.margem < 20) return "warning";
      return "healthy";
    },

    insightsEnabled: true
  },

  /* ================================
     EFICIÊNCIA OPERACIONAL
  ================================ */

  {
    id: "eficiencia_sistema",
    title: "Eficiência do Sistema",
    description:
      "Eficiência end-to-end desde o primeiro contato até a conversão e retenção.",
    domain: "eficiencia",
    modalKey: "eficienciaSistema",
    sourceKPIs: [
      "lead_to_contact",
      "contact_to_conversion",
      "conversion_to_retention",
      "recontact_rate",
      "fcr"
    ],

    valueFormatter: (data) => `${data.system_efficiency}%`,

    deltaFormatter: (data) =>
      `${data.delta >= 0 ? "+" : ""}${data.delta}%`,

    statusEvaluator: (data) => {
      if (data.system_efficiency < 60) return "critical";
      if (data.system_efficiency < 75) return "warning";
      return "healthy";
    },

    insightsEnabled: true
  },

  /* ================================
     QUALIDADE OPERACIONAL
  ================================ */

  {
    id: "qualidade_operacional",
    title: "Qualidade da Operação",
    description:
      "Qualidade percebida pelo cliente e consistência da entrega.",
    domain: "qualidade",
    modalKey: "qualidade",
    sourceKPIs: [
      "csat",
      "nps",
      "sentiment_score",
      "sla",
      "abandonment_rate"
    ],

    valueFormatter: (data) => `${data.quality_index}%`,

    deltaFormatter: (data) =>
      `${data.delta >= 0 ? "+" : ""}${data.delta}%`,

    statusEvaluator: (data) => {
      if (data.quality_index < 70) return "critical";
      if (data.quality_index < 85) return "warning";
      return "healthy";
    },

    insightsEnabled: true
  },

  /* ================================
     AUTOMAÇÃO
  ================================ */

  {
    id: "efetividade_automacao",
    title: "Efetividade das Automações",
    description:
      "Capacidade das automações em resolver demandas sem intervenção humana.",
    domain: "automacao",
    modalKey: "automacao",
    sourceKPIs: [
      "automation_rate",
      "automation_resolution_rate",
      "fallback_rate",
      "cost_saving"
    ],

    valueFormatter: (data) => `${data.automation_effectiveness}%`,

    deltaFormatter: (data) =>
      `${data.delta >= 0 ? "+" : ""}${data.delta}%`,

    statusEvaluator: (data) => {
      if (data.automation_effectiveness < 40) return "critical";
      if (data.automation_effectiveness < 60) return "warning";
      return "healthy";
    },

    insightsEnabled: true
  },

  /* ================================
     RISCO
  ================================ */

  {
    id: "risco_operacional",
    title: "Risco Operacional",
    description:
      "Probabilidade de impacto negativo na operação e nos resultados.",
    domain: "risco",
    modalKey: "risco",
    sourceKPIs: [
      "sla_breach_rate",
      "escalation_rate",
      "absenteeism_rate",
      "system_instability"
    ],

    valueFormatter: (data) => data.risk_level_label,

    statusEvaluator: (data) => {
      if (data.risk_score > 70) return "critical";
      if (data.risk_score > 40) return "warning";
      return "healthy";
    },

    insightsEnabled: true
  },

  /* ================================
     SALES – EXCLUSIVO VENDAS
  ================================ */

  {
    id: "sales_conversion_rate",
    title: "Taxa de Conversão Comercial",
    description:
      "Conversão efetiva de interações comerciais em vendas.",
    domain: "sales",
    modalKey: "conversionAnalysis",
    sourceKPIs: [
      "leads_qualificados",
      "oportunidades",
      "vendas_fechadas"
    ],
    channels: ["chat", "voice", "whatsapp", "video"],
    salesExclusive: true,

    valueFormatter: (data) => `${data.conversion_rate}%`,

    deltaFormatter: (data) =>
      `${data.delta >= 0 ? "+" : ""}${data.delta}%`,

    statusEvaluator: (data) => {
      if (data.conversion_rate < 15) return "critical";
      if (data.conversion_rate < 25) return "warning";
      return "healthy";
    },

    insightsEnabled: true
  },

  {
    id: "sales_cycle_time",
    title: "Tempo Médio de Fechamento",
    description:
      "Velocidade do ciclo comercial do primeiro contato ao fechamento.",
    domain: "sales",
    modalKey: "salesCycleTime",
    sourceKPIs: [
      "first_contact_time",
      "followup_time",
      "close_time"
    ],
    channels: ["multichannel"],
    salesExclusive: true,

    valueFormatter: (data) => `${data.avg_days_to_close} dias`,

    deltaFormatter: (data) =>
      `${data.delta >= 0 ? "-" : "+"}${Math.abs(data.delta)} dias`,

    statusEvaluator: (data) => {
      if (data.avg_days_to_close > 10) return "critical";
      if (data.avg_days_to_close > 6) return "warning";
      return "healthy";
    },

    insightsEnabled: true
  }
];

/* ================================
   HELPERS
================================ */

export const getKPIsByDomain = (domain: KPIDomain) =>
  KPI_COMPOSITES.filter((kpi) => kpi.domain === domain);

export const getSalesKPIs = () =>
  KPI_COMPOSITES.filter((kpi) => kpi.salesExclusive);

export const getKPIsByChannel = (channel: ChannelType) =>
  KPI_COMPOSITES.filter((kpi) =>
    kpi.channels?.includes(channel)
  );
