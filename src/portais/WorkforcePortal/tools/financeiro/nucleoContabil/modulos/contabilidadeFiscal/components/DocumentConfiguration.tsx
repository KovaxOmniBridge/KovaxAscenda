import React, { useState } from 'react';
import './styles/DocumentConfiguration.css';
import DocumentCreationModal from './DocumentCreationModal';
import { UniversalFiscalDocument } from '../types/UniversalFiscalDocument';

const DocumentConfiguration = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createdDocuments, setCreatedDocuments] = useState<UniversalFiscalDocument[]>([]);

    const [documentTypes] = useState([
        {
            id: 'nfe',
            name: 'NF-e',
            description: 'Nota Fiscal Eletrônica',
            series: '1',
            nextNumber: '000001',
            status: 'active',
            icon: '📄'
        },
        {
            id: 'nfse',
            name: 'NFS-e',
            description: 'Nota Fiscal de Serviço Eletrônica',
            series: '1',
            nextNumber: '000001',
            status: 'active',
            icon: '📋'
        },
        {
            id: 'nfce',
            name: 'NFC-e',
            description: 'Nota Fiscal ao Consumidor Eletrônica',
            series: '1',
            nextNumber: '000001',
            status: 'inactive',
            icon: '🧾'
        },
        {
            id: 'cte',
            name: 'CT-e',
            description: 'Conhecimento de Transporte Eletrônico',
            series: '1',
            nextNumber: '000001',
            status: 'inactive',
            icon: '🚚'
        }
    ]);

    const handleDocumentCreated = (doc: UniversalFiscalDocument) => {
        setCreatedDocuments(prev => [...prev, doc]);
        console.log('Documento criado:', doc);
    };

    return (
        <div className="dc-container">
            {/* Header */}
            <header className="dc-header">
                <div className="dc-header-row">
                    <div>
                        <h3 className="dc-title">Configuração de Documentos Fiscais</h3>
                        <p className="dc-subtitle">
                            Gerencie templates, numeração e séries de documentos fiscais eletrônicos.
                        </p>
                    </div>

                    <button
                        className="dc-btn-primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span>+</span>
                        Novo Documento
                    </button>
                </div>
            </header>

            {/* Grid de Documentos */}
            <section className="dc-grid">
                {documentTypes.map(doc => (
                    <article key={doc.id} className="dc-card">
                        <div className="dc-card-header">
                            <div className="dc-card-title-group">
                                <span className="dc-card-icon">{doc.icon}</span>
                                <div>
                                    <h4 className="dc-card-title">{doc.name}</h4>
                                    <p className="dc-card-description">{doc.description}</p>
                                </div>
                            </div>

                            <span
                                className={`dc-status ${
                                    doc.status === 'active'
                                        ? 'dc-status-active'
                                        : 'dc-status-inactive'
                                }`}
                            >
                                {doc.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>

                        <div className="dc-card-body">
                            <div className="dc-card-row">
                                <span className="dc-card-label">Série</span>
                                <span className="dc-card-value">{doc.series}</span>
                            </div>

                            <div className="dc-card-row">
                                <span className="dc-card-label">Próximo Número</span>
                                <span className="dc-card-value dc-card-mono">
                                    {doc.nextNumber}
                                </span>
                            </div>
                        </div>

                        <div className="dc-card-actions">
                            <button className="dc-btn-configure">
                                Configurar
                            </button>
                            <button className="dc-btn-secondary">
                                ⚙️
                            </button>
                        </div>
                    </article>
                ))}
            </section>

            {/* Templates */}
            <section className="dc-templates">
                <h4 className="dc-templates-title">
                    Templates de Documentos
                </h4>

                <div className="dc-template-grid">
                    <div className="dc-template-card">
                        <div className="dc-card-title-group">
                            <span className="dc-card-icon">📝</span>
                            <div>
                                <h5 className="dc-template-title">
                                    Template Padrão NF-e
                                </h5>
                                <p className="dc-template-meta">
                                    Última atualização: 15/01/2026
                                </p>
                            </div>
                        </div>

                        <button className="dc-template-link">
                            Editar Template →
                        </button>
                    </div>

                    <div className="dc-template-card">
                        <div className="dc-card-title-group">
                            <span className="dc-card-icon">📝</span>
                            <div>
                                <h5 className="dc-template-title">
                                    Template Padrão NFS-e
                                </h5>
                                <p className="dc-template-meta">
                                    Última atualização: 10/01/2026
                                </p>
                            </div>
                        </div>

                        <button className="dc-template-link">
                            Editar Template →
                        </button>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <DocumentCreationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDocumentCreated={handleDocumentCreated}
            />
        </div>
    );
};

export default DocumentConfiguration;
