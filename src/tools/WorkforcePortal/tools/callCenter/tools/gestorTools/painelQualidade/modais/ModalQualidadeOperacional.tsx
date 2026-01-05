import React from "react";
import "./styles/modalQualidadeOperacional.css";
import "./styles/modalBase.css";

interface IndicadorQualidade {
  label: string;
  valor: number | string;
  status: "excelente" | "bom" | "alerta" | "critico";
  descricao?: string;
}

interface ModalQualidadeOperacionalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreGeral: number; // 0 a 100
  indicadores: IndicadorQualidade[];
  observacoesEstrategicas?: string[];
}

const ModalQualidadeOperacional: React.FC<
  ModalQualidadeOperacionalProps
> = ({
  isOpen,
  onClose,
  scoreGeral,
  indicadores,
  observacoesEstrategicas = [],
}) => {
  if (!isOpen) return null;

  const scoreClass =
    scoreGeral >= 85
      ? "excelente"
      : scoreGeral >= 70
      ? "bom"
      : scoreGeral >= 50
      ? "alerta"
      : "critico";

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <header className="modal-header">
          <h2>Qualidade Operacional</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* SCORE GLOBAL */}
        <section className="modal-score">
          <div className={`score-circle ${scoreClass}`}>
            <strong>{scoreGeral}</strong>
            <span>/ 100</span>
          </div>
          <div className="score-description">
            <h3>Score Operacional Global</h3>
            <p>
              Indicador consolidado da qualidade da operação considerando
              atendimento humano, automações, cumprimento de SLAs, experiência
              do cliente e consistência dos processos.
            </p>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="modal-indicators">
          <h3>Indicadores-Chave de Qualidade</h3>

          <div className="indicators-grid">
            {indicadores.map((item, index) => (
              <div
                key={index}
                className={`indicator-card ${item.status}`}
              >
                <div className="indicator-header">
                  <span className="indicator-label">
                    {item.label}
                  </span>
                  <span className={`indicator-status ${item.status}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <div className="indicator-value">
                  {item.valor}
                </div>

                {item.descricao && (
                  <p className="indicator-description">
                    {item.descricao}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* INSIGHTS */}
        {observacoesEstrategicas.length > 0 && (
          <section className="modal-insights">
            <h3>Insights Estratégicos</h3>
            <ul>
              {observacoesEstrategicas.map((obs, idx) => (
                <li key={idx}>{obs}</li>
              ))}
            </ul>
          </section>
        )}

        <footer className="modal-footer">
          <p className="insight">
            A Qualidade Operacional reflete diretamente a sustentabilidade do
            crescimento. Quedas recorrentes indicam gargalos estruturais,
            automações mal calibradas ou falhas de capacitação. Este painel deve
            orientar ações corretivas e priorização de investimentos.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ModalQualidadeOperacional;
