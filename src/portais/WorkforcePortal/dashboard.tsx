import React, { useState } from "react";
import "./style/dashboard.css";
import Header from "./intens/header";
import { tools } from "./tools";
import UtilitiesModal from "./intens/utilidades";
import Sidebar from "./intens/sidebar";

const Dashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [showUtilities, setShowUtilities] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarToggle = () => {
    setShowSidebar(prev => !prev);
  };

  const ActiveTool = activeComponent ? tools[activeComponent] : null;

  return (
    <div className="wf-dashboard-layout">
      {/* Header fixo */}
      <div className="wf-dashboard-header">
        <Header
          setShowUtilities={setShowUtilities}
          onOpenSidebar={handleSidebarToggle}
        />
      </div>

      <div className="wf-main-content">
        {/* Sidebar como modal ou fixa */}
        {showSidebar && (
          <Sidebar
            asModal={showSidebar}
            onClose={() => setShowSidebar(false)}
            onSelect={setActiveComponent}
            user={{ id: "123", cargo: "administrador" }}
          />
        )}

        {/* Área de renderização das páginas internas */}
        <main className="wf-content-area">
          {ActiveTool ? (
            <div className="wf-dashboard-content">
              <ActiveTool />
            </div>
          ) : (
            <div className="wf-dashboard-placeholder">
              Selecione uma ferramenta ou utilidade...
            </div>
          )}
        </main>
      </div>

      {/* Modal de utilidades */}
      {showUtilities && (
        <UtilitiesModal
          onClose={() => setShowUtilities(false)}
          onSelect={setActiveComponent}
        />
      )}
    </div>
  );
};

export default Dashboard;
