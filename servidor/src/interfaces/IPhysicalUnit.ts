/**
 * Interface para Unidades Físicas (Lojas, Depósitos, etc.)
 */

// Tipos de unidade física
export enum PhysicalUnitType {
    STORE = 'STORE',                    // Loja/Ponto de venda
    WAREHOUSE = 'WAREHOUSE',            // Depósito/Armazém
    DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',  // Centro de distribuição
    OFFICE = 'OFFICE',                  // Escritório
    FACTORY = 'FACTORY',                // Fábrica
    WORKSHOP = 'WORKSHOP'               // Oficina
}

// Status da unidade
export enum PhysicalUnitStatus {
    ACTIVE = 'ACTIVE',                  // Operacional
    INACTIVE = 'INACTIVE',              // Inativa
    UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',  // Em construção
    UNDER_RENOVATION = 'UNDER_RENOVATION',      // Em reforma
    TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',  // Temporariamente fechada
    PERMANENTLY_CLOSED = 'PERMANENTLY_CLOSED'   // Permanentemente fechada
}

// Horário de funcionamento
export interface IOperatingHours {
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Domingo, 6 = Sábado
    openTime: string;                    // Formato "HH:MM"
    closeTime: string;                   // Formato "HH:MM"
    isClosed: boolean;                   // Se está fechado neste dia
}

// Contato da unidade
export interface IUnitContact {
    phone?: string;
    email?: string;
    whatsapp?: string;
    website?: string;
}

// Funcionário da unidade
export interface IUnitEmployee {
    id: string;
    name: string;
    role: string;                        // Cargo: gerente, vendedor, estoquista, etc.
    phone?: string;
    email?: string;
    hireDate: string;
    isManager: boolean;
}

// Estoque simplificado (referência a produtos)
export interface IUnitInventory {
    productId: string;
    productName: string;
    quantity: number;
    minQuantity?: number;                // Estoque mínimo
    maxQuantity?: number;                // Estoque máximo
    lastUpdated: string;
}

// Equipamentos da unidade
export interface IUnitEquipment {
    id: string;
    name: string;
    type: string;
    quantity: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
}

// Metas da unidade
export interface IUnitGoals {
    monthlySalesTarget?: number;         // Meta de vendas mensal
    monthlyRevenueTarget?: number;       // Meta de faturamento mensal
    customerSatisfactionTarget?: number; // Meta de satisfação (0-100)
    period: string;                      // Mês/Ano (ex: "2024-01")
}

// Desempenho da unidade
export interface IUnitPerformance {
    period: string;                      // Mês/Ano
    totalSales: number;
    totalRevenue: number;
    customerCount: number;
    averageTicket: number;
    customerSatisfaction?: number;
    achievementPercentage?: number;      // % da meta atingida
}

// Interface principal da unidade física
export interface IPhysicalUnit {
    id: string;
    companyId: string;
    assetId?: string;                    // Referência ao ativo (imóvel)
    
    // Informações básicas
    type: PhysicalUnitType;
    name: string;
    code?: string;                       // Código/ID interno da unidade
    description?: string;
    
    // Status
    status: PhysicalUnitStatus;
    openingDate?: string;                // Data de inauguração
    closingDate?: string;                // Data de fechamento (se aplicável)
    
    // Localização
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    neighborhood?: string;
    
    // Contato
    contact?: IUnitContact;
    
    // Horário de funcionamento
    operatingHours?: IOperatingHours[];
    
    // Características
    area?: number;                       // Área em m²
    capacity?: number;                   // Capacidade de pessoas/produtos
    parkingSpaces?: number;
    hasAccessibility?: boolean;
    hasWifi?: boolean;
    hasAirConditioning?: boolean;
    hasSecuritySystem?: boolean;
    
    // Equipe
    employees?: IUnitEmployee[];
    totalEmployees: number;
    managerId?: string;                  // ID do gerente responsável
    
    // Estoque (para lojas e depósitos)
    inventory?: IUnitInventory[];
    totalInventoryValue?: number;
    
    // Equipamentos
    equipment?: IUnitEquipment[];
    
    // Custos operacionais
    monthlyRent?: number;
    monthlyUtilities?: number;           // Água, luz, internet
    monthlyOtherExpenses?: number;
    totalMonthlyOperatingCost?: number;
    
    // Metas e Desempenho
    currentGoals?: IUnitGoals;
    performanceHistory?: IUnitPerformance[];
    
    // Fotos
    photos?: string[];
    
    // Metadata
    notes?: string;
    tags?: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Interface para criar nova unidade
export interface ICreatePhysicalUnit {
    companyId: string;
    assetId?: string;
    type: PhysicalUnitType;
    name: string;
    code?: string;
    description?: string;
    status: PhysicalUnitStatus;
    openingDate?: string;
    
    // Localização
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    neighborhood?: string;
    
    // Contato
    contact?: IUnitContact;
    
    // Horário
    operatingHours?: IOperatingHours[];
    
    // Características
    area?: number;
    capacity?: number;
    parkingSpaces?: number;
    hasAccessibility?: boolean;
    hasWifi?: boolean;
    hasAirConditioning?: boolean;
    hasSecuritySystem?: boolean;
    
    // Custos
    monthlyRent?: number;
    monthlyUtilities?: number;
    monthlyOtherExpenses?: number;
    
    // Metadata
    notes?: string;
    tags?: string[];
    isActive?: boolean;
}

// Interface para atualizar unidade
export interface IUpdatePhysicalUnit extends Partial<ICreatePhysicalUnit> {}

// Interface para estatísticas das unidades
export interface IPhysicalUnitStats {
    totalUnits: number;
    activeUnits: number;
    inactiveUnits: number;
    byType: {
        [PhysicalUnitType.STORE]: number;
        [PhysicalUnitType.WAREHOUSE]: number;
        [PhysicalUnitType.DISTRIBUTION_CENTER]: number;
        [PhysicalUnitType.OFFICE]: number;
        [PhysicalUnitType.FACTORY]: number;
        [PhysicalUnitType.WORKSHOP]: number;
    };
    byStatus: {
        [PhysicalUnitStatus.ACTIVE]: number;
        [PhysicalUnitStatus.INACTIVE]: number;
        [PhysicalUnitStatus.UNDER_CONSTRUCTION]: number;
        [PhysicalUnitStatus.UNDER_RENOVATION]: number;
        [PhysicalUnitStatus.TEMPORARILY_CLOSED]: number;
        [PhysicalUnitStatus.PERMANENTLY_CLOSED]: number;
    };
    totalEmployees: number;
    totalArea: number;
    totalMonthlyOperatingCost: number;
    totalMonthlyRevenue?: number;
    averagePerformance?: number;
}
