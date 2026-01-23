import React, { useEffect, useState } from "react";
import "./modalCampanhasDados.css";

/* FASES */
import FaseDadosGerais from "./fases/FaseDadosGerais";
import Candidatos from "./fases/FaseCandidatos";
import Entrevistas from "./fases/FaseEntrevistas";
import Treinamentos from "./fases/FaseTreinamentos";
import PeriodoExperiencia from "./fases/FaseExperiencia";
import Efetivados from "./fases/FaseEfetivados";
import Abandonos from "./fases/FaseAbandono";


/* =========================
   TIPAGENS
========================= */

export type Fase =
  | "dadosGerais"
  | "candidatos"
  | "entrevistas"
  | "treinamentos"
  | "experiencia"
  | "efetivados"
  | "abandonos"

export interface Campanha {
  id?: number;
  nome: string;
  status?: "ativo" | "paralisado" | "desativado";
  entrevistas?: any[];
  resumo?: any;
  experiencias?: any[];
  efetivados?: any[];
  abandonos?: any[];
}

interface ModalProps {
  campanha: Campanha | null;
  mode: string;
  onClose: () => void;
}

/* =========================
   FASES DISPONÍVEIS
========================= */

const fasesOrdem: Fase[] = [
  "dadosGerais",
  "candidatos",
  "entrevistas",
  "treinamentos",
  "experiencia",
  "efetivados",
  "abandonos",
];

/* =========================
   COMPONENTE
========================= */

const ModalCampanhasDados: React.FC<ModalProps> = ({
  campanha,
  onClose,
}) => {
  const [faseAtiva, setFaseAtiva] = useState<Fase>("candidatos");

  useEffect(() => {
    if (campanha) {
      setFaseAtiva("candidatos");
    }
  }, [campanha]);

  /* =========================
     RENDERIZAÇÃO DA FASE
  ========================= */

  const renderFase = () => {
    if (!campanha) {
      return (
        <div className="estado-vazio">
          Nenhuma campanha carregada.
        </div>
      );
    }

    switch (faseAtiva) {

      case "dadosGerais":
        return <FaseDadosGerais resumo={campanha.resumo} />;

      case "candidatos":
        return <Candidatos />;

      case "entrevistas":
        return (
          <Entrevistas entrevistas={campanha.entrevistas ?? []} />
        );

      case "treinamentos":
        return (
          <Treinamentos
            participantes={
              campanha.entrevistas
                ?.filter(e => e.aprovado)
                .map(e => ({
                  id: e.id,
                  nome: e.nome,
                  cargo: e.cargo,
                  treinamentoStatus: e.treinamentoStatus ?? "nao_iniciado",
                })) ?? []
            }
          />
        );


      case "experiencia":   // ✅ nova fase
        return <PeriodoExperiencia experiencias={campanha.experiencias ?? []} />;

      case "efetivados":  // ✅ nova fase
        return <Efetivados funcionarios={campanha.efetivados ?? []} />;

      case "abandonos":  // ✅ nova fase
        return <Abandonos abandonos={campanha.abandonos ?? []} />;

      default:
        return null;
    }
  };

  return (
    <div className="rh-fs-modal">
      {/* HEADER */}
      <header className="rh-fs-header">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {campanha && <h3>{campanha.nome}</h3>}
        </div>

        <button className="rh-fs-close" onClick={onClose}>
          ✕
        </button>
      </header>

      {/* =========================
         STEPPER — MENU DE DOMÍNIOS
      ========================= */}
      <nav className="rh-fs-steps">
        {fasesOrdem.map((fase) => (
          <button
            key={fase}
            className={`rh-fs-step-btn ${fase === faseAtiva ? "active" : ""}`}
            onClick={() => setFaseAtiva(fase)}
          >
            {fase}
          </button>
        ))}
      </nav>

      {/* CONTEÚDO */}
      <div className="rh-fs-content">
        {renderFase()}
      </div>

      {/* FOOTER */}
      <footer className="rh-fs-footer">
        <button onClick={onClose}>Fechar</button>
      </footer>
    </div>
  );
};

export default ModalCampanhasDados;
