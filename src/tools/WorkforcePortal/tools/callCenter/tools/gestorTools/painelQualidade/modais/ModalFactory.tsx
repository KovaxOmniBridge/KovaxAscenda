import React from "react";

/* ================================
   IMPORTAÇÃO DOS MODAIS
================================ */

import ModalLucratividade from "./ModalLucratividade";
import ModalEficienciaSistema from "./ModalEficienciaSistema";
import ModalEficienciaSquads from "./ModalEficienciaSquads";
import ModalQualidadeOperacional from "./ModalQualidadeOperacional";
// Futuro:
// import ModalAutomacao from "./ModalAutomacao";
// import ModalRisco from "./ModalRisco";

/* ================================
   TIPAGEM DO MODAL FACTORY
================================ */

type ModalFactoryProps = {
  modalKey: string;
  onClose: () => void;
};

/* ================================
   REGISTRO CENTRAL DE MODAIS
================================ */

const MODAL_REGISTRY: Record<string, React.FC<{ onClose: () => void }>> = {
  lucratividade: ModalLucratividade,
  eficienciaSistema: ModalEficienciaSistema,
  eficienciaSquads: ModalEficienciaSquads,
  qualidade: ModalQualidadeOperacional
  // automacao: ModalAutomacao,
  // risco: ModalRisco
};

/* ================================
   FACTORY
================================ */

const ModalFactory: React.FC<ModalFactoryProps> = ({
  modalKey,
  onClose
}) => {
  const ModalComponent = MODAL_REGISTRY[modalKey];

  if (!ModalComponent) {
    return (
      <div className="modal-container">
        <header className="modal-header">
          <h2>Modal não encontrado</h2>
          <button onClick={onClose}>✕</button>
        </header>

        <div className="modal-content">
          <p>
            Nenhum modal registrado para a chave:
            <strong> {modalKey}</strong>
          </p>
        </div>
      </div>
    );
  }

  return <ModalComponent onClose={onClose} />;
};

export default ModalFactory;
