import React, { useState } from "react";
import "./OperationsHub.css";

// ================================
// IMPORTAÇÃO DOS PAINÉIS
// ================================

import DashboardAquisicao from "./aquisicao/painel";
import DashboardCobranca from "./cobranca/painel";

// ================================
// TIPAGENS
// ================================

type PanelKey =
  | "master"
  | "qualidade"
  | "squads"
  | "workforce"
  | "cx"
  | "finance";

interface PanelConfig {
  key: PanelKey;
  label: string;
  icon: JSX.Element;
  component: React.FC;
  permissionKey: string;
}

// ================================
// MOCK DE PERMISSÕES
// ================================

const userPermissions: string[] = ["master", "qualidade"];

// ================================
// ÍCONES
// ================================

const MasterIcon = () => <span role="img">🧠</span>;
const QualityIcon = () => <span role="img">📊</span>;

// ================================
// REGISTRO DE PAINÉIS
// ================================

const PANELS: PanelConfig[] = [
  {
    key: "master",
    label: "Command Center",
    icon: <MasterIcon />,
    component: DashboardAquisicao,
    permissionKey: "master",
  },
  {
    key: "qualidade",
    label: "Painel de Cobranças",
    icon: <QualityIcon />,
    component: DashboardCobranca,
    permissionKey: "qualidade",
  },
];

// ================================
// COMPONENTE PRINCIPAL
// ================================

const OperationsHub: React.FC = () => {
  const [activePanelKey, setActivePanelKey] =
    useState<PanelKey>("master");

  const [isHeaderCollapsed, setIsHeaderCollapsed] =
    useState<boolean>(false);

  const activePanelConfig = PANELS.find(
    (panel) => panel.key === activePanelKey
  );

  const ActivePanel = activePanelConfig?.component;

  const hasPermission = (key: string) =>
    userPermissions.includes(key);

  return (
    <div className="operations-hub-container">

      {/* HEADER / DOCK RETRÁTIL */}
      <header
        className={`
          operations-hub-header-cards
          ${isHeaderCollapsed ? "collapsed" : ""}
        `}
      >
        {/* BOTÃO CENTRAL DE CONTROLE */}
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
            {PANELS.map(
              (panel) =>
                hasPermission(panel.permissionKey) && (
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
                )
            )}
          </div>
        )}
      </header>

      {/* CONTEÚDO DO PAINEL */}
      <main className="operations-hub-content">
        {ActivePanel ? <ActivePanel /> : null}
      </main>
    </div>
  );
};

export default OperationsHub;
