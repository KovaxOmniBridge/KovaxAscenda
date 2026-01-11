import React, { useState } from "react";
import "./modalSquads.css";

// Fase única
import DadosGerais from "./fases/FaseDadosGerais";

// Tipo de Squad
interface Squad {
  id?: number;
  nome: string;
  status?: "ativo" | "paralisado" | "desativado";
}

interface ModalProps {
  squad: Squad | null;
  onClose: () => void;
}

const ModalSquads: React.FC<ModalProps> = ({ squad, onClose }) => {
  // Mantido apenas para simular decisão estratégica futura (integração externa/interna)
  const [usarFonteExterna, setUsarFonteExterna] = useState<boolean | null>(null);

  const handleSalvar = () => {
    console.log("Salvar Squad", {
      squad,
      usarFonteExterna,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <header className="modal-header">
          <h3>{squad ? "Editar Squad" : "Novo Squad"}</h3>
          <button onClick={onClose}>X</button>
        </header>

        {/* Conteúdo */}
        <div className="modal-content">
          <DadosGerais squad={squad} />
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

export default ModalSquads;
