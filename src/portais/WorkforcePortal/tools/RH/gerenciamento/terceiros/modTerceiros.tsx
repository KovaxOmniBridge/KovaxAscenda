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
    <div className="terceiros-page">
      {/* HEADER */}
      <header className="terceiros-header">
        <input
          type="text"
          placeholder="Pesquisar acessos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
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

        <button className="btn-criar-terceiro" onClick={() => setModalCriar(true)}>
          + Novo acesso
        </button>
      </header>

      {/* GRID DE ACESSOS */}
      <main className="terceiros-grid">
        {acessosFiltrados.length === 0 ? (
          <div className="terceiros-empty">Nenhum acesso encontrado.</div>
        ) : (
          acessosFiltrados.map((acesso) => (
            <div
              key={acesso.id}
              className="terceiro-card"
              onClick={() => setAcessoSelecionado(acesso)}
            >
              <div className="terceiro-card-header">
                <h3>{acesso.nomeAcesso}</h3>
                <span className={`status-badge ${acesso.status}`}>
                  {acesso.status.toUpperCase()}
                </span>
              </div>

              <div className="terceiro-card-body">
                <p>Profissional: {acesso.profissional}</p>
                <p>Região: {acesso.regiao}</p>
              </div>

              <div className="terceiro-card-actions">
                <button
                  className="btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Configurar acesso: ${acesso.nomeAcesso}`);
                  }}
                >
                  Configurar
                </button>

                <select
                  className="status-select"
                  value={acesso.status}
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
      </main>

      {/* MODAL DE VISUALIZAÇÃO DE ACESSO */}
      {acessoSelecionado && (
        <CriarAcesso
          onClose={() => setAcessoSelecionado(null)}
          acesso={acessoSelecionado}
          isViewOnly
        />
      )}

      {/* MODAL DE CRIAÇÃO */}
      {modalCriar && (
        <CriarAcesso
          onClose={() => setModalCriar(false)}
          onCreate={handleCreateAcesso}
        />
      )}
    </div>
  );
};

export default GerenciamentoTerceiros;
