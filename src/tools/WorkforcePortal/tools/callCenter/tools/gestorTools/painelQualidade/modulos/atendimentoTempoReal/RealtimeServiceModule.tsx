import React from "react";
import "../serviceModules.css";

import { CHANNELS, ChannelInstance, ChannelStatus, RiskLevel } from "./canais";
import { QUALITY_KPIS } from "./KPIs";

/* ================================
   HELPERS EXECUTIVOS
================================ */

const statusLabel = (s: ChannelStatus) =>
  s === "online" ? "Operando" : s === "degraded" ? "Degradado" : "Offline";

const riskLabel = (r: RiskLevel) =>
  r === "low" ? "Baixo Risco" : r === "medium" ? "Risco Moderado" : "Alto Risco";

/* ================================
   COMPONENTE PRINCIPAL
================================ */

const RealtimeServiceModule: React.FC = () => {
  return (
    <section className="service-module realtime-module">
      <div className="module-content">
        {CHANNELS.map((channel: ChannelInstance) => {
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

              {/* KPIs DE QUALIDADE */}
              <div className="channel-metrics">
                {Object.entries(channel.metrics).map(([kpiKey, value]) => {
                  const kpi = QUALITY_KPIS[kpiKey as keyof typeof QUALITY_KPIS];

                  if (!kpi || value === undefined) return null;

                  return (
                    <div key={kpiKey} className="channel-metric">
                      <span className="metric-label">{kpi.label}</span>
                      <strong>
                        {kpi.format ? kpi.format(value) : value}
                      </strong>
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
