import React, { useState } from 'react';
import TaxConfigurationModal from './TaxConfigurationModal';
import './styles/FiscalConfiguration.css';

interface TaxRule {
    id: string;
    description: string;
    filters: {
        region?: string;
        category?: string;
    };
    taxes: {
        name: string;
        rate: number;
    }[];
    status: 'ACTIVE' | 'DRAFT';
    validFrom: string;
}

const FiscalConfiguration = () => {
    // State for Rule Engine
    const [rules, setRules] = useState<TaxRule[]>([
        {
            id: '1',
            description: 'Regra Padrão - Serviços Digitais (Global)',
            filters: { category: 'Serviços' },
            taxes: [{ name: 'VAT/IVA', rate: 20.0 }],
            status: 'ACTIVE',
            validFrom: '2025-01-01T00:00'
        },
        {
            id: '2',
            description: 'Vendas Varejo - América do Norte (EUA)',
            filters: { region: 'North America', category: 'Produtos' },
            taxes: [{ name: 'Sales Tax', rate: 8.5 }],
            status: 'ACTIVE',
            validFrom: '2025-01-01T00:00'
        }
    ]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddRule = (data: any) => {
        // Mock implementation to add the rule based on new modal data
        if (data && data.name) {
            setRules([...rules, {
                id: Math.random().toString(36).substr(2, 9),
                description: `${data.name} (${data.country || 'Global'})`,
                filters: {
                    region: data.country || 'Global',
                    category: (data.productTags && data.productTags.length > 0) ? 'Produtos' : 'Geral'
                },
                taxes: [{ name: data.name, rate: parseFloat(data.rate) || 0 }],
                status: 'ACTIVE',
                validFrom: data.vigencia || new Date().toISOString()
            } as TaxRule]);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="fc-container">

            {/* Header com Filtros (Sticky & Responsive) */}
            <div className="fc-header">
                {/* Lado Esquerdo: Título */}
                <div className="fc-title-group">
                    <div>
                        <h3 className="fc-title">Regras Fiscais</h3>
                        <p className="fc-subtitle">Gerencie a tributação global</p>
                    </div>
                </div>

                {/* Centro/Direita: Filtros e Ações em Linha */}
                <div className="fc-controls-wrapper">
                    {/* Grupo de Filtros */}
                    <div className="fc-filter-group">
                        <div className="fc-search-wrapper">
                            <input
                                type="text"
                                placeholder="Buscar regra..."
                                className="cf-input-control fc-search-input"
                            />
                            <span className="fc-search-icon">🔍</span>
                        </div>
                        <select className="cf-input-control fc-filter-select">
                            <option value="">País</option>
                            <option value="BR">Brasil</option>
                            <option value="US">USA</option>
                            <option value="EU">Europa</option>
                        </select>
                        <select className="cf-input-control fc-filter-select">
                            <option value="">Estado</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Produto"
                            className="cf-input-control fc-filter-input"
                        />
                    </div>

                    {/* Botão de Ação */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="fc-btn-primary"
                    >
                        <span>＋</span> <span className="inline">Nova Regra</span>
                    </button>
                </div>
            </div>

            {/* Gallery Grid (Mercado Livre Style) */}
            <div className="cf-gallery-grid">
                {rules.map(rule => (
                    <div key={rule.id} className="cf-gallery-card fc-card">
                        {/* Functional Header (Price + Status) */}
                        <div className="cf-card-header">
                            <span className="cf-card-price">
                                {rule.taxes[0]?.rate}% <span className="fc-card-price-sub">/ {rule.taxes[0]?.name}</span>
                            </span>
                            {rule.status === 'ACTIVE' && (
                                <span className="fc-status-badge">
                                    Ativo
                                </span>
                            )}
                        </div>

                        {/* Body */}
                        <div className="cf-card-body pt-2">
                            <h4 className="cf-card-title mt-0" title={rule.description}>
                                {rule.description}
                            </h4>

                            <div className="cf-card-meta">
                                <span className="cf-badge neutral">
                                    {rule.filters.region || 'Global'}
                                </span>
                                {(rule.filters.category) && (
                                    <span className="cf-badge neutral">
                                        {rule.filters.category}
                                    </span>
                                )}
                            </div>

                            <div className="fc-card-validity">
                                Vigência: {new Date(rule.validFrom).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Footer/Actions (Visible on hover concept or always) */}
                        <div className="cf-card-actions fc-card-actions-hover">
                            <span className="cf-link-btn">Ver detalhes</span>
                            <span className="fc-action-dots">⋮</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Validity / Rules Modal */}
            <TaxConfigurationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddRule}
            />
        </div>
    );
};

export default FiscalConfiguration;
