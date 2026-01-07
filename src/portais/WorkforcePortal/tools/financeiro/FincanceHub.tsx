import React, { useState } from "react";
import "./FincanceHub.css"

// ================================
// IMPORTAÇÃO DOS PAINÉIS FINANCEIROS
// ================================

import FinanceConfigPanel from "./Panels/configuracao";

// ================================
// TIPAGENS
// ================================

type PanelKey =
  | "Configuracao"


interface PanelConfig {
  key: PanelKey;
  label: string;
  icon: JSX.Element;
  component: React.FC;
  permissionKey: string;
}

// ================================
// MOCK DE PERMISSÕES DO USUÁRIO
// ================================

const userPermissions: string[] = [
  "Configuracao",
];

// ================================
// ÍCONES SIMPLES (placeholder)
// ================================

const OverviewIcon = () => <span role="img">💰</span>;
const CobrançaIcon = () => <span role="img">📊</span>;
const RelatoriosIcon = () => <span role="img">📑</span>;
const ConfigIcon = () => <span role="img">⚙️</span>;
const AcoesIcon = () => <span role="img">🎯</span>;

// ================================
// REGISTRO DE PAINÉIS FINANCEIROS
// ================================

const FINANCE_PANELS: PanelConfig[] = [
  {
    key: "Configuracao",
    label: "Configuração",
    icon: <ConfigIcon />,
    component: FinanceConfigPanel,
    permissionKey: "Configuracao",
  },
];

// ================================
// COMPONENTE PRINCIPAL DO HUB FINANCEIRO
// ================================

const FinanceHub: React.FC = () => {
  const [activePanelKey, setActivePanelKey] = useState<PanelKey>(
    "Configuracao"
  );
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(
    false
  );

  const activePanelConfig = FINANCE_PANELS.find(
    (panel) => panel.key === activePanelKey
  );

  const ActivePanel = activePanelConfig?.component;

  const hasPermission = (key: string) =>
    userPermissions.includes(key);

  return (
    <div className="finance-hub-container">

      {/* HEADER / DOCK RETRÁTIL */}
      <header
        className={`finance-hub-header-cards ${
          isHeaderCollapsed ? "collapsed" : ""
        }`}
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
            {FINANCE_PANELS.map(
              (panel) =>
                hasPermission(panel.permissionKey) && (
                  <div
                    key={panel.key}
                    className={`hub-card-button ${
                      panel.key === activePanelKey ? "active" : ""
                    }`}
                    onClick={() => setActivePanelKey(panel.key)}
                  >
                    <div className="hub-card-icon">{panel.icon}</div>
                    <div className="hub-card-label">{panel.label}</div>
                  </div>
                )
            )}
          </div>
        )}
      </header>

      {/* CONTEÚDO DO PAINEL */}
      <main className="finance-hub-content">
        {ActivePanel ? <ActivePanel /> : null}
      </main>
    </div>
  );
};

export default FinanceHub;
