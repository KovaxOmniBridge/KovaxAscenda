/**
 * Interface para Gerenciamento Executivo (Multi-empresa)
 */

// Tipo de participação do executivo na empresa
export enum ExecutiveRole {
    OWNER = 'OWNER',                        // Proprietário
    CEO = 'CEO',                            // Diretor Executivo
    BOARD_MEMBER = 'BOARD_MEMBER',          // Membro do Conselho
    INVESTOR = 'INVESTOR',                  // Investidor
    ADVISOR = 'ADVISOR',                    // Conselheiro
    PARTNER = 'PARTNER'                     // Sócio
}

// Status da participação
export enum ParticipationStatus {
    ACTIVE = 'ACTIVE',                      // Ativa
    INACTIVE = 'INACTIVE',                  // Inativa
    PENDING = 'PENDING',                    // Pendente
    SUSPENDED = 'SUSPENDED'                 // Suspensa
}

// Participação do executivo em uma empresa
export interface IExecutiveParticipation {
    id: string;
    executiveId: string;                    // ID do funcionário executivo
    companyId: string;
    companyName: string;
    role: ExecutiveRole;
    status: ParticipationStatus;
    
    // Participação acionária (se aplicável)
    equityPercentage?: number;              // % de participação
    sharesOwned?: number;                   // Quantidade de ações
    
    // Remuneração específica desta participação
    salary?: number;                        // Salário mensal
    bonusStructure?: string;                // Estrutura de bônus
    
    // Datas
    startDate: string;                      // Data de início
    endDate?: string;                       // Data de término
    
    // Permissões
    hasFullAccess: boolean;                 // Acesso total aos dados
    canViewFinancials: boolean;             // Ver dados financeiros
    canViewEmployees: boolean;              // Ver funcionários
    canViewAssets: boolean;                 // Ver ativos
    canMakeDecisions: boolean;              // Tomar decisões
    
    // Metadata
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Interface de criação de participação
export interface ICreateParticipation {
    executiveId: string;
    companyId: string;
    role: ExecutiveRole;
    status: ParticipationStatus;
    equityPercentage?: number;
    sharesOwned?: number;
    salary?: number;
    bonusStructure?: string;
    startDate: string;
    endDate?: string;
    hasFullAccess: boolean;
    canViewFinancials: boolean;
    canViewEmployees: boolean;
    canViewAssets: boolean;
    canMakeDecisions: boolean;
    notes?: string;
}

// Interface de atualização de participação
export interface IUpdateParticipation extends Partial<ICreateParticipation> {}

// Dashboard executivo - dados consolidados de todas as empresas
export interface IExecutiveDashboard {
    executive: {
        id: string;
        name: string;
        email: string;
        photo?: string;
    };
    
    // Resumo das participações
    totalCompanies: number;
    activeParticipations: number;
    rolesDistribution: {
        [key in ExecutiveRole]: number;
    };
    
    // Participações
    participations: IExecutiveParticipation[];
    
    // Dados financeiros consolidados
    financialSummary: {
        totalEquity: number;                // Patrimônio total em todas as empresas
        totalMonthlyIncome: number;         // Renda mensal total
        totalEmployees: number;             // Total de funcionários de todas as empresas
        totalAssets: number;                // Total de ativos físicos
    };
    
    // Estatísticas por empresa
    companiesData: ICompanyExecutiveData[];
}

// Dados de uma empresa para o executivo
export interface ICompanyExecutiveData {
    companyId: string;
    companyName: string;
    participation: IExecutiveParticipation;
    
    // Dados gerais
    generalData: {
        cnpj?: string;
        foundedDate?: string;
        status: string;
        industry?: string;
    };
    
    // Recursos Humanos
    hr: {
        totalEmployees: number;
        activeEmployees: number;
        monthlyPayroll: number;
        averageSalary: number;
        topRoles: { role: string; count: number }[];
    };
    
    // Ativos
    assets: {
        totalAssets: number;
        totalValue: number;
        byCategory: { category: string; count: number; value: number }[];
        physicalUnits: {
            total: number;
            byType: { type: string; count: number }[];
        };
    };
    
    // Financeiro
    financial: {
        revenue?: number;
        expenses?: number;
        profit?: number;
        cashFlow?: number;
    };
    
    // Performance
    performance: {
        growthRate?: number;
        employeeTurnover?: number;
        assetUtilization?: number;
    };
}

// Comparação entre empresas
export interface ICompanyComparison {
    companies: {
        id: string;
        name: string;
    }[];
    
    metrics: {
        employees: { [companyId: string]: number };
        assets: { [companyId: string]: number };
        revenue: { [companyId: string]: number };
        profit: { [companyId: string]: number };
    };
}

// Alertas para o executivo
export interface IExecutiveAlert {
    id: string;
    companyId: string;
    companyName: string;
    type: 'warning' | 'info' | 'critical' | 'success';
    category: 'hr' | 'financial' | 'assets' | 'general';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
}

// Relatório executivo
export interface IExecutiveReport {
    id: string;
    executiveId: string;
    title: string;
    description: string;
    reportType: 'monthly' | 'quarterly' | 'annual' | 'custom';
    period: {
        start: string;
        end: string;
    };
    companies: string[];                     // IDs das empresas incluídas
    sections: {
        includeHR: boolean;
        includeFinancial: boolean;
        includeAssets: boolean;
        includePerformance: boolean;
    };
    generatedAt: string;
    pdfUrl?: string;
}
