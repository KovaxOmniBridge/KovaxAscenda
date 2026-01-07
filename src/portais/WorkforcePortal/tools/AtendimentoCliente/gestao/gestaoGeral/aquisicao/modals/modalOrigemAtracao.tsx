import React from "react";
import "./styles/modalOrigemAtracao.css";

interface OrigemData {
  label: string;
  value: number;
  color: string;
  custoMedio: number;
  custoTotal: number;
}

const dadosOrigem: OrigemData[] = [
  {
    label: "Orgânica",
    value: 5400,
    color: "#22c55e",
    custoMedio: 0,
    custoTotal: 0,
  },
  {
    label: "Campanhas Pagas",
    value: 3800,
    color: "#3b82f6",
    custoMedio: 12.5,
    custoTotal: 47500,
  },
  {
    label: "Plataformas Terceiras",
    value: 2100,
    color: "#f59e0b",
    custoMedio: 9.8,
    custoTotal: 20580,
  },
  {
    label: "Indicação",
    value: 1150,
    color: "#a855f7",
    custoMedio: 3.2,
    custoTotal: 3680,
  },
];

const totalEntradas = dadosOrigem.reduce(
  (acc, item) => acc + item.value,
  0
);

/* =====================
   Modal Origem & Atração
===================== */

const ModalOrigemAtracao: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const pieStyle = {
    background: `conic-gradient(${dadosOrigem
      .map((d, i) => {
        const start =
          dadosOrigem
            .slice(0, i)
            .reduce((a, b) => a + b.value, 0) /
          totalEntradas *
          100;
        const end =
          start + (d.value / totalEntradas) * 100;
        return `${d.color} ${start}% ${end}%`;
      })
      .join(", ")})`,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-origem">

        {/* HEADER (FIXO) */}
        <header className="modal-header">
          <div>
            <h3>Origem & Atração</h3>
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

        {/* CONTEÚDO COM SCROLL ÚNICO */}
        <div className="modal-content">

          {/* BODY */}
          <section className="modal-body">

            {/* GRÁFICO */}
            <div className="pie-section">
              <div className="pie-kpi">
                <span className="pie-kpi-label">Entradas Totais</span>
                <strong className="pie-kpi-value">
                  {totalEntradas.toLocaleString()}
                </strong>
              </div>

              <div className="pie-chart" style={pieStyle} />
            </div>

            {/* LEGENDA / DETALHES */}
            <div className="legend-section">
              {dadosOrigem.map((item) => (
                <div key={item.label} className="legend-item">
                  <span
                    className="color-box"
                    style={{ background: item.color }}
                  />
                  <div className="legend-info">
                    <strong>{item.label}</strong>
                    <span>
                      Entradas: {item.value.toLocaleString()}
                    </span>
                    <span>
                      Custo médio: R$ {item.custoMedio.toFixed(2)}
                    </span>
                    <span>
                      Custo total: R$ {item.custoTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* FOOTER (PARTE DO FLUXO) */}
          <footer className="modal-footer">
            <h4>Relatório Executivo</h4>
            <p>
              O período analisado demonstra forte predominância de tráfego
              orgânico, reduzindo o CAC médio global. Campanhas pagas seguem
              relevantes para escala, enquanto indicações apresentam alto
              potencial estratégico com baixo custo marginal. Recomenda-se
              otimização progressiva do mix de aquisição priorizando canais
              orgânicos e referral.
            </p>
          </footer>

        </div>
      </div>
    </div>
  );

};

export default ModalOrigemAtracao;
