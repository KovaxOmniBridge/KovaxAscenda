import { Request, Response } from 'express';
import { EmployeeService } from '../services/EmployeeService';
import { AuthService } from '../services/AuthService';
import { ICreateEmployee, IUpdateEmployee, EmployeeRole, EmployeeStatus } from '../interfaces/IEmployee';

export class EmployeeController {
    private employeeService: EmployeeService;
    private authService: AuthService;

    constructor(employeeService: EmployeeService, authService: AuthService) {
        this.employeeService = employeeService;
        this.authService = authService;
    }

    /**
     * GET /api/employees
     * Lista todos os funcionários
     */
    getAllEmployees = async (req: Request, res: Response): Promise<void> => {
        try {
            const employees = this.employeeService.getAllEmployees();
            
            // Remove senhas
            const employeesWithoutPassword = employees.map(({ passwordHash, ...emp }) => emp);
            
            res.json(employeesWithoutPassword);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/employees/:id
     * Busca funcionário por ID
     */
    getEmployeeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const employee = this.employeeService.getEmployeeById(id);

            if (!employee) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            const { passwordHash, ...employeeWithoutPassword } = employee;
            res.json(employeeWithoutPassword);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/employees/company/:companyId
     * Lista funcionários por empresa
     */
    getEmployeesByCompany = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const employees = this.employeeService.getEmployeesByCompany(companyId);
            
            const employeesWithoutPassword = employees.map(({ passwordHash, ...emp }) => emp);
            res.json(employeesWithoutPassword);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/employees/unit/:unitId
     * Lista funcionários por unidade
     */
    getEmployeesByUnit = async (req: Request, res: Response): Promise<void> => {
        try {
            const { unitId } = req.params;
            const employees = this.employeeService.getEmployeesByUnit(unitId);
            
            const employeesWithoutPassword = employees.map(({ passwordHash, ...emp }) => emp);
            res.json(employeesWithoutPassword);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/employees/role/:role
     * Lista funcionários por cargo
     */
    getEmployeesByRole = async (req: Request, res: Response): Promise<void> => {
        try {
            const { role } = req.params;
            const { companyId } = req.query;
            
            const employees = this.employeeService.getEmployeesByRole(
                role as EmployeeRole,
                companyId as string | undefined
            );
            
            const employeesWithoutPassword = employees.map(({ passwordHash, ...emp }) => emp);
            res.json(employeesWithoutPassword);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/employees/status/:status
     * Lista funcionários por status
     */
    getEmployeesByStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { status } = req.params;
            const { companyId } = req.query;
            
            const employees = this.employeeService.getEmployeesByStatus(
                status as EmployeeStatus,
                companyId as string | undefined
            );
            
            const employeesWithoutPassword = employees.map(({ passwordHash, ...emp }) => emp);
            res.json(employeesWithoutPassword);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/employees/active
     * Lista funcionários ativos
     */
    getActiveEmployees = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.query;
            const employees = this.employeeService.getActiveEmployees(companyId as string | undefined);
            
            const employeesWithoutPassword = employees.map(({ passwordHash, ...emp }) => emp);
            res.json(employeesWithoutPassword);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/employees/manager/:managerId/subordinates
     * Lista subordinados de um gerente
     */
    getSubordinates = async (req: Request, res: Response): Promise<void> => {
        try {
            const { managerId } = req.params;
            const employees = this.employeeService.getSubordinates(managerId);
            
            const employeesWithoutPassword = employees.map(({ passwordHash, ...emp }) => emp);
            res.json(employeesWithoutPassword);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * POST /api/employees
     * Cria novo funcionário
     */
    createEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const data: ICreateEmployee = req.body;
            
            // Pega info do criador do header (simplificado)
            const creatorId = req.body._creatorId || 'system';
            const creatorName = req.body._creatorName || 'Sistema';

            const employee = await this.employeeService.createEmployee(data, creatorId, creatorName);
            
            const { passwordHash, ...employeeWithoutPassword } = employee;
            res.status(201).json(employeeWithoutPassword);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    /**
     * PUT /api/employees/:id
     * Atualiza funcionário
     */
    updateEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data: IUpdateEmployee = req.body;

            const employee = await this.employeeService.updateEmployee(id, data);

            if (!employee) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            const { passwordHash, ...employeeWithoutPassword } = employee;
            res.json(employeeWithoutPassword);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    /**
     * DELETE /api/employees/:id
     * Desliga funcionário (soft delete)
     */
    terminateEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const success = this.employeeService.terminateEmployee(id);

            if (!success) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            res.json({ message: 'Funcionário desligado com sucesso' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * DELETE /api/employees/:id/permanent
     * Deleta funcionário permanentemente
     */
    deleteEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const success = this.employeeService.deleteEmployee(id);

            if (!success) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            res.json({ message: 'Funcionário deletado permanentemente' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * POST /api/employees/:id/transfer
     * Transfere funcionário para outra unidade
     */
    transferEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { unitId } = req.body;

            if (!unitId) {
                res.status(400).json({ error: 'ID da unidade é obrigatório' });
                return;
            }

            const employee = await this.employeeService.transferEmployee(id, unitId);

            if (!employee) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            const { passwordHash, ...employeeWithoutPassword } = employee;
            res.json(employeeWithoutPassword);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    /**
     * POST /api/employees/:id/promote
     * Promove funcionário
     */
    promoteEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { role, salary } = req.body;

            if (!role) {
                res.status(400).json({ error: 'Novo cargo é obrigatório' });
                return;
            }

            const employee = await this.employeeService.promoteEmployee(id, role as EmployeeRole, salary);

            if (!employee) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            const { passwordHash, ...employeeWithoutPassword } = employee;
            res.json(employeeWithoutPassword);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    /**
     * POST /api/employees/:id/assign-manager
     * Atribui gerente a funcionário
     */
    assignManager = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { managerId } = req.body;

            if (!managerId) {
                res.status(400).json({ error: 'ID do gerente é obrigatório' });
                return;
            }

            const employee = await this.employeeService.assignManager(id, managerId);

            if (!employee) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            const { passwordHash, ...employeeWithoutPassword } = employee;
            res.json(employeeWithoutPassword);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    /**
     * POST /api/employees/:id/activate
     * Ativa funcionário
     */
    activateEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const success = this.employeeService.setEmployeeActive(id, true);

            if (!success) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            res.json({ message: 'Funcionário ativado com sucesso' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * POST /api/employees/:id/deactivate
     * Desativa funcionário
     */
    deactivateEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const success = this.employeeService.setEmployeeActive(id, false);

            if (!success) {
                res.status(404).json({ error: 'Funcionário não encontrado' });
                return;
            }

            res.json({ message: 'Funcionário desativado com sucesso' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/employees/company/:companyId/stats
     * Busca estatísticas de RH
     */
    getHRStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const stats = this.employeeService.getHRStats(companyId);
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * GET /api/employees/generate-access-key
     * Gera nova chave de acesso
     */
    generateAccessKey = async (req: Request, res: Response): Promise<void> => {
        try {
            const accessKey = this.employeeService.generateAccessKey();
            res.json({ accessKey });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
