import React, { useState } from 'react';
import './styles/FiscalHistory.css';

const FiscalHistory = () => {
  const [events] = useState([
    {
      id: '1',
      type: 'rule_activated',
      title: 'Regra Fiscal Ativada',
      description: 'ICMS - Vendas Interestaduais (18%) foi ativada',
      user: 'João Silva',
      timestamp: '2026-01-25T14:30:00',
      color: 'green'
    },
    {
      id: '2',
      type: 'rule_modified',
      title: 'Regra Fiscal Modificada',
      description: 'ISS - Serviços Digitais: alíquota alterada de 3% para 5%',
      user: 'Maria Santos',
      timestamp: '2026-01-24T10:15:00',
      color: 'blue'
    },
    {
      id: '3',
      type: 'simulation',
      title: 'Simulação Executada',
      description: '3 cenários simulados para PIS/COFINS',
      user: 'Carlos Oliveira',
      timestamp: '2026-01-23T16:45:00',
      color: 'purple'
    },
    {
      id: '4',
      type: 'rule_deactivated',
      title: 'Regra Fiscal Desativada',
      description: 'IPI - Produtos Importados foi desativada',
      user: 'Ana Costa',
      timestamp: '2026-01-22T09:20:00',
      color: 'red'
    },
    {
      id: '5',
      type: 'document_generated',
      title: 'Documento Gerado',
      description: 'NF-e #000123 emitida com sucesso',
      user: 'Sistema',
      timestamp: '2026-01-21T11:30:00',
      color: 'gray'
    }
  ]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 36e5);

    if (diffHours < 24) return `Há ${diffHours} horas`;
    if (diffHours < 48) return 'Ontem';
    return date.toLocaleDateString('pt-BR');
  };

  const getFiscalColorClass = (color: string) =>
    `fiscal-event-icon fiscal-${color}`;

  return (
    <div className="fiscal-history">
      
        {/* Header Unificado */}
        <div className="fiscal-card fiscal-history-header">

        {/* Título + descrição */}
        <div>
            <p className="text-slate-600 mt-1">
            Linha do tempo completa para auditoria, compliance e rastreabilidade fiscal.
            </p>
        </div>

        {/* Filtros */}
        <div className="fiscal-filters">
            <div className="flex flex-wrap gap-3">
            <select className="px-4 py-2 rounded-lg text-sm">
                <option value="">Todos os Tipos</option>
                <option value="rule_activated">Regras Ativadas</option>
                <option value="rule_modified">Regras Modificadas</option>
                <option value="rule_deactivated">Regras Desativadas</option>
                <option value="simulation">Simulações</option>
                <option value="document_generated">Documentos</option>
            </select>

            <input type="date" className="px-4 py-2 rounded-lg text-sm" />

            <input
                type="text"
                placeholder="Buscar por usuário…"
                className="flex-1 min-w-[200px] px-4 py-2 rounded-lg text-sm"
            />

            <button className="fiscal-button fiscal-button-primary px-4 py-2 text-sm">
                Filtrar
            </button>
            </div>
        </div>

        </div>


      {/* Timeline */}
      <div className="fiscal-timeline space-y-6">
        {events.map(event => (
          <div key={event.id} className="fiscal-event flex gap-4">

            {/* Card */}
            <div className="fiscal-event-card">
              <div className="flex justify-between gap-4">
                <div>
                  <h4 className="fiscal-event-title">{event.title}</h4>
                  <p className="fiscal-event-description mt-1">
                    {event.description}
                  </p>
                </div>

                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(event.timestamp)}
                </span>
              </div>

              <div className="fiscal-divider" />

              <div className="fiscal-event-meta mt-2">
                <span>Por</span>
                <span className="fiscal-event-user">{event.user}</span>
                <span>•</span>
                <span>
                  {new Date(event.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      <div className="flex justify-center">
        <button className="fiscal-button fiscal-button-secondary px-6 py-3">
          Carregar mais eventos
        </button>
      </div>
    </div>
  );
};

export default FiscalHistory;
