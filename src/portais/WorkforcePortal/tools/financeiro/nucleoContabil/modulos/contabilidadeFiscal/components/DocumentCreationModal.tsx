import React, { useState } from 'react';
import { UniversalFiscalDocument, DocumentState, LineItem, AppliedTax, FiscalEvent, Party, DocumentTotals, LegalMetadata } from '../types/UniversalFiscalDocument';
import { BrazilFiscalAdapter, getFiscalAdapter } from '../adapters/BrazilFiscalAdapter';
import './styles/DocumentCreationModal.css';

interface DocumentCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDocumentCreated: (doc: UniversalFiscalDocument) => void;
}

type WizardStep = 'template' | 'parties' | 'items' | 'taxes' | 'review' | 'result';

const DocumentCreationModal: React.FC<DocumentCreationModalProps> = ({ isOpen, onClose, onDocumentCreated }) => {
    const [currentStep, setCurrentStep] = useState<WizardStep>('template');
    const [selectedCountry, setSelectedCountry] = useState('Brazil');
    const [selectedDocType, setSelectedDocType] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Document state
    const [document, setDocument] = useState<Partial<UniversalFiscalDocument>>({
        id: `DOC-${Date.now()}`,
        version: 1,
        state: 'draft' as DocumentState,
        country: 'Brazil',
        jurisdiction: 'Federal',
        items: [],
        services: [],
        taxes: [],
        events: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    const [receiver, setReceiver] = useState<Partial<Party>>({
        name: '',
        taxId: '',
        address: {
            street: '',
            number: '',
            district: '',
            city: '',
            state: '',
            country: 'Brazil',
            postalCode: ''
        }
    });

    const [newItem, setNewItem] = useState<Partial<LineItem>>({
        code: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        unit: 'UN'
    });

    if (!isOpen) return null;

    const adapter = getFiscalAdapter(selectedCountry);

    const addItem = () => {
        if (!newItem.description || !newItem.unitPrice) return;

        const item: LineItem = {
            id: `ITEM-${Date.now()}`,
            code: newItem.code || '',
            description: newItem.description,
            quantity: newItem.quantity || 1,
            unitPrice: newItem.unitPrice,
            subtotal: (newItem.quantity || 1) * newItem.unitPrice,
            unit: newItem.unit || 'UN'
        };

        setDocument(prev => ({
            ...prev,
            items: [...(prev.items || []), item]
        }));

        setNewItem({ code: '', description: '', quantity: 1, unitPrice: 0, unit: 'UN' });
    };

    const removeItem = (id: string) => {
        setDocument(prev => ({
            ...prev,
            items: (prev.items || []).filter(item => item.id !== id)
        }));
    };

    const calculateTotals = (): DocumentTotals => {
        const subtotal = (document.items || []).reduce((sum, item) => sum + item.subtotal, 0);
        const taxesTotal = (document.taxes || []).reduce((sum, tax) => sum + tax.amount, 0);

        return {
            subtotal,
            discounts: 0,
            taxesTotal,
            total: subtotal + taxesTotal
        };
    };

    const applyTaxes = () => {
        if (!adapter) return;

        const subtotal = (document.items || []).reduce((sum, item) => sum + item.subtotal, 0);
        const taxes: AppliedTax[] = adapter.calculationRules.map(rule => ({
            id: `TAX-${rule.id}`,
            name: rule.name,
            type: rule.id,
            rate: rule.rate,
            baseValue: subtotal,
            amount: (subtotal * rule.rate) / 100,
            jurisdiction: document.jurisdiction || 'Federal'
        }));

        setDocument(prev => ({
            ...prev,
            taxes,
            totals: calculateTotals()
        }));
    };

    const handleEmit = async () => {
        if (!adapter) return;

        setIsProcessing(true);
        setCurrentStep('result');

        const fullDoc: UniversalFiscalDocument = {
            ...document as UniversalFiscalDocument,
            receiver: receiver as Party,
            issuer: {
                id: 'ISSUER-1',
                name: 'Empresa Exemplo LTDA',
                taxId: '12345678000190',
                address: {
                    street: 'Rua Exemplo',
                    number: '123',
                    district: 'Centro',
                    city: 'São Paulo',
                    state: 'SP',
                    country: 'Brazil',
                    postalCode: '01234-567'
                }
            } as Party,
            legalMetadata: {
                operationType: 'sale',
                additionalInfo: '',
                fiscalNotes: ''
            } as LegalMetadata,
            totals: calculateTotals()
        };

        try {
            const result = await adapter.authorizeDocument(fullDoc);

            const event: FiscalEvent = {
                id: `EVENT-${Date.now()}`,
                type: result.success ? 'authorized' : 'rejected',
                timestamp: new Date().toISOString(),
                user: 'Sistema',
                details: result.message
            };

            const finalDoc: UniversalFiscalDocument = {
                ...fullDoc,
                state: result.state,
                authorizationProtocol: result.protocol,
                events: [...fullDoc.events, event],
                authorizedAt: result.success ? new Date().toISOString() : undefined
            };

            setDocument(finalDoc);

            if (result.success) {
                setTimeout(() => {
                    onDocumentCreated(finalDoc);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Erro ao emitir documento:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const renderStepIndicator = () => {
        const steps = [
            { id: 'template', label: '1. Template' },
            { id: 'parties', label: '2. Partes' },
            { id: 'items', label: '3. Itens' },
            { id: 'taxes', label: '4. Tributos' },
            { id: 'review', label: '5. Revisão' },
            { id: 'result', label: '6. Resultado' }
        ];

        return (
            <div className="dcm-step-indicator">
                {steps.map((step, idx) => (
                    <div
                        key={step.id}
                        className={`dcm-step ${currentStep === step.id ? 'active' : ''} ${steps.findIndex(s => s.id === currentStep) > idx ? 'completed' : ''
                            }`}
                    >
                        <div className="dcm-step-number">{idx + 1}</div>
                        <div className="dcm-step-label">{step.label}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="dcm-overlay">
            <div className="dcm-modal">
                {/* Header */}
                <div className="dcm-header">
                    <div>
                        <h2 className="dcm-title">Criar Documento Fiscal</h2>
                        <p className="dcm-subtitle">Sistema Universal de Documentos (U-FDM)</p>
                    </div>
                    <button onClick={onClose} className="dcm-close">✕</button>
                </div>

                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Content */}
                <div className="dcm-content">
                    {/* Step 1: Template Selection */}
                    {currentStep === 'template' && (
                        <div className="dcm-step-content">
                            <h3 className="dcm-section-title">Selecione o Tipo de Documento</h3>

                            <div className="dcm-country-selector">
                                <label>País/Jurisdição:</label>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="dcm-select"
                                >
                                    <option value="Brazil">🇧🇷 Brasil</option>
                                    <option value="USA" disabled>🇺🇸 Estados Unidos (em breve)</option>
                                    <option value="EU" disabled>🇪🇺 União Europeia (em breve)</option>
                                </select>
                            </div>

                            <div className="dcm-doc-types-grid">
                                {adapter?.documentTypes.map((docType) => (
                                    <div
                                        key={docType.id}
                                        className={`dcm-doc-type-card ${selectedDocType === docType.id ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedDocType(docType.id);
                                            setDocument(prev => ({ ...prev, documentType: docType.id }));
                                        }}
                                    >
                                        <span className="dcm-doc-icon">{docType.icon}</span>
                                        <h4>{docType.name}</h4>
                                        <p>{docType.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Parties */}
                    {currentStep === 'parties' && (
                        <div className="dcm-step-content">
                            <h3 className="dcm-section-title">Dados do Destinatário</h3>

                            <div className="dcm-form-grid">
                                <div className="dcm-form-group">
                                    <label>CNPJ/CPF *</label>
                                    <input
                                        type="text"
                                        value={receiver.taxId}
                                        onChange={(e) => setReceiver({ ...receiver, taxId: e.target.value })}
                                        placeholder="00.000.000/0000-00"
                                        className="dcm-input"
                                    />
                                </div>
                                <div className="dcm-form-group">
                                    <label>Nome/Razão Social *</label>
                                    <input
                                        type="text"
                                        value={receiver.name}
                                        onChange={(e) => setReceiver({ ...receiver, name: e.target.value })}
                                        placeholder="Nome do destinatário"
                                        className="dcm-input"
                                    />
                                </div>
                                <div className="dcm-form-group">
                                    <label>CEP</label>
                                    <input
                                        type="text"
                                        value={receiver.address?.postalCode}
                                        onChange={(e) => setReceiver({
                                            ...receiver,
                                            address: { ...receiver.address!, postalCode: e.target.value }
                                        })}
                                        placeholder="00000-000"
                                        className="dcm-input"
                                    />
                                </div>
                                <div className="dcm-form-group">
                                    <label>Cidade</label>
                                    <input
                                        type="text"
                                        value={receiver.address?.city}
                                        onChange={(e) => setReceiver({
                                            ...receiver,
                                            address: { ...receiver.address!, city: e.target.value }
                                        })}
                                        placeholder="Cidade"
                                        className="dcm-input"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Items */}
                    {currentStep === 'items' && (
                        <div className="dcm-step-content">
                            <h3 className="dcm-section-title">Itens do Documento</h3>

                            <div className="dcm-add-item-form">
                                <input
                                    type="text"
                                    placeholder="Código"
                                    value={newItem.code}
                                    onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                                    className="dcm-input"
                                    style={{ flex: '0 0 100px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Descrição *"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    className="dcm-input"
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    placeholder="Qtd"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                                    className="dcm-input"
                                    style={{ flex: '0 0 80px' }}
                                />
                                <input
                                    type="number"
                                    placeholder="Preço Unit. *"
                                    value={newItem.unitPrice}
                                    onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                                    className="dcm-input"
                                    style={{ flex: '0 0 120px' }}
                                />
                                <button onClick={addItem} className="dcm-btn-add">+ Adicionar</button>
                            </div>

                            <div className="dcm-items-list">
                                {(document.items || []).map((item) => (
                                    <div key={item.id} className="dcm-item-row">
                                        <span className="dcm-item-code">{item.code}</span>
                                        <span className="dcm-item-desc">{item.description}</span>
                                        <span className="dcm-item-qty">{item.quantity} {item.unit}</span>
                                        <span className="dcm-item-price">R$ {item.unitPrice.toFixed(2)}</span>
                                        <span className="dcm-item-total">R$ {item.subtotal.toFixed(2)}</span>
                                        <button onClick={() => removeItem(item.id)} className="dcm-btn-remove">🗑️</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Taxes */}
                    {currentStep === 'taxes' && (
                        <div className="dcm-step-content">
                            <h3 className="dcm-section-title">Tributação</h3>

                            {document.taxes && document.taxes.length > 0 ? (
                                <div className="dcm-taxes-list">
                                    {document.taxes.map((tax) => (
                                        <div key={tax.id} className="dcm-tax-item">
                                            <div className="dcm-tax-name">{tax.name}</div>
                                            <div className="dcm-tax-details">
                                                <span>Base: R$ {tax.baseValue.toFixed(2)}</span>
                                                <span>Alíquota: {tax.rate}%</span>
                                                <span className="dcm-tax-amount">Valor: R$ {tax.amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="dcm-empty-state">
                                    <p>Nenhum imposto calculado ainda.</p>
                                    <button onClick={applyTaxes} className="dcm-btn-primary">Calcular Impostos</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 'review' && (
                        <div className="dcm-step-content">
                            <h3 className="dcm-section-title">Revisão Final</h3>

                            <div className="dcm-review-section">
                                <h4>Resumo do Documento</h4>
                                <div className="dcm-review-grid">
                                    <div><strong>Tipo:</strong> {selectedDocType.toUpperCase()}</div>
                                    <div><strong>Destinatário:</strong> {receiver.name}</div>
                                    <div><strong>Itens:</strong> {document.items?.length || 0}</div>
                                    <div><strong>Subtotal:</strong> R$ {calculateTotals().subtotal.toFixed(2)}</div>
                                    <div><strong>Impostos:</strong> R$ {calculateTotals().taxesTotal.toFixed(2)}</div>
                                    <div><strong>Total:</strong> R$ {calculateTotals().total.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Result */}
                    {currentStep === 'result' && (
                        <div className="dcm-step-content">
                            <div className="dcm-result-container">
                                {isProcessing ? (
                                    <div className="dcm-processing">
                                        <div className="dcm-spinner"></div>
                                        <p>Enviando para autorização...</p>
                                    </div>
                                ) : (
                                    <div className={`dcm-result ${document.state === 'authorized' ? 'success' : 'error'}`}>
                                        <div className="dcm-result-icon">
                                            {document.state === 'authorized' ? '✅' : '❌'}
                                        </div>
                                        <h3>{document.state === 'authorized' ? 'Documento Autorizado!' : 'Documento Rejeitado'}</h3>
                                        <p>{document.events?.[document.events.length - 1]?.details}</p>
                                        {document.authorizationProtocol && (
                                            <div className="dcm-protocol">
                                                <strong>Protocolo:</strong> {document.authorizationProtocol}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="dcm-footer">
                    {currentStep !== 'template' && currentStep !== 'result' && (
                        <button
                            onClick={() => {
                                const steps: WizardStep[] = ['template', 'parties', 'items', 'taxes', 'review'];
                                const currentIdx = steps.indexOf(currentStep);
                                if (currentIdx > 0) setCurrentStep(steps[currentIdx - 1]);
                            }}
                            className="dcm-btn-secondary"
                        >
                            ← Voltar
                        </button>
                    )}

                    {currentStep !== 'result' && (
                        <button
                            onClick={() => {
                                const steps: WizardStep[] = ['template', 'parties', 'items', 'taxes', 'review', 'result'];
                                const currentIdx = steps.indexOf(currentStep);

                                if (currentStep === 'review') {
                                    handleEmit();
                                } else if (currentIdx < steps.length - 1) {
                                    if (currentStep === 'items' && document.items && document.items.length > 0) {
                                        applyTaxes();
                                    }
                                    setCurrentStep(steps[currentIdx + 1]);
                                }
                            }}
                            className="dcm-btn-primary"
                            disabled={
                                (currentStep === 'template' && !selectedDocType) ||
                                (currentStep === 'parties' && (!receiver.name || !receiver.taxId)) ||
                                (currentStep === 'items' && (!document.items || document.items.length === 0))
                            }
                        >
                            {currentStep === 'review' ? 'Emitir Documento' : 'Próximo →'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentCreationModal;
