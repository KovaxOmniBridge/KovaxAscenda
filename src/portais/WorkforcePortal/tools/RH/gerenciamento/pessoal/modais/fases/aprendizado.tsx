import React, { useMemo, useState } from "react";
import "./styles/aprendizado.css";

/* =========================
   TIPAGENS
========================= */

interface Curso {
  id: string;
  nome: string;
  categoria: string;
  concluido: boolean;
  progresso: number; // %
}

interface AprendizadoPessoa {
  id: string;
  nome: string;
  cargo: string;
  taxaAprendizado: number; // %
  cursosConcluidos: number;
  cursosEmAndamento: number;
  horasTotais: number;
  cursos: Curso[];
}

/* =========================
   MOCK DE DADOS
========================= */

const MOCK_APRENDIZADO: AprendizadoPessoa[] = [
  {
    id: "1",
    nome: "Ana Souza",
    cargo: "Analista de Sistemas",
    taxaAprendizado: 92,
    cursosConcluidos: 8,
    cursosEmAndamento: 2,
    horasTotais: 120,
    cursos: [
      { id: "c1", nome: "React Avançado", categoria: "Tecnologia", concluido: true, progresso: 100 },
      { id: "c2", nome: "Gestão Ágil", categoria: "Gestão", concluido: true, progresso: 100 },
      { id: "c3", nome: "Segurança da Informação", categoria: "Compliance", concluido: false, progresso: 60 },
    ],
  },
  {
    id: "2",
    nome: "Carlos Lima",
    cargo: "Coordenador Operacional",
    taxaAprendizado: 74,
    cursosConcluidos: 5,
    cursosEmAndamento: 3,
    horasTotais: 86,
    cursos: [
      { id: "c4", nome: "Liderança Estratégica", categoria: "Gestão", concluido: true, progresso: 100 },
      { id: "c5", nome: "Indicadores de Performance", categoria: "Negócios", concluido: false, progresso: 45 },
    ],
  },
];

/* =========================
   COMPONENTE
========================= */

const Aprendizado: React.FC = () => {
  const [search, setSearch] = useState("");

  const dadosFiltrados = useMemo(() => {
    return MOCK_APRENDIZADO.filter((pessoa) =>
      pessoa.nome.toLowerCase().includes(search.toLowerCase()) ||
      pessoa.cargo.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="aprendizado-page">
      {/* HEADER */}
      <header className="aprendizado-header">
        <h2>Aprendizado & Desenvolvimento</h2>
        <input
          type="text"
          placeholder="Pesquisar por nome ou cargo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {/* GRID */}
      <main className="aprendizado-grid">
        {dadosFiltrados.length === 0 ? (
          <div className="aprendizado-empty">
            Nenhum dado de aprendizado encontrado.
          </div>
        ) : (
          dadosFiltrados.map((pessoa) => (
            <div key={pessoa.id} className="aprendizado-card">
              {/* HEADER CARD */}
              <div className="aprendizado-card-header">
                <div>
                  <h3>{pessoa.nome}</h3>
                  <span>{pessoa.cargo}</span>
                </div>

                <div className="taxa-aprendizado">
                  <span>Taxa de aprendizado</span>
                  <strong>{pessoa.taxaAprendizado}%</strong>
                </div>
              </div>

              {/* KPIs */}
              <div className="aprendizado-kpis">
                <div className="kpi">
                  <span>Cursos concluídos</span>
                  <strong>{pessoa.cursosConcluidos}</strong>
                </div>
                <div className="kpi">
                  <span>Em andamento</span>
                  <strong>{pessoa.cursosEmAndamento}</strong>
                </div>
                <div className="kpi">
                  <span>Horas totais</span>
                  <strong>{pessoa.horasTotais}h</strong>
                </div>
              </div>

              {/* CURSOS */}
              <div className="aprendizado-cursos">
                <h4>Cursos</h4>
                {pessoa.cursos.map((curso) => (
                  <div key={curso.id} className="curso-item">
                    <div className="curso-info">
                      <strong>{curso.nome}</strong>
                      <span>{curso.categoria}</span>
                    </div>

                    <div className="curso-progresso">
                      <div className="barra">
                        <div
                          className="barra-preenchida"
                          style={{ width: `${curso.progresso}%` }}
                        />
                      </div>
                      <span>{curso.progresso}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Aprendizado;
