import { Request, Response } from 'express';
import { PhysicalUnitService } from '../services/PhysicalUnitService';
import { ICreatePhysicalUnit, IUpdatePhysicalUnit, PhysicalUnitType } from '../interfaces/IPhysicalUnit';

export class PhysicalUnitController {
    private unitService: PhysicalUnitService;

    constructor() {
        this.unitService = new PhysicalUnitService();
    }

    createUnit = async (req: Request, res: Response): Promise<void> => {
        try {
            const data: ICreatePhysicalUnit = req.body;
            const unit = this.unitService.createUnit(data);
            res.status(201).json(unit);
        } catch (error: any) {
            console.error('Error creating unit:', error);
            res.status(400).json({ error: error.message || 'Erro ao criar unidade' });
        }
    };

    getUnitById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const unit = this.unitService.getUnitById(id);
            res.json(unit);
        } catch (error: any) {
            console.error('Error getting unit:', error);
            res.status(404).json({ error: error.message || 'Unidade não encontrada' });
        }
    };

    getAllUnits = async (req: Request, res: Response): Promise<void> => {
        try {
            const units = this.unitService.getAllUnits();
            res.json(units);
        } catch (error: any) {
            console.error('Error getting units:', error);
            res.status(500).json({ error: 'Erro ao buscar unidades' });
        }
    };

    getUnitsByCompany = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const units = this.unitService.getUnitsByCompany(companyId);
            res.json(units);
        } catch (error: any) {
            console.error('Error getting company units:', error);
            res.status(500).json({ error: 'Erro ao buscar unidades da empresa' });
        }
    };

    getUnitsByType = async (req: Request, res: Response): Promise<void> => {
        try {
            const { type } = req.params;
            const { companyId } = req.query;
            
            const units = this.unitService.getUnitsByType(
                type as PhysicalUnitType,
                companyId as string | undefined
            );
            res.json(units);
        } catch (error: any) {
            console.error('Error getting units by type:', error);
            res.status(500).json({ error: 'Erro ao buscar unidades por tipo' });
        }
    };

    getUnitsByCity = async (req: Request, res: Response): Promise<void> => {
        try {
            const { city } = req.params;
            const { companyId } = req.query;
            
            const units = this.unitService.getUnitsByCity(city, companyId as string | undefined);
            res.json(units);
        } catch (error: any) {
            console.error('Error getting units by city:', error);
            res.status(500).json({ error: 'Erro ao buscar unidades por cidade' });
        }
    };

    updateUnit = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data: IUpdatePhysicalUnit = req.body;
            const unit = this.unitService.updateUnit(id, data);
            res.json(unit);
        } catch (error: any) {
            console.error('Error updating unit:', error);
            res.status(400).json({ error: error.message || 'Erro ao atualizar unidade' });
        }
    };

    deleteUnit = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            this.unitService.deleteUnit(id);
            res.status(204).send();
        } catch (error: any) {
            console.error('Error deleting unit:', error);
            res.status(404).json({ error: error.message || 'Erro ao deletar unidade' });
        }
    };

    getUnitStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;
            const stats = this.unitService.getUnitStats(companyId);
            res.json(stats);
        } catch (error: any) {
            console.error('Error getting unit stats:', error);
            res.status(500).json({ error: 'Erro ao buscar estatísticas de unidades' });
        }
    };

    // Funcionários
    addEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const employee = req.body;
            const unit = this.unitService.addEmployee(id, employee);
            res.json(unit);
        } catch (error: any) {
            console.error('Error adding employee:', error);
            res.status(400).json({ error: error.message || 'Erro ao adicionar funcionário' });
        }
    };

    removeEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id, employeeId } = req.params;
            const unit = this.unitService.removeEmployee(id, employeeId);
            res.json(unit);
        } catch (error: any) {
            console.error('Error removing employee:', error);
            res.status(400).json({ error: error.message || 'Erro ao remover funcionário' });
        }
    };

    updateEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id, employeeId } = req.params;
            const data = req.body;
            const unit = this.unitService.updateEmployee(id, employeeId, data);
            res.json(unit);
        } catch (error: any) {
            console.error('Error updating employee:', error);
            res.status(400).json({ error: error.message || 'Erro ao atualizar funcionário' });
        }
    };

    // Estoque
    updateInventory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { inventory } = req.body;
            const unit = this.unitService.updateInventory(id, inventory);
            res.json(unit);
        } catch (error: any) {
            console.error('Error updating inventory:', error);
            res.status(400).json({ error: error.message || 'Erro ao atualizar estoque' });
        }
    };

    // Equipamentos
    addEquipment = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const equipment = req.body;
            const unit = this.unitService.addEquipment(id, equipment);
            res.json(unit);
        } catch (error: any) {
            console.error('Error adding equipment:', error);
            res.status(400).json({ error: error.message || 'Erro ao adicionar equipamento' });
        }
    };

    removeEquipment = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id, equipmentId } = req.params;
            const unit = this.unitService.removeEquipment(id, equipmentId);
            res.json(unit);
        } catch (error: any) {
            console.error('Error removing equipment:', error);
            res.status(400).json({ error: error.message || 'Erro ao remover equipamento' });
        }
    };

    // Metas
    setGoals = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const goals = req.body;
            const unit = this.unitService.setGoals(id, goals);
            res.json(unit);
        } catch (error: any) {
            console.error('Error setting goals:', error);
            res.status(400).json({ error: error.message || 'Erro ao definir metas' });
        }
    };

    // Desempenho
    recordPerformance = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const performance = req.body;
            const unit = this.unitService.recordPerformance(id, performance);
            res.json(unit);
        } catch (error: any) {
            console.error('Error recording performance:', error);
            res.status(400).json({ error: error.message || 'Erro ao registrar desempenho' });
        }
    };
}
