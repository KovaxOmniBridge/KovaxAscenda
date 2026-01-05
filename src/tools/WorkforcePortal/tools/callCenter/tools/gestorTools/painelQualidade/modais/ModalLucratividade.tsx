import React from "react";
import "./styles/modalLucratividade.css";
import "./styles/modalBase.css";

interface LucratividadePeriodo {
  periodo: string;
  receita: number;
  custos: number;
  lucro: number;
}

interface ModalLucratividadeProps {
  isOpen: boolean;
  onClose: () => void;
  totalReceita: number;
  totalCustos: number;
  margem: number; // %
  dadosPorPeriodo: LucratividadePeriodo[];
}

const ModalLucratividade: React.FC<ModalLucratividadeProps> = ({
  isOpen,
  onClose,
  totalReceita,
  totalCustos,
  margem,
  dadosPorPeriodo,
}) => {
  if (!isOpen) return null;

  const lucroTotal = totalReceita - totalCustos;

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <header className="modal-header">
          <h2>Lucratividade / Perdas</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </header>

        <section className="modal-summary">
          <div className="summary-card receita">
            <span>Receita Total</span>
            <strong>
              {totalReceita.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </div>

          <div className="summary-card custos">
            <span>Custos Totais</span>
            <strong>
              {totalCustos.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </div>

          <div
            className={`summary-card lucro ${
              lucroTotal >= 0 ? "positivo" : "negativo"
            }`}
          >
            <span>Lucro / Prejuízo</span>
            <strong>
              {lucroTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </div>

          <div
            className={`summary-card margem ${
              margem >= 20 ? "boa" : margem >= 10 ? "media" : "baixa"
            }`}
          >
            <span>Margem</span>
            <strong>{margem}%</strong>
          </div>
        </section>

        <section className="modal-description">
          <p>
            Esta visão consolida a performance financeira da operação ao longo do
            período selecionado, correlacionando receita, custos e margem.
            Utilizada como base para decisões estratégicas, priorização de
            squads, ajustes operacionais e validação de ROI.
          </p>
        </section>

        <section className="modal-content">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Receita</th>
                <th>Custos</th>
                <th>Lucro</th>
              </tr>
            </thead>
            <tbody>
              {dadosPorPeriodo.map((item) => (
                <tr key={item.periodo}>
                  <td>{item.periodo}</td>
                  <td>
                    {item.receita.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td>
                    {item.custos.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td
                    className={
                      item.lucro >= 0 ? "valor-positivo" : "valor-negativo"
                    }
                  >
                    {item.lucro.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="modal-footer">
          <p className="insight">
            Margens sustentáveis indicam eficiência sistêmica. Perdas recorrentes
            por período sinalizam gargalos operacionais, desalinhamento de metas
            ou automações ineficazes. Este KPI deve orientar decisões de corte,
            investimento ou reestruturação.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ModalLucratividade;
