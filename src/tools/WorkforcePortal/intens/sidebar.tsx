import React from "react";
import "./style/sidebar.css";
import { Ferramenta, permissoesCargo, permissoesUsuario } from "./futurasIntegracoes/permissions";

interface SidebarProps {
  onSelect: (id: string) => void; // id da ferramenta
  onClose: () => void;
  asModal?: boolean;
  user: { id: string; cargo: string };
}

// Apenas a ferramenta que temos
const todasFerramentas: { id: Ferramenta; label: string }[] = [
  { id: "settings", label: "Configurações" },
];

const Sidebar: React.FC<SidebarProps> = ({ onSelect, onClose, asModal = false, user }) => {
  const ferramentasDisponiveis = todasFerramentas.filter(item => {
    const cargoPermissoes = permissoesCargo[user.cargo] || [];
    const usuarioPermissoes = permissoesUsuario[user.id] || [];
    return cargoPermissoes.includes(item.id) || usuarioPermissoes.includes(item.id);
  });

  return (
    <>
      {asModal && <div className="wf-sidebar-backdrop" onClick={onClose} />}

      <aside
        className={`wf-sidebar ${asModal ? "wf-sidebar-modal" : ""}`}
        role="navigation"
      >
        <div className="wf-sidebar-header">
          <h3>Menu</h3>
          <button
            className="wf-sidebar-close"
            onClick={onClose}
            aria-label="Fechar sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="wf-sidebar-nav">
          {ferramentasDisponiveis.map((item) => (
            <button
              key={item.id}
              className="wf-sidebar-item"
              onClick={() => onSelect(item.id)} // <- Corrigido aqui
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
