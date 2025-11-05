import { PhysicalUnitRepository } from '../repositories/PhysicalUnitRepository';
import { IPhysicalUnit, ICreatePhysicalUnit, IUpdatePhysicalUnit, PhysicalUnitType, PhysicalUnitStatus, IPhysicalUnitStats } from '../interfaces/IPhysicalUnit';

export class PhysicalUnitService {
    private unitRepository: PhysicalUnitRepository;

    constructor() {
        this.unitRepository = new PhysicalUnitRepository();
    }

    createUnit(data: ICreatePhysicalUnit): IPhysicalUnit {
        // Validações
        this.validateUnitData(data);

        return this.unitRepository.create(data);
    }

    getUnitById(id: string): IPhysicalUnit {
        const unit = this.unitRepository.findById(id);
        if (!unit) {
            throw new Error('Unidade não encontrada');
        }
        return unit;
    }

    getAllUnits(): IPhysicalUnit[] {
        return this.unitRepository.findAll();
    }

    getUnitsByCompany(companyId: string): IPhysicalUnit[] {
        return this.unitRepository.findByCompanyId(companyId);
    }

    getUnitsByType(type: PhysicalUnitType, companyId?: string): IPhysicalUnit[] {
        return this.unitRepository.findByType(type, companyId);
    }

    getUnitsByCity(city: string, companyId?: string): IPhysicalUnit[] {
        return this.unitRepository.findByCity(city, companyId);
    }

    updateUnit(id: string, data: IUpdatePhysicalUnit): IPhysicalUnit {
        // Validações parciais
        if (data.type || data.name || data.status) {
            this.validateUnitData(data as ICreatePhysicalUnit, true);
        }

        return this.unitRepository.update(id, data);
    }

    deleteUnit(id: string): void {
        const unit = this.unitRepository.findById(id);
        if (!unit) {
            throw new Error('Unidade não encontrada');
        }
        this.unitRepository.delete(id);
    }

    getUnitStats(companyId: string): IPhysicalUnitStats {
        const units = this.unitRepository.findByCompanyId(companyId);

        const stats: IPhysicalUnitStats = {
            totalUnits: units.length,
            activeUnits: 0,
            inactiveUnits: 0,
            byType: {
                [PhysicalUnitType.STORE]: 0,
                [PhysicalUnitType.WAREHOUSE]: 0,
                [PhysicalUnitType.DISTRIBUTION_CENTER]: 0,
                [PhysicalUnitType.OFFICE]: 0,
                [PhysicalUnitType.FACTORY]: 0,
                [PhysicalUnitType.WORKSHOP]: 0
            },
            byStatus: {
                [PhysicalUnitStatus.ACTIVE]: 0,
                [PhysicalUnitStatus.INACTIVE]: 0,
                [PhysicalUnitStatus.UNDER_CONSTRUCTION]: 0,
                [PhysicalUnitStatus.UNDER_RENOVATION]: 0,
                [PhysicalUnitStatus.TEMPORARILY_CLOSED]: 0,
                [PhysicalUnitStatus.PERMANENTLY_CLOSED]: 0
            },
            totalEmployees: 0,
            totalArea: 0,
            totalMonthlyOperatingCost: 0
        };

        units.forEach(unit => {
            // Contar ativos/inativos
            if (unit.isActive) {
                stats.activeUnits++;
            } else {
                stats.inactiveUnits++;
            }

            // Contar por tipo
            if (stats.byType[unit.type] !== undefined) {
                stats.byType[unit.type]++;
            }

            // Contar por status
            if (stats.byStatus[unit.status] !== undefined) {
                stats.byStatus[unit.status]++;
            }

            // Somar funcionários
            stats.totalEmployees += unit.totalEmployees;

            // Somar área
            if (unit.area) {
                stats.totalArea += unit.area;
            }

            // Somar custos operacionais
            if (unit.totalMonthlyOperatingCost) {
                stats.totalMonthlyOperatingCost += unit.totalMonthlyOperatingCost;
            }
        });

        return stats;
    }

    // Gerenciar funcionários
    addEmployee(unitId: string, employee: any): IPhysicalUnit {
        this.validateEmployeeData(employee);
        return this.unitRepository.addEmployee(unitId, employee);
    }

    removeEmployee(unitId: string, employeeId: string): IPhysicalUnit {
        return this.unitRepository.removeEmployee(unitId, employeeId);
    }

    updateEmployee(unitId: string, employeeId: string, data: any): IPhysicalUnit {
        const unit = this.getUnitById(unitId);
        const employees = unit.employees || [];
        const index = employees.findIndex(emp => emp.id === employeeId);

        if (index === -1) {
            throw new Error('Funcionário não encontrado');
        }

        employees[index] = { ...employees[index], ...data };

        return this.unitRepository.update(unitId, { employees } as any);
    }

    // Gerenciar estoque
    updateInventory(unitId: string, inventory: any[]): IPhysicalUnit {
        const unit = this.unitRepository.findById(unitId);
        if (!unit) throw new Error('Unidade não encontrada');

        // Calcular valor total do estoque se disponível
        const totalValue = inventory.reduce((sum, item) => {
            return sum + ((item.unitPrice || 0) * item.quantity);
        }, 0);

        const stmt: any = {
            inventory: inventory,
            totalInventoryValue: totalValue > 0 ? totalValue : undefined
        };

        return this.unitRepository.update(unitId, stmt);
    }

    // Gerenciar equipamentos
    addEquipment(unitId: string, equipment: any): IPhysicalUnit {
        const unit = this.getUnitById(unitId);
        const equipmentList = unit.equipment || [];
        
        equipmentList.push({
            id: this.generateId(),
            ...equipment
        });

        return this.unitRepository.update(unitId, { equipment: equipmentList } as any);
    }

    removeEquipment(unitId: string, equipmentId: string): IPhysicalUnit {
        const unit = this.getUnitById(unitId);
        const equipmentList = (unit.equipment || []).filter(eq => eq.id !== equipmentId);

        return this.unitRepository.update(unitId, { equipment: equipmentList } as any);
    }

    // Definir metas
    setGoals(unitId: string, goals: any): IPhysicalUnit {
        return this.unitRepository.update(unitId, { currentGoals: goals } as any);
    }

    // Registrar desempenho
    recordPerformance(unitId: string, performance: any): IPhysicalUnit {
        const unit = this.getUnitById(unitId);
        const history = unit.performanceHistory || [];
        
        // Calcular % de atingimento se houver metas
        if (unit.currentGoals && performance.totalRevenue) {
            const target = unit.currentGoals.monthlyRevenueTarget;
            if (target) {
                performance.achievementPercentage = (performance.totalRevenue / target) * 100;
            }
        }

        history.push(performance);

        return this.unitRepository.update(unitId, { performanceHistory: history } as any);
    }

    private validateUnitData(data: Partial<ICreatePhysicalUnit>, isUpdate: boolean = false): void {
        if (!isUpdate) {
            if (!data.companyId) {
                throw new Error('ID da empresa é obrigatório');
            }
            if (!data.type) {
                throw new Error('Tipo da unidade é obrigatório');
            }
            if (!data.name) {
                throw new Error('Nome da unidade é obrigatório');
            }
            if (!data.status) {
                throw new Error('Status da unidade é obrigatório');
            }
            if (!data.address || !data.city || !data.state || !data.zipCode || !data.country) {
                throw new Error('Endereço completo é obrigatório');
            }
        }

        // Validar tipo
        if (data.type && !Object.values(PhysicalUnitType).includes(data.type)) {
            throw new Error('Tipo de unidade inválido');
        }

        // Validar status
        if (data.status && !Object.values(PhysicalUnitStatus).includes(data.status)) {
            throw new Error('Status inválido');
        }

        // Validar valores numéricos
        if (data.area !== undefined && data.area < 0) {
            throw new Error('Área não pode ser negativa');
        }
        if (data.capacity !== undefined && data.capacity < 0) {
            throw new Error('Capacidade não pode ser negativa');
        }
        if (data.monthlyRent !== undefined && data.monthlyRent < 0) {
            throw new Error('Aluguel mensal não pode ser negativo');
        }
    }

    private validateEmployeeData(employee: any): void {
        if (!employee.name) {
            throw new Error('Nome do funcionário é obrigatório');
        }
        if (!employee.role) {
            throw new Error('Cargo do funcionário é obrigatório');
        }
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
