import React from "react";
import "../serviceModules.css";

/* ================================
   TIPAGENS DO MÓDULO
================================ */

type AutomationStatus = "healthy" | "attention" | "critical";

type AutomationMetric = {
  key: string;
  label: string;
  value: string | number;
  variation?: number;
  status: "good" | "attention" | "bad";
};

type AutomationChannel = {
  id: string;
  name: string;
  status: AutomationStatus;
  metrics: AutomationMetric[];
};

/* ================================
   MOCK OPERACIONAL
   Base futura para IA / RPA / Bots
================================ */

const automationChannels: AutomationChannel[] = [
  {
    id: "chatbot",
    name: "Chatbot Conversacional",
    status: "healthy",
    metrics: [
      {
        key: "resolution",
        label: "Resolução Automática",
        value: "64%",
        variation: +6,
        status: "good"
      },
      {
        key: "fallback",
        label: "Escalonamento Humano",
        value: "18%",
        variation: -4,
        status: "good"
      },
      {
        key: "csat",
        label: "Qualidade Percebida",
        value: "86%",
        status: "good"
      }
    ]
  },
  {
    id: "ura",
    name: "URA Inteligente",
    status: "attention",
    metrics: [
      {
        key: "containment",
        label: "Containment Rate",
        value: "58%",
        variation: -5,
        status: "attention"
      },
      {
        key: "abandono",
        label: "Abandono",
        value: "9%",
        variation: +2,
        status: "bad"
      },
      {
        key: "tempo",
        label: "Tempo Médio na URA",
        value: "1m 40s",
        status: "good"
      }
    ]
  },
  {
    id: "automation-flows",
    name: "Fluxos Automatizados",
    status: "healthy",
    metrics: [
      {
        key: "executions",
        label: "Execuções",
        value: "12.480",
        status: "good"
      },
      {
        key: "success",
        label: "Taxa de Sucesso",
        value: "92%",
        status: "good"
      },
      {
        key: "cost",
        label: "Economia Gerada",
        value: "R$ 72k",
        status: "good"
      }
    ]
  }
];

/* ================================
   HELPERS SEMÂNTICOS
================================ */

const statusLabel = (status: AutomationStatus) => {
  if (status === "healthy") return "Estável";
  if (status === "attention") return "Atenção";
  return "Crítico";
};

/* ================================
   COMPONENTE PRINCIPAL
================================ */

const AutomationServiceModule: React.FC = () => {
  return (
    <section className="service-module automation-module">
      <header className="module-header">
        <h3>Atendimento Automatizado & IA</h3>
        <span className="module-subtitle">
          Bots, URA, fluxos e eficiência operacional
        </span>
      </header>

      <div className="module-content">
        {automationChannels.map((channel) => (
          <section
            key={channel.id}
            className={`automation-card status-${channel.status}`}
          >
            <header className="automation-header">
              <h4>{channel.name}</h4>
              <span className={`automation-status status-${channel.status}`}>
                {statusLabel(channel.status)}
              </span>
            </header>

            <div className="automation-metrics">
              {channel.metrics.map((metric) => (
                <div
                  key={metric.key}
                  className={`metric-card status-${metric.status}`}
                >
                  <span className="metric-label">
                    {metric.label}
                  </span>

                  <strong className="metric-value">
                    {metric.value}
                  </strong>

                  {metric.variation !== undefined && (
                    <span
                      className={`metric-variation ${
                        metric.variation >= 0 ? "positive" : "negative"
                      }`}
                    >
                      {metric.variation > 0 ? "+" : ""}
                      {metric.variation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default AutomationServiceModule;
