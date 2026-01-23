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
    <div className="rh-module-container">
      <div className="rh-page-header">
        <div className="rh-page-header-title">
          <h2>Gestão de squads</h2>
          <p>Configure squads, permissões e políticas de auditoria.</p>
        </div>
        <div className="rh-page-header-actions">
          <button className="rh-btn-primary" onClick={() => openModal()}>Novo Squad</button>
        </div>

        <div className="rh-input-group">
          <input
            type="text"
            className="rh-input"
            placeholder="Buscar squad..."
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
          {filteredSquads.map(squad => (
            <div key={squad.id} className="rh-card">
              <div className="rh-card-header">
                <h3>{squad.nome}</h3>
                <span className={`rh-badge ${squad.status}`}>
                  {squad.status}
                </span>
              </div>

              <div className="rh-card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--rh-text-secondary)' }}>Operação Vinculada</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--rh-text-primary)' }}>{squad.operacao}</span>
                </div>
              </div>

              <div className="rh-card-actions">
                <button
                  onClick={() => toggleStatus(squad)}
                  className="rh-btn-secondary"
                  title="Alterar Status"
                >
                  {squad.status === 'ativo' ? 'Desativar' : 'Ativar'}
                </button>
                <button onClick={() => openModal(squad)} className="rh-btn-primary" style={{ height: '32px', padding: '0 12px', fontSize: '13px' }}>
                  Configurar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSquads.length === 0 && (
          <div className="rh-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--rh-text-secondary)', gridColumn: '1/-1' }}>
            Nenhum squad encontrado.
          </div>
        )}
      </div>

      {modalOpen && (
        <ModalSquad squad={selectedSquad} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default ModSquads;
