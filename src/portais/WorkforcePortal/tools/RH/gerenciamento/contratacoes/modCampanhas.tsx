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
    <section className="campanhas-page">
      {/* HEADER */}
      <header className="campanhas-header">
        <div>
          <h1>Campanhas</h1>
          <p>Gerencie suas campanhas de forma rápida</p>
        </div>

        <button
          className="btn-primary"
          onClick={abrirCriacao}
        >
          Criar campanha
        </button>
      </header>

      {/* FILTROS */}
      <div className="campanhas-filters">
        <input
          type="text"
          placeholder="Buscar campanha"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
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

      {/* GRID */}
      <div className="campanhas-grid">
        {campanhasFiltradas.map((campanha) => (
          <article
            key={campanha.id}
            className="campanha-card"
            onClick={() => abrirVisualizacao(campanha)}
          >
            <div className="campanha-card-header">
              <h3>{campanha.nome}</h3>
              <span
                className={`status-badge ${campanha.status}`}
              >
                {campanha.status}
              </span>
            </div>

            <div className="campanha-card-body">
              <p>
                Clique para acompanhar o processo de
                contratação.
              </p>
            </div>

            <div
              className="campanha-card-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="btn-secondary"
                onClick={() => toggleStatus(campanha)}
              >
                Mudar status
              </button>

              <button
                className="btn-outline"
                onClick={() => abrirEdicao(campanha)}
              >
                Editar
              </button>
            </div>
          </article>
        ))}

        {campanhasFiltradas.length === 0 && (
          <div className="campanhas-empty">
            Nenhuma campanha encontrada
          </div>
        )}
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
          mode={modalMode}   // ✅ FIX CRÍTICO
          onClose={fecharModal}
        />
      )}
    </section>
  );
};

export default ModCampanhas;
