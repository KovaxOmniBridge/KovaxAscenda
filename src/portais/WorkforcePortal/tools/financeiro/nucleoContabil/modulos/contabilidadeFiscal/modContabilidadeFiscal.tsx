import React, { useState } from "react";
import FiscalDashboard from "./components/FiscalDashboard";
import FiscalConfiguration from "./components/FiscalConfiguration";
import DocumentConfiguration from "./components/DocumentConfiguration";
import FiscalHistory from "./components/FiscalHistory";
import FiscalReports from "./components/FiscalReports";
import IntelligentReports from "./components/IntelligentReports";
import "./contabilidadeFiscal.css";

type Tab = "dashboard" | "configuracoes" | "documentos" | "historico" | "relatorios" | "relatorios-ia";

const ModContabilidadeFiscal = () => {
    const [activeTab, setActiveTab] = useState<Tab>("dashboard");
    const [isHeaderOpen, setIsHeaderOpen] = useState(true);


    return (
        <div className="cf-module-container">
            {/* Header Area */}
            <div className={`cf-module-header-area ${isHeaderOpen ? 'open' : 'closed'}`}>
                <div className="cf-header-top">
                    <div className="cf-header-title">
                        <h2>Contabilidade Fiscal</h2>
                        <p>Gestão tributária, apuração e compliance.</p>
                    </div>

                    <button
                        className="cf-header-toggle"
                        onClick={() => setIsHeaderOpen(prev => !prev)}
                        aria-expanded={isHeaderOpen}
                    >
                        {isHeaderOpen ? 'Recolher' : 'Expandir'}
                    </button>
                </div>

                {isHeaderOpen && (
                    <div className="cf-tabs-container">
                        <button
                            onClick={() => setActiveTab("dashboard")}
                            className={`cf-tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                        >
                            Visão Geral
                        </button>

                        <button
                            onClick={() => setActiveTab("configuracoes")}
                            className={`cf-tab-button ${activeTab === 'configuracoes' ? 'active' : ''}`}
                        >
                            Configurações Fiscais
                        </button>

                        <button
                            onClick={() => setActiveTab("documentos")}
                            className={`cf-tab-button ${activeTab === 'documentos' ? 'active' : ''}`}
                        >
                            Configuração de Documentos
                        </button>

                        <button
                            onClick={() => setActiveTab("historico")}
                            className={`cf-tab-button ${activeTab === 'historico' ? 'active' : ''}`}
                        >
                            Histórico
                        </button>

                        <button
                            onClick={() => setActiveTab("relatorios")}
                            className={`cf-tab-button ${activeTab === 'relatorios' ? 'active' : ''}`}
                        >
                            Relatórios
                        </button>

                        <button
                            onClick={() => setActiveTab("relatorios-ia")}
                            className={`cf-tab-button ${activeTab === 'relatorios-ia' ? 'active' : ''}`}
                        >
                            Relatórios Inteligentes
                        </button>
                    </div>
                )}
            </div>





            {/* Content Area */}
            <div className="cf-module-content-area">
                {activeTab === "dashboard" && <FiscalDashboard />}
                {activeTab === "configuracoes" && <FiscalConfiguration />}
                {activeTab === "documentos" && <DocumentConfiguration />}
                {activeTab === "historico" && <FiscalHistory />}
                {activeTab === "relatorios" && <FiscalReports />}
                {activeTab === "relatorios-ia" && <IntelligentReports />}
            </div>
        </div>
    );
};

export default ModContabilidadeFiscal;
