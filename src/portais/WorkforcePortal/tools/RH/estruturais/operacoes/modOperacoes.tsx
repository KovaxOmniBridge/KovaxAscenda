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
    <div className="rh-module-container">
      <div className="rh-page-header">
        <div className="rh-page-header-title">
          <h2>Gestão de operações</h2>
          <p>Configure operações, permissões e políticas de auditoria.</p>
        </div>
        <div className="rh-page-header-actions">
          <button className="rh-btn-primary" onClick={() => openModal()}>Nova Operação</button>
        </div>

        <div className="rh-input-group">
          <input
            type="text"
            className="rh-input"
            placeholder="Buscar operação..."
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
          {filteredOperacoes.map(operacao => (
            <div key={operacao.id} className="rh-card">
              <div className="rh-card-header">
                <h3>{operacao.nome}</h3>
                <span className={`rh-badge ${operacao.status}`}>
                  {operacao.status}
                </span>
              </div>

              <div className="rh-card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--rh-text-secondary)' }}>Tipo de Operação</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--rh-text-primary)' }}>{operacao.operacao}</span>
                </div>
              </div>

              <div className="rh-card-actions">
                <button
                  onClick={() => toggleStatus(operacao)}
                  className="rh-btn-secondary"
                  title="Alterar Status"
                >
                  {operacao.status === 'ativo' ? 'Desativar' : 'Ativar'}
                </button>
                <button onClick={() => openModal(operacao)} className="rh-btn-primary" style={{ height: '32px', padding: '0 12px', fontSize: '13px' }}>
                  Configurar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOperacoes.length === 0 && (
          <div className="rh-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--rh-text-secondary)', gridColumn: '1/-1' }}>
            Nenhuma operação encontrada.
          </div>
        )}
      </div>

      {modalOpen && (
        <ModalOperacoes operacao={selectedOperacao} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default ModOperacoes;