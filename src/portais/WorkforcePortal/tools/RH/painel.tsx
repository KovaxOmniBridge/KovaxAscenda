import React, { useState } from "react";
import "./painel.css";

// ================================
// IMPORTAÇÃO DOS PAINÉIS
// ================================

import ModCampanhas from "./contratacoes/modCampanhas";
import ModCargos from "./cargos/modCargos";

// ================================
// TIPAGENS
// ================================

type PanelKey = "master" | "qualidade";

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

const userPermissions: string[] = ["master", "qualidade"];

const hasPermission = (key: string): boolean =>
  userPermissions.includes(key);

// ================================
// ÍCONES
// ================================

const MasterIcon = () => (
  <span role="img" aria-label="Comando Estratégico">
    🧠
  </span>
);

const QualityIcon = () => (
  <span role="img" aria-label="Configuração de Cargos">
    📊
  </span>
);

// ================================
// REGISTRO DE PAINÉIS
// ================================

const PANELS: PanelConfig[] = [
  {
    key: "master",
    label: "Comando Campanhas",
    icon: <MasterIcon />,
    component: ModCampanhas,
    permissionKey: "master",
  },
  {
    key: "qualidade",
    label: "Configuração de Cargos",
    icon: <QualityIcon />,
    component: ModCargos,
    permissionKey: "qualidade",
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
    useState<PanelKey>("master");

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
                  ${
                    panel.key === activePanelKey
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
