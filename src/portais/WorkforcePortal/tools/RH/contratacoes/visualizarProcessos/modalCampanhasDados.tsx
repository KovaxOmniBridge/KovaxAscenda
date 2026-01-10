import React, { useState } from "react";
import "./modalCampanhasDados.css";

// Import das fases
import DadosGerais from "./fases/FaseDadosGerais";
import Dados from "./fases/FaseDados";
import Permissoes from "./fases/FasePermissoes";
import Auditoria from "./fases/FaseAuditoria";
import Documentos from "./fases/FaseDocumentos";
import Resumo from "./fases/FaseResumo";

// Tipos de fases
type Fase =
  | "dadosGerais"
  | "dados"
  | "permissoes"
  | "auditoria"
  | "documentos"
  | "resumo";

// Tipo de campanha
export interface Campanha {
  id?: number;
  nome: string;
  status?: "ativo" | "paralisado" | "desativado";
}

// 🔹 Modos operacionais do modal
type ModalMode = "view" | "edit" | "create";

interface ModalProps {
  campanha: Campanha | null;
  mode: ModalMode;
  onClose: () => void;
}

// Mapeamento de fases
const fasesMap: Record<Fase, React.FC<{ campanha: Campanha | null }>> = {
  dadosGerais: DadosGerais,
  dados: Dados,
  permissoes: Permissoes,
  auditoria: Auditoria,
  documentos: Documentos,
  resumo: Resumo,
};

const fasesOrdem: Fase[] = [
  "dadosGerais",
  "dados",
  "permissoes",
  "auditoria",
  "documentos",
  "resumo",
];

const ModalCampanhas: React.FC<ModalProps> = ({
  campanha,
  mode,
  onClose,
}) => {
  const [fase, setFase] = useState<Fase>("dadosGerais");

  // Simulação de escolha de fonte na fase "dados"
  const [usarFonteExterna, setUsarFonteExterna] =
    useState<boolean | null>(null);

  const FaseComponente = fasesMap[fase];
  const faseIndex = fasesOrdem.indexOf(fase);

  const handleProsseguir = () => {
    if (mode === "view") return;

    if (fase === "dados" && usarFonteExterna !== null) {
      console.log("Salvar dados escolhidos");
      return;
    }

    if (faseIndex < fasesOrdem.length - 1) {
      setFase(fasesOrdem[faseIndex + 1]);
    }
  };

  const handleCancelar = () => {
    if (faseIndex > 0 && mode !== "view") {
      setFase(fasesOrdem[faseIndex - 1]);
    } else {
      onClose();
    }
  };

  const isSalvar =
    mode !== "view" &&
    (fase === "resumo" ||
      (fase === "dados" && usarFonteExterna !== null));

  const botaoPrincipalLabel =
    mode === "view" ? "Fechar" : isSalvar ? "Salvar" : "Prosseguir";

  const tituloModal =
    mode === "create"
      ? "Nova Campanha"
      : mode === "edit"
      ? "Editar Campanha"
      : "Visualização da Campanha";

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <header className="modal-header">
          <h3>{tituloModal}</h3>
          <button onClick={onClose}>✕</button>
        </header>

        {/* Navegação de fases */}
        <nav className="modal-nav">
          {fasesOrdem.map((f) => (
            <button
              key={f}
              className={f === fase ? "active" : ""}
              onClick={() => mode !== "view" && setFase(f)}
              disabled={mode === "view"}
            >
              {f}
            </button>
          ))}
        </nav>

        {/* Conteúdo */}
        <div className="modal-content">
          <FaseComponente campanha={campanha} />

          {mode !== "view" && fase === "dados" && (
            <div className="fonte-dados">
              <label>
                <input
                  type="radio"
                  name="fonte"
                  onChange={() => setUsarFonteExterna(false)}
                  checked={usarFonteExterna === false}
                />
                Criar em fonte interna
              </label>

              <label>
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

        {/* Footer */}
        <footer className="modal-footer">
          <button onClick={handleCancelar}>
            {mode === "view"
              ? "Fechar"
              : faseIndex === 0
              ? "Cancelar"
              : "Voltar"}
          </button>

          {mode !== "view" && (
            <button onClick={handleProsseguir}>
              {botaoPrincipalLabel}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ModalCampanhas;
