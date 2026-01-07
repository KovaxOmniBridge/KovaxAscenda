import React from "react";
import "./styles/modalInadinplentes.css";

const dadosInadimplentes = [
  {
    label: "Clientes Pessoa Física",
    total: 1800,
    recuperados: 720,
    color: "#ef4444", // vermelho para risco
  },
  {
    label: "Clientes Pessoa Jurídica",
    total: 1020,
    recuperados: 540,
    color: "#f97316", // laranja risco médio
  },
  {
    label: "Clientes em atraso D+30",
    total: 800,
    recuperados: 260,
    color: "#f59e0b", // amarelo risco alto
  },
  {
    label: "Clientes em atraso D+60",
    total: 660,
    recuperados: 90,
    color: "#10b981", // verde recuperação
  },
];

const dadosProcessados = dadosInadimplentes.map((item) => {
  const pendentes = item.total - item.recuperados;
  return { ...item, pendentes };
});

const totalPendentes = dadosProcessados.reduce(
  (acc, item) => acc + item.pendentes,
  0
);

const ModalInadimplentes: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const pieStyle = {
    background: `conic-gradient(${dadosProcessados
      .map((d, i) => {
        const start =
          dadosProcessados
            .slice(0, i)
            .reduce((a, b) => a + b.pendentes, 0) /
          totalPendentes *
          100;

        const end = start + (d.pendentes / totalPendentes) * 100;

        return `${d.color} ${start}% ${end}%`;
      })
      .join(", ")})`,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-inadimplentes">

        {/* HEADER */}
        <header className="modal-header">
          <div>
            <h3>Clientes Inadimplentes</h3>
          </div>

          <div className="period-reader">
            <label>Período</label>
            <select>
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
              <option>Personalizado</option>
            </select>
          </div>

          <button onClick={onClose}>✕</button>
        </header>

        {/* CONTEÚDO */}
        <div className="modal-content">

          <section className="modal-body">

            {/* KPI CENTRAL */}
            <div className="pie-section">
              <div className="pie-kpi">
                <span className="pie-kpi-label">Pendentes Totais</span>
                <strong className="pie-kpi-value negative">
                  {totalPendentes.toLocaleString()}
                </strong>
              </div>

              <div className="pie-chart" style={pieStyle} />
            </div>

            {/* DETALHAMENTO POR CATEGORIA */}
            <div className="legend-section">
              {dadosProcessados.map((item) => {
                const taxaPendencia = (item.pendentes / item.total) * 100;

                return (
                  <div key={item.label} className="legend-item">
                    <span
                      className="color-box"
                      style={{ background: item.color }}
                    />

                    <div className="legend-info">
                      <strong>{item.label}</strong>

                      <span>Total: {item.total.toLocaleString()}</span>
                      <span>Recuperados: {item.recuperados.toLocaleString()}</span>
                      <span className="highlight negative">
                        Pendentes: {item.pendentes.toLocaleString()} ({taxaPendencia.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>

          {/* FOOTER EXECUTIVO */}
          <footer className="modal-footer">
            <h4>Leitura Executiva</h4>
            <p>
              Os dados indicam concentração de inadimplência em clientes de alto risco e atrasos prolongados (D+30 e D+60). 
              Recomenda-se priorização da cobrança segmentada, revisão de políticas de negociação e foco nos clientes com maior probabilidade de recuperação. 
              A análise por categoria permite decisões rápidas sobre alocação de recursos e estratégias de mitigação de risco.
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default ModalInadimplentes;
