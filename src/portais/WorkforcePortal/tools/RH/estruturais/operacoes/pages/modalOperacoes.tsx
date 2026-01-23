import React, { useState } from "react";
import "./modalOperacoes.css";

// Fase única
import DadosGerais from "./fases/FaseDadosGerais";

// Tipo de Operação
interface Operacao {
  id?: number;
  nome: string;
  descricao?: string;
  status?: "ativo" | "paralisado" | "desativado";
}

interface ModalProps {
  operacao: Operacao | null;
  onClose: () => void;
}

const ModalOperacoes: React.FC<ModalProps> = ({ operacao, onClose }) => {
  // Estado local para edição/criação
  const [dadosGerais, setDadosGerais] = useState({
    nome: operacao?.nome ?? "",
    descricao: operacao?.descricao ?? "",
  });

  const handleChange = (
    field: "nome" | "descricao",
    value: string
  ) => {
    setDadosGerais((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSalvar = () => {
    console.log("Salvar Operação", {
      ...operacao,
      ...dadosGerais,
    });
    onClose();
  };

  return (
    <div className="rh-fs-modal">
      {/* Header */}
      <header className="rh-fs-header">
        <h3>{operacao ? "Editar Operação" : "Nova Operação"}</h3>
        <button className="rh-fs-close" onClick={onClose}>✕</button>
      </header>

      {/* Conteúdo */}
      <div className="rh-fs-content">
        <DadosGerais
          dados={dadosGerais}
          onChange={handleChange}
        />
      </div>

      {/* Footer */}
      <footer className="rh-fs-footer">
        <button onClick={onClose}>Cancelar</button>
        <button className="primary" onClick={handleSalvar}>Salvar</button>
      </footer>
    </div>
  );
};

export default ModalOperacoes;
