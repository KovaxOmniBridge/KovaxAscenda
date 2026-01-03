import React from "react";

/* ================================
   KPIs Compostas – Decision Layer
   Above Salesforce / Revenue Intelligence
================================ */

// Tipagem base (reutiliza o domínio existente)
export type KPIValue = string | number;

export type DerivedKPI = {
  key: string;
  label: string;
  description?: string;
  value: KPIValue;
  trend?: "up" | "down" | "stable";
  riskLevel?: "low" | "medium" | "high";
};

// Mock inicial – futuramente alimentado por engine de KPIs derivados
const KPIS_COMPOSTAS: DerivedKPI[] = [
  {
    key: "dynamicCAC",
    label: "CAC Dinâmico",
    description: "Custo operacional real por conversão em tempo quase real",
    value: "R$ 42,30",
    trend: "down",
    riskLevel: "low",
  },
  {
    key: "revenueVelocity",
    label: "Velocidade de Receita",
    description: "Receita gerada por unidade de tempo",
    value: "R$ 18.500 / hora",
    trend: "up",
    riskLevel: "low",
  },
  {
    key: "opportunityRiskIndex",
    label: "Risco de Oportunidade",
    description: "Probabilidade composta de perda de receita",
    value: "27%",
    trend: "up",
    riskLevel: "high",
  },
  {
    key: "leadEfficiencyIndex",
    label: "Eficiência de Leads",
    description: "Relação entre intenção, esforço e conversão",
    value: 1.42,
    trend: "stable",
    riskLevel: "medium",
  },
  {
    key: "agentValueIndex",
    label: "Valor do Agente",
    description: "Impacto financeiro líquido médio por operador",
    value: "R$ 3.200",
    trend: "up",
    riskLevel: "low",
  },
];

export default function KPIsCompostasPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">KPIs Compostas</h1>
          <p className="text-sm text-muted-foreground">
            Camada de decisão estratégica e inteligência de receita
          </p>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {KPIS_COMPOSTAS.map((kpi) => (
          <div
            key={kpi.key}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium">{kpi.label}</h2>
                <p className="text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </div>

              {/* Indicador de risco */}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium 
                  ${kpi.riskLevel === "low" && "bg-green-100 text-green-700"}
                  ${kpi.riskLevel === "medium" && "bg-yellow-100 text-yellow-700"}
                  ${kpi.riskLevel === "high" && "bg-red-100 text-red-700"}`}
              >
                {kpi.riskLevel?.toUpperCase()}
              </span>
            </div>

            {/* Valor */}
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-semibold">{kpi.value}</span>
              <span className="text-sm text-muted-foreground">
                {kpi.trend === "up" && "▲ Em alta"}
                {kpi.trend === "down" && "▼ Em queda"}
                {kpi.trend === "stable" && "■ Estável"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé conceitual */}
      <div className="text-xs text-muted-foreground">
        KPIs compostas são métricas derivadas utilizadas para orientar decisões
        estratégicas, priorização automática e ações prescritivas.
      </div>
    </div>
  );
}
