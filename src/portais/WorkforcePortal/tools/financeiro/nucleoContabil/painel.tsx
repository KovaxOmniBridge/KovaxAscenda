import React, { useState } from "react";
import "./painel.css";
// Importing standardized styles if available in the broader project, for consistency where needed
// Note: We are using specific class names in painel.css to enforce the "technical" look
import "../../RH/styles/universal-format-mods.css";

// ================================
// IMPORTS - MODULES
// ================================
// import ModContabilidadeGeral from "./modulos/contabilidadeGeral/modContabilidadeGeral";
import ModContabilidadeFiscal from "./modulos/contabilidadeFiscal/modContabilidadeFiscal";
import ModContabilidadeGerencial from "./modulos/contabilidadeGerencial/modContabilidadeGerencial";
import ModContabilidadeInternacional from "./modulos/contabilidadeInternacional/modContabilidadeInternacional";
import ModEscrituracao from "./modulos/escrituracao/modEscrituracao";
import ModLivroRazao from "./modulos/livroRazao/modLivroRazao";

// ================================
// TYPES
// ================================
type ModuleKey =
    //    | "geral"
    | "fiscal"
    | "gerencial"
    | "internacional"
    | "escrituracao"
    | "gl";

interface ModuleConfig {
    key: ModuleKey;
    label: string;
    subLabel?: string;
    icon: JSX.Element;
    component: React.ComponentType;
}

// ================================
// ICONS
// ================================
const Icons = {
    //    Geral: () => <span>🏛️</span>,
    Fiscal: () => <span>⚖️</span>,
    Gerencial: () => <span>📈</span>,
    Internacional: () => <span>🌐</span>,
    Escrituracao: () => <span>🖊️</span>,
    GL: () => <span>📒</span>
};

// ================================
// MODULE REGISTRY
// ================================
const MODULES: ModuleConfig[] = [
    /*
        {
            key: "geral",
            label: "Contabilidade Geral",
            subLabel: "General Accounting",
            icon: <Icons.Geral />,
            component: ModContabilidadeGeral
        },
    */
    {
        key: "fiscal",
        label: "Contabilidade Fiscal",
        subLabel: "Tax & Compliance",
        icon: <Icons.Fiscal />,
        component: ModContabilidadeFiscal
    },
    {
        key: "gerencial",
        label: "Contabilidade Gerencial",
        subLabel: "Managerial Accounting",
        icon: <Icons.Gerencial />,
        component: ModContabilidadeGerencial
    },
    {
        key: "internacional",
        label: "Contabilidade Internacional",
        subLabel: "IFRS / GAAP",
        icon: <Icons.Internacional />,
        component: ModContabilidadeInternacional
    },
    {
        key: "escrituracao",
        label: "Escrituração Contábil",
        subLabel: "Bookkeeping",
        icon: <Icons.Escrituracao />,
        component: ModEscrituracao
    },
    {
        key: "gl",
        label: "Livro Razão (GL)",
        subLabel: "General Ledger",
        icon: <Icons.GL />,
        component: ModLivroRazao
    }
];

// ================================
// MAIN COMPONENT
// ================================
const NucleoContabilPanel = (): JSX.Element => {
    const [activeModuleKey, setActiveModuleKey] = useState<ModuleKey>("fiscal");
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);

    const ActiveComponent = MODULES.find(m => m.key === activeModuleKey)?.component;

    return (
        <div className="nucleo-contabil-container">
            {/* TOP DOCK / HEADER */}
            <header className={`nucleo-contabil-header ${isHeaderCollapsed ? 'collapsed' : ''}`}>
                <div className="nucleo-header-top-bar">
                    <div className="nucleo-brand">
                        <span style={{ fontSize: '1.2rem' }}>📐</span>
                        <span>Núcleo Contábil / Accounting Core</span>
                    </div>
                    <button
                        className="nucleo-toggle-btn"
                        onClick={() => setIsHeaderCollapsed(prev => !prev)}
                        title={isHeaderCollapsed ? "Expandir" : "Recolher"}
                    >
                        {isHeaderCollapsed ? "▼" : "▲"}
                    </button>
                </div>

                {!isHeaderCollapsed && (
                    <nav className="nucleo-nav-grid">
                        {MODULES.map(module => (
                            <div
                                key={module.key}
                                className={`nucleo-nav-card ${activeModuleKey === module.key ? 'active' : ''}`}
                                onClick={() => setActiveModuleKey(module.key)}
                            >
                                <div className="nucleo-card-icon">{module.icon}</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="nucleo-card-label">{module.label}</span>
                                    {module.subLabel && (
                                        <span style={{ fontSize: '0.7em', opacity: 0.7 }}>{module.subLabel}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </nav>
                )}
            </header>

            {/* MAIN WORKSPACE */}
            <main className="nucleo-content-area">
                {ActiveComponent ? (
                    <ActiveComponent />
                ) : (
                    <div className="nucleo-empty-state">
                        <h3>Módulo não encontrado</h3>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NucleoContabilPanel;
