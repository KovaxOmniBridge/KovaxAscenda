// ============================================
// WEALTH MANAGEMENT - ASSET INTERFACES
// ============================================

/**
 * Tipos de ativos físicos
 */
export enum AssetType {
    STORE = 'store',              // Loja
    WAREHOUSE = 'warehouse',       // Estoque/Armazém
    REAL_ESTATE = 'real_estate',   // Imóvel
    CLINIC = 'clinic',             // Clínica
    VEHICLE = 'vehicle',           // Veículo
    EQUIPMENT = 'equipment',       // Equipamento
    FURNITURE = 'furniture',       // Móveis
    OTHER = 'other'                // Outros
}

/**
 * Status do ativo
 */
export enum AssetStatus {
    ACTIVE = 'active',           // Ativo/Em uso
    INACTIVE = 'inactive',       // Inativo
    MAINTENANCE = 'maintenance', // Em manutenção
    RENTED = 'rented',          // Alugado
    FOR_SALE = 'for_sale',      // À venda
    SOLD = 'sold'               // Vendido
}

/**
 * Tipo de posse
 */
export enum OwnershipType {
    OWNED = 'owned',           // Próprio
    RENTED = 'rented',         // Alugado
    LEASED = 'leased',         // Arrendado
    FINANCED = 'financed'      // Financiado
}

/**
 * Interface de localização
 */
export interface IAssetLocation {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}

/**
 * Interface de documentos
 */
export interface IAssetDocument {
    id: string;
    name: string;
    type: 'contract' | 'deed' | 'photo' | 'invoice' | 'other';
    url: string;
    uploadedAt: string;
}

/**
 * Interface de despesas
 */
export interface IAssetExpense {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: 'maintenance' | 'tax' | 'insurance' | 'rent' | 'utility' | 'other';
}

/**
 * Interface principal de Ativo
 */
export interface IAsset {
    id: string;
    companyId: string;
    
    // Informações básicas
    type: AssetType;
    name: string;
    description?: string;
    
    // Valores
    purchaseValue?: number;
    currentValue?: number;
    estimatedValue?: number;
    
    // Datas
    purchaseDate?: string;
    warrantyExpiryDate?: string;
    
    // Status e posse
    status: AssetStatus;
    ownershipType: OwnershipType;
    
    // Localização
    location?: IAssetLocation;
    
    // Características específicas
    area?: number;              // m² (para imóveis)
    capacity?: number;          // capacidade (para estoques)
    rooms?: number;             // quartos (para imóveis)
    floors?: number;            // andares
    parkingSpaces?: number;     // vagas
    
    // Informações adicionais
    brand?: string;             // marca (para veículos/equipamentos)
    model?: string;             // modelo
    year?: number;              // ano
    serialNumber?: string;      // número de série
    licensePlate?: string;      // placa (para veículos)
    
    // Documentos e mídia
    documents?: IAssetDocument[];
    photos?: string[];          // URLs das fotos
    
    // Despesas
    expenses?: IAssetExpense[];
    monthlyExpense?: number;    // despesa mensal estimada
    
    // Observações
    notes?: string;
    tags?: string[];
    
    // Controle
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Interface para criação de ativo
 */
export interface ICreateAsset {
    companyId: string;
    type: AssetType;
    name: string;
    description?: string;
    purchaseValue?: number;
    currentValue?: number;
    estimatedValue?: number;
    purchaseDate?: string;
    warrantyExpiryDate?: string;
    status: AssetStatus;
    ownershipType: OwnershipType;
    location?: IAssetLocation;
    area?: number;
    capacity?: number;
    rooms?: number;
    floors?: number;
    parkingSpaces?: number;
    brand?: string;
    model?: string;
    year?: number;
    serialNumber?: string;
    licensePlate?: string;
    documents?: IAssetDocument[];
    photos?: string[];
    expenses?: IAssetExpense[];
    monthlyExpense?: number;
    notes?: string;
    tags?: string[];
    isActive?: boolean;
}

/**
 * Interface para atualização de ativo
 */
export interface IUpdateAsset extends Partial<ICreateAsset> {}

/**
 * Interface de estatísticas
 */
export interface IAssetStats {
    totalAssets: number;
    totalValue: number;
    activeAssets: number;
    inactiveAssets: number;
    byType: Record<AssetType, number>;
    byStatus: Record<AssetStatus, number>;
    byOwnership: Record<OwnershipType, number>;
    totalMonthlyExpenses: number;
}
