import React, { useState } from "react";
import "./modStyleMarketplace.css";

/**
 * Contrato de um tema de Marketplace
 * Futuramente este objeto virá do backend
 */
interface MarketplaceStyle {
  id: string;
  name: string;
  description: string;
  previewColor: string; // usado apenas como representação visual inicial
  isDefault?: boolean;
}

/**
 * Payload de persistência
 * Pronto para integração com API / banco de dados
 */
interface SaveStylePayload {
  styleId: string;
}

/**
 * Mock de estilos pré-programados
 * Fonte futura: banco de dados / API
 */
const AVAILABLE_STYLES: MarketplaceStyle[] = [
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "Visual escuro, moderno e focado em alta conversão.",
    previewColor: "#1E1E2F",
    isDefault: true,
  },
  {
    id: "clean-light",
    name: "Clean Light",
    description: "Interface clara, minimalista e institucional.",
    previewColor: "#F4F6F8",
  },
  {
    id: "premium-black",
    name: "Premium Black",
    description: "Experiência premium com foco em produtos de alto valor.",
    previewColor: "#0F0F0F",
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    description: "Identidade corporativa clássica e confiável.",
    previewColor: "#0A3D62",
  },
];

const ModStyleMarketplace: React.FC = () => {
  const defaultStyle =
    AVAILABLE_STYLES.find((style) => style.isDefault) || AVAILABLE_STYLES[0];

  const [selectedStyle, setSelectedStyle] = useState<MarketplaceStyle>(
    defaultStyle
  );

  /**
   * Handler de seleção visual
   */
  const handleSelectStyle = (style: MarketplaceStyle) => {
    setSelectedStyle(style);
  };

  /**
   * Handler de persistência
   * Integração futura com API
   */
  const handleSaveStyle = () => {
    const payload: SaveStylePayload = {
      styleId: selectedStyle.id,
    };

    // Integração futura:
    // POST /api/marketplace/style
    // body: payload

    console.log("Payload pronto para persistência:", payload);
  };

  return (
    <section className="style-marketplace-container">
      <header className="style-marketplace-header">
        <h2>Estilização do Marketplace</h2>
        <p>
          Selecione o tema visual que melhor representa a identidade do seu
          marketplace. As alterações impactam diretamente a experiência do
          usuário final.
        </p>
      </header>

      <div className="style-marketplace-grid">
        {AVAILABLE_STYLES.map((style) => (
          <div
            key={style.id}
            className={`style-card ${
              selectedStyle.id === style.id ? "selected" : ""
            }`}
            onClick={() => handleSelectStyle(style)}
          >
            <div
              className="style-preview"
              style={{ backgroundColor: style.previewColor }}
            />

            <div className="style-info">
              <h3>{style.name}</h3>
              <p>{style.description}</p>
            </div>

            {selectedStyle.id === style.id && (
              <span className="style-selected-indicator">
                Selecionado
              </span>
            )}
          </div>
        ))}
      </div>

      <footer className="style-marketplace-footer">
        <div className="style-marketplace-summary">
          <strong>Estilo ativo:</strong> {selectedStyle.name}
        </div>

        <button
          className="style-marketplace-save-button"
          onClick={handleSaveStyle}
        >
          Salvar Estilização
        </button>
      </footer>
    </section>
  );
};

export default ModStyleMarketplace;
