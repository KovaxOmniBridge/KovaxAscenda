import React from "react";
import "./style/marketplace.css";

const Marketplace: React.FC = () => {
  const products = [
    { id: 1, name: "CRM Pro", category: "Vendas", price: "R$ 99/mês" },
    { id: 2, name: "Gestão Financeira", category: "Financeiro", price: "R$ 149/mês" },
    { id: 3, name: "Automação Marketing", category: "Marketing", price: "R$ 129/mês" },
    { id: 4, name: "RH Inteligente", category: "Recursos Humanos", price: "R$ 89/mês" },
  ];

  return (
    <div className="mp-container">
      {/* Header */}
      <header className="mp-header">
        <h1>Marketplace</h1>
        <p>Explore soluções para escalar sua operação</p>
      </header>

      {/* Filtros (visual apenas) */}
      <div className="mp-filters">
        <button className="mp-filter active">Todos</button>
        <button className="mp-filter">Vendas</button>
        <button className="mp-filter">Financeiro</button>
        <button className="mp-filter">Marketing</button>
        <button className="mp-filter">RH</button>
      </div>

      {/* Grid de Produtos */}
      <section className="mp-grid">
        {products.map((product) => (
          <div key={product.id} className="mp-card">
            <div className="mp-card-icon">📦</div>

            <div className="mp-card-body">
              <h3>{product.name}</h3>
              <span className="mp-category">{product.category}</span>
            </div>

            <div className="mp-card-footer">
              <span className="mp-price">{product.price}</span>
              <button className="mp-action">Ver detalhes</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Marketplace;
