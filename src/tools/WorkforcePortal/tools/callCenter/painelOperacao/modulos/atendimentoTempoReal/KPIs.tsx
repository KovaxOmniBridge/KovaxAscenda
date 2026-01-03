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
   KPIs UNIVERSAIS (Transversais a todos os objetivos) 
================================ */
export const UNIVERSAL_KPIS: Record<string, KPI> = {
  /* ================= Operação & Capacidade ================= */
  activeAgents: { key: "activeAgents", label: "Agentes Ativos", description: "Agentes disponíveis" },
  occupancyRate: { key: "occupancyRate", label: "Ocupação", description: "Tempo produtivo", format: v => `${v}%` },
  utilizationRate: { key: "utilizationRate", label: "Utilização", description: "Capacidade usada", format: v => `${v}%` },
  absenteeismRate: { key: "absenteeismRate", label: "Absenteísmo", description: "Ausência operacional", format: v => `${v}%` },
  scheduleAdherence: { key: "scheduleAdherence", label: "Adesão à Escala", description: "Conformidade com horários programados", format: v => `${v}%` },
  overtimeRate: { key: "overtimeRate", label: "Horas Extras", description: "Percentual de horas extras", format: v => `${v}%` },

  /* ================= Fluxo & Tempo ================= */
  inputRate: { key: "inputRate", label: "Entradas/min", description: "Volume recebido" },
  outputRate: { key: "outputRate", label: "Saídas/min", description: "Volume resolvido" },
  avgWaitTime: { key: "avgWaitTime", label: "Espera Média", description: "Tempo médio de espera" },
  avgHandleTime: { key: "avgHandleTime", label: "TMA", description: "Tempo médio de atendimento" },
  backlogRate: { key: "backlogRate", label: "Backlog", description: "Percentual de demandas pendentes", format: v => `${v}%` },
  responseVelocity: { key: "responseVelocity", label: "Velocidade de Resposta", description: "Tempo médio até a primeira ação", format: v => `${v} min` },

  /* ================= Qualidade & Experiência ================= */
  csat: { key: "csat", label: "CSAT", description: "Satisfação", format: v => `${v}%` },
  nps: { key: "nps", label: "NPS", description: "Net Promoter Score" },
  sentimentScore: { key: "sentimentScore", label: "Sentimento", description: "Análise emocional" },
  fcrRate: { key: "fcrRate", label: "FCR", description: "Resolução no 1º contato", format: v => `${v}%` },
  escalationRate: { key: "escalationRate", label: "Escalonamento", description: "Percentual de casos escalados", format: v => `${v}%` },
  customerEffortScore: { key: "customerEffortScore", label: "CES", description: "Esforço do cliente para resolver demanda", format: v => `${v}/5` },

  /* ================= Tecnologia ================= */
  availability: { key: "availability", label: "Disponibilidade", description: "Uptime", format: v => `${v}%` },
  dropRate: { key: "dropRate", label: "Quedas", description: "Falhas técnicas", format: v => `${v}%` },
  latencyMs: { key: "latencyMs", label: "Latência", description: "Tempo técnico", format: v => `${v}ms` },
  automationRate: { key: "automationRate", label: "Automação", description: "Resolução automática", format: v => `${v}%` },
  aiAssistedRate: { key: "aiAssistedRate", label: "Assistência IA", description: "Percentual de interações auxiliadas por IA", format: v => `${v}%` },

  /* ================= Inteligência & Risco ================= */
  riskScore: { key: "riskScore", label: "Risco Operacional", description: "Probabilidade de falha" },
  forecastAccuracy: { key: "forecastAccuracy", label: "Acurácia de Previsão", description: "Precisão das projeções operacionais", format: v => `${v}%` },
  predictiveDropRate: { key: "predictiveDropRate", label: "Risco de Queda Previsto", description: "Previsão de falhas antes que ocorram", format: v => `${v}%` },

  /* ================= Inovação / Enterprise ================= */
  agentEngagementScore: { key: "agentEngagementScore", label: "Engajamento do Agente", description: "Métrica combinada de motivação e produtividade", format: v => `${v}/100` },
  crossChannelResolution: { key: "crossChannelResolution", label: "Resolução Multicanal", description: "Percentual de problemas resolvidos via múltiplos canais", format: v => `${v}%` },
  proactiveContactRate: { key: "proactiveContactRate", label: "Contato Proativo", description: "Percentual de contatos iniciados pela operação para prevenir churn", format: v => `${v}%` },
  customerJourneyCompletion: { key: "customerJourneyCompletion", label: "Jornada Completa", description: "Percentual de clientes que completam toda a jornada planejada", format: v => `${v}%` }
};


/* ================================ 
   KPIs POR OBJETIVO 
================================ */
export const KPI_REGISTRY: Record<string, KPI> = {
  /* ================= AQUISIÇÃO ================= */
  abandonmentRate: { key: "abandonmentRate", label: "Abandono", description: "Clientes que desistem", format: v => `${v}%` },
  leadConversionRate: { key: "leadConversionRate", label: "Conversão de Leads", description: "Leads convertidos", format: v => `${v}%` },
  qualifiedLeadRate: { key: "qualifiedLeadRate", label: "Leads Qualificados", description: "Leads válidos", format: v => `${v}%` },
  speedToLead: { key: "speedToLead", label: "Speed to Lead", description: "Tempo até primeiro contato" },
  leadIntentScore: { key: "leadIntentScore", label: "Intenção do Lead", description: "Propensão à compra" },

  /* ================= VENDAS ================= */
  conversionRate: { key: "conversionRate", label: "Conversão", description: "Conversão em venda", format: v => `${v}%` },
  callsPerConversion: { key: "callsPerConversion", label: "Chamadas por Conversão", description: "Tentativas por venda" },
  ticketMedio: { key: "ticketMedio", label: "Ticket Médio", description: "Valor médio por venda" },
  revenuePerContact: { key: "revenuePerContact", label: "Receita por Contato", description: "Valor gerado por interação" },
  conversionProbability: { key: "conversionProbability", label: "Probabilidade de Conversão", description: "Estimativa por IA", format: v => `${v}%` },

  /* ================= ONBOARDING ================= */
  firstResponseTime: { key: "firstResponseTime", label: "1ª Resposta", description: "Tempo até primeira interação" },

  /* ================= ENTREGA ================= */
  backlog: { key: "backlog", label: "Backlog", description: "Demandas fora do SLA" },
  queueSize: { key: "queueSize", label: "Fila", description: "Demandas aguardando" },

  /* ================= SUPORTE ================= */
  fcr: { key: "fcr", label: "FCR", description: "Resolução no primeiro contato", format: v => `${v}%` },
  recontactRate: { key: "recontactRate", label: "Recontato", description: "Clientes que retornam", format: v => `${v}%` },
  escalationRate: { key: "escalationRate", label: "Escalonamento", description: "Casos elevados", format: v => `${v}%` },
  complaintRate: { key: "complaintRate", label: "Reclamações", description: "Incidência de reclamações", format: v => `${v}%` },

  /* ================= RETENÇÃO ================= */
  churnRate: { key: "churnRate", label: "Churn", description: "Perda de clientes", format: v => `${v}%` },
  lifetimeValue: { key: "lifetimeValue", label: "LTV", description: "Valor do cliente" },
  opportunityDecayRate: { key: "opportunityDecayRate", label: "Decaimento de Oportunidade", description: "Perda de valor", format: v => `${v}%` },

  /* ================= COBRANÇA ================= */
  recoveryRate: { key: "recoveryRate", label: "Recuperação", description: "Valores recuperados", format: v => `${v}%` },
  promiseToPayRate: { key: "promiseToPayRate", label: "Promessas de Pagamento", description: "Compromissos assumidos", format: v => `${v}%` },
  delinquencyRate: { key: "delinquencyRate", label: "Inadimplência", description: "Clientes inadimplentes", format: v => `${v}%` },

  /* ================= EXPANSÃO ================= */
  revenuePerAgent: { key: "revenuePerAgent", label: "Receita por Agente", description: "Valor gerado por operador" },

  /* ================= INFORMAÇÃO ================= */
  lossReasonScore: { key: "lossReasonScore", label: "Causa de Perda", description: "Motivos de não conversão" },
  avgLeadStageTime: { key: "avgLeadStageTime", label: "Tempo por Etapa", description: "Tempo médio no funil" },

  /* ================= COMPLIANCE ================= */
  complianceScore: { key: "complianceScore", label: "Compliance", description: "Aderência a políticas", format: v => `${v}%` },
  auditFindings: { key: "auditFindings", label: "Achados de Auditoria", description: "Incidentes detectados" },

  /* ================= INTELIGÊNCIA ================= */
  demandForecastAccuracy: { key: "demandForecastAccuracy", label: "Previsão de Demanda", description: "Acurácia", format: v => `${v}%` },
  learningVelocity: { key: "learningVelocity", label: "Velocidade de Aprendizado", description: "Evolução dos modelos" },
  aiDecisionAccuracy: { key: "aiDecisionAccuracy", label: "Acurácia da IA", description: "Precisão das decisões", format: v => `${v}%` },
  humanVsAiEfficiency: { key: "humanVsAiEfficiency", label: "Humano vs IA", description: "Eficiência comparativa" }
};
