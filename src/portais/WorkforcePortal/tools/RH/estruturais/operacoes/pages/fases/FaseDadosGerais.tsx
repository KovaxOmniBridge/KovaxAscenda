import React from "react";
import "./fases.css";

interface DadosGeraisData {
  nome: string;
  descricao: string;
}

interface DadosGeraisProps {
  dados?: DadosGeraisData;
  onChange: (field: keyof DadosGeraisData, value: string) => void;
}

const DadosGerais: React.FC<DadosGeraisProps> = ({ dados, onChange }) => {
  // Fallback defensivo
  const safeDados: DadosGeraisData = {
    nome: dados?.nome ?? "",
    descricao: dados?.descricao ?? "",
  };

  return (
    <div className="fase-container">
      <h4 className="fase-title">Dados Gerais da Operação</h4>

      <p className="fase-description">
        Defina as informações essenciais da Operação. Esses dados estruturam sua
        identidade e servem como base para organização, permissões e integrações
        futuras.
      </p>

      <div className="fase-section">
        <h5 className="fase-section-title">Identificação da Operação</h5>

        <div className="fase-field-group">
          <label htmlFor="operacao-nome">Nome da Operação</label>
          <input
            id="operacao-nome"
            type="text"
            placeholder="Ex: Operação Logística"
            value={safeDados.nome}
            onChange={(e) => onChange("nome", e.target.value)}
          />
        </div>

        <div className="fase-field-group">
          <label htmlFor="operacao-descricao">Descrição</label>
          <textarea
            id="operacao-descricao"
            placeholder="Descreva o propósito e responsabilidades da Operação"
            value={safeDados.descricao}
            onChange={(e) => onChange("descricao", e.target.value)}
          />
        </div>
      </div>

      <div className="fase-alert info">
        Essas informações definem a identidade da Operação e sustentam sua
        evolução dentro da estrutura organizacional.
      </div>
    </div>
  );
};

export default DadosGerais;
