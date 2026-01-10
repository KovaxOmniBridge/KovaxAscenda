import React, { useState } from "react";
import "./modalInfraestrutura.css";

// Fase única
import DadosGerais from "./fases/FaseDadosGerais";

// Tipo de Infraestrutura
interface Infraestrutura {
  id?: number;
  nome: string;
  descricao?: string;
  status?: "ativo" | "paralisado" | "desativado";
}

interface ModalProps {
  infraestrutura: Infraestrutura | null;
  onClose: () => void;
}

const ModalInfraestrutura: React.FC<ModalProps> = ({ infraestrutura, onClose }) => {
  // Estado local para edição/criação
  const [dadosGerais, setDadosGerais] = useState({
    nome: infraestrutura?.nome ?? "",
    descricao: infraestrutura?.descricao ?? "",
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
    console.log("Salvar Infraestrutura", {
      ...infraestrutura,
      ...dadosGerais,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <header className="modal-header">
          <h3>{infraestrutura ? "Editar Infraestrutura" : "Nova Infraestrutura"}</h3>
          <button onClick={onClose}>X</button>
        </header>

        {/* Conteúdo */}
        <div className="modal-content">
          <DadosGerais
            dados={dadosGerais}
            onChange={handleChange}
          />
        </div>

        {/* Footer */}
        <footer className="modal-footer">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSalvar}>Salvar</button>
        </footer>
      </div>
    </div>
  );
};

export default ModalInfraestrutura;
