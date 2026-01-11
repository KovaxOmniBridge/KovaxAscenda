import React from "react";
import "./styles/FaseEfetivados.css"; // CSS dedicado para essa fase

/* =========================
   TIPAGENS
========================= */

export interface FuncionarioEfetivado {
  id: string;
  nome: string;
  cargo: string;
  dataEfetivacao?: string; // opcional, pode mostrar a data da efetivação
}

interface EfetivadosProps {
  funcionarios: FuncionarioEfetivado[];
}

/* =========================
   COMPONENTE
========================= */

const Efetivados: React.FC<EfetivadosProps> = ({ funcionarios }) => {
  return (
    <div className="fase-container">
      <h5>Funcionários Efetivados</h5>

      {funcionarios.length === 0 ? (
        <div className="fase-empty">Nenhum funcionário efetivado.</div>
      ) : (
        <div className="funcionarios-grid">
          {funcionarios.map((f) => (
            <div key={f.id} className="funcionario-card">
              <div className="card-header">
                <strong>{f.nome}</strong>
                {f.dataEfetivacao && (
                  <span className="data-efetivacao">
                    Efetivado em: {new Date(f.dataEfetivacao).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="card-body">
                <span>{f.cargo}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Efetivados;
