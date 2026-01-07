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
      <h4 className="fase-title">Dados Gerais do Squad</h4>

      <p className="fase-description">
        Defina as informações essenciais do Squad. Esses dados estruturam a
        identidade do time e servem como base para organização, permissões e
        futuras integrações.
      </p>

      <div className="fase-section">
        <h5 className="fase-section-title">Identificação do Squad</h5>

        <div className="fase-field-group">
          <label htmlFor="squad-nome">Nome do Squad</label>
          <input
            id="squad-nome"
            type="text"
            placeholder="Ex: Squad de Tecnologia"
            value={safeDados.nome}
            onChange={(e) => onChange("nome", e.target.value)}
          />
        </div>

        <div className="fase-field-group">
          <label htmlFor="squad-descricao">Descrição</label>
          <textarea
            id="squad-descricao"
            placeholder="Descreva o propósito e responsabilidades do Squad"
            value={safeDados.descricao}
            onChange={(e) => onChange("descricao", e.target.value)}
          />
        </div>
      </div>

      <div className="fase-alert info">
        Essas informações definem a identidade do Squad e sustentam sua evolução
        dentro da estrutura organizacional.
      </div>
    </div>
  );
};

export default DadosGerais;
