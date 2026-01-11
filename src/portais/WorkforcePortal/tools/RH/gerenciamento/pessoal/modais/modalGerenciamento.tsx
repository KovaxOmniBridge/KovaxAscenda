import React, { useEffect, useState } from "react";
import "./modalGerenciamento.css";

/* =========================
   FASES (DOMÍNIOS)
========================= */

import PerfilUsuario from "./fases/dadosGerais";
import AvaliacoesCorporativas from "./fases/desempenho";
import FolhaPagamento from "./fases/folhaPagamento";
import Aprendizado from "./fases/aprendizado";
import RelatorioUsuario from "./fases/relatorio";

/* =========================
   TIPAGENS
========================= */

export type Fase =
  | "perfilUsuario"
  | "avaliacoesCorporativas"
  | "folhaPagamento"
  | "aprendizado"
  | "relatorioUsuario";

export interface UsuarioGerenciado {
  id: number;
  nome: string;
  status?: "ativo" | "inativo" | "afastado";
}

/* =========================
   PROPS DO MODAL
========================= */

interface ModalProps {
  usuario: UsuarioGerenciado | null;
  onClose: () => void;
}

/* =========================
   ORDEM DAS FASES
========================= */

const fasesOrdem: { id: Fase; label: string }[] = [
  { id: "perfilUsuario", label: "Perfil" },
  { id: "avaliacoesCorporativas", label: "Avaliações" },
  { id: "folhaPagamento", label: "Folha" },
  { id: "aprendizado", label: "Aprendizado" },
  { id: "relatorioUsuario", label: "Relatório" },
];

/* =========================
   MOCKS (TEMPORÁRIOS)
========================= */

const usuarioMock = {
  nome: "Carlos Henrique",
  cargo: "Analista de Operações",
  operacao: "Customer Experience",
};

const insightsMock = [
  {
    titulo: "Alto engajamento operacional",
    descricao:
      "O colaborador apresenta constância de performance acima da média do time.",
    nivel: "positivo" as const,
  },
  {
    titulo: "Risco de sobrecarga",
    descricao:
      "Indicadores de jornada sugerem possível exaustão em médio prazo.",
    nivel: "atencao" as const,
  },
];

const avaliacoesMock = [
  {
    avaliador: "Mariana Alves",
    cargo: "Gestora de Operações",
    data: "2025-01-10",
    comentario:
      "Excelente postura profissional, com forte senso de responsabilidade.",
  },
];

/* =========================
   COMPONENTE
========================= */

const ModalGerenciamento: React.FC<ModalProps> = ({
  usuario,
  onClose,
}) => {
  const [faseAtiva, setFaseAtiva] = useState<Fase>("perfilUsuario");

  useEffect(() => {
    if (usuario) {
      setFaseAtiva("perfilUsuario");
    }
  }, [usuario]);

  /* =========================
     RENDERIZAÇÃO DA FASE
  ========================= */

  const renderFase = () => {
    if (!usuario) {
      return (
        <div className="estado-vazio">
          Nenhum colaborador carregado.
        </div>
      );
    }

    switch (faseAtiva) {
      case "perfilUsuario":
        return <PerfilUsuario />;

      case "avaliacoesCorporativas":
        return <AvaliacoesCorporativas />;

      case "folhaPagamento":
        return <FolhaPagamento />;

      case "aprendizado":
        return <Aprendizado />;

      case "relatorioUsuario":
        return (
          <RelatorioUsuario
            usuario={usuarioMock}
            insightsIA={insightsMock}
            avaliacoesHumanas={avaliacoesMock}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="usuario-fullscreen">
      {/* HEADER */}
      <header className="usuario-header">
        <div className="usuario-header-left">
          {usuario && <h2>{usuario.nome}</h2>}
        </div>

        <button className="usuario-close" onClick={onClose}>
          ✕
        </button>
      </header>

      {/* =========================
         STEPPER — DOMÍNIOS
      ========================= */}
      <nav className="usuario-steps">
        {fasesOrdem.map(({ id, label }) => (
          <button
            key={id}
            className={`step ${id === faseAtiva ? "active" : ""}`}
            onClick={() => setFaseAtiva(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* CONTEÚDO */}
      <main className="usuario-content">
        {renderFase()}
      </main>

      {/* FOOTER */}
      <footer className="usuario-footer">
        <button onClick={onClose}>Fechar</button>
      </footer>
    </div>
  );
};

export default ModalGerenciamento;
