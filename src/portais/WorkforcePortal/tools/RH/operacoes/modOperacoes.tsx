import React, { useState } from "react";
import ModalOperacoes from "./pages/modalOperacoes";
import "./modOperacoes.css";

// Tipo de operações
interface operacoes {
  id: number;
  nome: string;
  status: "ativo" | "paralisado" | "desativado";
  operacao: string;
}

// Mock inicial de operações
const initialOperacoes: operacoes[] = [
  { id: 1, nome: "Equipe financeiro", status: "ativo", operacao: "Financeiro" },
  { id: 2, nome: "Equipe de Analise de documentos", status: "paralisado", operacao: "Analise de documentos" },
  { id: 3, nome: "Estagiário", status: "desativado", operacao: "Estagiário" },
];

const ModOperacoes: React.FC = () => {
  const [operacoes, setOperacoes] = useState<operacoes[]>(initialOperacoes);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "ativo" | "paralisado" | "desativado">("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOperacao, setSelectedOperacao] = useState<operacoes | null>(null);
  const filteredOperacoes = operacoes.filter(operacao => 
    operacao.nome.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "todos" || operacao.status === filter)
  );

  const toggleStatus = (operacao: operacoes) => {
    const nextStatus: Record<string, operacoes["status"]> = {
      "ativo": "paralisado",
      "paralisado": "desativado",
      "desativado": "ativo",
    };
    setOperacoes(prev => prev.map(o => o.id === operacao.id ? { ...o, status: nextStatus[operacao.status] } : o));
  };

  const openModal = (operacao?: operacoes) => {
    setSelectedOperacao(operacao || null);
    setModalOpen(true);
  };

  return (
    <div className="modOperacoes-container">
      <div className="modOperacoes-header">
        <h2>Gestão de operações</h2>
        <p>Configure operações, permissões e políticas de auditoria.</p>
        <div className="modOperacoes-actions">
          <button onClick={() => openModal()}>Nova Operação</button>
          <input 
            type="text" 
            placeholder="Buscar operação..." 
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

      <div className="modOperacoes-list">
        {filteredOperacoes.map(operacao => (
          <div key={operacao.id} className="modOperacoes-cell">
            <span className="operacao-name">{operacao.nome}</span>
            <span className="operacao-name">{operacao.operacao}</span>
            <div className="button-group">
              <button onClick={() => toggleStatus(operacao)} className={`status-${operacao.status}`}>
                {operacao.status}
              </button>
              <button onClick={() => openModal(operacao)}>Configurar</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ModalOperacoes operacao={selectedOperacao} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );

};

export default ModOperacoes;