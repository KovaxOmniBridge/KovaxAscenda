import {
    FiscalAdapterPlugin,
    DocumentType,
    Field,
    TaxRule,
    ValidationRule,
    UniversalFiscalDocument,
    AuthResult,
    ValidationResult
} from '../types/UniversalFiscalDocument';

// Brazil Fiscal Adapter Plugin
export const BrazilFiscalAdapter: FiscalAdapterPlugin = {
    country: 'Brazil',
    jurisdiction: 'Federal',

    documentTypes: [
        {
            id: 'nfe',
            name: 'NF-e',
            description: 'Nota Fiscal Eletrônica',
            icon: '📄'
        },
        {
            id: 'nfse',
            name: 'NFS-e',
            description: 'Nota Fiscal de Serviço Eletrônica',
            icon: '📋'
        },
        {
            id: 'nfce',
            name: 'NFC-e',
            description: 'Nota Fiscal ao Consumidor Eletrônica',
            icon: '🧾'
        }
    ],

    requiredFields: [
        { name: 'issuer.taxId', type: 'text', required: true, label: 'CNPJ Emissor' },
        { name: 'receiver.taxId', type: 'text', required: true, label: 'CNPJ/CPF Destinatário' },
        { name: 'receiver.name', type: 'text', required: true, label: 'Nome Destinatário' },
        {
            name: 'legalMetadata.operationType', type: 'select', required: true, label: 'Tipo de Operação', options: [
                { value: 'sale', label: 'Venda' },
                { value: 'return', label: 'Devolução' },
                { value: 'transfer', label: 'Transferência' }
            ]
        }
    ],

    optionalFields: [
        { name: 'legalMetadata.additionalInfo', type: 'text', required: false, label: 'Informações Adicionais' },
        { name: 'legalMetadata.fiscalNotes', type: 'text', required: false, label: 'Observações Fiscais' }
    ],

    calculationRules: [
        { id: 'icms', name: 'ICMS', rate: 18, applicableWhen: 'items.length > 0' },
        { id: 'pis', name: 'PIS', rate: 1.65, applicableWhen: 'items.length > 0' },
        { id: 'cofins', name: 'COFINS', rate: 7.6, applicableWhen: 'items.length > 0' },
        { id: 'iss', name: 'ISS', rate: 5, applicableWhen: 'services.length > 0' }
    ],

    validationRules: [
        { field: 'issuer.taxId', rule: 'cnpj', message: 'CNPJ do emissor inválido' },
        { field: 'receiver.taxId', rule: 'cnpj_or_cpf', message: 'CNPJ/CPF do destinatário inválido' },
        { field: 'items', rule: 'min_length:1', message: 'Documento deve ter pelo menos 1 item' }
    ],

    supportedFormats: ['XML', 'PDF'],

    authorizationFlow: 'async',

    async authorizeDocument(doc: UniversalFiscalDocument): Promise<AuthResult> {
        // Mock de autorização SEFAZ
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simula 90% de sucesso
                const success = Math.random() > 0.1;

                if (success) {
                    resolve({
                        success: true,
                        protocol: `${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        message: 'Documento autorizado pela SEFAZ',
                        state: 'authorized'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Documento rejeitado pela SEFAZ',
                        state: 'rejected',
                        errors: ['Erro 999: Falha na comunicação com SEFAZ (simulado)']
                    });
                }
            }, 2000); // Simula delay de rede
        });
    },

    validateDocument(doc: UniversalFiscalDocument): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validação de CNPJ (simplificada)
        if (!doc.issuer.taxId || doc.issuer.taxId.length !== 14) {
            errors.push('CNPJ do emissor deve ter 14 dígitos');
        }

        // Validação de itens
        if (doc.items.length === 0 && doc.services.length === 0) {
            errors.push('Documento deve ter pelo menos 1 item ou serviço');
        }

        // Validação de totais
        if (doc.totals.total <= 0) {
            errors.push('Total do documento deve ser maior que zero');
        }

        // Warnings
        if (!doc.legalMetadata.additionalInfo) {
            warnings.push('Recomenda-se preencher informações adicionais');
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
};

// Helper function to get adapter by country
export const getFiscalAdapter = (country: string): FiscalAdapterPlugin | null => {
    const adapters: Record<string, FiscalAdapterPlugin> = {
        'Brazil': BrazilFiscalAdapter,
        // Outros adapters podem ser adicionados aqui
    };

    return adapters[country] || null;
};
