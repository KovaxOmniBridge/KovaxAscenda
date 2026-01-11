import React, { useState } from "react";
import ModalSquad from "./pages/modalSquads";
import "./modSquads.css";

// Tipo de squad
interface squads {
  id: number;
  nome: string;
  status: "ativo" | "paralisado" | "desativado";
  operacao: string;
}

// Mock inicial de squads
const initialSquads: squads[] = [
  { id: 1, nome: "Equipe financeiro", status: "ativo", operacao: "Financeiro" },
  { id: 2, nome: "Equipe de Analise de documentos", status: "paralisado", operacao: "Analise de documentos" },
  { id: 3, nome: "Estagiário", status: "desativado", operacao: "Estagiário" },
];

const ModSquads: React.FC = () => {
  const [squads, setSquads] = useState<squads[]>(initialSquads);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "ativo" | "paralisado" | "desativado">("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState<squads | null>(null);

  const filteredSquads = squads.filter(squad => 
    squad.nome.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "todos" || squad.status === filter)
  );

  const toggleStatus = (squad: squads) => {
    const nextStatus: Record<string, squads["status"]> = {
      "ativo": "paralisado",
      "paralisado": "desativado",
      "desativado": "ativo",
    };
    setSquads(prev => prev.map(s => s.id === squad.id ? { ...s, status: nextStatus[squad.status] } : s));
  };

  const openModal = (squad?: squads) => {
    setSelectedSquad(squad || null);
    setModalOpen(true);
  };

  return (
    <div className="modSquads-container">
      <div className="modSquads-header">
        <h2>Gestão de squads</h2>
        <p>Configure squads, permissões e políticas de auditoria.</p>
        <div className="modSquads-actions">
          <button onClick={() => openModal()}>Novo Squad</button>
          <input 
            type="text" 
            placeholder="Buscar squad..." 
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

      <div className="modSquads-list">
        {filteredSquads.map(squad => (
          <div key={squad.id} className="modSquads-cell">
            <span className="squad-name">{squad.nome}</span>
            <span className="squad-name">{squad.operacao}</span>
            <div className="button-group">
              <button onClick={() => toggleStatus(squad)} className={`status-${squad.status}`}>
                {squad.status}
              </button>
              <button onClick={() => openModal(squad)}>Configurar</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ModalSquad squad={selectedSquad} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );

};

export default ModSquads;
