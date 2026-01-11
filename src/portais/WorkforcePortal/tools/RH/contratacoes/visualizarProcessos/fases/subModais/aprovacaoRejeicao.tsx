import React from "react";
import "./styles/aprovacaoRejeicao.css";

/* =========================
   TIPAGENS
========================= */

interface ResultadoTeste {
  id: string;
  nome: string;
  acertos: number;
  total: number;
}

interface CandidatoDetalhado {
  id: string;
  nome: string;
  email: string;
  idade: number;
  regiao: string;
  compatibilidade: number;
  status: "aguardando_aprovacao" | "aprovado" | "reprovado";
  resultadosTestes?: ResultadoTeste[]; // 🔑 agora opcional
  curriculoUrl?: string;
  videoApresentacaoUrl?: string;
}

interface ModalCandidatoDetalhadoProps {
  candidato: CandidatoDetalhado;
  onClose: () => void;
  onAprovar: (id: string) => void;
  onRejeitar: (id: string) => void;
}

/* =========================
   COMPONENTE
========================= */

const ModalCandidatoDetalhado: React.FC<
  ModalCandidatoDetalhadoProps
> = ({ candidato, onClose, onAprovar, onRejeitar }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-detalhado">

        {/* HEADER */}
        <header className="modal-detalhado-header">
          <div>
            <h2>{candidato.nome}</h2>
            <span>
              {candidato.idade} anos • {candidato.regiao}
            </span>
          </div>

          <button onClick={onClose}>✕</button>
        </header>

        {/* BODY */}
        <div className="modal-detalhado-body">

          {/* COLUNA ESQUERDA */}
          <aside className="candidato-resumo">
            <div className="resumo-card">
              <span>Compatibilidade Geral</span>
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

            <div className="resumo-info">
              <p><strong>Email:</strong> {candidato.email}</p>
              <p><strong>Status:</strong> {candidato.status}</p>
            </div>

            <div className="resumo-anexos">
              {candidato.curriculoUrl ? (
                <a
                  href={candidato.curriculoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Visualizar Currículo
                </a>
              ) : (
                <span className="disabled">
                  Currículo não enviado
                </span>
              )}

              {candidato.videoApresentacaoUrl ? (
                <a
                  href={candidato.videoApresentacaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🎥 Vídeo de apresentação
                </a>
              ) : (
                <span className="disabled">
                  Vídeo não enviado
                </span>
              )}
            </div>
          </aside>

          {/* COLUNA DIREITA */}
          <section className="candidato-testes">
            <h4>Resultados dos Testes</h4>

            <div className="testes-list">
              {candidato.resultadosTestes?.length ? (
                candidato.resultadosTestes.map((teste) => {
                  const percentual = Math.round(
                    (teste.acertos / teste.total) * 100
                  );

                  return (
                    <div
                      key={teste.id}
                      className="teste-card"
                    >
                      <div className="teste-header">
                        <strong>{teste.nome}</strong>
                        <span>
                          {teste.acertos}/{teste.total}
                        </span>
                      </div>

                      <div className="teste-bar">
                        <div
                          className={`teste-progress ${
                            percentual >= 70
                              ? "alta"
                              : percentual >= 50
                              ? "media"
                              : "baixa"
                          }`}
                          style={{ width: `${percentual}%` }}
                        />
                      </div>

                      <span className="teste-percentual">
                        {percentual}% de acerto
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="teste-empty">
                  Nenhum teste realizado até o momento.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="modal-detalhado-footer">
          <button onClick={onClose}>
            Fechar
          </button>

          <div className="acoes">
            <button
              className="rejeitar"
              onClick={() => onRejeitar(candidato.id)}
            >
              Rejeitar
            </button>

            <button
              className="aprovar"
              onClick={() => onAprovar(candidato.id)}
            >
              Aprovar candidato
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModalCandidatoDetalhado;
