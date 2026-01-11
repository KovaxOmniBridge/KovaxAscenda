import React from "react";
import "./styles/FaseAbandono.css";

/* =========================
   TIPAGENS
========================= */

export interface ColaboradorAbandono {
  id: string;
  nome: string;
  cargo?: string;
  motivo?: string;
  dataSaida?: string;
}

interface FaseAbandonoProps {
  abandonos?: ColaboradorAbandono[];
}

/* =========================
   MOCK
========================= */

const MOCK_ABANDONOS: ColaboradorAbandono[] = [
  {
    id: "1",
    nome: "Lucas Ferreira",
    cargo: "Desenvolvedor Front-end",
    motivo: "Desistência voluntária",
    dataSaida: "2026-01-05",
  },
  {
    id: "2",
    nome: "Mariana Alves",
    cargo: "Analista de RH",
    motivo: "Não atingiu metas do período de experiência",
    dataSaida: "2026-01-12",
  },
];

/* =========================
   COMPONENTE
========================= */

const Abandono: React.FC<FaseAbandonoProps> = ({
  abandonos = MOCK_ABANDONOS,
}) => {
  return (
    <div className="fase-container">
      <h5>Colaboradores que abandonaram</h5>

      {abandonos.length === 0 ? (
        <div className="fase-empty">
          Nenhum registro de abandono.
        </div>
      ) : (
        <div className="abandonos-grid">
          {abandonos.map((c) => (
            <div key={c.id} className="abandono-card">
              <div className="card-header">
                <strong>{c.nome}</strong>
                {c.cargo && <span>{c.cargo}</span>}
              </div>
              <div className="card-body">
                {c.motivo && (
                  <p>
                    <strong>Motivo:</strong> {c.motivo}
                  </p>
                )}
                {c.dataSaida && (
                  <p>
                    <strong>Data de saída:</strong> {c.dataSaida}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Abandono;
