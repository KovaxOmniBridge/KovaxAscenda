import React from "react";
import "./style/utilidades.css";

interface UtilitiesModalProps {
  onClose: () => void;
  onSelect: (tool: string) => void;
}

const tools = [
  {
    id: "forms",
    title: "Formulários",
    description: "Crie formulários e colete respostas",
    icon: "📝",
  },
  {
    id: "docs",
    title: "Documentos",
    description: "Editor de texto colaborativo",
    icon: "📄",
  },
  {
    id: "slides",
    title: "Apresentações",
    description: "Crie slides profissionais",
    icon: "📊",
  },
  {
    id: "sheets",
    title: "Planilhas",
    description: "Dados, métricas e análises",
    icon: "📈",
  },
];

const UtilitiesModal: React.FC<UtilitiesModalProps> = ({
  onClose,
  onSelect,
}) => {
  return (
    <>
      <div className="wf-utilities-backdrop" onClick={onClose} />

      <div
        className="wf-utilities-modal"
        role="dialog"
        aria-modal="true"
      >
        <div className="wf-utilities-header">
          <h3>Utilidades</h3>
          <button
            className="wf-utilities-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="wf-utilities-grid">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className="wf-utilities-card"
              onClick={() => {
                onSelect(tool.title);
                onClose();
              }}
            >
              <span className="wf-utilities-icon">{tool.icon}</span>
              <div className="wf-utilities-info">
                <strong>{tool.title}</strong>
                <p>{tool.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default UtilitiesModal;
