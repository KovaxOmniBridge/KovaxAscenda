import React, { useState } from "react";
import "./operationalPainel.css";

// ================================
// TIPAGENS
// ================================

type Trend = "up" | "down" | "stable";
type SquadStatus = "ativa" | "alerta" | "pausada";

type GlobalKPI = {
  label: string;
  value: string | number;
  description?: string;
  trend?: Trend;
};

type Squad = {
  id: string;
  name: string;
  status: SquadStatus;
  agentesOnline: number;
  agentesTotal: number;
  sla: number;
  produtividade: number;
  chamadasAtivas: number;
};

// ================================
// MOCK DE DADOS
// ================================

const globalKPIs: GlobalKPI[] = [
  { label: "Chamadas Ativas", value: 128, trend: "up", description: "Em tempo real" },
  { label: "SLA Médio", value: "92%", trend: "stable", description: "Meta ≥ 90%" },
  { label: "Produtividade Geral", value: "88%", trend: "down", description: "Última 1h" },
  { label: "Agentes Online", value: "342 / 410", trend: "up", description: "Disponibilidade atual" }
];

const squadsMock: Squad[] = [
  {
    id: "s1",
    name: "Squad Retenção",
    status: "ativa",
    agentesOnline: 42,
    agentesTotal: 50,
    sla: 95,
    produtividade: 90,
    chamadasAtivas: 38
  },
  {
    id: "s2",
    name: "Squad Vendas",
    status: "alerta",
    agentesOnline: 31,
    agentesTotal: 45,
    sla: 87,
    produtividade: 82,
    chamadasAtivas: 51
  },
  {
    id: "s3",
    name: "Squad Suporte",
    status: "ativa",
    agentesOnline: 56,
    agentesTotal: 60,
    sla: 93,
    produtividade: 89,
    chamadasAtivas: 64
  }
];

// ================================
// HELPERS
// ================================

const trendIcon = (trend?: Trend) => {
  if (trend === "up") return "▲";
  if (trend === "down") return "▼";
  return "●";
};

// ================================
// COMPONENTE
// ================================

const OperationPanel: React.FC = () => {
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);

  return (
    <div className="operation-container">
      {/* HEADER */}
      <header className="operation-header">
        <div>
          <h1>Centro de Operações · Call Center</h1>
          <span className="environment">
            Ambiente Produção · Operação Nacional · Tempo Real
          </span>
        </div>
        <div className="header-actions">
          <button className="action-btn">Atualizar</button>
          <button className="action-btn primary">Visão Executiva</button>
        </div>
      </header>

      {/* KPIs */}
      <section className="kpi-grid">
        {globalKPIs.map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <span className="kpi-label">{kpi.label}</span>
            <strong className="kpi-value">{kpi.value}</strong>
            <div className={`kpi-trend trend-${kpi.trend}`}>
              {trendIcon(kpi.trend)} {kpi.description}
            </div>
          </div>
        ))}
      </section>

      {/* SQUADS */}
      <section className="squad-section">
        <h2>Squads Operacionais</h2>

        <div className="squad-grid">
          {squadsMock.map((squad) => (
            <div
              key={squad.id}
              className={`squad-card status-${squad.status}`}
              onClick={() => setSelectedSquad(squad)}
            >
              <header className="squad-header">
                <h3>{squad.name}</h3>
                <span className={`badge ${squad.status}`}>{squad.status}</span>
              </header>

              <div className="squad-metrics">
                <div>
                  <span>Agentes</span>
                  <strong>{squad.agentesOnline}/{squad.agentesTotal}</strong>
                </div>
                <div>
                  <span>Chamadas</span>
                  <strong>{squad.chamadasAtivas}</strong>
                </div>
                <div>
                  <span>SLA</span>
                  <strong>{squad.sla}%</strong>
                </div>
                <div>
                  <span>Produtividade</span>
                  <strong>{squad.produtividade}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {selectedSquad && (
        <div className="modal-overlay" onClick={() => setSelectedSquad(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>{selectedSquad.name}</h2>
              <button onClick={() => setSelectedSquad(null)}>×</button>
            </header>

            <section className="modal-content">
              <div className="modal-grid">
                <div><span>Status</span><strong>{selectedSquad.status}</strong></div>
                <div><span>Agentes</span><strong>{selectedSquad.agentesOnline}/{selectedSquad.agentesTotal}</strong></div>
                <div><span>SLA</span><strong>{selectedSquad.sla}%</strong></div>
                <div><span>Produtividade</span><strong>{selectedSquad.produtividade}%</strong></div>
                <div><span>Chamadas Ativas</span><strong>{selectedSquad.chamadasAtivas}</strong></div>
              </div>

              <div className="placeholder">
                Próximo nível: filas, campanhas, metas, alarmes, IA preditiva.
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationPanel;
