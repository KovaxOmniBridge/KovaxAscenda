import React, { useState } from "react";
import "./modalCargos.css";

// Import das fases
import DadosGerais from "./fases/FaseDadosGerais";
import Dados from "./fases/FaseDados";
import Permissoes from "./fases/FasePermissoes";
import Auditoria from "./fases/FaseAuditoria";
import Documentos from "./fases/FaseDocumentos";
import Resumo from "./fases/FaseResumo";

// Tipos de fases
type Fase = "dadosGerais" | "dados" | "permissoes" | "auditoria" | "documentos" | "resumo";

// Tipo de cargo
interface Cargo {
  id?: number;
  nome: string;
  status?: "ativo" | "paralisado" | "desativado";
}

interface ModalProps {
  cargo: Cargo | null;
  onClose: () => void;
}

const fasesMap: Record<Fase, React.FC<{ cargo: Cargo | null }>> = {
  dadosGerais: DadosGerais,
  dados: Dados,
  permissoes: Permissoes,
  auditoria: Auditoria,
  documentos: Documentos,
  resumo: Resumo,
};

const ModalCargo: React.FC<ModalProps> = ({ cargo, onClose }) => {
  const [fase, setFase] = useState<Fase>("dadosGerais");

  // Para a fase 'dados' definimos se usuário vai criar/importar (simulação de state)
  const [usarFonteExterna, setUsarFonteExterna] = useState<boolean | null>(null);

  const FaseComponente = fasesMap[fase];

  const fasesOrdem: Fase[] = ["dadosGerais", "dados", "permissoes", "auditoria", "documentos", "resumo"];
  const faseIndex = fasesOrdem.indexOf(fase);

  const handleProsseguir = () => {
    if (fase === "dados" && usarFonteExterna !== null) {
      // Se usuário já selecionou fonte externa ou interna, o botão vira salvar
      console.log("Salvar dados escolhidos");
      return;
    }
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
  const isSalvar = (fase === "resumo") || (fase === "dados" && usarFonteExterna !== null);
  const botaoPrincipalLabel = isSalvar ? "Salvar" : "Prosseguir";

  return (
    <div className="rh-fs-modal">
      {/* Header */}
      <header className="rh-fs-header">
        <h3>{cargo ? "Editar Cargo" : "Novo Cargo"}</h3>
        <button className="rh-fs-close" onClick={onClose}>✕</button>
      </header>

      {/* Navegação de fases */}
      <nav className="rh-fs-steps">
        {fasesOrdem.map(f => (
          <button
            key={f}
            className={`rh-fs-step-btn ${f === fase ? "active" : ""}`}
            onClick={() => setFase(f)}
          >
            {f}
          </button>
        ))}
      </nav>

      {/* Conteúdo da fase atual */}
      <div className="rh-fs-content">
        <FaseComponente cargo={cargo} />

        {/* Apenas para simulação da escolha da fonte na fase 'dados' */}
        {fase === "dados" && (
          <div style={{ marginTop: "20px" }}>
            <label>
              <input
                type="radio"
                name="fonte"
                onChange={() => setUsarFonteExterna(false)}
                checked={usarFonteExterna === false}
              />
              Criar em fonte interna
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name="fonte"
                onChange={() => setUsarFonteExterna(true)}
                checked={usarFonteExterna === true}
              />
              Usar fonte externa
            </label>
          </div>
        )}
      </div>

      {/* Footer com botões */}
      <footer className="rh-fs-footer">
        <button onClick={handleCancelar}>{faseIndex === 0 ? "Cancelar" : "Voltar"}</button>
        <button className="primary" onClick={handleProsseguir}>{botaoPrincipalLabel}</button>
      </footer>
    </div>
  );
};

export default ModalCargo;
