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
    <div className="rh-fs-modal">
      {/* Header */}
      <header className="rh-fs-header">
        <h3>{squad ? "Editar Squad" : "Novo Squad"}</h3>
        <button className="rh-fs-close" onClick={onClose}>✕</button>
      </header>

      {/* Conteúdo */}
      <div className="rh-fs-content">
        <DadosGerais squad={squad} />
      </div>

      {/* Footer */}
      <footer className="rh-fs-footer">
        <button onClick={onClose}>Cancelar</button>
        <button className="primary" onClick={handleSalvar}>Salvar</button>
      </footer>
    </div>
  );
};

export default ModalSquads;
