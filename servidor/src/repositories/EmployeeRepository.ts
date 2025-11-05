import Database from 'better-sqlite3';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
    IEmployee,
    ICreateEmployee,
    IUpdateEmployee,
    IEmployeeDocuments,
    IEmployeeAddress,
    IPermissions,
    IBankInfo,
    IDependent,
    IHRStats,
    EmployeeRole,
    EmployeeStatus,
    ContractType,
    AccessLevel,
    ROLE_PERMISSIONS
} from '../interfaces/IEmployee';

export class EmployeeRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
        this.initializeTables();
    }

    private initializeTables(): void {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS employees (
                id TEXT PRIMARY KEY,
                companyId TEXT NOT NULL,
                unitId TEXT,
                
                -- Dados pessoais
                fullName TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                birthDate TEXT NOT NULL,
                gender TEXT,
                photo TEXT,
                
                -- Documentos (JSON)
                documents TEXT NOT NULL,
                
                -- Endereço (JSON)
                address TEXT NOT NULL,
                
                -- Trabalho
                role TEXT NOT NULL,
                department TEXT,
                jobTitle TEXT NOT NULL,
                contractType TEXT NOT NULL,
                hireDate TEXT NOT NULL,
                terminationDate TEXT,
                status TEXT NOT NULL,
                
                -- Remuneração
                salary REAL NOT NULL,
                paymentDay INTEGER NOT NULL,
                hasBenefits INTEGER NOT NULL DEFAULT 0,
                benefits TEXT,
                
                -- Banco (JSON)
                bankInfo TEXT,
                
                -- Acesso
                accessKey TEXT NOT NULL UNIQUE,
                passwordHash TEXT NOT NULL,
                accessLevel TEXT NOT NULL,
                permissions TEXT NOT NULL,
                lastLogin TEXT,
                isActive INTEGER NOT NULL DEFAULT 1,
                
                -- Jornada (JSON)
                workSchedule TEXT,
                
                -- Relacionamentos
                managerId TEXT,
                managerName TEXT,
                dependents TEXT,
                
                -- Histórico (JSON)
                roleHistory TEXT,
                performanceReviews TEXT,
                warningsAndPraises TEXT,
                
                -- Emergência (JSON)
                emergencyContact TEXT,
                
                -- Metadata
                notes TEXT,
                tags TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                createdBy TEXT NOT NULL,
                createdByName TEXT NOT NULL,
                
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
                FOREIGN KEY (unitId) REFERENCES physical_units(id) ON DELETE SET NULL,
                FOREIGN KEY (managerId) REFERENCES employees(id) ON DELETE SET NULL
            );
            
            -- Índices para otimização
            CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(companyId);
            CREATE INDEX IF NOT EXISTS idx_employees_unit ON employees(unitId);
            CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
            CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
            CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(isActive);
            CREATE INDEX IF NOT EXISTS idx_employees_access_key ON employees(accessKey);
            CREATE INDEX IF NOT EXISTS idx_employees_manager ON employees(managerId);
            CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
        `);
    }

    /**
     * Gera uma chave de acesso única
     */
    generateAccessKey(): string {
        const prefix = 'EMP';
        const random = crypto.randomBytes(4).toString('hex').toUpperCase();
        return `${prefix}-${random}`;
    }

    /**
     * Hash de senha com bcrypt
     */
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    /**
     * Valida senha
     */
    async validatePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Cria um novo funcionário
     */
    async create(data: ICreateEmployee, creatorId: string, creatorName: string): Promise<IEmployee> {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        
        // Gera access key se não fornecido
        const accessKey = data.accessKey || this.generateAccessKey();
        
        // Hash da senha
        const passwordHash = await this.hashPassword(data.password);
        
        // Permissões baseadas no cargo
        const permissions = ROLE_PERMISSIONS[data.role];
        
        const stmt = this.db.prepare(`
            INSERT INTO employees (
                id, companyId, unitId,
                fullName, email, phone, birthDate, gender, photo,
                documents, address,
                role, department, jobTitle, contractType, hireDate, status,
                salary, paymentDay, hasBenefits, benefits,
                bankInfo,
                accessKey, passwordHash, accessLevel, permissions, isActive,
                workSchedule,
                managerId, dependents,
                roleHistory, performanceReviews, warningsAndPraises,
                emergencyContact,
                notes, tags,
                createdAt, updatedAt, createdBy, createdByName
            ) VALUES (
                ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?,
                ?, ?, ?, ?, ?,
                ?,
                ?, ?,
                ?, ?, ?,
                ?,
                ?, ?,
                ?, ?, ?, ?
            )
        `);
        
        stmt.run(
            id, data.companyId, data.unitId || null,
            data.fullName, data.email, data.phone, data.birthDate, data.gender || null, data.photo || null,
            JSON.stringify(data.documents), JSON.stringify(data.address),
            data.role, data.department || null, data.jobTitle, data.contractType, data.hireDate, data.status,
            data.salary, data.paymentDay, data.hasBenefits ? 1 : 0, data.benefits ? JSON.stringify(data.benefits) : null,
            data.bankInfo ? JSON.stringify(data.bankInfo) : null,
            accessKey, passwordHash, data.accessLevel, JSON.stringify(permissions), 1,
            data.workSchedule ? JSON.stringify(data.workSchedule) : null,
            data.managerId || null, null,
            JSON.stringify([]), JSON.stringify([]), JSON.stringify([]),
            data.emergencyContact ? JSON.stringify(data.emergencyContact) : null,
            data.notes || null, data.tags ? JSON.stringify(data.tags) : null,
            now, now, creatorId, creatorName
        );
        
        const employee = this.findById(id);
        if (!employee) {
            throw new Error('Erro ao criar funcionário');
        }
        
        return employee;
    }

    /**
     * Busca funcionário por ID
     */
    findById(id: string): IEmployee | null {
        const stmt = this.db.prepare('SELECT * FROM employees WHERE id = ?');
        const row = stmt.get(id) as any;
        return row ? this.mapRowToEmployee(row) : null;
    }

    /**
     * Busca funcionário por chave de acesso
     */
    findByAccessKey(accessKey: string): IEmployee | null {
        const stmt = this.db.prepare('SELECT * FROM employees WHERE accessKey = ?');
        const row = stmt.get(accessKey) as any;
        return row ? this.mapRowToEmployee(row) : null;
    }

    /**
     * Busca funcionário por email
     */
    findByEmail(email: string): IEmployee | null {
        const stmt = this.db.prepare('SELECT * FROM employees WHERE email = ?');
        const row = stmt.get(email) as any;
        return row ? this.mapRowToEmployee(row) : null;
    }

    /**
     * Lista todos os funcionários
     */
    findAll(): IEmployee[] {
        const stmt = this.db.prepare('SELECT * FROM employees ORDER BY fullName ASC');
        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToEmployee(row));
    }

    /**
     * Lista funcionários por empresa
     */
    findByCompany(companyId: string): IEmployee[] {
        const stmt = this.db.prepare('SELECT * FROM employees WHERE companyId = ? ORDER BY fullName ASC');
        const rows = stmt.all(companyId) as any[];
        return rows.map(row => this.mapRowToEmployee(row));
    }

    /**
     * Lista funcionários por unidade
     */
    findByUnit(unitId: string): IEmployee[] {
        const stmt = this.db.prepare('SELECT * FROM employees WHERE unitId = ? ORDER BY fullName ASC');
        const rows = stmt.all(unitId) as any[];
        return rows.map(row => this.mapRowToEmployee(row));
    }

    /**
     * Lista funcionários por cargo
     */
    findByRole(role: EmployeeRole, companyId?: string): IEmployee[] {
        let query = 'SELECT * FROM employees WHERE role = ?';
        const params: any[] = [role];
        
        if (companyId) {
            query += ' AND companyId = ?';
            params.push(companyId);
        }
        
        query += ' ORDER BY fullName ASC';
        
        const stmt = this.db.prepare(query);
        const rows = stmt.all(...params) as any[];
        return rows.map(row => this.mapRowToEmployee(row));
    }

    /**
     * Lista funcionários por status
     */
    findByStatus(status: EmployeeStatus, companyId?: string): IEmployee[] {
        let query = 'SELECT * FROM employees WHERE status = ?';
        const params: any[] = [status];
        
        if (companyId) {
            query += ' AND companyId = ?';
            params.push(companyId);
        }
        
        query += ' ORDER BY fullName ASC';
        
        const stmt = this.db.prepare(query);
        const rows = stmt.all(...params) as any[];
        return rows.map(row => this.mapRowToEmployee(row));
    }

    /**
     * Lista funcionários ativos
     */
    findActive(companyId?: string): IEmployee[] {
        let query = 'SELECT * FROM employees WHERE isActive = 1';
        const params: any[] = [];
        
        if (companyId) {
            query += ' AND companyId = ?';
            params.push(companyId);
        }
        
        query += ' ORDER BY fullName ASC';
        
        const stmt = this.db.prepare(query);
        const rows = stmt.all(...params) as any[];
        return rows.map(row => this.mapRowToEmployee(row));
    }

    /**
     * Lista funcionários subordinados a um gerente
     */
    findByManager(managerId: string): IEmployee[] {
        const stmt = this.db.prepare('SELECT * FROM employees WHERE managerId = ? ORDER BY fullName ASC');
        const rows = stmt.all(managerId) as any[];
        return rows.map(row => this.mapRowToEmployee(row));
    }

    /**
     * Atualiza funcionário
     */
    async update(id: string, data: IUpdateEmployee): Promise<IEmployee | null> {
        const current = this.findById(id);
        if (!current) return null;

        const fields: string[] = [];
        const values: any[] = [];

        // Campos simples
        const simpleFields = [
            'unitId', 'fullName', 'email', 'phone', 'birthDate', 'gender', 'photo',
            'role', 'department', 'jobTitle', 'contractType', 'hireDate', 'terminationDate', 'status',
            'salary', 'paymentDay', 'managerId', 'managerName', 'notes'
        ];

        simpleFields.forEach(field => {
            if (data[field as keyof IUpdateEmployee] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field as keyof IUpdateEmployee]);
            }
        });

        // Campos booleanos
        if (data.hasBenefits !== undefined) {
            fields.push('hasBenefits = ?');
            values.push(data.hasBenefits ? 1 : 0);
        }

        if (data.isActive !== undefined) {
            fields.push('isActive = ?');
            values.push(data.isActive ? 1 : 0);
        }

        // Campos JSON
        const jsonFields = [
            'documents', 'address', 'benefits', 'bankInfo', 'workSchedule',
            'dependents', 'emergencyContact', 'tags'
        ];

        jsonFields.forEach(field => {
            if (data[field as keyof IUpdateEmployee] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(JSON.stringify(data[field as keyof IUpdateEmployee]));
            }
        });

        // Atualiza senha se fornecida
        if (data.password) {
            const passwordHash = await this.hashPassword(data.password);
            fields.push('passwordHash = ?');
            values.push(passwordHash);
        }

        // Atualiza permissões se o cargo mudou
        if (data.role) {
            const permissions = ROLE_PERMISSIONS[data.role];
            fields.push('permissions = ?');
            values.push(JSON.stringify(permissions));
        }

        if (fields.length === 0) return current;

        fields.push('updatedAt = ?');
        values.push(new Date().toISOString());
        values.push(id);

        const query = `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`;
        const stmt = this.db.prepare(query);
        stmt.run(...values);

        return this.findById(id);
    }

    /**
     * Atualiza último login
     */
    updateLastLogin(id: string): void {
        const stmt = this.db.prepare('UPDATE employees SET lastLogin = ? WHERE id = ?');
        stmt.run(new Date().toISOString(), id);
    }

    /**
     * Ativa/desativa funcionário
     */
    setActive(id: string, isActive: boolean): boolean {
        const stmt = this.db.prepare('UPDATE employees SET isActive = ?, updatedAt = ? WHERE id = ?');
        const result = stmt.run(isActive ? 1 : 0, new Date().toISOString(), id);
        return result.changes > 0;
    }

    /**
     * Deleta funcionário (soft delete - muda status)
     */
    delete(id: string): boolean {
        const stmt = this.db.prepare(`
            UPDATE employees 
            SET status = ?, terminationDate = ?, isActive = 0, updatedAt = ? 
            WHERE id = ?
        `);
        const result = stmt.run(
            EmployeeStatus.TERMINATED,
            new Date().toISOString(),
            new Date().toISOString(),
            id
        );
        return result.changes > 0;
    }

    /**
     * Deleta permanentemente
     */
    deletePermanently(id: string): boolean {
        const stmt = this.db.prepare('DELETE FROM employees WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }

    /**
     * Valida credenciais de login
     */
    async validateCredentials(accessKey: string, password: string): Promise<IEmployee | null> {
        const employee = this.findByAccessKey(accessKey);
        
        if (!employee) return null;
        if (!employee.isActive) return null;
        if (employee.status === EmployeeStatus.TERMINATED) return null;
        
        const isValid = await this.validatePassword(password, employee.passwordHash);
        
        if (!isValid) return null;
        
        // Atualiza último login
        this.updateLastLogin(employee.id);
        
        return employee;
    }

    /**
     * Busca estatísticas de RH
     */
    getHRStats(companyId: string): IHRStats {
        const employees = this.findByCompany(companyId);
        
        const stats: IHRStats = {
            totalEmployees: employees.length,
            activeEmployees: employees.filter(e => e.isActive && e.status === EmployeeStatus.ACTIVE).length,
            inactiveEmployees: employees.filter(e => !e.isActive || e.status !== EmployeeStatus.ACTIVE).length,
            byRole: {} as any,
            byStatus: {} as any,
            byContractType: {} as any,
            averageSalary: 0,
            totalPayroll: 0,
            averageTenure: 0
        };

        // Inicializa contadores
        Object.values(EmployeeRole).forEach(role => {
            stats.byRole[role] = 0;
        });
        
        Object.values(EmployeeStatus).forEach(status => {
            stats.byStatus[status] = 0;
        });
        
        Object.values(ContractType).forEach(type => {
            stats.byContractType[type] = 0;
        });

        // Contabiliza
        let totalSalary = 0;
        let totalTenure = 0;
        const now = new Date();

        employees.forEach(emp => {
            stats.byRole[emp.role]++;
            stats.byStatus[emp.status]++;
            stats.byContractType[emp.contractType]++;
            
            totalSalary += emp.salary;
            
            const hireDate = new Date(emp.hireDate);
            const monthsWorked = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
            totalTenure += monthsWorked;
        });

        stats.averageSalary = employees.length > 0 ? totalSalary / employees.length : 0;
        stats.totalPayroll = totalSalary;
        stats.averageTenure = employees.length > 0 ? totalTenure / employees.length : 0;

        return stats;
    }

    /**
     * Mapeia linha do banco para Employee
     */
    private mapRowToEmployee(row: any): IEmployee {
        return {
            id: row.id,
            companyId: row.companyId,
            unitId: row.unitId,
            fullName: row.fullName,
            email: row.email,
            phone: row.phone,
            birthDate: row.birthDate,
            gender: row.gender,
            photo: row.photo,
            documents: JSON.parse(row.documents),
            address: JSON.parse(row.address),
            role: row.role as EmployeeRole,
            department: row.department,
            jobTitle: row.jobTitle,
            contractType: row.contractType as ContractType,
            hireDate: row.hireDate,
            terminationDate: row.terminationDate,
            status: row.status as EmployeeStatus,
            salary: row.salary,
            paymentDay: row.paymentDay,
            hasBenefits: row.hasBenefits === 1,
            benefits: row.benefits ? JSON.parse(row.benefits) : undefined,
            bankInfo: row.bankInfo ? JSON.parse(row.bankInfo) : undefined,
            accessKey: row.accessKey,
            passwordHash: row.passwordHash,
            accessLevel: row.accessLevel as AccessLevel,
            permissions: JSON.parse(row.permissions),
            lastLogin: row.lastLogin,
            isActive: row.isActive === 1,
            workSchedule: row.workSchedule ? JSON.parse(row.workSchedule) : undefined,
            managerId: row.managerId,
            managerName: row.managerName,
            dependents: row.dependents ? JSON.parse(row.dependents) : undefined,
            roleHistory: row.roleHistory ? JSON.parse(row.roleHistory) : undefined,
            performanceReviews: row.performanceReviews ? JSON.parse(row.performanceReviews) : undefined,
            warningsAndPraises: row.warningsAndPraises ? JSON.parse(row.warningsAndPraises) : undefined,
            emergencyContact: row.emergencyContact ? JSON.parse(row.emergencyContact) : undefined,
            notes: row.notes,
            tags: row.tags ? JSON.parse(row.tags) : undefined,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            createdBy: row.createdBy,
            createdByName: row.createdByName
        };
    }
}
