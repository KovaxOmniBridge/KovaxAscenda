// Universal Fiscal Document Model (U-FDM) - Core Types

export type DocumentState =
    | 'draft'
    | 'pre_emission'
    | 'authorized'
    | 'rejected'
    | 'contingency'
    | 'cancelled';

export interface Party {
    id: string;
    name: string;
    taxId: string; // CNPJ, VAT, EIN, etc.
    address: Address;
    email?: string;
    phone?: string;
}

export interface Address {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface LineItem {
    id: string;
    code: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    subtotal: number;
    ncm?: string; // Nomenclatura Comum do Mercosul (Brasil)
    unit: string;
}

export interface ServiceItem {
    id: string;
    code: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    subtotal: number;
    serviceCode?: string;
}

export interface AppliedTax {
    id: string;
    name: string;
    type: string;
    rate: number;
    baseValue: number;
    amount: number;
    jurisdiction: string;
}

export interface DocumentTotals {
    subtotal: number;
    discounts: number;
    taxesTotal: number;
    total: number;
}

export interface LegalMetadata {
    legalBasis?: string;
    additionalInfo?: string;
    fiscalNotes?: string;
    operationType: string;
}

export interface Reference {
    type: 'order' | 'contract' | 'invoice' | 'other';
    id: string;
    description?: string;
}

export interface FiscalEvent {
    id: string;
    type: 'created' | 'validated' | 'authorized' | 'rejected' | 'cancelled';
    timestamp: string;
    user: string;
    details: string;
    metadata?: Record<string, any>;
}

export interface UniversalFiscalDocument {
    // Core
    id: string;
    version: number;
    state: DocumentState;

    // Template
    country: string;
    jurisdiction: string;
    documentType: string;

    // Parties
    issuer: Party;
    receiver: Party;

    // Content
    items: LineItem[];
    services: ServiceItem[];

    // Taxation
    taxes: AppliedTax[];
    totals: DocumentTotals;

    // Metadata
    legalMetadata: LegalMetadata;
    externalReferences: Reference[];

    // Control
    events: FiscalEvent[];
    createdAt: string;
    updatedAt: string;
    authorizedAt?: string;
    authorizationProtocol?: string;
}

// Fiscal Adapter Plugin Interface
export interface DocumentType {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface Field {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    required: boolean;
    label: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
}

export interface TaxRule {
    id: string;
    name: string;
    rate: number;
    applicableWhen: string;
}

export interface ValidationRule {
    field: string;
    rule: string;
    message: string;
}

export interface AuthResult {
    success: boolean;
    protocol?: string;
    message: string;
    state: DocumentState;
    errors?: string[];
}

export interface FiscalAdapterPlugin {
    country: string;
    jurisdiction: string;
    documentTypes: DocumentType[];

    // Structure
    requiredFields: Field[];
    optionalFields: Field[];

    // Rules
    calculationRules: TaxRule[];
    validationRules: ValidationRule[];

    // Formats
    supportedFormats: ('XML' | 'JSON' | 'PDF' | 'EDI')[];

    // Authorization
    authorizationFlow: 'sync' | 'async';
    authorizeDocument(doc: UniversalFiscalDocument): Promise<AuthResult>;
    validateDocument(doc: UniversalFiscalDocument): ValidationResult;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
