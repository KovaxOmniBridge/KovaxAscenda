import React from "react";
import "./acquisitionMovement.css";

interface HubCardProps {
  title: string;
  description: string;
  actions: string[];
}

const HubCard: React.FC<HubCardProps> = ({ title, description, actions }) => {
  return (
    <div className="hub-card">
      <div className="hub-card-header">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="hub-card-actions">
        {actions.map((action, index) => (
          <button key={index} className="hub-action-button">
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

const AcquisitionMovement: React.FC = () => {
  return (
    <section className="hub-container">
      <header className="hub-header">
        <h1>Aquisição & Movimentação</h1>
        <p>
          Gestão integrada do ciclo de entrada, evolução e saída de pessoas na
          organização.
        </p>
      </header>

      <div className="hub-grid">
        <HubCard
          title="Recrutamento & Seleção"
          description="Captação interna e externa de talentos, triagem e decisão."
          actions={[
            "Criar Vaga",
            "Banco de Talentos",
            "Processos Seletivos",
            "Indicadores de Aquisição",
          ]}
        />

        <HubCard
          title="Admissão & Onboarding"
          description="Formalização da entrada e integração inicial do colaborador."
          actions={[
            "Admissão",
            "Checklist de Onboarding",
            "Integrações",
            "Documentação",
          ]}
        />

        <HubCard
          title="Período de Experiência"
          description="Acompanhamento, avaliações e decisões de efetivação."
          actions={[
            "Avaliações",
            "Feedbacks",
            "Regras de Efetivação",
            "Histórico",
          ]}
        />

        <HubCard
          title="Movimentações Internas"
          description="Promoções, transferências e mudanças contratuais."
          actions={[
            "Promoção",
            "Transferência",
            "Alteração de Cargo",
            "Histórico de Movimentações",
          ]}
        />

        <HubCard
          title="Mobilidade Internacional"
          description="Gestão de alocações e contratos globais."
          actions={[
            "Nova Mobilidade",
            "Contratos",
            "Compliance Local",
            "Acompanhamento",
          ]}
        />

        <HubCard
          title="Offboarding & Desligamentos"
          description="Encerramento do vínculo de forma estruturada e auditável."
          actions={[
            "Desligamento",
            "Checklist de Saída",
            "Motivos",
            "Indicadores de Turnover",
          ]}
        />
      </div>
    </section>
  );
};

export default AcquisitionMovement;
