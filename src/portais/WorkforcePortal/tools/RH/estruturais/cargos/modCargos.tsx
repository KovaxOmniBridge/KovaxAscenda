import React, { useState } from "react";
import ModalCargo from "./pages/modalCargos";
import "./modCargos.css";

// Tipo de cargo
interface Cargo {
  id: number;
  nome: string;
  status: "ativo" | "paralisado" | "desativado";
}

// Mock inicial de cargos
const initialCargos: Cargo[] = [
  { id: 1, nome: "Administrador", status: "ativo" },
  { id: 2, nome: "Analista", status: "paralisado" },
  { id: 3, nome: "Estagiário", status: "desativado" },
];

const ModCargos: React.FC = () => {
  const [cargos, setCargos] = useState<Cargo[]>(initialCargos);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "ativo" | "paralisado" | "desativado">("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);

  const filteredCargos = cargos.filter(cargo =>
    cargo.nome.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "todos" || cargo.status === filter)
  );

  const toggleStatus = (cargo: Cargo) => {
    const nextStatus: Record<string, Cargo["status"]> = {
      "ativo": "paralisado",
      "paralisado": "desativado",
      "desativado": "ativo",
    };
    setCargos(prev => prev.map(c => c.id === cargo.id ? { ...c, status: nextStatus[cargo.status] } : c));
  };

  const openModal = (cargo?: Cargo) => {
    setSelectedCargo(cargo || null);
    setModalOpen(true);
  };

  return (
    <div className="rh-module-container">
      <div className="rh-page-header">
        <div className="rh-page-header-title">
          <h2>Gestão de cargos</h2>
          <p>Configure cargos, permissões e políticas de auditoria.</p>
        </div>
        <div className="rh-page-header-actions">
          <button className="rh-btn-primary" onClick={() => openModal()}>Novo Cargo</button>
        </div>

        <div className="rh-input-group">
          <input
            type="text"
            className="rh-input"
            placeholder="Buscar cargo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <div className="filter-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="filter-select" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>Filtrar por status:</label>
            <select
              className="rh-select"
              id="filter-select"
              value={filter}
              onChange={e => setFilter(e.target.value as any)}
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="paralisado">Paralisado</option>
              <option value="desativado">Desativado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rh-module-content-area">
        <div className="rh-cards-grid">
          {filteredCargos.map(cargo => (
            <div key={cargo.id} className="rh-card">
              <div className="rh-card-header">
                <h3>{cargo.nome}</h3>
                <span className={`rh-badge ${cargo.status}`}>
                  {cargo.status}
                </span>
              </div>

              <div className="rh-card-body">
                <p onClick={() => openModal(cargo)}>
                  Clique em configurar para editar permissões e detalhes deste cargo.
                </p>
              </div>

              <div className="rh-card-actions">
                <button
                  onClick={() => toggleStatus(cargo)}
                  className="rh-btn-secondary"
                  title="Alterar Status"
                >
                  {cargo.status === 'ativo' ? 'Desativar' : 'Ativar'}
                </button>
                <button onClick={() => openModal(cargo)} className="rh-btn-primary" style={{ height: '32px', padding: '0 12px', fontSize: '13px' }}>
                  Configurar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCargos.length === 0 && (
          <div className="rh-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--rh-text-secondary)', gridColumn: '1/-1' }}>
            Nenhum cargo encontrado.
          </div>
        )}
      </div>

      {modalOpen && (
        <ModalCargo cargo={selectedCargo} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default ModCargos;
