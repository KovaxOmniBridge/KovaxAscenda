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
    <div className="modCargos-container">
      <div className="modCargos-header">
        <h2>Gestão de cargos</h2>
        <p>Configure cargos, permissões e políticas de auditoria.</p>
        <div className="modCargos-actions">
          <button onClick={() => openModal()}>Novo Cargo</button>
          <input 
            type="text" 
            placeholder="Buscar cargo..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
          <div className="filter-container">
            <label htmlFor="filter-select">Filtrar por status:</label>
            <select
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

      <div className="modCargos-list">
        {filteredCargos.map(cargo => (
          <div key={cargo.id} className="modCargos-cell">
            <span className="cargo-name">{cargo.nome}</span>
            <div className="button-group">
              <button onClick={() => toggleStatus(cargo)} className={`status-${cargo.status}`}>
                {cargo.status}
              </button>
              <button onClick={() => openModal(cargo)}>Configurar</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ModalCargo cargo={selectedCargo} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );

};

export default ModCargos;
