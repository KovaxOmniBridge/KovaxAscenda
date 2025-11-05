import { Router } from 'express';
import { PhysicalUnitController } from '../controllers/PhysicalUnitController';

const router = Router();
const unitController = new PhysicalUnitController();

// CRUD básico
router.post('/', unitController.createUnit);
router.get('/', unitController.getAllUnits);
router.get('/:id', unitController.getUnitById);
router.put('/:id', unitController.updateUnit);
router.delete('/:id', unitController.deleteUnit);

// Busca por empresa
router.get('/company/:companyId', unitController.getUnitsByCompany);

// Estatísticas
router.get('/stats/:companyId', unitController.getUnitStats);

// Busca por tipo e cidade
router.get('/type/:type', unitController.getUnitsByType);
router.get('/city/:city', unitController.getUnitsByCity);

// Funcionários
router.post('/:id/employees', unitController.addEmployee);
router.put('/:id/employees/:employeeId', unitController.updateEmployee);
router.delete('/:id/employees/:employeeId', unitController.removeEmployee);

// Estoque
router.put('/:id/inventory', unitController.updateInventory);

// Equipamentos
router.post('/:id/equipment', unitController.addEquipment);
router.delete('/:id/equipment/:equipmentId', unitController.removeEquipment);

// Metas
router.put('/:id/goals', unitController.setGoals);

// Desempenho
router.post('/:id/performance', unitController.recordPerformance);

export default router;
