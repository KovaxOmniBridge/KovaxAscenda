import React from "react";
import "./styles/FaseTreinamentos.css";


interface TreinamentoParticipante {
  id: number;
  nome: string;
  cargo?: string;
  treinamentoStatus: "concluido" | "em_andamento" | "nao_iniciado";
}

interface Props {
  participantes: TreinamentoParticipante[];
}

const Treinamentos: React.FC<Props> = ({ participantes }) => {
  const total = participantes.length;
  const concluidos = participantes.filter(
    p => p.treinamentoStatus === "concluido"
  ).length;

  return (
    <section className="fase-treinamentos">
      {/* KPI TOPO */}
      <div className="treinamentos-kpi">
        <strong>{concluidos}</strong> de{" "}
        <strong>{total}</strong> treinamentos concluídos
      </div>

      {/* LISTAGEM */}
      <div className="treinamentos-lista">
        {participantes.map(p => (
          <div
            key={p.id}
            className={`treinamento-card status-${p.treinamentoStatus}`}
          >
            <div className="info">
              <span className="nome">{p.nome}</span>
              {p.cargo && <span className="cargo">{p.cargo}</span>}
            </div>

            <span className="status">
              {p.treinamentoStatus === "concluido" && "Concluído"}
              {p.treinamentoStatus === "em_andamento" && "Em andamento"}
              {p.treinamentoStatus === "nao_iniciado" && "Não iniciado"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Treinamentos;
