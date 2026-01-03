import React from "react";
import "../serviceModules.css";

/* ================================
   TIPAGENS DO MÓDULO
================================ */

type ChannelStatus = "online" | "attention" | "offline";

type DigitalChannel = {
  id: string;
  name: string;
  status: ChannelStatus;
  volume: number;
  responseTime: string;
  successRate: string;
};

/* ================================
   MOCK OPERACIONAL
   Futuro: API / CRM / Omnichannel
================================ */

const channels: DigitalChannel[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    status: "online",
    volume: 1840,
    responseTime: "2m 10s",
    successRate: "28%"
  },
  {
    id: "email",
    name: "E-mail",
    status: "attention",
    volume: 620,
    responseTime: "1h 12m",
    successRate: "19%"
  },
  {
    id: "instagram",
    name: "Instagram",
    status: "online",
    volume: 430,
    responseTime: "3m 45s",
    successRate: "31%"
  },
  {
    id: "facebook",
    name: "Facebook",
    status: "online",
    volume: 290,
    responseTime: "4m 05s",
    successRate: "24%"
  }
];

/* ================================
   HELPERS SEMÂNTICOS
================================ */

const statusLabel = (status: ChannelStatus) => {
  if (status === "online") return "Operando";
  if (status === "attention") return "Atenção";
  return "Indisponível";
};

/* ================================
   COMPONENTE PRINCIPAL
================================ */

const DigitalServiceModule: React.FC = () => {
  return (
    <section className="service-module digital-module">
      <header className="module-header">
        <h3>Atendimento Digital</h3>
        <span className="module-subtitle">
          Canais assíncronos e mídias sociais
        </span>
      </header>

      <div className="module-content">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`channel-card status-${channel.status}`}
          >
            <div className="channel-header">
              <strong className="channel-title">
                {channel.name}
              </strong>

              <span className={`channel-status status-${channel.status}`}>
                {statusLabel(channel.status)}
              </span>
            </div>

            <div className="channel-metrics">
              <div className="channel-metric">
                <span className="metric-label">Volume</span>
                <strong>{channel.volume}</strong>
              </div>

              <div className="channel-metric">
                <span className="metric-label">Tempo de Resposta</span>
                <strong>{channel.responseTime}</strong>
              </div>

              <div className="channel-metric">
                <span className="metric-label">Taxa de Sucesso</span>
                <strong>{channel.successRate}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DigitalServiceModule;
