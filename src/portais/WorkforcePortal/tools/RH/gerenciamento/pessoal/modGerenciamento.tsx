import React, { useState, useMemo } from "react";
import "./modGerenciamento.css";

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
    <div className="pessoas-page">
      {/* =========================
         HEADER
      ========================= */}
      <header className="pessoas-header">
        <input
          type="text"
          placeholder="Pesquisar por nome, email, cargo, operação ou squad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
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
          value={filtroOperacao}
          onChange={(e) => setFiltroOperacao(e.target.value)}
        >
          <option value="todos">Todas as operações</option>
          <option value="Financeiro">Financeiro</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Operações">Operações</option>
        </select>
      </header>

      {/* =========================
         GRID DE PESSOAS
      ========================= */}
      <main className="pessoas-grid">
        {pessoasFiltradas.length === 0 ? (
          <div className="pessoas-empty">
            Nenhuma pessoa encontrada.
          </div>
        ) : (
          pessoasFiltradas.map((pessoa) => (
            <div
              key={pessoa.id}
              className="pessoa-card"
              onClick={() => abrirPerfilCompleto(pessoa)}
            >
              <img
                src={
                  pessoa.fotoUrl ||
                  "https://via.placeholder.com/150"
                }
                alt={pessoa.nome}
                className="pessoa-avatar"
              />

              <div className="pessoa-info">
                <h3>{pessoa.nome}</h3>
                <span>{pessoa.idade} anos</span>
                <span>{pessoa.cargo}</span>
                <span>{pessoa.operacao}</span>
                {pessoa.squad && (
                  <span className="pessoa-squad">
                    Squad: {pessoa.squad}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </main>

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
