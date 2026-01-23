import React, { useState } from "react";
import "./painel.css";
/* Novos estilos padronizados */
import "./styles/universal-format-mods.css";
import "./styles/universal-format-modais.css";
import "./styles/header.css";
import "./styles/cards.css";

// ================================
// IMPORTAÇÃO DOS PAINÉIS
// ================================

import GerenciamentoPessoas from "./gerenciamento/pessoal/modGerenciamento";
import ModCampanhas from "./gerenciamento/contratacoes/modCampanhas";
import Terceiros from "./gerenciamento/terceiros/modTerceiros";
import ModOperacoes from "./estruturais/operacoes/modOperacoes";
import ModSquads from "./estruturais/squads/modSquads";
import ModCargos from "./estruturais/cargos/modCargos";

// ================================
// TIPAGENS
// ================================

type PanelKey = "campanhas" | "cargos" | "squads" | "operacoes" | "terceiros" | "pessoas";

interface PanelConfig {
  key: PanelKey;
  label: string;
  icon: JSX.Element;
  component: React.ComponentType;
  permissionKey: string;
}

// ================================
// MOCK DE PERMISSÕES (RBAC-ready)
// ================================

const userPermissions: string[] = ["campanhas", "cargos", "terceiros", "squads", "operacoes", "pessoas"];

const hasPermission = (key: string): boolean =>
  userPermissions.includes(key);

// ================================
// ÍCONES
// ================================

const CampanhasIcon = () => (
  <span role="img" aria-label="Comando Estratégico">
    🧠
  </span>
);

const CargosIcon = () => (
  <span role="img" aria-label="Configuração de Cargos">
    📊
  </span>
);

const TerceirosIcon = () => (
  <span role="img" aria-label="Gerenciamento de Terceiros">
    🤝
  </span>
);

const SquadsIcon = () => (
  <span role="img" aria-label="Gestão de Squads">
    🛡️
  </span>
);

const OperacoesIcon = () => (
  <span role="img" aria-label="Hub de Operações">
    ⚙️
  </span>
);

const PessoasIcon = () => (
  <span role="img" aria-label="Gerenciamento de Pessoas">
    👥
  </span>
);


// ================================
// REGISTRO DE PAINÉIS
// ================================

const PANELS: PanelConfig[] = [
  {
    key: "pessoas",
    label: "Gerenciamento de Pessoas",
    icon: <PessoasIcon />,
    component: GerenciamentoPessoas,
    permissionKey: "pessoas",
  },
  {
    key: "campanhas",
    label: "Comando Campanhas",
    icon: <CampanhasIcon />,
    component: ModCampanhas,
    permissionKey: "campanhas",
  },
  {
    key: "terceiros",
    label: "Gerenciamento de Terceiros",
    icon: <TerceirosIcon />,
    component: Terceiros,
    permissionKey: "terceiros",
  },
  {
    key: "squads",
    label: "Gestão de Squads",
    icon: <SquadsIcon />,
    component: ModSquads,
    permissionKey: "squads",
  },
  {
    key: "operacoes",
    label: "Hub de Operações",
    icon: <OperacoesIcon />,
    component: ModOperacoes,
    permissionKey: "operacoes",
  },
  {
    key: "cargos",
    label: "Configuração de Cargos",
    icon: <CargosIcon />,
    component: ModCargos,
    permissionKey: "cargos",
  },
];

// ================================
// FALLBACK DE SEGURANÇA
// ================================

const EmptyState = (): JSX.Element => (
  <div className="hub-empty-state">
    <h3>Painel indisponível</h3>
    <p>
      O módulo selecionado não está acessível ou não foi corretamente
      configurado.
    </p>
  </div>
);

// ================================
// COMPONENTE PRINCIPAL
// ================================

const OperationsHubRH = (): JSX.Element => {
  const [activePanelKey, setActivePanelKey] =
    useState<PanelKey>("campanhas");

  const [isHeaderCollapsed, setIsHeaderCollapsed] =
    useState<boolean>(false);

  const activePanelConfig = PANELS.find(
    (panel) =>
      panel.key === activePanelKey &&
      hasPermission(panel.permissionKey)
  );

  const ActivePanel = activePanelConfig?.component;

  return (
    <div className="operations-hub-container">
      {/* HEADER / DOCK RETRÁTIL */}
      <header
        className={`
          operations-hub-header-cards
          ${isHeaderCollapsed ? "collapsed" : ""}
        `}
      >
        {/* BOTÃO CENTRAL */}
        <button
          className="hub-header-toggle-centered"
          onClick={() =>
            setIsHeaderCollapsed((prev) => !prev)
          }
          title={
            isHeaderCollapsed
              ? "Expandir navegação"
              : "Recolher navegação"
          }
        >
          {isHeaderCollapsed ? "▾" : "▴"}
        </button>

        {/* CARDS DE NAVEGAÇÃO */}
        {!isHeaderCollapsed && (
          <div className="hub-cards-wrapper">
            {PANELS.filter((panel) =>
              hasPermission(panel.permissionKey)
            ).map((panel) => (
              <div
                key={panel.key}
                className={`
                  hub-card-button
                  ${panel.key === activePanelKey
                    ? "active"
                    : ""
                  }
                `}
                onClick={() =>
                  setActivePanelKey(panel.key)
                }
              >
                <div className="hub-card-icon">
                  {panel.icon}
                </div>
                <div className="hub-card-label">
                  {panel.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* CONTEÚDO */}
      <main className="operations-hub-content">
        {ActivePanel ? <ActivePanel /> : <EmptyState />}
      </main>
    </div>
  );
};

export default OperationsHubRH;
