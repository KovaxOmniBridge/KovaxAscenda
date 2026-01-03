/* ================================
   OBJETIVOS DE NEGÓCIO
   Single Source of Truth
================================ */

export type ObjectiveType =
  | "aquisicao"
  | "vendas"
  | "onboarding"
  | "entrega"
  | "suporte"
  | "retencao"
  | "relacionamento"
  | "cobranca"
  | "expansao"
  | "informacao"
  | "compliance"
  | "inteligencia";

export type ObjectiveDefinition = {
  key: ObjectiveType;
  label: string;
  description: string;
};

export const OBJECTIVES: Record<ObjectiveType, ObjectiveDefinition> = {
  aquisicao: {
    key: "aquisicao",
    label: "Aquisição",
    description: "Captação de novos leads, clientes ou usuários"
  },

  vendas: {
    key: "vendas",
    label: "Vendas",
    description: "Conversão de interesse em receita e contratos"
  },

  onboarding: {
    key: "onboarding",
    label: "Onboarding",
    description: "Ativação inicial e entrada estruturada do cliente"
  },

  entrega: {
    key: "entrega",
    label: "Entrega",
    description: "Execução, provisionamento ou entrega do produto ou serviço"
  },

  suporte: {
    key: "suporte",
    label: "Suporte",
    description: "Resolução de problemas, incidentes e falhas operacionais"
  },

  relacionamento: {
    key: "relacionamento",
    label: "Relacionamento",
    description: "Gestão contínua do vínculo e da experiência do cliente"
  },

  retencao: {
    key: "retencao",
    label: "Retenção",
    description: "Prevenção de churn e recuperação de clientes em risco"
  },

  cobranca: {
    key: "cobranca",
    label: "Cobrança",
    description: "Gestão de faturamento, inadimplência e renegociação"
  },

  expansao: {
    key: "expansao",
    label: "Expansão",
    description: "Upsell, cross-sell e aumento do valor do cliente"
  },

  informacao: {
    key: "informacao",
    label: "Informação",
    description: "Comunicação, autosserviço e disseminação de conhecimento"
  },

  compliance: {
    key: "compliance",
    label: "Compliance",
    description: "Governança, auditoria, políticas e conformidade regulatória"
  },

  inteligencia: {
    key: "inteligencia",
    label: "Inteligência",
    description: "Análise de dados, insights, previsões e apoio à decisão"
  }
};
