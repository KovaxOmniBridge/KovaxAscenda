import React, { useState, useMemo } from "react";


/* =========================
   MODAL CORPORATIVO
========================= */

import ModalGerenciamento, {
  UsuarioGerenciado,
} from "./modais/modalGerenciamento";

/* =========================
   TIPAGENS
========================= */

interface Pessoa {
  id: string;
  nome: string;
  email: string;
  idade: number;
  cargo: string;
  operacao: string;
  squad?: string;
  fotoUrl?: string;
}

/* =========================
   MOCK DE PESSOAS
========================= */

const MOCK_PESSOAS: Pessoa[] = [
  {
    id: "1",
    nome: "Ana Souza",
    email: "ana.souza@empresa.com",
    idade: 29,
    cargo: "Analista Financeiro",
    operacao: "Financeiro",
    squad: "Squad Alpha",
    fotoUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    nome: "Carlos Lima",
    email: "carlos.lima@empresa.com",
    idade: 34,
    cargo: "Desenvolvedor Frontend",
    operacao: "Tecnologia",
    squad: "Squad React",
    fotoUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    nome: "Fernanda Rocha",
    email: "fernanda.rocha@empresa.com",
    idade: 41,
    cargo: "Gerente de Operações",
    operacao: "Operações",
    fotoUrl: "https://i.pravatar.cc/150?img=3",
  },
];

/* =========================
   COMPONENTE
========================= */

const GerenciamentoPessoas: React.FC = () => {
  const [pessoas] = useState<Pessoa[]>(MOCK_PESSOAS);

  const [usuarioAtivo, setUsuarioAtivo] =
    useState<UsuarioGerenciado | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("todos");
  const [filtroOperacao, setFiltroOperacao] = useState("todos");

  /* =========================
     FILTROS E PESQUISA
  ========================= */

  const pessoasFiltradas = useMemo(() => {
    const textoBusca = searchTerm.toLowerCase();

    return pessoas.filter((p) => {
      const matchesSearch =
        p.nome.toLowerCase().includes(textoBusca) ||
        p.email.toLowerCase().includes(textoBusca) ||
        p.cargo.toLowerCase().includes(textoBusca) ||
        p.operacao.toLowerCase().includes(textoBusca) ||
        (p.squad && p.squad.toLowerCase().includes(textoBusca));

      const matchesCargo =
        filtroCargo === "todos" || p.cargo === filtroCargo;

      const matchesOperacao =
        filtroOperacao === "todos" || p.operacao === filtroOperacao;

      return matchesSearch && matchesCargo && matchesOperacao;
    });
  }, [pessoas, searchTerm, filtroCargo, filtroOperacao]);

  /* =========================
     ABRIR PERFIL 360°
  ========================= */

  const abrirPerfilCompleto = (pessoa: Pessoa) => {
    setUsuarioAtivo({
      id: Number(pessoa.id),
      nome: pessoa.nome,
      status: "ativo",
    });
  };

  return (
    <div className="rh-module-container">
      {/* =========================
         HEADER
      ========================= */}
      <div className="rh-page-header">
        <div className="rh-page-header-title">
          <h2>Gestão de Pessoas</h2>
          <p>Gerencie colaboradores, squads e operações.</p>
        </div>

        <div className="rh-input-group">
          <input
            type="text"
            className="rh-input"
            placeholder="Pesquisar por nome, email, cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />

          <select
            className="rh-select"
            value={filtroCargo}
            onChange={(e) => setFiltroCargo(e.target.value)}
          >
            <option value="todos">Todos os cargos</option>
            <option value="Analista Financeiro">
              Analista Financeiro
            </option>
            <option value="Desenvolvedor Frontend">
              Desenvolvedor Frontend
            </option>
            <option value="Gerente de Operações">
              Gerente de Operações
            </option>
          </select>

          <select
            className="rh-select"
            value={filtroOperacao}
            onChange={(e) => setFiltroOperacao(e.target.value)}
          >
            <option value="todos">Todas as operações</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Operações">Operações</option>
          </select>
        </div>
      </div>

      {/* =========================
         GRID DE PESSOAS
      ========================= */}
      <div className="rh-module-content-area">
        <div className="rh-cards-grid">
          {pessoasFiltradas.length === 0 ? (
            <div className="rh-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--rh-text-secondary)', gridColumn: '1/-1' }}>
              Nenhuma pessoa encontrada.
            </div>
          ) : (
            pessoasFiltradas.map((pessoa) => (
              <div
                key={pessoa.id}
                className="rh-card"
                onClick={() => abrirPerfilCompleto(pessoa)}
                style={{ alignItems: 'center', textAlign: 'center' }}
              >
                <div style={{ padding: '24px 0 12px 0' }}>
                  <img
                    src={
                      pessoa.fotoUrl ||
                      "https://via.placeholder.com/150"
                    }
                    alt={pessoa.nome}
                    className="rh-card-avatar"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--rh-border-color)' }}
                  />
                </div>

                <div className="rh-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{pessoa.nome}</h3>
                    <span style={{ fontSize: '13px', color: 'var(--rh-text-target)' }}>{pessoa.cargo}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--rh-text-secondary)' }}>{pessoa.operacao}</span>
                    {pessoa.squad && (
                      <span className="rh-badge inativo" style={{ marginTop: '4px' }}>
                        {pessoa.squad}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rh-card-actions" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>
                  <button className="rh-btn-secondary" style={{ width: '100%' }}>Ver Perfil</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =========================
         MODAL FULLSCREEN (PERFIL 360°)
      ========================= */}
      {usuarioAtivo && (
        <ModalGerenciamento
          usuario={usuarioAtivo}
          onClose={() => setUsuarioAtivo(null)}
        />
      )}
    </div>
  );
};

export default GerenciamentoPessoas;
