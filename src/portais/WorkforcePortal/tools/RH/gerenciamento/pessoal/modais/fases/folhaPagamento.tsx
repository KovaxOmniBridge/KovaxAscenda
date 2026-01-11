import React, { useMemo, useState } from "react";
import "./styles/folhaPagamento.css";

/* =========================
   TIPAGENS
========================= */

type StatusPagamento = "pago" | "pendente" | "atrasado";

interface FolhaColaborador {
  id: string;
  nome: string;
  cargo: string;
  operacao: string;
  salarioBase: number;
  beneficios: number;
  descontos: number;
  salarioLiquido: number;
  status: StatusPagamento;
}

/* =========================
   MOCK DE DADOS
========================= */

const MOCK_FOLHA: FolhaColaborador[] = [
  {
    id: "1",
    nome: "Ana Souza",
    cargo: "Analista Financeiro",
    operacao: "Financeiro",
    salarioBase: 6200,
    beneficios: 1200,
    descontos: 800,
    salarioLiquido: 6600,
    status: "pago",
  },
  {
    id: "2",
    nome: "Carlos Lima",
    cargo: "Desenvolvedor Full Stack",
    operacao: "Tecnologia",
    salarioBase: 8500,
    beneficios: 1500,
    descontos: 1100,
    salarioLiquido: 8900,
    status: "pendente",
  },
  {
    id: "3",
    nome: "Fernanda Rocha",
    cargo: "Coordenadora RH",
    operacao: "Recursos Humanos",
    salarioBase: 7800,
    beneficios: 1300,
    descontos: 900,
    salarioLiquido: 8200,
    status: "atrasado",
  },
];

/* =========================
   COMPONENTE
========================= */

const FolhaPagamento: React.FC = () => {
  const [folha, setFolha] = useState<FolhaColaborador[]>(MOCK_FOLHA);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState<StatusPagamento | "todos">("todos");

  /* =========================
     FILTRO + PESQUISA
  ========================= */

  const folhaFiltrada = useMemo(() => {
    return folha.filter((col) => {
      const matchStatus =
        filtroStatus === "todos" || col.status === filtroStatus;

      const matchSearch =
        col.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.operacao.toLowerCase().includes(searchTerm.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [folha, searchTerm, filtroStatus]);

  /* =========================
     KPIs EXECUTIVOS
  ========================= */

  const totalFolha = useMemo(
    () => folha.reduce((acc, f) => acc + f.salarioLiquido, 0),
    [folha]
  );

  const totalPago = useMemo(
    () =>
      folha
        .filter((f) => f.status === "pago")
        .reduce((acc, f) => acc + f.salarioLiquido, 0),
    [folha]
  );

  const totalPendente = totalFolha - totalPago;

  return (
    <div className="folha-page">
      {/* =========================
         HEADER
      ========================= */}
      <header className="folha-header">
        <input
          type="text"
          placeholder="Pesquisar por nome, cargo ou operação"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filtroStatus}
          onChange={(e) =>
            setFiltroStatus(e.target.value as StatusPagamento | "todos")
          }
        >
          <option value="todos">Todos os status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="atrasado">Atrasado</option>
        </select>

        <button className="btn-primary">
          Exportar folha
        </button>
      </header>

      {/* =========================
         KPIs
      ========================= */}
      <section className="folha-kpis">
        <div className="kpi-card">
          <span>Total da folha</span>
          <strong>R$ {totalFolha.toLocaleString("pt-BR")}</strong>
        </div>

        <div className="kpi-card success">
          <span>Total pago</span>
          <strong>R$ {totalPago.toLocaleString("pt-BR")}</strong>
        </div>

        <div className="kpi-card warning">
          <span>Valores pendentes</span>
          <strong>R$ {totalPendente.toLocaleString("pt-BR")}</strong>
        </div>
      </section>

      {/* =========================
         TABELA ANALÍTICA
      ========================= */}
      <main className="folha-table-wrapper">
        <table className="folha-table">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Cargo</th>
              <th>Operação</th>
              <th>Salário Base</th>
              <th>Benefícios</th>
              <th>Descontos</th>
              <th>Salário Líquido</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {folhaFiltrada.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              folhaFiltrada.map((col) => (
                <tr key={col.id}>
                  <td>{col.nome}</td>
                  <td>{col.cargo}</td>
                  <td>{col.operacao}</td>
                  <td>R$ {col.salarioBase.toLocaleString("pt-BR")}</td>
                  <td>R$ {col.beneficios.toLocaleString("pt-BR")}</td>
                  <td>R$ {col.descontos.toLocaleString("pt-BR")}</td>
                  <td className="liquido">
                    R$ {col.salarioLiquido.toLocaleString("pt-BR")}
                  </td>
                  <td>
                    <span className={`status ${col.status}`}>
                      {col.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default FolhaPagamento;
