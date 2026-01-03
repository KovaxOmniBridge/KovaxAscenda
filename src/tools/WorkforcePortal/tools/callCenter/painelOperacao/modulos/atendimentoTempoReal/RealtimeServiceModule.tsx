import React from "react";
import "../serviceModules.css";

import { CHANNELS, ChannelInstance, ChannelStatus, RiskLevel } from "./canais";
import { KPI_REGISTRY, UNIVERSAL_KPIS } from "./KPIs";
import { OBJECTIVE_KPIS } from "./KPIsObjetivos";

/* ================================
   HELPERS EXECUTIVOS
================================ */

const statusLabel = (s: ChannelStatus) =>
  s === "online" ? "Operando" : s === "degraded" ? "Degradado" : "Offline";

const riskLabel = (r: RiskLevel) =>
  r === "low" ? "Baixo Risco" : r === "medium" ? "Risco Moderado" : "Alto Risco";

/* ================================
   REGISTRO UNIFICADO DE KPIs
   Combina universais + específicas
================================ */
const ALL_KPIS = { ...UNIVERSAL_KPIS, ...KPI_REGISTRY };

/* ================================
   COMPONENTE PRINCIPAL
================================ */

const RealtimeServiceModule: React.FC = () => {
  return (
    <section className="service-module realtime-module">
      <div className="module-content">
        {CHANNELS.map((channel: ChannelInstance) => {
          // Pega KPIs específicas do objetivo
          const objectiveKPIs = OBJECTIVE_KPIS[channel.objective] || [];

          // Combina universais + específicas, sem duplicar
          const uniqueKPIs = Array.from(new Set([...Object.keys(UNIVERSAL_KPIS), ...objectiveKPIs]));

          return (
            <div
              key={channel.id}
              className={`channel-card status-${channel.status} risk-${channel.riskLevel}`}
            >
              {/* HEADER DO CANAL */}
              <div className="channel-header">
                <strong className="channel-title">{channel.name}</strong>

                <div className="channel-badges">
                  <span className={`channel-status status-${channel.status}`}>
                    {statusLabel(channel.status)}
                  </span>
                  <span className={`channel-risk risk-${channel.riskLevel}`}>
                    {riskLabel(channel.riskLevel)}
                  </span>
                </div>
              </div>

              {/* KPIs ORIENTADAS AO OBJETIVO + UNIVERSAIS */}
              <div className="channel-metrics">
                {uniqueKPIs.map((kpiKey) => {
                  const kpi = ALL_KPIS[kpiKey];
                  const value = channel.metrics[kpiKey];

                  if (!kpi || value === undefined) return null;

                  return (
                    <div key={kpiKey} className="channel-metric">
                      <span className="metric-label">{kpi.label}</span>
                      <strong>{kpi.format ? kpi.format(value) : value}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RealtimeServiceModule;
