import React from "react";
import "./painelOperacao.css";

/* ================================
   IMPORTAÇÃO DOS MÓDULOS
================================ */

import RealtimeModule from "./modulos/atendimentoTempoReal/RealtimeServiceModule";
import DigitalModule from "./modulos/atendimentoDigital/DigitalServiceModule";
import AutomationModule from "./modulos/atendimentoAutomatizado/AutomationServiceModule";

/* ================================
   TIPAGENS ESTRATÉGICAS
================================ */

type SquadStatus = "healthy" | "warning" | "critical";
type SquadType = "realtime" | "digital" | "automation";
type SquadObjective = "vendas" | "suporte" | "cobranca";

/* ================================
   DEFINIÇÃO DOS SQUADS (META)
================================ */

type SquadConfig = {
  id: string;
  name: string;
  type: SquadType;
  status: SquadStatus;
  objective: SquadObjective;
  Module: React.FC;
};

const squadsConfig: SquadConfig[] = [
  {
    id: "squad-rt",
    name: "Atendimento em Tempo Real",
    type: "realtime",
    status: "warning",
    objective: "suporte",
    Module: RealtimeModule
  },
  {
    id: "squad-digital",
    name: "Atendimento Digital",
    type: "digital",
    status: "healthy",
    objective: "vendas",
    Module: DigitalModule
  },
  {
    id: "squad-bot",
    name: "Atendimento Automatizado",
    type: "automation",
    status: "healthy",
    objective: "cobranca",
    Module: AutomationModule
  }
];

/* ================================
   HELPERS SEMÂNTICOS
================================ */

const statusLabel = (status: SquadStatus) => {
  if (status === "healthy") return "Saudável";
  if (status === "warning") return "Atenção";
  return "Crítico";
};

/* ================================
   COMPONENTE PRINCIPAL
================================ */

const PainelOperacao: React.FC = () => {
  return (
    <div className="operational-panel-container">
      {squadsConfig.map((squad) => {
        const Module = squad.Module;

        return (
          <section
            key={squad.id}
            className={`
              squad-card
              squad-${squad.type}
              status-${squad.status}
            `}
          >
            {/* HEADER DO SQUAD */}
            <header className="squad-header">
              <div>
                <h2 className="squad-title">{squad.name}</h2>
              </div>

              <span className={`squad-status status-${squad.status}`}>
                {statusLabel(squad.status)}
              </span>
            </header>

            {/* MÓDULO ESPECIALIZADO */}
            <div className="squad-module-container">
              <Module />
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default PainelOperacao;
