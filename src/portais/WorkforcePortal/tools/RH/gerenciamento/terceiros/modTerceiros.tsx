import React, { useState, useMemo } from "react";
import "./modTerceiros.css";

/* =========================
   TIPAGENS
========================= */

type StatusAcesso = "ativo" | "inativo" | "pendente";

interface AcessoTerceiro {
  id: string;
  nomeAcesso: string;
  profissional: string;
  regiao: string;
  status: StatusAcesso;
}

/* =========================
   MOCK DE ACESSOS
========================= */

const MOCK_ACESSOS: AcessoTerceiro[] = [
  { id: "1", nomeAcesso: "Financeiro ERP", profissional: "Ana Souza", regiao: "São Paulo - SP", status: "ativo" },
  { id: "2", nomeAcesso: "CRM Plataforma", profissional: "Carlos Lima", regiao: "Curitiba - PR", status: "pendente" },
  { id: "3", nomeAcesso: "Sistema RH", profissional: "Fernanda Rocha", regiao: "Belo Horizonte - MG", status: "inativo" },
];

/* =========================
   IMPORT MODAL DE CRIAÇÃO
========================= */

import CriarAcesso from "./modais/criarAcesso";

/* =========================
   COMPONENTE
========================= */

const GerenciamentoTerceiros: React.FC = () => {
  const [acessosList, setAcessosList] = useState<AcessoTerceiro[]>(MOCK_ACESSOS);
  const [acessoSelecionado, setAcessoSelecionado] = useState<AcessoTerceiro | null>(null);
  const [modalCriar, setModalCriar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusAcesso | "todos">("todos");

  /* =========================
     FILTROS E PESQUISA
  ========================= */
  const acessosFiltrados = useMemo(() => {
    return acessosList.filter((a) => {
      const matchesStatus = filtroStatus === "todos" || a.status === filtroStatus;
      const matchesSearch =
        a.nomeAcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.profissional.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.regiao.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [acessosList, searchTerm, filtroStatus]);

  /* =========================
     FUNÇÃO PARA CRIAR ACESSO
  ========================= */
  const handleCreateAcesso = (novoAcesso: Omit<AcessoTerceiro, "id">) => {
    const newAcesso: AcessoTerceiro = { ...novoAcesso, id: (acessosList.length + 1).toString() };
    setAcessosList((prev) => [...prev, newAcesso]);
    setModalCriar(false);
  };

  return (
    <div className="rh-module-container">
      {/* HEADER DA PÁGINA */}
      <header className="rh-page-header">
        <div className="rh-page-header-title">
          <h2>Gerenciamento de Terceiros</h2>
          <p>Gerencie acessos e permissões de terceiros.</p>
        </div>

        <div className="rh-page-header-actions">
          <input
            type="text"
            className="rh-input"
            placeholder="Pesquisar acessos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="rh-select"
            value={filtroStatus}
            onChange={(e) =>
              setFiltroStatus(e.target.value as StatusAcesso | "todos")
            }
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="pendente">Pendente</option>
          </select>

          <button
            className="rh-btn-primary"
            onClick={() => setModalCriar(true)}
          >
            Novo Acesso
          </button>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO (GRID DE CARDS) */}
      <main className="rh-module-content-area">
        <div className="rh-cards-grid">
          {acessosFiltrados.length === 0 ? (
            <div className="terceiros-empty" style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "#6b7280" }}>
              Nenhum acesso encontrado.
            </div>
          ) : (
            acessosFiltrados.map((acesso) => (
              <div
                key={acesso.id}
                className="rh-card"
                onClick={() => setAcessoSelecionado(acesso)}
              >
                <div className="rh-card-header">
                  <h3>{acesso.nomeAcesso}</h3>
                  <span className={`rh-badge ${acesso.status}`}>
                    {acesso.status.toUpperCase()}
                  </span>
                </div>

                <div className="rh-card-body">
                  <p><strong>Profissional:</strong> {acesso.profissional}</p>
                  <p><strong>Região:</strong> {acesso.regiao}</p>
                </div>

                <div className="rh-card-actions">
                  <button
                    className="rh-btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Configurar acesso: ${acesso.nomeAcesso}`);
                    }}
                  >
                    Configurar
                  </button>

                  <select
                    className="rh-select"
                    style={{ height: '32px', padding: '4px 8px', fontSize: '12px' }} // Ajuste pontual para caber bonitinho no card
                    value={acesso.status}
                    onClick={(e) => e.stopPropagation()} // Importante para não abrir o card ao clicar no select
                    onChange={(e) => {
                      e.stopPropagation();
                      const novoStatus = e.target.value as StatusAcesso;
                      setAcessosList((prev) =>
                        prev.map((a) =>
                          a.id === acesso.id ? { ...a, status: novoStatus } : a
                        )
                      );
                    }}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL DE VISUALIZAÇÃO DE ACESSO */}
      {
        acessoSelecionado && (
          <CriarAcesso
            onClose={() => setAcessoSelecionado(null)}
            acesso={acessoSelecionado}
            isViewOnly
          />
        )
      }

      {/* MODAL DE CRIAÇÃO */}
      {
        modalCriar && (
          <CriarAcesso
            onClose={() => setModalCriar(false)}
            onCreate={handleCreateAcesso}
          />
        )
      }
    </div >
  );
};

export default GerenciamentoTerceiros;
