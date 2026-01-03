import React from "react";
import "./style/sidebar.css";
import {
  Ferramenta,
  permissoesCargo,
  permissoesUsuario,
} from "./futurasIntegracoes/permissions";

interface SidebarProps {
  onSelect: (id: Ferramenta) => void; // tipado com domínio correto
  onClose: () => void;
  asModal?: boolean;
  user: { id: string; cargo: string };
}

// Catálogo único de ferramentas
interface FerramentaMenu {
  id: Ferramenta;
  label: string;
}

const todasFerramentas: FerramentaMenu[] = [
  { id: "settings", label: "Configurações" },
  { id: "operationsHub", label: "Painel Operacional" },
];

// Regra centralizada de permissão (RBAC híbrido)
const hasPermission = (
  userId: string,
  cargo: string,
  ferramenta: Ferramenta
): boolean => {
  const permissoesPorCargo = permissoesCargo[cargo] || [];
  const permissoesPorUsuario = permissoesUsuario[userId] || [];

  return (
    permissoesPorCargo.includes(ferramenta) ||
    permissoesPorUsuario.includes(ferramenta)
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  onSelect,
  onClose,
  asModal = false,
  user,
}) => {
  const ferramentasDisponiveis = todasFerramentas.filter((item) =>
    hasPermission(user.id, user.cargo, item.id)
  );

  return (
    <>
      {asModal && (
        <div className="wf-sidebar-backdrop" onClick={onClose} />
      )}

      <aside
        className={`wf-sidebar ${asModal ? "wf-sidebar-modal" : ""}`}
        role="navigation"
        aria-label="Menu lateral"
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
          {ferramentasDisponiveis.length === 0 && (
            <span className="wf-sidebar-empty">
              Nenhuma ferramenta disponível
            </span>
          )}

          {ferramentasDisponiveis.map((item) => (
            <button
              key={item.id}
              className="wf-sidebar-item"
              onClick={() => onSelect(item.id)}
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