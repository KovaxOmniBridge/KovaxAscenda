import React from "react";
import "./styles/modalEficienciaSquads.css";
import "./styles/modalBase.css";

interface SquadMetric {
  id: string;
  nome: string;
  eficiencia: number; // %
  volumeAtendimentos: number;
  conversao: number; // %
  satisfacao: number; // CSAT %
  custoOperacional: number;
}

interface ModalEficienciaSquadsProps {
  isOpen: boolean;
  onClose: () => void;
  squads: SquadMetric[];
}

const ModalEficienciaSquads: React.FC<ModalEficienciaSquadsProps> = ({
  isOpen,
  onClose,
  squads,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <header className="modal-header">
          <h2>Eficiência dos Squads</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </header>

        <section className="modal-description">
          <p>
            Este painel avalia a performance consolidada de cada squad em relação
            aos objetivos estratégicos da operação, considerando eficiência,
            conversão, satisfação e custo operacional.
          </p>
        </section>

        <section className="modal-content">
          <table className="squad-table">
            <thead>
              <tr>
                <th>Squad</th>
                <th>Eficiência</th>
                <th>Atendimentos</th>
                <th>Conversão</th>
                <th>CSAT</th>
                <th>Custo Operacional</th>
              </tr>
            </thead>
            <tbody>
              {squads.map((squad) => (
                <tr key={squad.id}>
                  <td>{squad.nome}</td>
                  <td
                    className={
                      squad.eficiencia >= 80
                        ? "status-good"
                        : squad.eficiencia >= 60
                        ? "status-warning"
                        : "status-critical"
                    }
                  >
                    {squad.eficiencia}%
                  </td>
                  <td>{squad.volumeAtendimentos}</td>
                  <td>{squad.conversao}%</td>
                  <td>{squad.satisfacao}%</td>
                  <td>
                    {squad.custoOperacional.toLocaleString("pt-BR", {
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
            Squads com alta eficiência e baixo custo operacional representam
            maior aderência ao objetivo estratégico. Squads abaixo do benchmark
            exigem revisão de processos, capacitação ou redistribuição de carga.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ModalEficienciaSquads;
