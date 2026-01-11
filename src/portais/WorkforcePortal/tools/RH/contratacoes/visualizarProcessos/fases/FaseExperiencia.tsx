import React, { useState } from "react";
import "./styles/FaseExperiencia.css";

export const MOCK_EXPERIENCIAS: Experiencia[] = [
  {
    id: "1",
    colaboradorNome: "Lucas Ferreira",
    cargo: "Desenvolvedor Frontend",
    inicio: "2026-01-02",
    fimPrevisto: "2026-04-02",
    status: "em_andamento",
  },
  {
    id: "2",
    colaboradorNome: "Mariana Alves",
    cargo: "Analista de RH",
    inicio: "2026-01-05",
    fimPrevisto: "2026-04-05",
    status: "concluido",
  },
];

const PeriodoExperiencia: React.FC<PeriodoExperienciaProps> = ({
  experiencias = MOCK_EXPERIENCIAS,
}) => {
  const [experienciaSelecionada, setExperienciaSelecionada] =
    useState<Experiencia | null>(null);

  const emAndamento = experiencias.filter(e => e.status === "em_andamento");
  const concluidas = experiencias.filter(e => e.status === "concluido");
  const canceladas = experiencias.filter(e => e.status === "cancelado");

  return (
    <div className="fase-container">
      {/* EM ANDAMENTO */}
      <section className="fase-section">
        <h5>Período em andamento</h5>
        {emAndamento.length === 0 ? (
          <div className="fase-empty">Nenhum colaborador em período ativo</div>
        ) : (
          <div className="experiencias-grid">
            {emAndamento.map(e => (
              <div
                key={e.id}
                className="experiencia-card em_andamento"
                onClick={() => setExperienciaSelecionada(e)}
              >
                <strong>{e.colaboradorNome}</strong>
                <span>{e.cargo}</span>
                <span>{new Date(e.inicio).toLocaleDateString()} - {new Date(e.fimPrevisto).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONCLUÍDAS */}
      <section className="fase-section">
        <h5>Períodos concluídos</h5>
        {concluidas.length === 0 ? (
          <div className="fase-empty">Nenhum período concluído</div>
        ) : (
          <div className="experiencias-grid">
            {concluidas.map(e => (
              <div
                key={e.id}
                className="experiencia-card concluido"
                onClick={() => setExperienciaSelecionada(e)}
              >
                <strong>{e.colaboradorNome}</strong>
                <span>{e.cargo}</span>
                <span>{new Date(e.inicio).toLocaleDateString()} - {new Date(e.fimPrevisto).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CANCELADAS */}
      <section className="fase-section">
        <h5>Períodos cancelados</h5>
        {canceladas.length === 0 ? (
          <div className="fase-empty">Nenhum período cancelado</div>
        ) : (
          <div className="experiencias-grid">
            {canceladas.map(e => (
              <div
                key={e.id}
                className="experiencia-card cancelado"
                onClick={() => setExperienciaSelecionada(e)}
              >
                <strong>{e.colaboradorNome}</strong>
                <span>{e.cargo}</span>
                <span>{new Date(e.inicio).toLocaleDateString()} - {new Date(e.fimPrevisto).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL FUTURO PARA DETALHES */}
      {experienciaSelecionada && (
        <div className="placeholder-modal">
          Período de {experienciaSelecionada.colaboradorNome}
          <button onClick={() => setExperienciaSelecionada(null)}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default PeriodoExperiencia;
