import React from "react";
import "./styles/modaConversao.css";

interface ConversaoClienteData {
  label: string;
  entradas: number;
  clientes: number;
  ticketMedio: number;
  receitaTotal: number;
  color: string;
}

const dadosConversaoClientes: ConversaoClienteData[] = [
  {
    label: "Orgânica",
    entradas: 5400,
    clientes: 620,
    ticketMedio: 180,
    receitaTotal: 111600,
    color: "#22c55e",
  },
  {
    label: "Campanhas Pagas",
    entradas: 3800,
    clientes: 410,
    ticketMedio: 220,
    receitaTotal: 90200,
    color: "#3b82f6",
  },
  {
    label: "Plataformas Terceiras",
    entradas: 2100,
    clientes: 180,
    ticketMedio: 195,
    receitaTotal: 35100,
    color: "#f59e0b",
  },
  {
    label: "Indicação",
    entradas: 1150,
    clientes: 260,
    ticketMedio: 260,
    receitaTotal: 67600,
    color: "#a855f7",
  },
];


const totalClientes = dadosConversaoClientes.reduce(
  (acc, item) => acc + item.clientes,
  0
);

const receitaTotal = dadosConversaoClientes.reduce(
  (acc, item) => acc + item.receitaTotal,
  0
);


const ModalConversaoClientes: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const pieStyle = {
    background: `conic-gradient(${dadosConversaoClientes
      .map((d, i) => {
        const start =
          dadosConversaoClientes
            .slice(0, i)
            .reduce((a, b) => a + b.clientes, 0) /
          totalClientes *
          100;

        const end =
          start + (d.clientes / totalClientes) * 100;

        return `${d.color} ${start}% ${end}%`;
      })
      .join(", ")})`,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-conversao-clientes">

        {/* HEADER */}
        <header className="modal-header">
          <div>
            <h3>Conversão em Clientes</h3>
          </div>

          <div className="period-reader">
            <label>Período</label>
            <select>
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
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
                  Clientes Convertidos
                </span>
                <strong className="pie-kpi-value positive">
                  {totalClientes.toLocaleString()}
                </strong>
              </div>

              <div className="pie-chart" style={pieStyle} />

              <span className="pie-kpi-sub">
                Receita total: R$ {receitaTotal.toLocaleString()}
              </span>
            </div>

            {/* DETALHAMENTO */}
            <div className="legend-section">
              {dadosConversaoClientes.map((item) => {
                const taxa =
                  (item.clientes / item.entradas) * 100;

                return (
                  <div key={item.label} className="legend-item">
                    <span
                      className="color-box"
                      style={{ background: item.color }}
                    />

                    <div className="legend-info">
                      <strong>{item.label}</strong>

                      <span>
                        Clientes: {item.clientes.toLocaleString()}
                      </span>

                      <span>
                        Conversão: {taxa.toFixed(1)}%
                      </span>

                      <span>
                        Ticket médio: R$ {item.ticketMedio}
                      </span>

                      <span className="highlight">
                        Receita: R$ {item.receitaTotal.toLocaleString()}
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
              O funil demonstra forte eficiência na conversão final,
              com destaque para canais de indicação e tráfego orgânico,
              que combinam alta taxa de conversão e maior ticket médio.
              Campanhas pagas sustentam volume relevante, porém exigem
              otimização contínua de CAC para maximização do LTV.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ModalConversaoClientes;
