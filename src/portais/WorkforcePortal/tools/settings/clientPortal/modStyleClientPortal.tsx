import React, { useState } from "react";
import "./modStyleClientPortal.css";

/**
 * Contrato de estilo do Portal do Cliente
 * Fonte futura: API / Banco de dados
 */
interface ClientPortalStyle {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  isDefault?: boolean;
}

/**
 * Payload pronto para persistência
 */
interface SaveClientPortalStylePayload {
  styleId: string;
}

/**
 * Mock de estilos disponíveis
 */
const AVAILABLE_CLIENT_PORTAL_STYLES: ClientPortalStyle[] = [
  {
    id: "client-clean",
    name: "Clean Experience",
    description:
      "Interface clara e intuitiva, focada em usabilidade e simplicidade.",
    previewColor: "#F9FAFB",
    isDefault: true,
  },
  {
    id: "client-dark",
    name: "Dark Experience",
    description:
      "Visual moderno em dark mode, reduz fadiga visual e aumenta engajamento.",
    previewColor: "#111827",
  },
  {
    id: "client-premium",
    name: "Premium Client",
    description:
      "Experiência sofisticada, ideal para serviços de alto valor agregado.",
    previewColor: "#0F172A",
  },
  {
    id: "client-brand",
    name: "Brand Oriented",
    description:
      "Layout flexível, preparado para forte identidade visual da marca.",
    previewColor: "#1D4ED8",
  },
];

const ModStyleClientePortal: React.FC = () => {
  const defaultStyle =
    AVAILABLE_CLIENT_PORTAL_STYLES.find((s) => s.isDefault) ||
    AVAILABLE_CLIENT_PORTAL_STYLES[0];

  const [selectedStyle, setSelectedStyle] =
    useState<ClientPortalStyle>(defaultStyle);

  /**
   * Seleção visual
   */
  const handleSelectStyle = (style: ClientPortalStyle) => {
    setSelectedStyle(style);
  };

  /**
   * Persistência futura
   */
  const handleSaveStyle = () => {
    const payload: SaveClientPortalStylePayload = {
      styleId: selectedStyle.id,
    };

    // Integração futura:
    // POST /api/client-portal/style
    // body: payload

    console.log("Payload pronto para persistência:", payload);
  };

  return (
    <section className="style-client-portal-container">
      <header className="style-client-portal-header">
        <h2>Estilização do Portal do Cliente</h2>
        <p>
          Defina a experiência visual que será apresentada aos seus clientes.
          Esta configuração impacta diretamente percepção de marca, usabilidade
          e retenção.
        </p>
      </header>

      <div className="style-client-portal-grid">
        {AVAILABLE_CLIENT_PORTAL_STYLES.map((style) => (
          <div
            key={style.id}
            className={`style-client-card ${
              selectedStyle.id === style.id ? "selected" : ""
            }`}
            onClick={() => handleSelectStyle(style)}
          >
            <div
              className="style-client-preview"
              style={{ backgroundColor: style.previewColor }}
            />

            <div className="style-client-info">
              <h3>{style.name}</h3>
              <p>{style.description}</p>
            </div>

            {selectedStyle.id === style.id && (
              <span className="style-client-selected-indicator">
                Selecionado
              </span>
            )}
          </div>
        ))}
      </div>

      <footer className="style-client-portal-footer">
        <div className="style-client-portal-summary">
          <strong>Estilo ativo:</strong> {selectedStyle.name}
        </div>

        <button
          className="style-client-portal-save-button"
          onClick={handleSaveStyle}
        >
          Salvar Estilização
        </button>
      </footer>
    </section>
  );
};

export default ModStyleClientePortal;
