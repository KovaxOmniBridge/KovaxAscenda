import React, { useState } from "react";
import "./styles/configuracao.css";

// ===========================
// TIPAGENS
// ===========================
interface Pais {
  id: string;
  nome: string;
}

interface Imposto {
  id: string;
  nome: string;
  tipo: "percentual" | "fixo";
  aliquota: number;
  categoria: string;
}

interface FluxoFinanceiro {
  id: string;
  nome: string;
  tipo: "entrada" | "saida" | "transferencia";
  descricao?: string;
}

// ===========================
// MOCK INICIAL
// ===========================
const PAISES: Pais[] = [
  { id: "br", nome: "Brasil" },
  { id: "us", nome: "Estados Unidos" },
  { id: "de", nome: "Alemanha" },
];

const FinanceConfigPanel: React.FC = () => {
  const [paisSelecionado, setPaisSelecionado] = useState<string>("br");
  const [impostos, setImpostos] = useState<Imposto[]>([]);
  const [fluxos, setFluxos] = useState<FluxoFinanceiro[]>([]);

  // ===========================
  // HANDLERS
  // ===========================
  const adicionarImposto = () => {
    const nome = prompt("Nome do imposto:");
    const tipo = prompt("Tipo (percentual/fixo):") as "percentual" | "fixo";
    const aliquota = Number(prompt("Alíquota:") || 0);
    const categoria = prompt("Categoria (federal/estadual/municipal):") || "";

    if (nome && tipo && !isNaN(aliquota) && categoria) {
      setImpostos((prev) => [
        ...prev,
        { id: Date.now().toString(), nome, tipo, aliquota, categoria },
      ]);
    }
  };

  const adicionarFluxo = () => {
    const nome = prompt("Nome do fluxo:");
    const tipo = prompt("Tipo (entrada/saida/transferencia):") as
      | "entrada"
      | "saida"
      | "transferencia";
    const descricao = prompt("Descrição opcional:") || "";

    if (nome && tipo) {
      setFluxos((prev) => [
        ...prev,
        { id: Date.now().toString(), nome, tipo, descricao },
      ]);
    }
  };

  const removerItem = (id: string, tipo: "imposto" | "fluxo") => {
    if (tipo === "imposto") {
      setImpostos((prev) => prev.filter((item) => item.id !== id));
    } else {
      setFluxos((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="finance-config-panel">
      <header className="config-header">
        <h2>Configurações Financeiras</h2>
        <div className="pais-selector">
          <label>Selecionar País:</label>
          <select
            value={paisSelecionado}
            onChange={(e) => setPaisSelecionado(e.target.value)}
          >
            {PAISES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* ===========================
          IMPOSITOS
      =========================== */}
      <section className="config-section">
        <h3>Impostos</h3>
        <button onClick={adicionarImposto}>Adicionar Imposto</button>
        <ul className="item-list">
          {impostos.map((i) => (
            <li key={i.id}>
              <strong>{i.nome}</strong> - {i.tipo} - {i.aliquota}%
              ({i.categoria})
              <button onClick={() => removerItem(i.id, "imposto")}>🗑️</button>
            </li>
          ))}
        </ul>
      </section>

      {/* ===========================
          FLUXOS FINANCEIROS
      =========================== */}
      <section className="config-section">
        <h3>Fluxos Financeiros</h3>
        <button onClick={adicionarFluxo}>Adicionar Fluxo</button>
        <ul className="item-list">
          {fluxos.map((f) => (
            <li key={f.id}>
              <strong>{f.nome}</strong> - {f.tipo} {f.descricao && `(${f.descricao})`}
              <button onClick={() => removerItem(f.id, "fluxo")}>🗑️</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default FinanceConfigPanel;
