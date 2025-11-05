import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { IEmployee, ILoginCredentials, IAuthSession, EmployeeRole } from '../interfaces/IEmployee';

export class AuthService {
    private employeeRepository: EmployeeRepository;
    private jwtSecret: string;
    private jwtExpiresIn: string;

    constructor(employeeRepository: EmployeeRepository) {
        this.employeeRepository = employeeRepository;
        // Em produção, use variáveis de ambiente
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '8h';
    }

    /**
     * Realiza login de funcionário
     */
    async login(credentials: ILoginCredentials): Promise<{ session: IAuthSession; employee: Omit<IEmployee, 'passwordHash'> } | null> {
        const { accessKey, password, role } = credentials;

        // Valida credenciais
        const employee = await this.employeeRepository.validateCredentials(accessKey, password);
        
        if (!employee) {
            return null;
        }

        // Se um cargo foi especificado, verifica se corresponde
        if (role && employee.role !== role) {
            return null;
        }

        // Gera token JWT
        const session = this.generateSession(employee);

        // Remove senha do retorno
        const { passwordHash, ...employeeWithoutPassword } = employee;

        return {
            session,
            employee: employeeWithoutPassword
        };
    }

    /**
     * Gera sessão JWT
     */
    generateSession(employee: IEmployee): IAuthSession {
        const expiresIn = this.parseExpiration(this.jwtExpiresIn);
        const expiresAt = new Date(Date.now() + expiresIn);

        const payload = {
            employeeId: employee.id,
            companyId: employee.companyId,
            role: employee.role,
            accessLevel: employee.accessLevel,
            permissions: employee.permissions
        };

        const token = jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn
        } as jwt.SignOptions);

        return {
            token,
            employeeId: employee.id,
            companyId: employee.companyId,
            role: employee.role,
            accessLevel: employee.accessLevel,
            permissions: employee.permissions,
            expiresAt: expiresAt.toISOString()
        };
    }

    /**
     * Verifica token JWT
     */
    verifyToken(token: string): IAuthSession | null {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as any;
            
            // Calcula data de expiração
            const expiresAt = new Date(decoded.exp * 1000);
            
            return {
                token,
                employeeId: decoded.employeeId,
                companyId: decoded.companyId,
                role: decoded.role,
                accessLevel: decoded.accessLevel,
                permissions: decoded.permissions,
                expiresAt: expiresAt.toISOString()
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Renova token JWT
     */
    refreshToken(oldToken: string): IAuthSession | null {
        const session = this.verifyToken(oldToken);
        
        if (!session) {
            return null;
        }

        // Busca funcionário atualizado
        const employee = this.employeeRepository.findById(session.employeeId);
        
        if (!employee || !employee.isActive) {
            return null;
        }

        // Gera novo token
        return this.generateSession(employee);
    }

    /**
     * Valida permissão específica
     */
    checkPermission(session: IAuthSession, permission: keyof IAuthSession['permissions']): boolean {
        return session.permissions[permission] === true;
    }

    /**
     * Valida se tem acesso a recurso de outra empresa
     */
    checkCompanyAccess(session: IAuthSession, resourceCompanyId: string): boolean {
        return session.companyId === resourceCompanyId;
    }

    /**
     * Valida se pode gerenciar funcionário
     */
    canManageEmployee(session: IAuthSession, targetEmployeeId: string): boolean {
        // Admins podem gerenciar todos
        if (session.permissions.canManageEmployees) {
            return true;
        }

        // Gerentes podem gerenciar subordinados
        const targetEmployee = this.employeeRepository.findById(targetEmployeeId);
        if (!targetEmployee) {
            return false;
        }

        // Verifica se é subordinado
        if (targetEmployee.managerId === session.employeeId) {
            return true;
        }

        // Pode editar a si mesmo (dados básicos)
        if (targetEmployeeId === session.employeeId) {
            return true;
        }

        return false;
    }

    /**
     * Parseia string de expiração para milissegundos
     */
    private parseExpiration(expiresIn: string): number {
        const unit = expiresIn.slice(-1);
        const value = parseInt(expiresIn.slice(0, -1));

        switch (unit) {
            case 's': return value * 1000;
            case 'm': return value * 60 * 1000;
            case 'h': return value * 60 * 60 * 1000;
            case 'd': return value * 24 * 60 * 60 * 1000;
            default: return 8 * 60 * 60 * 1000; // 8 horas padrão
        }
    }

    /**
     * Gera senha aleatória
     */
    generateRandomPassword(length: number = 12): string {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, charset.length);
            password += charset[randomIndex];
        }
        
        return password;
    }

    /**
     * Valida força da senha
     */
    validatePasswordStrength(password: string): { valid: boolean; message?: string } {
        if (password.length < 8) {
            return { valid: false, message: 'Senha deve ter no mínimo 8 caracteres' };
        }

        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Senha deve conter letras minúsculas' };
        }

        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Senha deve conter letras maiúsculas' };
        }

        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Senha deve conter números' };
        }

        return { valid: true };
    }
}
