import React from "react";
import "./styles/ModalEficienciaSistema.css";
import "./styles/modalBase.css";

/* =========================================================
   TIPAGENS ESTRATÉGICAS
========================================================= */

type FunnelStage = {
  id: string;
  label: string;
  input: number;
  output: number;
  efficiency: number; // %
  issues?: string[];
};

interface ModalEficienciaSistemaProps {
  onClose: () => void;
}

/* =========================================================
   MOCK ESTRUTURAL (POSTERIORMENTE API)
========================================================= */

const FUNNEL_STAGES: FunnelStage[] = [
  {
    id: "interesse",
    label: "Interesse Inicial",
    input: 12000,
    output: 8600,
    efficiency: 72,
    issues: ["Tempo de resposta inicial elevado"]
  },
  {
    id: "qualificacao",
    label: "Qualificação",
    input: 8600,
    output: 6100,
    efficiency: 71,
    issues: ["Baixa automação na triagem"]
  },
  {
    id: "atendimento",
    label: "Atendimento",
    input: 6100,
    output: 4900,
    efficiency: 80
  },
  {
    id: "conversao",
    label: "Conversão",
    input: 4900,
    output: 3200,
    efficiency: 65,
    issues: ["Alta fricção na etapa final"]
  },
  {
    id: "retencao",
    label: "Retenção Inicial",
    input: 3200,
    output: 2700,
    efficiency: 84
  }
];

/* =========================================================
   HELPERS VISUAIS
========================================================= */

const efficiencyStatus = (value: number) => {
  if (value >= 80) return "healthy";
  if (value >= 65) return "warning";
  return "critical";
};

/* =========================================================
   COMPONENTE
========================================================= */

const ModalEficienciaSistema: React.FC<ModalEficienciaSistemaProps> = ({
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container modal-eficiencia-sistema">

        {/* HEADER */}
        <header className="modal-header">
          <div>
            <h2>Eficiência Global do Sistema</h2>
            <p>
              Visão end-to-end da performance operacional,
              do primeiro contato à retenção inicial.
            </p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* KPI RESUMO */}
        <section className="modal-summary">
          <div className="summary-card">
            <span>Eficiência Média</span>
            <strong>74%</strong>
          </div>

          <div className="summary-card">
            <span>Volume Total Processado</span>
            <strong>12.000</strong>
          </div>

          <div className="summary-card">
            <span>Conversões Finais</span>
            <strong>3.200</strong>
          </div>
        </section>

        {/* FUNIL DE EFICIÊNCIA */}
        <section className="funnel-section">
          <h3>Funil Operacional</h3>

          <div className="funnel-grid">
            {FUNNEL_STAGES.map(stage => (
              <div
                key={stage.id}
                className={`funnel-card ${efficiencyStatus(stage.efficiency)}`}
              >
                <header>
                  <strong>{stage.label}</strong>
                  <span>{stage.efficiency}%</span>
                </header>

                <div className="funnel-metrics">
                  <div>
                    <label>Entradas</label>
                    <span>{stage.input.toLocaleString()}</span>
                  </div>
                  <div>
                    <label>Saídas</label>
                    <span>{stage.output.toLocaleString()}</span>
                  </div>
                </div>

                {stage.issues && (
                  <ul className="funnel-issues">
                    {stage.issues.map((issue, idx) => (
                      <li key={idx}>⚠ {issue}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* INSIGHTS ESTRATÉGICOS */}
        <section className="insights-section">
          <h3>Insights Estratégicos</h3>

          <ul>
            <li>
              A maior perda ocorre na fase de <strong>Conversão</strong>,
              impactando diretamente a lucratividade.
            </li>
            <li>
              A automação na fase de <strong>Qualificação</strong>
              apresenta alto potencial de ganho de eficiência.
            </li>
            <li>
              A retenção inicial está saudável e acima do benchmark.
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default ModalEficienciaSistema;
