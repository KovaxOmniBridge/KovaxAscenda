import React, { useState } from "react";
import "./styles/criarAcesso.css";

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

// Tipo do acesso
interface AcessoTerceiro {
  id?: string;
  nomeAcesso: string;
  profissional: string;
  regiao: string;
  status: "ativo" | "inativo" | "pendente";
}

interface ModalProps {
  acesso?: AcessoTerceiro;
  onClose: () => void;
  onCreate?: (novoAcesso: Omit<AcessoTerceiro, "id">) => void;
  isViewOnly?: boolean;
}


const fasesMap: Record<Fase, any> = {
  dadosGerais: DadosGerais,
  dados: Dados,
  permissoes: Permissoes,
  auditoria: Auditoria,
  documentos: Documentos,
  resumo: Resumo,
};

const CriarAcessoTerceiro: React.FC<ModalProps> = ({ acesso, onClose, onCreate }) => {
  const [fase, setFase] = useState<Fase>("dadosGerais");
  const [usarFonteExterna, setUsarFonteExterna] = useState<boolean | null>(null);

  const FaseComponente = fasesMap[fase];
  const fasesOrdem: Fase[] = ["dadosGerais", "dados", "permissoes", "auditoria", "documentos", "resumo"];
  const faseIndex = fasesOrdem.indexOf(fase);

  const handleProsseguir = () => {
    if (fase === "dados" && usarFonteExterna !== null) {
      // Simulação de salvar dados da fase "dados"
      console.log("Dados da fase 'dados' salvos");
      return;
    }

    if (faseIndex < fasesOrdem.length - 1) {
      setFase(fasesOrdem[faseIndex + 1]);
    } else {
      // Última fase: salvar novo acesso
      if (onCreate) {
        onCreate({
          nomeAcesso: "Novo Acesso",
          profissional: "Profissional X",
          regiao: "Região Y",
          status: "pendente",
        });
      }
      onClose();
    }
  };

  const handleCancelar = () => {
    if (faseIndex > 0) {
      setFase(fasesOrdem[faseIndex - 1]);
    } else {
      onClose();
    }
  };

  const isSalvar = fase === "resumo" || (fase === "dados" && usarFonteExterna !== null);
  const botaoPrincipalLabel = isSalvar ? "Salvar" : "Prosseguir";

  return (
    <div className="rh-fs-modal">
      {/* Header */}
      <header className="rh-fs-header">
        <h3>{acesso ? "Editar Acesso" : "Novo Acesso"}</h3>
        <button className="rh-fs-close" onClick={onClose}>✕</button>
      </header>

      {/* Navegação de fases */}
      <nav className="rh-fs-steps">
        {fasesOrdem.map((f) => (
          <button
            key={f}
            className={`rh-fs-step-btn ${f === fase ? "active" : ""}`}
            onClick={() => setFase(f)}
          >
            {f}
          </button>
        ))}
      </nav>

      {/* Conteúdo da fase */}
      <div className="rh-fs-content">
        <FaseComponente acesso={acesso} />

        {/* Simulação da escolha de fonte na fase 'dados' */}
        {fase === "dados" && (
          <div style={{ marginTop: "20px" }}>
            <label>
              <input
                type="radio"
                name="fonte"
                onChange={() => setUsarFonteExterna(false)}
                checked={usarFonteExterna === false}
              />
              Criar internamente
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

      {/* Footer */}
      <footer className="rh-fs-footer">
        <button onClick={handleCancelar}>{faseIndex === 0 ? "Cancelar" : "Voltar"}</button>
        <button className="primary" onClick={handleProsseguir}>{botaoPrincipalLabel}</button>
      </footer>
    </div>
  );
};

export default CriarAcessoTerceiro;
