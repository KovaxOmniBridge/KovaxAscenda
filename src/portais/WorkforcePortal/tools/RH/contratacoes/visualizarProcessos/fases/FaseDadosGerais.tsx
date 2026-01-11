import React from "react";
import "./styles/FaseDadosGerais.css";

export interface CampanhaResumo {
  totalCandidatos?: number;
  entrevistasAgendadas?: number;
  treinamentosConcluidos?: number;
  periodoExperiencia?: number;
  efetivados?: number;
  abandonos?: number;
}

interface FaseDadosGeraisProps {
  resumo?: CampanhaResumo;
}

/* =========================
   MOCK
========================= */

const MOCK_RESUMO: CampanhaResumo = {
  totalCandidatos: 120,
  entrevistasAgendadas: 85,
  treinamentosConcluidos: 75,
  periodoExperiencia: 60,
  efetivados: 50,
  abandonos: 10,
};

/* =========================
   COMPONENTE
========================= */

const FaseDadosGerais: React.FC<FaseDadosGeraisProps> = ({
  resumo = MOCK_RESUMO,
}) => {
  return (
    <div className="fase-container">
      <h5>Resumo da Campanha</h5>

      <div className="resumo-grid">
        <div className="resumo-card">
          <strong>{resumo.totalCandidatos ?? 0}</strong>
          <span>Total de candidatos</span>
        </div>

        <div className="resumo-card">
          <strong>{resumo.entrevistasAgendadas ?? 0}</strong>
          <span>Entrevistas agendadas</span>
        </div>

        <div className="resumo-card">
          <strong>{resumo.treinamentosConcluidos ?? 0}</strong>
          <span>Treinamentos concluídos</span>
        </div>

        <div className="resumo-card">
          <strong>{resumo.periodoExperiencia ?? 0}</strong>
          <span>Período de experiência</span>
        </div>

        <div className="resumo-card">
          <strong>{resumo.efetivados ?? 0}</strong>
          <span>Efetivados</span>
        </div>

        <div className="resumo-card">
          <strong>{resumo.abandonos ?? 0}</strong>
          <span>Abandonos</span>
        </div>
      </div>
    </div>
  );
};

export default FaseDadosGerais;
