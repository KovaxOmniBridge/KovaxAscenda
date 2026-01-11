import React from "react";
import "./styles/relatorio.css";

/* =========================
   ENTIDADES DE DOMÍNIO
========================= */

export type NivelInsight = "positivo" | "atencao" | "critico";

interface Usuario {
  nome: string;
  cargo: string;
  operacao: string;
}

interface InsightIA {
  titulo: string;
  descricao: string;
  nivel: NivelInsight;
}

interface AvaliacaoHumana {
  avaliador: string;
  cargo: string;
  data: string; // ISO date
  comentario: string;
}

interface RelatorioUsuarioProps {
  usuario: Usuario;
  insightsIA: InsightIA[];
  avaliacoesHumanas: AvaliacaoHumana[];
}

/* =========================
   HELPERS
========================= */

const formatarData = (data: string) =>
  new Date(data).toLocaleDateString("pt-BR");

/* =========================
   COMPONENTE
========================= */

const RelatorioUsuario: React.FC<RelatorioUsuarioProps> = ({
  usuario,
  insightsIA,
  avaliacoesHumanas,
}) => {
  return (
    <div className="relatorio-page">
      {/* HEADER */}
      <header className="relatorio-header">
        <h2>Relatório Analítico do Colaborador</h2>
        <p>
          Consolidação estratégica baseada em inteligência artificial e
          avaliações humanas.
        </p>
      </header>

      {/* DADOS DO USUÁRIO */}
      <section className="relatorio-section">
        <h3>Dados do Colaborador</h3>

        <div className="relatorio-user-grid">
          <div>
            <span>Nome</span>
            <strong>{usuario.nome}</strong>
          </div>
          <div>
            <span>Cargo</span>
            <strong>{usuario.cargo}</strong>
          </div>
          <div>
            <span>Operação</span>
            <strong>{usuario.operacao}</strong>
          </div>
        </div>
      </section>

      {/* ANÁLISE IA */}
      <section className="relatorio-section">
        <h3>Análise por Inteligência Artificial</h3>

        {insightsIA.length === 0 ? (
          <div className="relatorio-empty">
            Nenhum insight analítico gerado pela IA.
          </div>
        ) : (
          <div className="insights-grid">
            {insightsIA.map((insight, idx) => (
              <div
                key={idx}
                className={`insight-card insight-${insight.nivel}`}
              >
                <header className="insight-header">
                  <span className={`insight-badge ${insight.nivel}`}>
                    {insight.nivel === "positivo" && "✔ Positivo"}
                    {insight.nivel === "atencao" && "⚠ Atenção"}
                    {insight.nivel === "critico" && "⛔ Crítico"}
                  </span>
                  <strong>{insight.titulo}</strong>
                </header>

                <p>{insight.descricao}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AVALIAÇÃO HUMANA */}
      <section className="relatorio-section">
        <h3>Avaliação Humana (Gestão / RH)</h3>

        {avaliacoesHumanas.length === 0 ? (
          <div className="relatorio-empty">
            Nenhuma avaliação humana registrada.
          </div>
        ) : (
          <div className="avaliacoes-list">
            {avaliacoesHumanas.map((av, idx) => (
              <div key={idx} className="avaliacao-card">
                <header className="avaliacao-header">
                  <div>
                    <strong>{av.avaliador}</strong>
                    <span>{av.cargo}</span>
                  </div>
                  <time>{formatarData(av.data)}</time>
                </header>

                <p>{av.comentario}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RelatorioUsuario;
