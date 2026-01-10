import React from "react";
import "./fases.css";

interface DadosGeraisData {
  nome: string;
  descricao: string;
  codigoInterno: string;
  nivel: string;
}

interface DadosGeraisProps {
  dados?: DadosGeraisData;
  onChange: (field: keyof DadosGeraisData, value: string) => void;
}

const DadosGerais: React.FC<DadosGeraisProps> = ({ dados, onChange }) => {
  // Fallback defensivo para evitar undefined
  const safeDados: DadosGeraisData = {
    nome: dados?.nome ?? "",
    descricao: dados?.descricao ?? "",
    codigoInterno: dados?.codigoInterno ?? "",
    nivel: dados?.nivel ?? "",
  };

  return (
    <div className="fase-container">
      <h4 className="fase-title">Dados Gerais</h4>

      <p className="fase-description">
        Defina as informações estruturais do cargo. Esses dados são utilizados
        como base para permissões, auditoria e integrações futuras.
      </p>

      {/* Identificação */}
      <div className="fase-section">
        <h5 className="fase-section-title">Identificação do cargo</h5>

        <div className="fase-field-group">
          <label htmlFor="cargo-nome">Nome do cargo</label>
          <input
            id="cargo-nome"
            type="text"
            placeholder="Ex: Analista de Sistemas"
            value={safeDados.nome}
            onChange={(e) => onChange("nome", e.target.value)}
          />
        </div>

        <div className="fase-field-group">
          <label htmlFor="cargo-descricao">Descrição</label>
          <textarea
            id="cargo-descricao"
            placeholder="Descrição resumida das responsabilidades do cargo"
            value={safeDados.descricao}
            onChange={(e) => onChange("descricao", e.target.value)}
          />
        </div>
      </div>

      {/* Classificação */}
      <div className="fase-section">
        <h5 className="fase-section-title">Classificação organizacional</h5>

        <div className="fase-field-group">
          <label htmlFor="cargo-codigo">Código interno</label>
          <input
            id="cargo-codigo"
            type="text"
            placeholder="Ex: CARGO-001"
            value={safeDados.codigoInterno}
            onChange={(e) => onChange("codigoInterno", e.target.value)}
          />
        </div>

        <div className="fase-field-group">
          <label htmlFor="cargo-nivel">Nível hierárquico</label>
          <select
            id="cargo-nivel"
            value={safeDados.nivel}
            onChange={(e) => onChange("nivel", e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="operacional">Operacional</option>
            <option value="tatico">Tático</option>
            <option value="estrategico">Estratégico</option>
          </select>
        </div>
      </div>

      <div className="fase-alert info">
        Essas informações são fundamentais para governança, auditoria e
        integrações futuras.
      </div>
    </div>
  );
};

export default DadosGerais;
