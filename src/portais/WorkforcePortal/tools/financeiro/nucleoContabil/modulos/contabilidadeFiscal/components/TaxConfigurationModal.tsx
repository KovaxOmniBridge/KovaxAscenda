import React, { useState } from 'react';
import '../contabilidadeFiscal.css';
import './styles/TaxConfigurationModal.css';

interface TaxConfigurationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

type Tab = 'identificacao' | 'aplicacao' | 'regra' | 'dependencias' | 'governanca' | 'simulacao';

const TaxConfigurationModal: React.FC<TaxConfigurationModalProps> = ({ isOpen, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState<Tab>('identificacao');
    const [formData, setFormData] = useState({
        // Identificação
        name: '',
        code: '',
        type: 'consumo',
        jurisdiction: 'federal',
        vigencia: '',

        // Aplicação
        country: '',
        state: '',
        city: '',
        productTags: [],
        serviceTags: [],
        clientType: [],

        // Regra
        calcType: 'percentual',
        calcBase: 'bruto',
        rate: '',

        // Dependencias (mock)
        dependencies: [],

        // Governança
        legalRef: '',
        justification: ''
    });

    // Estado para simulações
    const [simulationScenarios, setSimulationScenarios] = useState([
        { id: 'low', label: 'Valor Baixo', value: '100.00', simulated: false, result: null as any },
        { id: 'medium', label: 'Valor Médio', value: '1000.00', simulated: false, result: null as any },
        { id: 'high', label: 'Valor Alto', value: '10000.00', simulated: false, result: null as any }
    ]);

    if (!isOpen) return null;

    // Função de simulação de cálculo de imposto
    const simulateTaxCalculation = (baseValue: number) => {
        const rate = parseFloat(formData.rate) || 0;
        const taxAmount = (baseValue * rate) / 100;
        const total = baseValue + taxAmount;

        return {
            baseValue,
            rate,
            calcBase: formData.calcBase,
            breakdown: [
                { step: 1, description: 'Valor Base', value: baseValue },
                { step: 2, description: `Aplicação de ${formData.name || 'Imposto'} (${rate}%)`, value: taxAmount },
                { step: 3, description: 'Impostos Dependentes', value: 0, note: 'Nenhum configurado' }
            ],
            appliedTaxes: [
                { name: formData.name || 'Imposto Configurado', rate, amount: taxAmount, included: true }
            ],
            excludedTaxes: [],
            total
        };
    };

    const handleSimulate = (scenarioId: string) => {
        const scenario = simulationScenarios.find(s => s.id === scenarioId);
        if (!scenario) return;

        const baseValue = parseFloat(scenario.value) || 0;
        const result = simulateTaxCalculation(baseValue);

        setSimulationScenarios(prev =>
            prev.map(s =>
                s.id === scenarioId
                    ? { ...s, simulated: true, result }
                    : s
            )
        );
    };

    const updateScenarioValue = (scenarioId: string, value: string) => {
        setSimulationScenarios(prev =>
            prev.map(s =>
                s.id === scenarioId
                    ? { ...s, value, simulated: false, result: null }
                    : s
            )
        );
    };

    const allScenariosSimulated = simulationScenarios.every(s => s.simulated);
    const simulatedCount = simulationScenarios.filter(s => s.simulated).length;

    const handleSave = () => {
        // Validation logic could go here
        if (!allScenariosSimulated) {
            alert('Por favor, complete todas as 3 simulações antes de salvar.');
            return;
        }
        onSave(formData);
    };

    // Helper to render badges
    const renderBadge = (label: string, value: string, colorClass: string = "cf-badge neutral") => (
        <span className={`tcm-badge ${colorClass}`}>
            <span className="tcm-badge-label">{label}:</span>
            {value}
        </span>
    );

    return (
        <div className="cf-fs-modal">

            {/* Steps / Tabs */}
            <div className="cf-fs-steps">
                {[
                    { id: 'identificacao', label: '1. Identificação' },
                    { id: 'aplicacao', label: '2. Aplicação' },
                    { id: 'regra', label: '3. Regra de Cálculo' },
                    { id: 'dependencias', label: '4. Dependências' },
                    { id: 'governanca', label: '5. Governança' },
                    { id: 'simulacao', label: '6. Simulação', badge: `${simulatedCount}/3` }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`cf-fs-step-btn ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        {tab.label}
                        {tab.badge && (
                            <span className={`tcm-simulation-badge ${allScenariosSimulated ? 'complete' : ''}`}>
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="cf-fs-content">
                <div className="cf-fs-content-inner tcm-content-inner tcm-animate-fade">

                    {/* Aba 1: Identificação */}
                    {activeTab === 'identificacao' && (
                        <div className="tcm-animate-fade">
                            <h4 className="tcm-section-title">Identificação e Vigência</h4>
                            <div className="tcm-form-grid">
                                <div className="tcm-form-col-full">
                                    <label className="cf-input-label">Nome do Imposto</label>
                                    <input
                                        type="text"
                                        className="cf-input-control"
                                        placeholder="Ex: ICMS, VAT, Sales Tax"
                                        value={formData.name}
                                        autoFocus
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="cf-input-label">Código Interno</label>
                                    <input
                                        type="text"
                                        className="cf-input-control tcm-input-mono"
                                        placeholder="TAX-001"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="cf-input-label">Início da Vigência</label>
                                    <input
                                        type="date"
                                        className="cf-input-control"
                                        value={formData.vigencia}
                                        onChange={e => setFormData({ ...formData, vigencia: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="cf-input-label">Tipo de Imposto</label>
                                    <select
                                        className="cf-input-control"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="consumo">Consumo</option>
                                        <option value="servico">Serviço</option>
                                        <option value="renda">Renda</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="cf-input-label">Nível de Jurisdição</label>
                                    <select
                                        className="cf-input-control"
                                        value={formData.jurisdiction}
                                        onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
                                    >
                                        <option value="municipal">Municipal</option>
                                        <option value="estadual">Estadual</option>
                                        <option value="federal">Federal</option>
                                        <option value="nacional">Nacional</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aba 2: Aplicação */}
                    {activeTab === 'aplicacao' && (
                        <div className="tcm-animate-fade">
                            <h4 className="tcm-section-title">Escopo de Aplicação</h4>
                            <div className="tcm-alert-info">
                                <strong>Dica:</strong> Defina onde e quando este imposto será aplicado. Os campos funcionam como filtros.
                            </div>
                            <div className="tcm-form-grid">
                                <div>
                                    <label className="cf-input-label">País</label>
                                    <select
                                        className="cf-input-control"
                                        value={formData.country}
                                        onChange={e => setFormData({ ...formData, country: e.target.value })}
                                    >
                                        <option value="">Global</option>
                                        <option value="BR">Brasil</option>
                                        <option value="US">Estados Unidos</option>
                                        <option value="EU">União Europeia</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="cf-input-label">Estado / Província</label>
                                    <input
                                        type="text"
                                        className="cf-input-control"
                                        placeholder="Minas Gerais, California..."
                                        value={formData.state}
                                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                                <div className="tcm-form-col-full">
                                    <label className="cf-input-label">Tipo de Cliente</label>
                                    <div className="tcm-checkbox-group">
                                        {['B2B', 'B2C', 'Governo', 'Exportação'].map(type => (
                                            <label key={type} className="tcm-checkbox-label">
                                                <input type="checkbox" className="tcm-checkbox-input" />
                                                {type}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="tcm-form-col-full">
                                    <label className="cf-input-label">Tags de Produto / Serviço</label>
                                    <input
                                        type="text"
                                        className="cf-input-control"
                                        placeholder="Separe por vírgulas (ex: #servico-digital, #software)"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aba 3: Regra de Cálculo */}
                    {activeTab === 'regra' && (
                        <div className="tcm-animate-fade">
                            <h4 className="tcm-section-title">Lógica Tributária</h4>
                            <div className="tcm-form-grid">
                                <div>
                                    <label className="cf-input-label">Tipo de Cálculo</label>
                                    <select
                                        className="cf-input-control"
                                        value={formData.calcType}
                                        onChange={e => setFormData({ ...formData, calcType: e.target.value })}
                                    >
                                        <option value="percentual">Percentual (%)</option>
                                        <option value="fixo">Valor Fixo</option>
                                        <option value="progressivo">Progressivo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="cf-input-label">Base de Cálculo</label>
                                    <select
                                        className="cf-input-control"
                                        value={formData.calcBase}
                                        onChange={e => setFormData({ ...formData, calcBase: e.target.value })}
                                    >
                                        <option value="bruto">Valor Bruto</option>
                                        <option value="liquido">Valor Líquido</option>
                                        <option value="com_impostos">Valor com Outros Impostos</option>
                                    </select>
                                </div>

                                <div className="tcm-form-col-full tcm-rate-container">
                                    <label className="cf-input-label tcm-rate-label">Valor da Alíquota</label>
                                    <div className="tcm-rate-input-wrapper">
                                        <div className="tcm-rate-input-container">
                                            <input
                                                type="number"
                                                className="cf-input-control tcm-rate-input"
                                                placeholder="0.00"
                                                value={formData.rate}
                                                onChange={e => setFormData({ ...formData, rate: e.target.value })}
                                            />
                                            <span className="tcm-rate-symbol">%</span>
                                        </div>
                                        <span className="tcm-rate-hint">Aplicado sobre a base selecionada</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aba 4: Dependências */}
                    {activeTab === 'dependencias' && (
                        <div className="tcm-animate-fade">
                            <h4 className="tcm-section-title">Dependências e Conflitos</h4>
                            <p className="tcm-rate-hint" style={{ marginBottom: "1rem" }}>Defina regras de precedência e conflitos com outros impostos.</p>

                            <div className="tcm-dependencies-list">
                                {/* Exemplo visual de lista de dependencias */}
                                <div className="tcm-dependency-item">
                                    <div className="tcm-dependency-content">
                                        <div className="tcm-dependency-icon">IF</div>
                                        <div>
                                            <div className="tcm-dependency-text-title">Conflito de Bitributação</div>
                                            <div className="tcm-dependency-text-desc">Se <span className="tcm-dependency-code">ISS_QN</span> estiver ativo, não aplicar este imposto.</div>
                                        </div>
                                    </div>
                                    <span className="tcm-dependency-edit">Editar</span>
                                </div>

                                <div className="tcm-add-dependency">
                                    <span className="tcm-add-dependency-text">
                                        <span className="tcm-add-dependency-icon">＋</span> Adicionar Regra de Dependência
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aba 5: Governança */}
                    {activeTab === 'governanca' && (
                        <div className="tcm-animate-fade">
                            <h4 className="tcm-section-title">Governança e Compliance</h4>
                            <div className="tcm-alert-warning">
                                <span className="tcm-alert-icon">⚖️</span>
                                <div>
                                    <strong>Auditoria Legal:</strong> Todos os impostos devem possuir uma base legal vinculada para garantir conformidade em caso de auditoria.
                                </div>
                            </div>

                            <div>
                                <label className="cf-input-label">Referência Legal / Norma</label>
                                <input
                                    type="text"
                                    className="cf-input-control"
                                    placeholder="Ex: Lei Complementar 116/2003"
                                    value={formData.legalRef}
                                    onChange={e => setFormData({ ...formData, legalRef: e.target.value })}
                                />
                            </div>

                            <div className="mt-6">
                                <label className="cf-input-label">Justificativa da Configuração (Obrigatório)</label>
                                <textarea
                                    className="cf-input-control tcm-textarea"
                                    placeholder="Descreva o motivo desta configuração, incluindo pareceres técnicos se houver..."
                                    value={formData.justification}
                                    onChange={e => setFormData({ ...formData, justification: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {/* Aba 6: Simulação */}
                    {activeTab === 'simulacao' && (
                        <div className="tcm-animate-fade">
                            <h4 className="tcm-section-title">Simulações Obrigatórias</h4>
                            <div className="tcm-alert-warning">
                                <span className="tcm-alert-icon">⚠️</span>
                                <div>
                                    <strong>Validação Obrigatória:</strong> Execute as 3 simulações abaixo antes de ativar esta regra fiscal. Isso garante que o cálculo está correto em diferentes cenários.
                                </div>
                            </div>

                            <div className="tcm-progress-indicator">
                                <span className="tcm-progress-label">Progresso:</span>
                                <div className="tcm-progress-bar">
                                    <div
                                        className="tcm-progress-fill"
                                        style={{ width: `${(simulatedCount / 3) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="tcm-progress-text">{simulatedCount} de 3 cenários simulados</span>
                            </div>

                            <div className="tcm-simulation-scenarios">
                                {simulationScenarios.map((scenario) => (
                                    <div key={scenario.id} className="tcm-simulation-scenario">
                                        <div className="tcm-scenario-header">
                                            <h5 className="tcm-scenario-title">{scenario.label}</h5>
                                            {scenario.simulated && (
                                                <span className="tcm-scenario-badge success">✓ Simulado</span>
                                            )}
                                            {!scenario.simulated && (
                                                <span className="tcm-scenario-badge pending">Pendente</span>
                                            )}
                                        </div>

                                        <div className="tcm-simulation-input-group">
                                            <div className="tcm-input-wrapper">
                                                <label className="cf-input-label">Valor Base (R$)</label>
                                                <input
                                                    type="number"
                                                    className="cf-input-control"
                                                    value={scenario.value}
                                                    onChange={(e) => updateScenarioValue(scenario.id, e.target.value)}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleSimulate(scenario.id)}
                                                className="tcm-simulate-btn"
                                                disabled={!formData.rate}
                                            >
                                                🧮 Simular
                                            </button>
                                        </div>

                                        {scenario.simulated && scenario.result && (
                                            <div className="tcm-simulation-result">
                                                <div className="tcm-result-header">
                                                    <span className="tcm-result-title">📊 Resultado da Simulação</span>
                                                </div>

                                                {/* Breakdown de Cálculo */}
                                                <div className="tcm-breakdown-section">
                                                    <h6 className="tcm-breakdown-title">Breakdown de Cálculo:</h6>
                                                    {scenario.result.breakdown.map((item: any) => (
                                                        <div key={item.step} className="tcm-breakdown-item">
                                                            <div className="tcm-breakdown-step">
                                                                <span className="tcm-step-number">{item.step}</span>
                                                                <span className="tcm-step-desc">{item.description}</span>
                                                            </div>
                                                            <div className="tcm-breakdown-value">
                                                                <span className="tcm-value-amount">
                                                                    R$ {item.value.toFixed(2)}
                                                                </span>
                                                                {item.note && (
                                                                    <span className="tcm-value-note">({item.note})</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Impostos Aplicados */}
                                                <div className="tcm-taxes-section">
                                                    <h6 className="tcm-breakdown-title">Impostos Incluídos:</h6>
                                                    {scenario.result.appliedTaxes.map((tax: any, idx: number) => (
                                                        <div key={idx} className="tcm-tax-item included">
                                                            <span className="tcm-tax-name">✓ {tax.name}</span>
                                                            <span className="tcm-tax-details">
                                                                {tax.rate}% = R$ {tax.amount.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {scenario.result.excludedTaxes.length > 0 && (
                                                        <>
                                                            <h6 className="tcm-breakdown-title" style={{ marginTop: '1rem' }}>Impostos Excluídos:</h6>
                                                            {scenario.result.excludedTaxes.map((tax: any, idx: number) => (
                                                                <div key={idx} className="tcm-tax-item excluded">
                                                                    <span className="tcm-tax-name">✗ {tax.name}</span>
                                                                    <span className="tcm-tax-details">{tax.reason}</span>
                                                                </div>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>

                                                {/* Total Final */}
                                                <div className="tcm-total-section">
                                                    <span className="tcm-total-label">Total Final:</span>
                                                    <span className="tcm-total-value">
                                                        R$ {scenario.result.total.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!allScenariosSimulated && (
                                <div className="tcm-alert-info" style={{ marginTop: '1.5rem' }}>
                                    <strong>Próximo passo:</strong> Complete as simulações restantes para habilitar o botão "Salvar Imposto".
                                </div>
                            )}

                            {allScenariosSimulated && (
                                <div className="tcm-alert-info" style={{ marginTop: '1.5rem', backgroundColor: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', borderColor: 'rgb(220, 252, 231)' }}>
                                    <strong>✓ Todas as simulações concluídas!</strong> Você pode agora salvar esta configuração de imposto.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="cf-fs-footer">
                <button onClick={onClose} className="cf-fs-btn">
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    disabled={!formData.name || !formData.justification}
                    className="cf-fs-btn primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Salvar Imposto
                </button>
            </div>
        </div>
    );
};

export default TaxConfigurationModal;
