import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { EmployeeService } from '../services/EmployeeService';
import { ILoginCredentials } from '../interfaces/IEmployee';

export class AuthController {
    private authService: AuthService;
    private employeeService: EmployeeService;

    constructor(authService: AuthService, employeeService: EmployeeService) {
        this.authService = authService;
        this.employeeService = employeeService;
    }

    /**
     * POST /api/auth/login
     * Realiza login
     */
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const credentials: ILoginCredentials = req.body;

            if (!credentials.accessKey || !credentials.password) {
                res.status(400).json({ error: 'Chave de acesso e senha são obrigatórios' });
                return;
            }

            const result = await this.authService.login(credentials);

            if (!result) {
                res.status(401).json({ error: 'Credenciais inválidas' });
                return;
            }

            res.json({
                message: 'Login realizado com sucesso',
                session: result.session,
                employee: result.employee
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * POST /api/auth/logout
     * Realiza logout (cliente deve remover token)
     */
    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            // Em uma implementação mais robusta, poderia invalidar o token no servidor
            res.json({ message: 'Logout realizado com sucesso' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * POST /api/auth/refresh
     * Renova token JWT
     */
    refreshToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.body;

            if (!token) {
                res.status(400).json({ error: 'Token é obrigatório' });
                return;
            }

            const newSession = this.authService.refreshToken(token);

            if (!newSession) {
                res.status(401).json({ error: 'Token inválido ou expirado' });
                return;
            }

            res.json({
                message: 'Token renovado com sucesso',
                session: newSession
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/auth/me
     * Retorna dados do usuário logado
     */
    getMe = async (req: Request, res: Response): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Token não fornecido' });
                return;
            }

            const token = authHeader.substring(7);
            const session = this.authService.verifyToken(token);

            if (!session) {
                res.status(401).json({ error: 'Token inválido' });
                return;
            }

            const employee = this.employeeService.getEmployeeById(session.employeeId);

            if (!employee) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            // Remove senha
            const { passwordHash, ...employeeWithoutPassword } = employee;

            res.json({
                employee: employeeWithoutPassword,
                session
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * POST /api/auth/change-password
     * Altera senha do usuário logado
     */
    changePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Token não fornecido' });
                return;
            }

            const token = authHeader.substring(7);
            const session = this.authService.verifyToken(token);

            if (!session) {
                res.status(401).json({ error: 'Token inválido' });
                return;
            }

            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
                return;
            }

            // Valida força da nova senha
            const validation = this.authService.validatePasswordStrength(newPassword);
            if (!validation.valid) {
                res.status(400).json({ error: validation.message });
                return;
            }

            // Valida senha atual
            const employee = this.employeeService.getEmployeeById(session.employeeId);
            if (!employee) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            const isValidPassword = await this.authService['employeeRepository'].validatePassword(
                currentPassword,
                employee.passwordHash
            );

            if (!isValidPassword) {
                res.status(401).json({ error: 'Senha atual incorreta' });
                return;
            }

            // Altera senha
            await this.employeeService.changePassword(session.employeeId, newPassword);

            res.json({ message: 'Senha alterada com sucesso' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * POST /api/auth/validate-token
     * Valida token JWT
     */
    validateToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.body;

            if (!token) {
                res.status(400).json({ error: 'Token é obrigatório' });
                return;
            }

            const session = this.authService.verifyToken(token);

            if (!session) {
                res.status(401).json({ valid: false, error: 'Token inválido' });
                return;
            }

            res.json({ valid: true, session });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
