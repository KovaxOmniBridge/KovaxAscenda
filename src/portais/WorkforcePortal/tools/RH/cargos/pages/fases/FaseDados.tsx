import React from "react";
import "./fases.css";

export type FonteDados = "interna" | "externa";

interface DadosProps {
  fonte: FonteDados | null;
  apiUrl?: string;
  apiToken?: string;
  onChangeFonte: (fonte: FonteDados) => void;
  onChangeField: (field: string, value: string) => void;
}

const Dados: React.FC<DadosProps> = ({
  fonte,
  apiUrl,
  apiToken,
  onChangeFonte,
  onChangeField,
}) => {
  return (
    <div className="fase-container">
      <h4 className="fase-title">Dados</h4>

      <p className="fase-description">
        Defina onde e como os dados relacionados a este cargo serão armazenados.
        Essa decisão impacta integrações, auditoria e escalabilidade da
        plataforma.
      </p>

      {/* Escolha da fonte */}
      <div className="fase-section">
        <h5 className="fase-section-title">Fonte de dados</h5>

        <div className="fase-radio-group">
          <label className="fase-radio-option">
            <input
              type="radio"
              name="fonteDados"
              checked={fonte === "interna"}
              onChange={() => onChangeFonte("interna")}
            />
            <span>Utilizar banco de dados interno da plataforma</span>
          </label>

          <label className="fase-radio-option">
            <input
              type="radio"
              name="fonteDados"
              checked={fonte === "externa"}
              onChange={() => onChangeFonte("externa")}
            />
            <span>Integrar com fonte de dados externa (API)</span>
          </label>
        </div>
      </div>

      {/* Fonte interna */}
      {fonte === "interna" && (
        <div className="fase-section">
          <h5 className="fase-section-title">Armazenamento interno</h5>

          <div className="fase-alert success">
            Os dados serão armazenados e gerenciados integralmente pela
            plataforma, seguindo os padrões internos de segurança e auditoria.
          </div>
        </div>
      )}

      {/* Fonte externa */}
      {fonte === "externa" && (
        <div className="fase-section">
          <h5 className="fase-section-title">Integração externa</h5>

          <div className="fase-field-group">
            <label htmlFor="api-url">URL da API</label>
            <input
              id="api-url"
              type="text"
              placeholder="https://api.exemplo.com/cargos"
              value={apiUrl}
              onChange={(e) => onChangeField("apiUrl", e.target.value)}
            />
          </div>

          <div className="fase-field-group">
            <label htmlFor="api-token">Token de autenticação</label>
            <input
              id="api-token"
              type="password"
              placeholder="Token ou chave de acesso"
              value={apiToken}
              onChange={(e) => onChangeField("apiToken", e.target.value)}
            />
          </div>

          <div className="fase-alert warning">
            Certifique-se de que a API externa esteja em conformidade com os
            requisitos de segurança e disponibilidade da plataforma.
          </div>
        </div>
      )}
    </div>
  );
};

export default Dados;
