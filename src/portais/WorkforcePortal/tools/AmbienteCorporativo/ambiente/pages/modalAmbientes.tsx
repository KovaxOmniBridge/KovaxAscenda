import React, { useState } from "react";
import "./modalAmbientes.css";

// Import das fases
import DadosGerais from "./fases/FaseDadosGerais";
import Dados from "./fases/FaseFerramentas";
import Permissoes from "./fases/FasePermissoes";
import Resumo from "./fases/FaseResumo";

// Tipos de fases
type Fase = "dadosGerais" | "ferramentas" | "permissoes" | "resumo";

// Tipo de ambiente
interface Ambiente {
  id?: number;
  nome: string;
  status?: "ativo" | "paralisado" | "desativado";
}

interface ModalProps {
  ambiente: Ambiente | null;
  onClose: () => void;
}

const fasesMap: Record<Fase, React.FC<{ambiente: Ambiente | null}>> = {
  dadosGerais: DadosGerais,
  ferramentas: Dados,
  permissoes: Permissoes,
  resumo: Resumo,
};

const ModalAmbientes: React.FC<ModalProps> = ({ ambiente, onClose }) => {
  const [fase, setFase] = useState<Fase>("dadosGerais");

  const FaseComponente = fasesMap[fase];

  const fasesOrdem: Fase[] = ["dadosGerais","ferramentas","permissoes","resumo"];
  const faseIndex = fasesOrdem.indexOf(fase);

  const handleProsseguir = () => {
    if (faseIndex < fasesOrdem.length - 1) {
      setFase(fasesOrdem[faseIndex + 1]);
    }
  };

  const handleCancelar = () => {
    if (faseIndex > 0) {
      setFase(fasesOrdem[faseIndex - 1]);
    } else {
      onClose();
    }
  };

  // Determina se o botão principal é 'Salvar' ou 'Prosseguir'
  const isSalvar = fase === "resumo";
  const botaoPrincipalLabel = isSalvar ? "Salvar" : "Prosseguir";

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <header className="modal-header">
          <h3>{ambiente ? "Editar Ambiente" : "Novo Ambiente"}</h3>
          <button onClick={onClose}>X</button>
        </header>

        {/* Navegação de fases */}
        <nav className="modal-nav">
          {fasesOrdem.map(f => (
            <button
              key={f}
              className={f === fase ? "active" : ""}
              onClick={() => setFase(f)}
            >
              {f}
            </button>
          ))}
        </nav>

        {/* Conteúdo da fase atual */}
        <div className="modal-content">
          <FaseComponente ambiente={ambiente} />
        </div>

        {/* Footer com botões */}
        <footer className="modal-footer">
          <button onClick={handleCancelar}>{faseIndex === 0 ? "Cancelar" : "Voltar"}</button>
          <button onClick={handleProsseguir}>{botaoPrincipalLabel}</button>
        </footer>
      </div>
    </div>
  );
};

export default ModalAmbientes;
