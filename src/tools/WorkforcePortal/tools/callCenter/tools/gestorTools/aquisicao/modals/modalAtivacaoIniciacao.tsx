import React from "react";
import "./styles/modalAtivacaoiniciacao.css";

const dadosConversao = [
  {
    label: "Orgânica",
    entradas: 5400,
    convertidos: 1620,
    color: "#22c55e",
  },
  {
    label: "Campanhas Pagas",
    entradas: 3800,
    convertidos: 760,
    color: "#3b82f6",
  },
  {
    label: "Plataformas Terceiras",
    entradas: 2100,
    convertidos: 315,
    color: "#f59e0b",
  },
  {
    label: "Indicação",
    entradas: 1150,
    convertidos: 402,
    color: "#a855f7",
  },
];

const totalConvertidos = dadosConversao.reduce(
  (acc, item) => acc + item.convertidos,
  0
);

const ModalTaxaConversao: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const pieStyle = {
    background: `conic-gradient(${dadosConversao
      .map((d, i) => {
        const start =
          dadosConversao
            .slice(0, i)
            .reduce((a, b) => a + b.convertidos, 0) /
          totalConvertidos *
          100;

        const end =
          start + (d.convertidos / totalConvertidos) * 100;

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
            <h3>Taxa de Conversão</h3>
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
                  Conversões Totais
                </span>
                <strong className="pie-kpi-value positive">
                  {totalConvertidos.toLocaleString()}
                </strong>
              </div>

              <div className="pie-chart" style={pieStyle} />
            </div>

            {/* DETALHAMENTO POR ORIGEM */}
            <div className="legend-section">
              {dadosConversao.map((item) => {
                const taxa =
                  (item.convertidos / item.entradas) * 100;

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
                        Convertidos:{" "}
                        {item.convertidos.toLocaleString()}
                      </span>

                      <span className="highlight positive">
                        Taxa de conversão:{" "}
                        {taxa.toFixed(1)}%
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
              A análise evidencia discrepâncias claras de eficiência entre
              os canais de aquisição. Tráfego por indicação apresenta a
              maior taxa de conversão relativa, enquanto campanhas pagas
              sustentam volume com menor eficiência marginal. Recomenda-se
              reequilíbrio do investimento priorizando canais de alta
              conversão e otimização contínua do funil inicial.
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default ModalTaxaConversao;
