import React, { useState } from "react";
import "./styles/FaseCandidatos.css";
import ModalCandidatoDetalhado from "./subModais/aprovacaoRejeicao";

/* =========================
   TIPAGENS
========================= */

interface ResultadoTeste {
  id: string;
  nome: string;
  totalQuestoes: number;
  acertos: number;
  taxaAcerto: number; // %
}

export interface Candidato {
  id: string;
  nome: string;
  email: string;
  idade: number;
  regiao: string;
  compatibilidade: number;
  status: "aguardando_aprovacao" | "aprovado" | "reprovado";

  resultadosTestes?: ResultadoTeste[];
  curriculoUrl?: string;
  videoApresentacaoUrl?: string;
}

interface CandidatosProps {
  candidatosElegiveis?: Candidato[];
  onAprovarCandidato?: (id: string) => void;
  onRejeitarCandidato?: (id: string) => void;
}

/* =========================
   MOCK DE CANDIDATOS
========================= */

const MOCK_CANDIDATOS: Candidato[] = [
  {
    id: "1",
    nome: "Lucas Ferreira",
    email: "lucas.ferreira@email.com",
    idade: 27,
    regiao: "São Paulo - SP",
    compatibilidade: 82,
    status: "aguardando_aprovacao",
    resultadosTestes: [
      {
        id: "logica",
        nome: "Raciocínio Lógico",
        totalQuestoes: 20,
        acertos: 16,
        taxaAcerto: 80,
      },
      {
        id: "tecnico",
        nome: "Conhecimento Técnico",
        totalQuestoes: 15,
        acertos: 12,
        taxaAcerto: 80,
      },
    ],
    curriculoUrl: "/curriculos/lucas-ferreira.pdf",
    videoApresentacaoUrl: "/videos/lucas-ferreira.mp4",
  },
  {
    id: "2",
    nome: "Mariana Alves",
    email: "mariana.alves@email.com",
    idade: 32,
    regiao: "Curitiba - PR",
    compatibilidade: 68,
    status: "aguardando_aprovacao",
    resultadosTestes: [],
  },
  {
    id: "3",
    nome: "Rafael Nogueira",
    email: "rafael.n@email.com",
    idade: 24,
    regiao: "Belo Horizonte - MG",
    compatibilidade: 91,
    status: "aguardando_aprovacao",
  },
];

/* =========================
   COMPONENTE
========================= */

const Candidatos: React.FC<CandidatosProps> = ({
  candidatosElegiveis = MOCK_CANDIDATOS,
  onAprovarCandidato,
  onRejeitarCandidato,
}) => {
  const [candidatoSelecionado, setCandidatoSelecionado] =
    useState<Candidato | null>(null);

  return (
    <div className="fase-container">
      {/* GRID DE CANDIDATOS */}
      <section className="fase-section">
        <h5>Candidatos elegíveis</h5>

        {candidatosElegiveis.length === 0 ? (
          <div className="fase-empty">
            Nenhum candidato aguardando avaliação.
          </div>
        ) : (
          <div className="candidatos-grid">
            {candidatosElegiveis.map((candidato) => (
              <div
                key={candidato.id}
                className="candidato-market-card"
                onClick={() => setCandidatoSelecionado(candidato)}
              >
                <div className="card-header">
                  <strong>{candidato.nome}</strong>
                  <span>{candidato.idade} anos</span>
                </div>

                <div className="card-body">
                  <span className="regiao">
                    📍 {candidato.regiao}
                  </span>
                </div>

                <div className="card-footer">
                  <span className="compatibilidade">
                    Compatibilidade
                  </span>
                  <strong
                    className={
                      candidato.compatibilidade >= 70
                        ? "alta"
                        : candidato.compatibilidade >= 50
                        ? "media"
                        : "baixa"
                    }
                  >
                    {candidato.compatibilidade}%
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL DO CANDIDATO */}
      {candidatoSelecionado && (
        <ModalCandidatoDetalhado
          candidato={candidatoSelecionado}
          onClose={() => setCandidatoSelecionado(null)}
          onAprovar={(id) => {
            onAprovarCandidato?.(id);
            setCandidatoSelecionado(null);
          }}
          onRejeitar={(id) => {
            onRejeitarCandidato?.(id);
            setCandidatoSelecionado(null);
          }}
        />
      )}
    </div>
  );
};

export default Candidatos;
