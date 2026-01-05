import React, { useState } from "react";
import "./painelQualidade.css";

/* ================================
   TIPAGENS ESTRATÉGICAS
================================ */

type KPIStatus = "healthy" | "warning" | "critical";

type KPIComposite = {
  id: string;
  title: string;
  value: string;
  delta?: string;
  status: KPIStatus;
  description: string;
  modalKey: string;
};

/* ================================
   CONFIGURAÇÃO DOS KPIs COMPOSTOS
================================ */

const KPIS: KPIComposite[] = [
  {
    id: "kpi-lucratividade",
    title: "Lucratividade Líquida",
    value: "R$ 1.240.000",
    delta: "+8.4%",
    status: "healthy",
    description: "Resultado financeiro consolidado no período",
    modalKey: "lucratividade"
  },
  {
    id: "kpi-eficiencia-sistema",
    title: "Eficiência do Sistema",
    value: "82%",
    delta: "+3%",
    status: "healthy",
    description: "Performance end-to-end do funil operacional",
    modalKey: "eficienciaSistema"
  },
  {
    id: "kpi-qualidade",
    title: "Qualidade da Operação",
    value: "91%",
    delta: "-1%",
    status: "warning",
    description: "Experiência percebida pelo cliente",
    modalKey: "qualidade"
  },
  {
    id: "kpi-automacao",
    title: "Efetividade das Automações",
    value: "64%",
    delta: "+5%",
    status: "healthy",
    description: "Capacidade de escala sem intervenção humana",
    modalKey: "automacao"
  },
  {
    id: "kpi-risco",
    title: "Risco Operacional",
    value: "Baixo",
    status: "healthy",
    description: "Probabilidade de impacto negativo na operação",
    modalKey: "risco"
  }
];

/* ================================
   COMPONENTE PRINCIPAL
================================ */

const PainelQualidade: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <section className="quality-panel-container">
      <header className="quality-panel-header">
        <h1>Painel Executivo de Qualidade</h1>
        <p>Visão consolidada da saúde operacional e estratégica</p>
      </header>

      <div className="quality-kpi-grid">
        {KPIS.map((kpi) => (
          <div
            key={kpi.id}
            className={`kpi-card status-${kpi.status}`}
            onClick={() => setActiveModal(kpi.modalKey)}
          >
            <div className="kpi-header">
              <span className="kpi-title">{kpi.title}</span>
              {kpi.delta && (
                <span className={`kpi-delta ${kpi.delta.startsWith("-") ? "negative" : "positive"}`}>
                  {kpi.delta}
                </span>
              )}
            </div>

            <div className="kpi-value">{kpi.value}</div>

            <p className="kpi-description">{kpi.description}</p>
          </div>
        ))}
      </div>

      {/* ================================
         MODAIS (PLACEHOLDER)
      ================================ */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Análise Detalhada</h2>
              <button onClick={() => setActiveModal(null)}>✕</button>
            </header>

            <div className="modal-content">
              <p>
                Modal <strong>{activeModal}</strong> será carregado aqui.
              </p>
              <p>
                Gráficos, correlações, insights e recomendações estratégicas.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PainelQualidade;
