import React, { useState } from "react";
import ModalAmbientes from "./pages/modalAmbientes";
import "./modAmbientes.css";

// Tipo de ambiente
interface Ambiente {
  id: number;
  nome: string;
  status: "ativo" | "paralisado" | "desativado";
}

// Mock inicial de ambientes
const initialAmbientes: Ambiente[] = [
  { id: 1, nome: "Administrador", status: "ativo" },
  { id: 2, nome: "Analista", status: "paralisado" },
  { id: 3, nome: "Estagiário", status: "desativado" },
];

const ModAmbientes: React.FC = () => {
  const [ambientes, setAmbientes] = useState<Ambiente[]>(initialAmbientes);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "ativo" | "paralisado" | "desativado">("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAmbiente, setSelectedAmbiente] = useState<Ambiente | null>(null);

  const filteredAmbientes = ambientes.filter(ambiente => 
    ambiente.nome.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "todos" || ambiente.status === filter)
  );

  const toggleStatus = (ambiente: Ambiente) => {
    const nextStatus: Record<string, Ambiente["status"]> = {
      "ativo": "paralisado",
      "paralisado": "desativado",
      "desativado": "ativo",
    };
    setAmbientes(prev => prev.map(a => a.id === ambiente.id ? { ...a, status: nextStatus[ambiente.status] } : a));
  };

  const openModal = (ambiente?: Ambiente) => {
    setSelectedAmbiente(ambiente || null);
    setModalOpen(true);
  };

  return (
    <div className="modAmbientes-container">
      <div className="modAmbientes-header">
        <h2>Gestão de ambientes</h2>
        <p>Configure ambientes, permissões e políticas de auditoria.</p>
        <div className="modAmbientes-actions">
          <button onClick={() => openModal()}>Novo Ambiente</button>
          <input 
            type="text" 
            placeholder="Buscar ambiente..." 
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

      <div className="modAmbientes-list">
        {filteredAmbientes.map(ambiente => (
          <div key={ambiente.id} className="modAmbientes-cell">
            <span className="ambiente-name">{ambiente.nome}</span>
            <div className="button-group">
              <button onClick={() => toggleStatus(ambiente)} className={`status-${ambiente.status}`}>
                {ambiente.status}
              </button>
              <button onClick={() => openModal(ambiente)}>Configurar</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ModalAmbientes ambiente={selectedAmbiente} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );

};

export default ModAmbientes;
