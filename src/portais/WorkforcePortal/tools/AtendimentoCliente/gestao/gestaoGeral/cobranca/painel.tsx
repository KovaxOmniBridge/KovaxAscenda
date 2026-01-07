import React, { useState } from "react";
import "./painel.css";

/* =====================
   Modais
===================== */

import ModalInadimplentes from "./modals/modalInadinplentes";
//import ModalRecuperado from "./modals/modalRecuperados";
//import ModalPerdido from "./modals/modalPerdidos";
//import ModalValores from "./modals/modalValores";

/* =====================
   Tipos
===================== */

type ModalType =
  | "BASE_INADIMPLENTE"
  | "RECUPERADO"
  | "PERDIDO"
  | "VALORES"
  | "RELATORIO_EXECUTIVO"
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

const DashboardCobranca: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <main className="dashboard-kpi">

      <KPIBlock title="Base de Cobrança">
        <KPICard
          title="Clientes Inadimplentes"
          value={3_280}
          onClick={() => setActiveModal("BASE_INADIMPLENTE")}
        />

        <KPICard
          title="Valor em Atraso"
          value="R$ 1.245.000"
          onClick={() => setActiveModal("VALORES")}
        />
      </KPIBlock>


      <KPIBlock title="Performance de Recuperação">
        <KPICard
          title="Valor Recuperado"
          value="R$ 522.400"
          onClick={() => setActiveModal("RECUPERADO")}
        />

        <KPICard
          title="Valor Perdido"
          value="R$ 338.900"
          onClick={() => setActiveModal("PERDIDO")}
        />
      </KPIBlock>


      <KPIBlock title="Visão Executiva">
        <KPICard
          title="Relatório Executivo"
          value="Acessar"
          onClick={() => setActiveModal("RELATORIO_EXECUTIVO")}
        />
      </KPIBlock>

      </main>

      {/* =====================
          Camada de Modais
      ===================== */}

      {activeModal === "BASE_INADIMPLENTE" && (
        <ModalInadimplentes onClose={closeModal} />
      )}

      {activeModal === "VALORES" && (
        <ModalValores onClose={closeModal} />
      )}

      {activeModal === "PERDIDO" && (
        <ModalPerdido onClose={closeModal} />
      )}

      {activeModal === "RECUPERADO" && (
        <ModalRecuperado onClose={closeModal} />
      )}

      {activeModal === "RELATORIO_EXECUTIVO" && (
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

export default DashboardCobranca;
