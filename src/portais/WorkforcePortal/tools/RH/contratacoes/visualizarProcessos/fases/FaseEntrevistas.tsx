import React, { useState } from "react";
import "./styles/FaseEntrevistas.css";

/* =========================
   TIPAGENS
========================= */

export interface Entrevista {
  id: string;
  candidatoNome: string;
  tipo: "individual" | "grupo";
  formato: "online" | "presencial";
  data?: string;
  avaliadores: string[];
  status: "nao_agendada" | "agendada" | "realizada";
}

interface EntrevistasProps {
  entrevistas?: Entrevista[];
}

/* =========================
   MOCK
========================= */

const MOCK_ENTREVISTAS: Entrevista[] = [
  {
    id: "1",
    candidatoNome: "Lucas Ferreira",
    tipo: "individual",
    formato: "online",
    avaliadores: ["Ana RH", "Carlos Tech"],
    status: "nao_agendada",
  },
  {
    id: "2",
    candidatoNome: "Mariana Alves",
    tipo: "grupo",
    formato: "presencial",
    data: "2026-01-15",
    avaliadores: ["Fernanda RH"],
    status: "agendada",
  },
];

/* =========================
   COMPONENTE
========================= */

const Entrevistas: React.FC<EntrevistasProps> = ({
  entrevistas = MOCK_ENTREVISTAS, // 🔒 blindagem crítica
}) => {
  const [entrevistaSelecionada, setEntrevistaSelecionada] =
    useState<Entrevista | null>(null);

  const naoAgendadas = entrevistas.filter(
    (e) => e.status === "nao_agendada"
  );

  const agendadas = entrevistas.filter(
    (e) => e.status !== "nao_agendada"
  );

  return (
    <div className="fase-container">
      {/* NÃO AGENDADAS */}
      <section className="fase-section">
        <h5>Entrevistas pendentes</h5>

        {naoAgendadas.length === 0 ? (
          <div className="fase-empty">
            Nenhuma entrevista pendente.
          </div>
        ) : (
          <div className="entrevistas-grid">
            {naoAgendadas.map((e) => (
              <div
                key={e.id}
                className="entrevista-card pendente"
                onClick={() => setEntrevistaSelecionada(e)}
              >
                <strong>{e.candidatoNome}</strong>
                <span>{e.tipo} • {e.formato}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AGENDADAS */}
      <section className="fase-section">
        <h5>Entrevistas agendadas</h5>

        {agendadas.length === 0 ? (
          <div className="fase-empty">
            Nenhuma entrevista agendada.
          </div>
        ) : (
          <div className="entrevistas-grid">
            {agendadas.map((e) => (
              <div
                key={e.id}
                className="entrevista-card agendada"
              >
                <strong>{e.candidatoNome}</strong>
                <span>{e.data ?? "Data indefinida"}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FUTURO: modal de agendamento */}
      {entrevistaSelecionada && (
        <div className="placeholder-modal">
          Agendar entrevista de {entrevistaSelecionada.candidatoNome}
          <button onClick={() => setEntrevistaSelecionada(null)}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default Entrevistas;
