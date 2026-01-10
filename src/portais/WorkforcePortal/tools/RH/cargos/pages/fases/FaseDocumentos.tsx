import React from "react";
import "./fases.css";

export interface DocumentoObrigatorio {
  id: string;
  nome: string;
  obrigatorio: boolean;
}

interface DocumentosProps {
  documentos?: DocumentoObrigatorio[];
  onToggleObrigatorio: (id: string) => void;
  onAddDocumento: () => void;
  onRemoveDocumento: (id: string) => void;
  onChangeNome: (id: string, value: string) => void;
}

const Documentos: React.FC<DocumentosProps> = ({
  documentos = [],
  onToggleObrigatorio,
  onAddDocumento,
  onRemoveDocumento,
  onChangeNome,
}) => {
  const documentosSeguros = documentos ?? [];

  return (
    <div className="fase-container">
      <h4 className="fase-title">Documentos</h4>

      <p className="fase-description">
        Defina quais documentos são exigidos para usuários vinculados a este
        cargo. Essa configuração impacta onboarding, compliance e auditoria.
      </p>

      <div className="fase-section">
        <h5 className="fase-section-title">Documentos obrigatórios</h5>

        {documentosSeguros.length === 0 && (
          <div className="fase-alert info">
            Nenhum documento configurado. Adicione os documentos exigidos para
            este cargo.
          </div>
        )}

        {documentosSeguros.map((doc) => {
          const inputTextId = `documento-nome-${doc.id}`;
          const inputCheckId = `documento-obrigatorio-${doc.id}`;

          return (
            <div key={doc.id} className="fase-document-row">
              {/* Nome do documento */}
              <div className="fase-field-group">
                <label htmlFor={inputTextId}>Nome do documento</label>
                <input
                  id={inputTextId}
                  type="text"
                  placeholder="Ex: RG, Contrato, Certificado"
                  value={doc.nome}
                  onChange={(e) => onChangeNome(doc.id, e.target.value)}
                />
              </div>

              {/* Obrigatoriedade */}
              <div className="fase-checkbox">
                <input
                  id={inputCheckId}
                  type="checkbox"
                  checked={doc.obrigatorio}
                  onChange={() => onToggleObrigatorio(doc.id)}
                />
                <label htmlFor={inputCheckId}>Obrigatório</label>
              </div>

              {/* Remover */}
              <button
                type="button"
                className="fase-button danger"
                onClick={() => onRemoveDocumento(doc.id)}
                aria-label={`Remover documento ${doc.nome || "sem nome"}`}
              >
                Remover
              </button>
            </div>
          );
        })}

        <button
          type="button"
          className="fase-button primary"
          onClick={onAddDocumento}
        >
          Adicionar documento
        </button>
      </div>

      <div className="fase-alert warning">
        Documentos obrigatórios podem ser utilizados como bloqueio de acesso até
        que sejam devidamente enviados e validados.
      </div>
    </div>
  );
};

export default Documentos;
