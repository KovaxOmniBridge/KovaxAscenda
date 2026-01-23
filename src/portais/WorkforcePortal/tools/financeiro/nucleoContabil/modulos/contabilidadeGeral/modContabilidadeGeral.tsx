import React, { useState } from "react";
import PlanoContas from "./components/PlanoContas";
import BalancoPatrimonial from "./components/BalancoPatrimonial";
import "./contabilidadeGeral.css";

type Tab = "dashboard" | "plano_contas" | "balanco";

const ModContabilidadeGeral = () => {
    const [activeTab, setActiveTab] = useState<Tab>("plano_contas");

    return (
        <div className="h-full flex flex-col conta-geral-theme">
            <div className="p-4 bg-white border-b border-gray-200">
                <div className="conta-tabs">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`conta-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    >
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setActiveTab("plano_contas")}
                        className={`conta-tab-btn ${activeTab === 'plano_contas' ? 'active' : ''}`}
                    >
                        Plano de Contas
                    </button>
                    <button
                        onClick={() => setActiveTab("balanco")}
                        className={`conta-tab-btn ${activeTab === 'balanco' ? 'active' : ''}`}
                    >
                        Balanço Patrimonial
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                {activeTab === "dashboard" && (
                    <div className="p-4 bg-white rounded shadow-sm border">
                        <h3 className="text-lg font-medium text-gray-900">Resumo da Contabilidade</h3>
                        <p className="text-gray-500 mt-2">Visão consolidada dos principais indicadores contábeis.</p>
                    </div>
                )}
                {activeTab === "plano_contas" && <PlanoContas />}
                {activeTab === "balanco" && <BalancoPatrimonial />}
            </div>
        </div>
    );
};

export default ModContabilidadeGeral;
