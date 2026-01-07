import React from "react";
import "./styles/modalAbandono.css";

const dadosAbandono = [
  {
    label: "Orgânica",
    entradas: 5400,
    iniciados: 3780,
    color: "#22c55e",
  },
  {
    label: "Campanhas Pagas",
    entradas: 3800,
    iniciados: 2100,
    color: "#3b82f6",
  },
  {
    label: "Plataformas Terceiras",
    entradas: 2100,
    iniciados: 980,
    color: "#f59e0b",
  },
  {
    label: "Indicação",
    entradas: 1150,
    iniciados: 910,
    color: "#a855f7",
  },
];

const dadosProcessados = dadosAbandono.map((item) => {
  const abandonos = item.entradas - item.iniciados;
  return { ...item, abandonos };
});

const totalAbandonos = dadosProcessados.reduce(
  (acc, item) => acc + item.abandonos,
  0
);

const ModalTaxaAbandono: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const pieStyle = {
    background: `conic-gradient(${dadosProcessados
      .map((d, i) => {
        const start =
          dadosProcessados
            .slice(0, i)
            .reduce((a, b) => a + b.abandonos, 0) /
          totalAbandonos *
          100;

        const end =
          start + (d.abandonos / totalAbandonos) * 100;

        return `${d.color} ${start}% ${end}%`;
      })
      .join(", ")})`,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-conversao">

        {/* HEADER */}
        <header className="modal-header">
          <div>
            <h3>Taxa de Abandono</h3>
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
                <span className="pie-kpi-label">
                  Abandonos Totais
                </span>
                <strong className="pie-kpi-value negative">
                  {totalAbandonos.toLocaleString()}
                </strong>
              </div>

              <div className="pie-chart" style={pieStyle} />
            </div>

            {/* DETALHAMENTO POR ORIGEM */}
            <div className="legend-section">
              {dadosProcessados.map((item) => {
                const taxaAbandono =
                  (item.abandonos / item.entradas) * 100;

                return (
                  <div key={item.label} className="legend-item">
                    <span
                      className="color-box"
                      style={{ background: item.color }}
                    />

                    <div className="legend-info">
                      <strong>{item.label}</strong>

                      <span>
                        Entradas: {item.entradas.toLocaleString()}
                      </span>

                      <span>
                        Abandonos:{" "}
                        {item.abandonos.toLocaleString()}
                      </span>

                      <span className="highlight negative">
                        Taxa de abandono:{" "}
                        {taxaAbandono.toFixed(1)}%
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
              Os dados revelam pontos críticos de fricção no estágio inicial
              do funil. Canais pagos e plataformas terceiras concentram
              maior taxa de abandono, indicando desalinhamento entre
              expectativa e proposta de valor. Recomenda-se otimização
              imediata da experiência de entrada, revisão de mensagens
              iniciais e priorização de canais com maior retenção
              operacional.
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default ModalTaxaAbandono;
