import { EmployeeRepository } from '../repositories/EmployeeRepository';
import {
    IEmployee,
    ICreateEmployee,
    IUpdateEmployee,
    IHRStats,
    EmployeeRole,
    EmployeeStatus,
    ContractType
} from '../interfaces/IEmployee';

export class EmployeeService {
    private employeeRepository: EmployeeRepository;

    constructor(employeeRepository: EmployeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * Cria novo funcionário
     */
    async createEmployee(data: ICreateEmployee, creatorId: string, creatorName: string): Promise<IEmployee> {
        // Validações
        this.validateCreateData(data);

        // Verifica se email já existe na empresa
        const existingEmail = this.employeeRepository.findByEmail(data.email);
        if (existingEmail && existingEmail.companyId === data.companyId) {
            throw new Error('Email já cadastrado nesta empresa');
        }

        // Se access key foi fornecida, verifica se já existe
        if (data.accessKey) {
            const existingKey = this.employeeRepository.findByAccessKey(data.accessKey);
            if (existingKey) {
                throw new Error('Chave de acesso já existe');
            }
        }

        return this.employeeRepository.create(data, creatorId, creatorName);
    }

    /**
     * Busca funcionário por ID
     */
    getEmployeeById(id: string): IEmployee | null {
        return this.employeeRepository.findById(id);
    }

    /**
     * Busca funcionário por chave de acesso
     */
    getEmployeeByAccessKey(accessKey: string): IEmployee | null {
        return this.employeeRepository.findByAccessKey(accessKey);
    }

    /**
     * Lista todos os funcionários
     */
    getAllEmployees(): IEmployee[] {
        return this.employeeRepository.findAll();
    }

    /**
     * Lista funcionários por empresa
     */
    getEmployeesByCompany(companyId: string): IEmployee[] {
        return this.employeeRepository.findByCompany(companyId);
    }

    /**
     * Lista funcionários por unidade
     */
    getEmployeesByUnit(unitId: string): IEmployee[] {
        return this.employeeRepository.findByUnit(unitId);
    }

    /**
     * Lista funcionários por cargo
     */
    getEmployeesByRole(role: EmployeeRole, companyId?: string): IEmployee[] {
        return this.employeeRepository.findByRole(role, companyId);
    }

    /**
     * Lista funcionários por status
     */
    getEmployeesByStatus(status: EmployeeStatus, companyId?: string): IEmployee[] {
        return this.employeeRepository.findByStatus(status, companyId);
    }

    /**
     * Lista funcionários ativos
     */
    getActiveEmployees(companyId?: string): IEmployee[] {
        return this.employeeRepository.findActive(companyId);
    }

    /**
     * Lista subordinados de um gerente
     */
    getSubordinates(managerId: string): IEmployee[] {
        return this.employeeRepository.findByManager(managerId);
    }

    /**
     * Atualiza funcionário
     */
    async updateEmployee(id: string, data: IUpdateEmployee): Promise<IEmployee | null> {
        const employee = this.employeeRepository.findById(id);
        if (!employee) {
            throw new Error('Funcionário não encontrado');
        }

        // Se está mudando email, verifica duplicatas
        if (data.email && data.email !== employee.email) {
            const existingEmail = this.employeeRepository.findByEmail(data.email);
            if (existingEmail && existingEmail.companyId === employee.companyId && existingEmail.id !== id) {
                throw new Error('Email já cadastrado nesta empresa');
            }
        }

        // Se está mudando access key, verifica duplicatas
        if (data.accessKey && data.accessKey !== employee.accessKey) {
            const existingKey = this.employeeRepository.findByAccessKey(data.accessKey);
            if (existingKey && existingKey.id !== id) {
                throw new Error('Chave de acesso já existe');
            }
        }

        return this.employeeRepository.update(id, data);
    }

    /**
     * Altera senha do funcionário
     */
    async changePassword(id: string, newPassword: string): Promise<boolean> {
        const employee = this.employeeRepository.findById(id);
        if (!employee) {
            throw new Error('Funcionário não encontrado');
        }

        const updated = await this.employeeRepository.update(id, { password: newPassword });
        return updated !== null;
    }

    /**
     * Ativa/desativa funcionário
     */
    setEmployeeActive(id: string, isActive: boolean): boolean {
        return this.employeeRepository.setActive(id, isActive);
    }

    /**
     * Desliga funcionário
     */
    terminateEmployee(id: string): boolean {
        return this.employeeRepository.delete(id);
    }

    /**
     * Deleta funcionário permanentemente
     */
    deleteEmployee(id: string): boolean {
        return this.employeeRepository.deletePermanently(id);
    }

    /**
     * Transfere funcionário para outra unidade
     */
    async transferEmployee(id: string, newUnitId: string): Promise<IEmployee | null> {
        return this.employeeRepository.update(id, { unitId: newUnitId });
    }

    /**
     * Promove funcionário (muda cargo)
     */
    async promoteEmployee(id: string, newRole: EmployeeRole, newSalary?: number): Promise<IEmployee | null> {
        const updateData: IUpdateEmployee = { role: newRole };
        
        if (newSalary !== undefined) {
            updateData.salary = newSalary;
        }

        return this.employeeRepository.update(id, updateData);
    }

    /**
     * Atribui gerente a funcionário
     */
    async assignManager(employeeId: string, managerId: string): Promise<IEmployee | null> {
        // Verifica se gerente existe
        const manager = this.employeeRepository.findById(managerId);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }

        return this.employeeRepository.update(employeeId, {
            managerId
        } as any);
    }

    /**
     * Busca estatísticas de RH
     */
    getHRStats(companyId: string): IHRStats {
        return this.employeeRepository.getHRStats(companyId);
    }

    /**
     * Gera nova chave de acesso
     */
    generateAccessKey(): string {
        return this.employeeRepository.generateAccessKey();
    }

    /**
     * Valida dados de criação
     */
    private validateCreateData(data: ICreateEmployee): void {
        if (!data.fullName || data.fullName.trim().length < 3) {
            throw new Error('Nome completo inválido');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            throw new Error('Email inválido');
        }

        if (!data.phone || data.phone.length < 10) {
            throw new Error('Telefone inválido');
        }

        if (!data.birthDate) {
            throw new Error('Data de nascimento é obrigatória');
        }

        if (!data.documents.cpf || data.documents.cpf.length !== 11) {
            throw new Error('CPF inválido');
        }

        if (!data.jobTitle || data.jobTitle.trim().length < 2) {
            throw new Error('Título do cargo é obrigatório');
        }

        if (data.salary < 0) {
            throw new Error('Salário inválido');
        }

        if (data.paymentDay < 1 || data.paymentDay > 31) {
            throw new Error('Dia de pagamento inválido (1-31)');
        }

        if (!data.password || data.password.length < 8) {
            throw new Error('Senha deve ter no mínimo 8 caracteres');
        }
    }

    /**
     * Valida email
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
