import React, { useState } from "react";
import "./painel.css";

/* =====================
   Modais
===================== */

import ModalOrigemAtracao from "./modals/ModalOrigemAtracao";
import ModalTaxaConversao from "./modals/modalAtivacaoIniciacao";
import ModalAbandono from "./modals/modalAbandono";
import ModalConversaoClientes from "./modals/modalConversao";

/* =====================
   Tipos
===================== */

type ModalType =
  | "ORIGEM_ATRACAO"
  | "ATIVACAO"
  | "ABANDONO"
  | "CONVERSAO"
  | "RELATORIO"
  | null;

/* =====================
   Componentes Base
===================== */

interface KPICardProps {
  title: string;
  value: string | number;
  onClick: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, onClick }) => (
  <div className="kpi-card" onClick={onClick} role="button">
    <span className="kpi-title">{title}</span>
    <strong className="kpi-value">{value}</strong>
  </div>
);

interface KPIBlockProps {
  title: string;
  children: React.ReactNode;
}

const KPIBlock: React.FC<KPIBlockProps> = ({ title, children }) => (
  <section className="kpi-block">
    <h2 className="kpi-block-title">{title}</h2>
    <div className="kpi-block-content">{children}</div>
  </section>
);

/* =====================
   Modal Simples
===================== */

interface SimpleModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  title,
  onClose,
  children,
}) => (
  <div className="modal-overlay">
    <div className="modal-container">
      <header className="modal-header">
        <h3>{title}</h3>
        <button onClick={onClose}>✕</button>
      </header>
      <div className="modal-content">{children}</div>
    </div>
  </div>
);

/* =====================
   Dashboard Principal
===================== */

const DashboardAquisicao: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <main className="dashboard-kpi">

        {/* Origem & Atração */}
        <KPIBlock title="Origem & Atração">
          <KPICard
            title="Entradas Totais"
            value={12_450}
            onClick={() => setActiveModal("ORIGEM_ATRACAO")}
          />
        </KPIBlock>

        {/* Ativação & Iniciação */}
        <KPIBlock title="Ativação & Iniciação">
          <KPICard
            title="Taxa de Inicialização"
            value="42%"
            onClick={() => setActiveModal("ATIVACAO")}
          />

          <KPICard
            title="Taxa de Abandono"
            value="27%"
            onClick={() => setActiveModal("ABANDONO")}
          />
        </KPIBlock>

        {/* Conversão (placeholder estratégico) */}
        <KPIBlock title="Conversão">
          <KPICard
            title="Conversão em Clientes"
            value="18%"
            onClick={() => setActiveModal("CONVERSAO")}
          />
        </KPIBlock>

        {/* Visão Executiva */}
        <KPIBlock title="Visão Executiva">
          <KPICard
            title="Relatório Geral"
            value="Visualizar"
            onClick={() => setActiveModal("RELATORIO")}
          />
        </KPIBlock>

      </main>

      {/* =====================
          Camada de Modais
      ===================== */}

      {activeModal === "ORIGEM_ATRACAO" && (
        <ModalOrigemAtracao onClose={closeModal} />
      )}

      {activeModal === "ATIVACAO" && (
        <ModalTaxaConversao onClose={closeModal} />
      )}

      {activeModal === "ABANDONO" && (
        <ModalAbandono onClose={closeModal} />
      )}

      {activeModal === "CONVERSAO" && (
        <ModalConversaoClientes onClose={closeModal} />
      )}

      {activeModal === "RELATORIO" && (
        <SimpleModal
          title="Relatório Geral"
          onClose={closeModal}
        >
          Visão consolidada do funil completo: aquisição, ativação e conversão.
        </SimpleModal>
      )}
    </>
  );
};

export default DashboardAquisicao;
