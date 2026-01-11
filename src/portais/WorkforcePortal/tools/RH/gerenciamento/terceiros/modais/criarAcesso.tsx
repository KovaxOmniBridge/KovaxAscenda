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
  status?: "ativo" | "inativo" | "pendente";
}

interface ModalProps {
  acesso?: AcessoTerceiro;
  onClose: () => void;
  onCreate?: (novoAcesso: Omit<AcessoTerceiro, "id">) => void;
  isViewOnly?: boolean;
}


const fasesMap: Record<Fase, React.FC<{ acesso?: AcessoTerceiro | null }>> = {
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
  const fasesOrdem: Fase[] = ["dadosGerais","dados","permissoes","auditoria","documentos","resumo"];
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
          id: acesso?.id ?? String(Date.now()),
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
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <header className="modal-header">
          <h3>{acesso ? "Editar Acesso" : "Novo Acesso"}</h3>
          <button onClick={onClose}>X</button>
        </header>

        {/* Navegação de fases */}
        <nav className="modal-nav">
          {fasesOrdem.map((f) => (
            <button
              key={f}
              className={f === fase ? "active" : ""}
              onClick={() => setFase(f)}
            >
              {f}
            </button>
          ))}
        </nav>

        {/* Conteúdo da fase */}
        <div className="modal-content">
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
        <footer className="modal-footer">
          <button onClick={handleCancelar}>{faseIndex === 0 ? "Cancelar" : "Voltar"}</button>
          <button onClick={handleProsseguir}>{botaoPrincipalLabel}</button>
        </footer>
      </div>
    </div>
  );
};

export default CriarAcessoTerceiro;
