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
}

interface ModalProps {
  campanha: Campanha | null;
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
    <div className="campanha-fullscreen">
      {/* HEADER */}
      <header className="campanha-header">
        <div className="campanha-header-left">
          {campanha && <h2>{campanha.nome}</h2>}
        </div>

        <button className="campanha-close" onClick={onClose}>
          ✕
        </button>
      </header>

      {/* =========================
         STEPPER — MENU DE DOMÍNIOS
      ========================= */}
      <nav className="campanha-steps">
        {fasesOrdem.map((fase) => (
          <button
            key={fase}
            className={`step ${fase === faseAtiva ? "active" : ""}`}
            onClick={() => setFaseAtiva(fase)}
          >
            {fase}
          </button>
        ))}
      </nav>

      {/* CONTEÚDO */}
      <main className="campanha-content">
        {renderFase()}
      </main>

      {/* FOOTER */}
      <footer className="campanha-footer">
        <button onClick={onClose}>Fechar</button>
      </footer>
    </div>
  );
};

export default ModalCampanhasDados;
