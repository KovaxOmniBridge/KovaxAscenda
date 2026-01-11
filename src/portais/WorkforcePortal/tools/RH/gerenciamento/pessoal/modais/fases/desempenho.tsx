import React, { useMemo, useState } from "react";
import "./styles/desempenho.css";

/* =========================
   TIPAGENS
========================= */

type ScoreStatus = "excelente" | "adequado" | "alerta" | "critico";

interface AvaliacaoColaborador {
  id: string;
  nome: string;
  cargo: string;
  operacao: string;

  desempenho: number; // 0 - 100
  jornada: number; // % aderência
  pontoFrequencia: number; // % presença
  engajamento: number; // 0 - 100
  eticaConduta: number; // 0 - 100
}

/* =========================
   MOCK DATA
========================= */

const MOCK_AVALIACOES: AvaliacaoColaborador[] = [
  {
    id: "1",
    nome: "Ana Souza",
    cargo: "Analista Financeiro",
    operacao: "Backoffice",
    desempenho: 88,
    jornada: 96,
    pontoFrequencia: 98,
    engajamento: 82,
    eticaConduta: 100,
  },
  {
    id: "2",
    nome: "Carlos Lima",
    cargo: "Supervisor Operacional",
    operacao: "Operações",
    desempenho: 72,
    jornada: 84,
    pontoFrequencia: 87,
    engajamento: 65,
    eticaConduta: 90,
  },
  {
    id: "3",
    nome: "Fernanda Rocha",
    cargo: "Coordenadora RH",
    operacao: "People",
    desempenho: 94,
    jornada: 99,
    pontoFrequencia: 100,
    engajamento: 91,
    eticaConduta: 100,
  },
];

/* =========================
   HELPERS
========================= */

const resolveStatus = (score: number): ScoreStatus => {
  if (score >= 90) return "excelente";
  if (score >= 75) return "adequado";
  if (score >= 60) return "alerta";
  return "critico";
};

/* =========================
   COMPONENTE
========================= */

const AvaliacoesCorporativas: React.FC = () => {
  const [search, setSearch] = useState("");

  const dadosFiltrados = useMemo(() => {
    return MOCK_AVALIACOES.filter((c) =>
      `${c.nome} ${c.cargo} ${c.operacao}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="avaliacoes-page">
      {/* HEADER */}
      <header className="avaliacoes-header">
        <input
          type="text"
          placeholder="Pesquisar por nome, cargo ou operação..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {/* GRID AVALIATIVO */}
      <main className="avaliacoes-grid">
        {dadosFiltrados.length === 0 ? (
          <div className="avaliacoes-empty">
            Nenhum colaborador encontrado.
          </div>
        ) : (
          dadosFiltrados.map((colab) => (
            <div key={colab.id} className="avaliacao-card">
              {/* HEADER CARD */}
              <div className="avaliacao-card-header">
                <div>
                  <h3>{colab.nome}</h3>
                  <span>{colab.cargo}</span>
                </div>
                <strong>{colab.operacao}</strong>
              </div>

              {/* MÉTRICAS */}
              <div className="avaliacao-metricas">
                <div className={`metrica ${resolveStatus(colab.desempenho)}`}>
                  <span>Desempenho</span>
                  <strong>{colab.desempenho}%</strong>
                </div>

                <div className={`metrica ${resolveStatus(colab.jornada)}`}>
                  <span>Jornada</span>
                  <strong>{colab.jornada}%</strong>
                </div>

                <div
                  className={`metrica ${resolveStatus(
                    colab.pontoFrequencia
                  )}`}
                >
                  <span>Ponto & Frequência</span>
                  <strong>{colab.pontoFrequencia}%</strong>
                </div>

                <div className={`metrica ${resolveStatus(colab.engajamento)}`}>
                  <span>Engajamento</span>
                  <strong>{colab.engajamento}%</strong>
                </div>

                <div
                  className={`metrica ${resolveStatus(colab.eticaConduta)}`}
                >
                  <span>Ética & Conduta</span>
                  <strong>{colab.eticaConduta}%</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default AvaliacoesCorporativas;
