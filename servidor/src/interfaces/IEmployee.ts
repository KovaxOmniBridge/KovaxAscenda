/**
 * Interface para Gerenciamento de Recursos Humanos
 */

// Cargos disponíveis no sistema
export enum EmployeeRole {
    ADMIN = 'ADMIN',                    // Administrador do sistema
    MANAGER = 'MANAGER',                // Gerente
    SUPERVISOR = 'SUPERVISOR',          // Supervisor
    HR = 'HR',                          // Recursos Humanos
    ACCOUNTANT = 'ACCOUNTANT',          // Contador
    SALES = 'SALES',                    // Vendedor
    STOCK_KEEPER = 'STOCK_KEEPER',      // Estoquista
    CASHIER = 'CASHIER',                // Caixa
    ATTENDANT = 'ATTENDANT',            // Atendente
    SECURITY = 'SECURITY',              // Segurança
    CLEANER = 'CLEANER',                // Limpeza
    MAINTENANCE = 'MAINTENANCE',        // Manutenção
    DRIVER = 'DRIVER',                  // Motorista
    ASSISTANT = 'ASSISTANT',            // Assistente
    INTERN = 'INTERN'                   // Estagiário
}

// Status do funcionário
export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',                  // Ativo
    ON_VACATION = 'ON_VACATION',        // De férias
    ON_LEAVE = 'ON_LEAVE',              // Afastado
    SUSPENDED = 'SUSPENDED',            // Suspenso
    TERMINATED = 'TERMINATED'           // Desligado
}

// Tipo de contrato
export enum ContractType {
    CLT = 'CLT',                        // CLT
    PJ = 'PJ',                          // Pessoa Jurídica
    INTERN = 'INTERN',                  // Estágio
    TEMPORARY = 'TEMPORARY',            // Temporário
    FREELANCE = 'FREELANCE'             // Freelancer
}

// Níveis de acesso ao sistema
export enum AccessLevel {
    FULL = 'FULL',                      // Acesso total
    HIGH = 'HIGH',                      // Alto acesso
    MEDIUM = 'MEDIUM',                  // Médio acesso
    LOW = 'LOW',                        // Baixo acesso
    READONLY = 'READONLY'               // Apenas leitura
}

// Permissões específicas
export interface IPermissions {
    // Gestão
    canManageEmployees: boolean;        // Gerenciar funcionários
    canManageCompany: boolean;          // Gerenciar empresa
    canManageProducts: boolean;         // Gerenciar produtos
    canManageAssets: boolean;           // Gerenciar ativos
    canManageUnits: boolean;            // Gerenciar unidades
    
    // Financeiro
    canViewFinancials: boolean;         // Ver financeiro
    canManageFinancials: boolean;       // Gerenciar financeiro
    canApprovePurchases: boolean;       // Aprovar compras
    
    // Operacional
    canManageStock: boolean;            // Gerenciar estoque
    canMakeSales: boolean;              // Fazer vendas
    canProcessPayments: boolean;        // Processar pagamentos
    
    // Relatórios
    canViewReports: boolean;            // Ver relatórios
    canExportData: boolean;             // Exportar dados
    
    // Sistema
    canManageSettings: boolean;         // Gerenciar configurações
    canViewAuditLog: boolean;           // Ver log de auditoria
}

// Endereço do funcionário
export interface IEmployeeAddress {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

// Documentos do funcionário
export interface IEmployeeDocuments {
    cpf: string;
    rg?: string;
    workCard?: string;                  // Carteira de trabalho
    voterRegistration?: string;         // Título de eleitor
    driverLicense?: string;             // CNH
}

// Informações bancárias
export interface IBankInfo {
    bankName: string;
    bankCode: string;
    agency: string;
    account: string;
    accountType: 'checking' | 'savings' | 'salary';
    pixKey?: string;
}

// Dependentes
export interface IDependent {
    id: string;
    name: string;
    relationship: 'spouse' | 'child' | 'parent' | 'other';
    birthDate: string;
    cpf?: string;
}

// Histórico de cargos
export interface IRoleHistory {
    id: string;
    role: EmployeeRole;
    unitId?: string;
    unitName?: string;
    startDate: string;
    endDate?: string;
    salary?: number;
}

// Avaliações de desempenho
export interface IPerformanceReview {
    id: string;
    reviewDate: string;
    reviewerId: string;
    reviewerName: string;
    period: string;
    rating: number;                     // 0-10
    strengths?: string;
    weaknesses?: string;
    goals?: string;
    comments?: string;
}

// Advertências e elogios
export interface IWarningOrPraise {
    id: string;
    type: 'warning' | 'praise';
    date: string;
    issuedBy: string;
    issuedByName: string;
    reason: string;
    description: string;
}

// Interface principal do funcionário
export interface IEmployee {
    id: string;
    companyId: string;
    unitId?: string;                    // Unidade onde trabalha
    
    // Dados pessoais
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender?: 'male' | 'female' | 'other';
    photo?: string;                     // URL Base64
    
    // Documentos
    documents: IEmployeeDocuments;
    
    // Endereço
    address: IEmployeeAddress;
    
    // Informações de trabalho
    role: EmployeeRole;
    department?: string;
    jobTitle: string;                   // Título do cargo (personalizado)
    
    // Contrato
    contractType: ContractType;
    hireDate: string;
    terminationDate?: string;
    status: EmployeeStatus;
    
    // Remuneração
    salary: number;
    paymentDay: number;                 // Dia do pagamento (1-31)
    hasBenefits: boolean;
    benefits?: string[];                // Vale transporte, alimentação, etc
    
    // Banco
    bankInfo?: IBankInfo;
    
    // Acesso ao sistema
    accessKey: string;                  // Chave de acesso única
    passwordHash: string;
    accessLevel: AccessLevel;
    permissions: IPermissions;
    lastLogin?: string;
    isActive: boolean;                  // Pode fazer login
    
    // Jornada
    workSchedule?: {
        startTime: string;              // "08:00"
        endTime: string;                // "17:00"
        workDays: number[];             // [1,2,3,4,5] = Seg-Sex
        lunchBreak?: number;            // Minutos de almoço
    };
    
    // Relacionamentos
    managerId?: string;                 // ID do gerente/supervisor
    managerName?: string;
    dependents?: IDependent[];
    
    // Histórico
    roleHistory?: IRoleHistory[];
    performanceReviews?: IPerformanceReview[];
    warningsAndPraises?: IWarningOrPraise[];
    
    // Emergência
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    
    // Metadata
    notes?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    createdByName: string;
}

// Interface para criar funcionário
export interface ICreateEmployee {
    companyId: string;
    unitId?: string;
    
    // Dados pessoais
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender?: 'male' | 'female' | 'other';
    photo?: string;
    
    // Documentos
    documents: IEmployeeDocuments;
    
    // Endereço
    address: IEmployeeAddress;
    
    // Trabalho
    role: EmployeeRole;
    department?: string;
    jobTitle: string;
    contractType: ContractType;
    hireDate: string;
    status: EmployeeStatus;
    
    // Remuneração
    salary: number;
    paymentDay: number;
    hasBenefits: boolean;
    benefits?: string[];
    
    // Banco
    bankInfo?: IBankInfo;
    
    // Acesso (será gerado automaticamente se não fornecido)
    accessKey?: string;
    password: string;
    accessLevel: AccessLevel;
    
    // Relacionamentos
    managerId?: string;
    
    // Jornada
    workSchedule?: {
        startTime: string;
        endTime: string;
        workDays: number[];
        lunchBreak?: number;
    };
    
    // Emergência
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    
    notes?: string;
    tags?: string[];
}

// Interface para atualizar funcionário
export interface IUpdateEmployee extends Partial<ICreateEmployee> {
    isActive?: boolean;
}

// Interface para login
export interface ILoginCredentials {
    accessKey: string;
    password: string;
    role?: EmployeeRole;                // Opcional: filtrar por cargo
}

// Interface de sessão/token
export interface IAuthSession {
    token: string;
    employeeId: string;
    companyId: string;
    role: EmployeeRole;
    accessLevel: AccessLevel;
    permissions: IPermissions;
    expiresAt: string;
}

// Interface para estatísticas de RH
export interface IHRStats {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    byRole: {
        [key in EmployeeRole]: number;
    };
    byStatus: {
        [key in EmployeeStatus]: number;
    };
    byContractType: {
        [key in ContractType]: number;
    };
    averageSalary: number;
    totalPayroll: number;
    averageTenure: number;              // Tempo médio de casa (meses)
    turnoverRate?: number;              // Taxa de rotatividade
}

// Preset de permissões por cargo
export const ROLE_PERMISSIONS: { [key in EmployeeRole]: IPermissions } = {
    [EmployeeRole.ADMIN]: {
        canManageEmployees: true,
        canManageCompany: true,
        canManageProducts: true,
        canManageAssets: true,
        canManageUnits: true,
        canViewFinancials: true,
        canManageFinancials: true,
        canApprovePurchases: true,
        canManageStock: true,
        canMakeSales: true,
        canProcessPayments: true,
        canViewReports: true,
        canExportData: true,
        canManageSettings: true,
        canViewAuditLog: true
    },
    [EmployeeRole.MANAGER]: {
        canManageEmployees: true,
        canManageCompany: false,
        canManageProducts: true,
        canManageAssets: true,
        canManageUnits: true,
        canViewFinancials: true,
        canManageFinancials: true,
        canApprovePurchases: true,
        canManageStock: true,
        canMakeSales: true,
        canProcessPayments: true,
        canViewReports: true,
        canExportData: true,
        canManageSettings: false,
        canViewAuditLog: true
    },
    [EmployeeRole.SUPERVISOR]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: true,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: true,
        canManageFinancials: false,
        canApprovePurchases: true,
        canManageStock: true,
        canMakeSales: true,
        canProcessPayments: true,
        canViewReports: true,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.HR]: {
        canManageEmployees: true,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: true,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: false,
        canProcessPayments: false,
        canViewReports: true,
        canExportData: true,
        canManageSettings: false,
        canViewAuditLog: true
    },
    [EmployeeRole.ACCOUNTANT]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: true,
        canManageUnits: false,
        canViewFinancials: true,
        canManageFinancials: true,
        canApprovePurchases: true,
        canManageStock: false,
        canMakeSales: false,
        canProcessPayments: true,
        canViewReports: true,
        canExportData: true,
        canManageSettings: false,
        canViewAuditLog: true
    },
    [EmployeeRole.SALES]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: true,
        canProcessPayments: true,
        canViewReports: false,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.STOCK_KEEPER]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: true,
        canMakeSales: false,
        canProcessPayments: false,
        canViewReports: false,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.CASHIER]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: true,
        canProcessPayments: true,
        canViewReports: false,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.ATTENDANT]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: true,
        canProcessPayments: false,
        canViewReports: false,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.SECURITY]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: false,
        canProcessPayments: false,
        canViewReports: false,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.CLEANER]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: false,
        canProcessPayments: false,
        canViewReports: false,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.MAINTENANCE]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: false,
        canProcessPayments: false,
        canViewReports: false,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.DRIVER]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: false,
        canProcessPayments: false,
        canViewReports: false,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.ASSISTANT]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: false,
        canProcessPayments: false,
        canViewReports: true,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    },
    [EmployeeRole.INTERN]: {
        canManageEmployees: false,
        canManageCompany: false,
        canManageProducts: false,
        canManageAssets: false,
        canManageUnits: false,
        canViewFinancials: false,
        canManageFinancials: false,
        canApprovePurchases: false,
        canManageStock: false,
        canMakeSales: false,
        canProcessPayments: false,
        canViewReports: false,
        canExportData: false,
        canManageSettings: false,
        canViewAuditLog: false
    }
};
