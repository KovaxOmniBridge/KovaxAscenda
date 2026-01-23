import React, { useState, useMemo } from "react";
import ModalCampanhas from "./visualizarProcessos/modalCampanhasDados";
import ModalCampanhasDados from "./criarCampanhas/modalCampanhas";
import "./modCampanhas.css";

// ================================
// TIPAGEM
// ================================

type CampanhaStatus = "ativo" | "paralisado" | "desativado";
type ModalMode = "view" | "edit" | "create";

interface Campanha {
  id: number;
  nome: string;
  status: CampanhaStatus;
}

// ================================
// MOCK
// ================================

const initialCampanhas: Campanha[] = [
  { id: 1, nome: "Contratação de Administradores", status: "ativo" },
  { id: 2, nome: "Contratação de Analistas", status: "paralisado" },
  { id: 3, nome: "Contratação de Estagiários", status: "desativado" },
];

// ================================
// COMPONENTE
// ================================

const ModCampanhas = (): JSX.Element => {
  const [campanhas, setCampanhas] = useState(initialCampanhas);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | CampanhaStatus>("todos");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("view");
  const [selectedCampanha, setSelectedCampanha] =
    useState<Campanha | null>(null);

  // ================================
  // FILTROS
  // ================================

  const campanhasFiltradas = useMemo(() => {
    return campanhas.filter((c) => {
      const matchSearch = c.nome
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        filter === "todos" || c.status === filter;
      return matchSearch && matchStatus;
    });
  }, [campanhas, search, filter]);

  // ================================
  // HANDLERS
  // ================================

  const toggleStatus = (campanha: Campanha) => {
    const fluxo: Record<CampanhaStatus, CampanhaStatus> = {
      ativo: "paralisado",
      paralisado: "desativado",
      desativado: "ativo",
    };

    setCampanhas((prev) =>
      prev.map((c) =>
        c.id === campanha.id
          ? { ...c, status: fluxo[c.status] }
          : c
      )
    );
  };

  const abrirVisualizacao = (campanha: Campanha) => {
    setSelectedCampanha(campanha);
    setModalMode("view");
    setModalOpen(true);
  };

  const abrirEdicao = (campanha: Campanha) => {
    setSelectedCampanha(campanha);
    setModalMode("edit");
    setModalOpen(true);
  };

  const abrirCriacao = () => {
    setSelectedCampanha(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setSelectedCampanha(null);
  };

  // ================================
  // RENDER
  // ================================

  return (
    <div className="rh-module-container">
      {/* HEADER UNIFICADO (RH UI) */}
      <div className="rh-page-header">
        <div className="rh-page-header-title">
          <h1>Campanhas</h1>
          <p>Gerencie suas campanhas de forma rápida</p>
        </div>

        <div className="rh-page-header-actions">
          <button
            className="rh-btn-primary"
            onClick={abrirCriacao}
          >
            Criar campanha
          </button>
        </div>

        {/* 
            Nota: O layout original merged filters into header bottom. 
            O rh-page-header padrão é flex-row. 
            Para manter o visual "merged" mas usando componentes padrão, podemos colocar os filtros abaixo ou dentro do actions se couber.
            Vamos colocar os filtros em uma linha separada se quisermos fidelidade ao layout "unificado" anterior,
            OU usar o padrão "Header com Actions" e filtros abaixo.
            O modGerenciamento.css usa .pessoas-header que tem inputs dentro.
            Vamos adaptar para usar rh-page-header e inserir os inputs no actions ou abaixo.
            Para manter integridade com modGerenciamento (que tem filtros no header), vamos incluir os inputs no rh-page-header-actions ou criar uma row extra.
            Aqui vou colocar os inputs direto no fluxo para simplificar, já que rh-page-header suporta flex-wrap.
        */}
        <div className="rh-input-group">
          <input
            type="text"
            className="rh-input"
            placeholder="Buscar campanha"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rh-select"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as any)
            }
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativas</option>
            <option value="paralisado">Paralisadas</option>
            <option value="desativado">Desativadas</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="rh-module-content-area">
        <div className="rh-cards-grid">
          {campanhasFiltradas.map((campanha) => (
            <article
              key={campanha.id}
              className="rh-card"
              onClick={() => abrirVisualizacao(campanha)}
            >
              <div className="rh-card-header">
                <h3>{campanha.nome}</h3>
                <span
                  className={`rh-badge ${campanha.status}`}
                >
                  {campanha.status}
                </span>
              </div>

              <div className="rh-card-body">
                <p style={{ margin: 0 }}>
                  Clique para acompanhar o processo de
                  contratação.
                </p>
              </div>

              <div
                className="rh-card-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="rh-btn-secondary"
                  onClick={() => toggleStatus(campanha)}
                >
                  Mudar status
                </button>

                <button
                  className="rh-btn-secondary"
                  onClick={() => abrirEdicao(campanha)}
                >
                  Editar
                </button>
              </div>
            </article>
          ))}

          {campanhasFiltradas.length === 0 && (
            <div className="rh-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--rh-text-secondary)' }}>
              Nenhuma campanha encontrada
            </div>
          )}
        </div>
      </div>

      {/* MODAIS */}
      {modalOpen && modalMode === "view" && selectedCampanha && (
        <ModalCampanhas
          campanha={selectedCampanha}
          mode="view"
          onClose={fecharModal}
        />
      )}

      {modalOpen && modalMode !== "view" && (
        <ModalCampanhasDados
          campanha={selectedCampanha}
          mode={modalMode as any}
          onClose={fecharModal}
        />
      )}
    </div>
  );
};

export default ModCampanhas;
