import React, { useState } from "react";
import ModalOperacoes from "./pages/modalInfraestrutura";
import "./modInfraestrutura.css";

// Tipo de infraestrutura
interface infraestrutura {
  id: number;
  nome: string;
  status: "ativo" | "paralisado" | "desativado";
  unidade: string;
}

// Mock inicial de infraestrutura
const initialInfraestrutura: infraestrutura[] = [
  { id: 1, nome: "Equipe financeiro", status: "ativo", unidade: "Financeiro" },
  { id: 2, nome: "Equipe de Analise de documentos", status: "paralisado", unidade: "Analise de documentos" },
  { id: 3, nome: "Estagiário", status: "desativado", unidade: "Estagiário" },
];

const ModInfraestrutura: React.FC = () => {
  const [infraestrutura, setInfraestrutura] = useState<infraestrutura[]>(initialInfraestrutura);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "ativo" | "paralisado" | "desativado">("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInfraestrutura, setSelectedInfraestrutura] = useState<infraestrutura | null>(null);
  const filteredInfraestrutura = infraestrutura.filter(infra => 
    infra.nome.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "todos" || infra.status === filter)
  );

  const toggleStatus = (infraestrutura: infraestrutura) => {
    const nextStatus: Record<string, infraestrutura["status"]> = {
      "ativo": "paralisado",
      "paralisado": "desativado",
      "desativado": "ativo",
    };
    setInfraestrutura(prev => prev.map(i => i.id === infraestrutura.id ? { ...i, status: nextStatus[infraestrutura.status] } : i));
  };

  const openModal = (infraestrutura?: infraestrutura) => {
    setSelectedInfraestrutura(infraestrutura || null);
    setModalOpen(true);
  };

  return (
    <div className="modInfraestrutura-container">
      <div className="modInfraestrutura-header">
        <h2>Gestão de infraestrutura</h2>
        <p>Configure infraestrutura, permissões e políticas de auditoria.</p>
        <div className="modInfraestrutura-actions">
          <button onClick={() => openModal()}>Nova Infraestrutura</button>
          <input 
            type="text" 
            placeholder="Buscar Unidade..." 
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

      <div className="modInfraestrutura-list">
        {filteredInfraestrutura.map(infraestrutura => (
          <div key={infraestrutura.id} className="modInfraestrutura-cell">
            <span className="infraestrutura-name">{infraestrutura.nome}</span>
            <span className="infraestrutura-name">{infraestrutura.unidade}</span>
            <div className="button-group">
              <button onClick={() => toggleStatus(infraestrutura)} className={`status-${infraestrutura.status}`}>
                {infraestrutura.status}
              </button>
              <button onClick={() => openModal(infraestrutura)}>Configurar</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ModalOperacoes infraestrutura={selectedInfraestrutura} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );

};

export default ModInfraestrutura;