import React from "react";
import "./fases.css";

export type NivelAuditoria = "basico" | "detalhado" | "completo";

export interface EventoAuditoria {
  id: string;
  nome: string;
  descricao?: string;
  habilitado: boolean;
}

interface AuditoriaProps {
  nivel?: NivelAuditoria;
  eventos?: EventoAuditoria[];
  onChangeNivel: (nivel: NivelAuditoria) => void;
  onToggleEvento: (id: string) => void;
}

const Auditoria: React.FC<AuditoriaProps> = ({
  nivel = "basico",
  eventos = [],
  onChangeNivel,
  onToggleEvento,
}) => {
  const eventosSeguros = eventos ?? [];

  return (
    <div className="fase-container">
      <h4 className="fase-title">Auditoria</h4>

      <p className="fase-description">
        Configure o nível de auditoria e os eventos que serão registrados para
        usuários vinculados a este cargo.
      </p>

      {/* Nível de auditoria */}
      <div className="fase-section">
        <h5 className="fase-section-title">Nível de auditoria</h5>

        <div
          className="fase-radio-group"
          role="radiogroup"
          aria-labelledby="auditoria-nivel-label"
        >
          <span id="auditoria-nivel-label" className="sr-only">
            Selecione o nível de auditoria
          </span>

          {/* Básico */}
          <div className="fase-radio-option">
            <input
              id="auditoria-basico"
              type="radio"
              name="nivelAuditoria"
              value="basico"
              checked={nivel === "basico"}
              onChange={() => onChangeNivel("basico")}
            />
            <label htmlFor="auditoria-basico">Básico</label>
          </div>

          {/* Detalhado */}
          <div className="fase-radio-option">
            <input
              id="auditoria-detalhado"
              type="radio"
              name="nivelAuditoria"
              value="detalhado"
              checked={nivel === "detalhado"}
              onChange={() => onChangeNivel("detalhado")}
            />
            <label htmlFor="auditoria-detalhado">Detalhado</label>
          </div>

          {/* Completo */}
          <div className="fase-radio-option">
            <input
              id="auditoria-completo"
              type="radio"
              name="nivelAuditoria"
              value="completo"
              checked={nivel === "completo"}
              onChange={() => onChangeNivel("completo")}
            />
            <label htmlFor="auditoria-completo">Completo</label>
          </div>
        </div>

        <div className="fase-alert info">
          Quanto maior o nível de auditoria, maior o volume de informações
          registradas.
        </div>
      </div>

      {/* Eventos auditáveis */}
      <div className="fase-section">
        <h5 className="fase-section-title">Eventos auditáveis</h5>

        {eventosSeguros.length === 0 && (
          <div className="fase-alert info">
            Nenhum evento disponível para auditoria.
          </div>
        )}

        {eventosSeguros.map((evento) => {
          const inputId = `auditoria-evento-${evento.id}`;

          return (
            <div key={evento.id} className="fase-permissao-row">
              <div className="fase-permissao-info">
                <strong>{evento.nome}</strong>
                {evento.descricao && (
                  <span className="fase-permissao-descricao">
                    {evento.descricao}
                  </span>
                )}
              </div>

              <div className="fase-toggle">
                <input
                  id={inputId}
                  type="checkbox"
                  checked={evento.habilitado}
                  onChange={() => onToggleEvento(evento.id)}
                />
                <label htmlFor={inputId}>
                  Auditar evento {evento.nome}
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fase-alert warning">
        Eventos habilitados podem impactar desempenho e consumo de armazenamento.
      </div>
    </div>
  );
};

export default Auditoria;
