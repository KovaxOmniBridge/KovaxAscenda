import { ExecutiveParticipationRepository } from '../repositories/ExecutiveParticipationRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import Database from 'better-sqlite3';
import {
    IExecutiveDashboard,
    ICompanyExecutiveData,
    IExecutiveParticipation,
    ICreateParticipation,
    IUpdateParticipation,
    ExecutiveRole,
    ParticipationStatus
} from '../interfaces/IExecutive';

export class ExecutiveService {
    private participationRepository: ExecutiveParticipationRepository;
    private employeeRepository: EmployeeRepository;
    private db: Database.Database;

    constructor(
        participationRepository: ExecutiveParticipationRepository,
        employeeRepository: EmployeeRepository,
        db: Database.Database
    ) {
        this.participationRepository = participationRepository;
        this.employeeRepository = employeeRepository;
        this.db = db;
    }

    /**
     * Cria participação executiva
     */
    createParticipation(data: ICreateParticipation): IExecutiveParticipation {
        // Valida se executivo existe
        const executive = this.employeeRepository.findById(data.executiveId);
        if (!executive) {
            throw new Error('Executivo não encontrado');
        }

        // Verifica se empresa existe
        const companyStmt = this.db.prepare('SELECT id FROM companies WHERE id = ?');
        const company = companyStmt.get(data.companyId);
        if (!company) {
            throw new Error('Empresa não encontrada');
        }

        return this.participationRepository.create(data);
    }

    /**
     * Busca participação por ID
     */
    getParticipationById(id: string): IExecutiveParticipation | null {
        return this.participationRepository.findById(id);
    }

    /**
     * Lista participações de um executivo
     */
    getExecutiveParticipations(executiveId: string): IExecutiveParticipation[] {
        return this.participationRepository.findByExecutive(executiveId);
    }

    /**
     * Lista participações ativas de um executivo
     */
    getActiveParticipations(executiveId: string): IExecutiveParticipation[] {
        return this.participationRepository.findActiveByExecutive(executiveId);
    }

    /**
     * Atualiza participação
     */
    updateParticipation(id: string, data: IUpdateParticipation): IExecutiveParticipation | null {
        return this.participationRepository.update(id, data);
    }

    /**
     * Remove participação
     */
    deleteParticipation(id: string): boolean {
        return this.participationRepository.delete(id);
    }

    /**
     * Verifica se executivo tem acesso a empresa
     */
    hasAccessToCompany(executiveId: string, companyId: string): boolean {
        return this.participationRepository.hasAccessToCompany(executiveId, companyId);
    }

    /**
     * Busca dashboard executivo com dados consolidados
     */
    getExecutiveDashboard(executiveId: string): IExecutiveDashboard {
        const executive = this.employeeRepository.findById(executiveId);
        if (!executive) {
            throw new Error('Executivo não encontrado');
        }

        const participations = this.participationRepository.findActiveByExecutive(executiveId);

        // Conta distribuição de cargos
        const rolesDistribution: { [key in ExecutiveRole]: number } = {
            OWNER: 0,
            CEO: 0,
            BOARD_MEMBER: 0,
            INVESTOR: 0,
            ADVISOR: 0,
            PARTNER: 0
        };

        participations.forEach(p => {
            rolesDistribution[p.role]++;
        });

        // Coleta dados de cada empresa
        const companiesData: ICompanyExecutiveData[] = [];
        let totalEquity = 0;
        let totalMonthlyIncome = 0;
        let totalEmployees = 0;
        let totalAssets = 0;

        for (const participation of participations) {
            const companyData = this.getCompanyData(participation);
            companiesData.push(companyData);

            // Soma totais
            if (participation.equityPercentage) {
                totalEquity += participation.equityPercentage;
            }
            if (participation.salary) {
                totalMonthlyIncome += participation.salary;
            }
            totalEmployees += companyData.hr.totalEmployees;
            totalAssets += companyData.assets.totalAssets;
        }

        return {
            executive: {
                id: executive.id,
                name: executive.fullName,
                email: executive.email,
                photo: executive.photo
            },
            totalCompanies: participations.length,
            activeParticipations: participations.filter(p => p.status === ParticipationStatus.ACTIVE).length,
            rolesDistribution,
            participations,
            financialSummary: {
                totalEquity,
                totalMonthlyIncome,
                totalEmployees,
                totalAssets
            },
            companiesData
        };
    }

    /**
     * Busca dados completos de uma empresa para o executivo
     */
    private getCompanyData(participation: IExecutiveParticipation): ICompanyExecutiveData {
        const companyId = participation.companyId;

        // Dados gerais da empresa
        const companyStmt = this.db.prepare(`
            SELECT id, name, cnpj, razaoSocial, nomeFantasia, dataAbertura, situacaoCadastral 
            FROM companies 
            WHERE id = ?
        `);
        const company = companyStmt.get(companyId) as any;

        // Dados de RH
        const hrData = this.getCompanyHRData(companyId);

        // Dados de ativos
        const assetsData = this.getCompanyAssetsData(companyId);

        return {
            companyId,
            companyName: participation.companyName,
            participation,
            generalData: {
                cnpj: company?.cnpj,
                foundedDate: company?.dataAbertura,
                status: company?.situacaoCadastral || 'ATIVA',
                industry: undefined
            },
            hr: hrData,
            assets: assetsData,
            financial: {
                revenue: undefined,
                expenses: undefined,
                profit: undefined,
                cashFlow: undefined
            },
            performance: {
                growthRate: undefined,
                employeeTurnover: undefined,
                assetUtilization: undefined
            }
        };
    }

    /**
     * Busca dados de RH da empresa
     */
    private getCompanyHRData(companyId: string): ICompanyExecutiveData['hr'] {
        try {
            // Busca funcionários
            const employeesStmt = this.db.prepare(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active,
                    SUM(CASE WHEN status = 'ACTIVE' THEN salary ELSE 0 END) as payroll,
                    AVG(CASE WHEN status = 'ACTIVE' THEN salary ELSE NULL END) as avgSalary
                FROM employees 
                WHERE companyId = ?
            `);
            const stats = employeesStmt.get(companyId) as any;

            // Top cargos
            const rolesStmt = this.db.prepare(`
                SELECT role, COUNT(*) as count 
                FROM employees 
                WHERE companyId = ? AND status = 'ACTIVE'
                GROUP BY role 
                ORDER BY count DESC 
                LIMIT 5
            `);
            const roles = rolesStmt.all(companyId) as any[];

            return {
                totalEmployees: stats?.total || 0,
                activeEmployees: stats?.active || 0,
                monthlyPayroll: stats?.payroll || 0,
                averageSalary: stats?.avgSalary || 0,
                topRoles: roles.map(r => ({
                    role: this.translateRole(r.role),
                    count: r.count
                }))
            };
        } catch (error) {
            return {
                totalEmployees: 0,
                activeEmployees: 0,
                monthlyPayroll: 0,
                averageSalary: 0,
                topRoles: []
            };
        }
    }

    /**
     * Busca dados de ativos da empresa
     */
    private getCompanyAssetsData(companyId: string): ICompanyExecutiveData['assets'] {
        try {
            // Busca ativos físicos
            const assetsStmt = this.db.prepare(`
                SELECT 
                    COUNT(*) as total,
                    SUM(purchaseValue) as totalValue
                FROM assets 
                WHERE companyId = ?
            `);
            const assetsStats = assetsStmt.get(companyId) as any;

            // Por categoria
            const categoriesStmt = this.db.prepare(`
                SELECT category, COUNT(*) as count, SUM(purchaseValue) as value
                FROM assets 
                WHERE companyId = ?
                GROUP BY category
            `);
            const categories = categoriesStmt.all(companyId) as any[];

            // Unidades físicas
            const unitsStmt = this.db.prepare(`
                SELECT COUNT(*) as total FROM physical_units WHERE companyId = ?
            `);
            const unitsStats = unitsStmt.get(companyId) as any;

            const unitsTypeStmt = this.db.prepare(`
                SELECT type, COUNT(*) as count 
                FROM physical_units 
                WHERE companyId = ?
                GROUP BY type
            `);
            const unitsTypes = unitsTypeStmt.all(companyId) as any[];

            return {
                totalAssets: assetsStats?.total || 0,
                totalValue: assetsStats?.totalValue || 0,
                byCategory: categories.map(c => ({
                    category: c.category,
                    count: c.count,
                    value: c.value
                })),
                physicalUnits: {
                    total: unitsStats?.total || 0,
                    byType: unitsTypes.map(u => ({
                        type: u.type,
                        count: u.count
                    }))
                }
            };
        } catch (error) {
            return {
                totalAssets: 0,
                totalValue: 0,
                byCategory: [],
                physicalUnits: {
                    total: 0,
                    byType: []
                }
            };
        }
    }

    /**
     * Traduz cargo
     */
    private translateRole(role: string): string {
        const roles: { [key: string]: string } = {
            'ADMIN': 'Administrador',
            'MANAGER': 'Gerente',
            'SUPERVISOR': 'Supervisor',
            'HR': 'RH',
            'ACCOUNTANT': 'Contador',
            'SALES': 'Vendedor',
            'STOCK_KEEPER': 'Estoquista',
            'CASHIER': 'Caixa',
            'ATTENDANT': 'Atendente',
            'SECURITY': 'Segurança',
            'CLEANER': 'Limpeza',
            'MAINTENANCE': 'Manutenção',
            'DRIVER': 'Motorista',
            'ASSISTANT': 'Assistente',
            'INTERN': 'Estagiário'
        };
        return roles[role] || role;
    }
}
