import { Router } from 'express';
import { EmployeeController } from '../controllers/EmployeeController';

export function createEmployeeRoutes(employeeController: EmployeeController): Router {
    const router = Router();

    // Listagem
    router.get('/', employeeController.getAllEmployees);
    router.get('/active', employeeController.getActiveEmployees);
    router.get('/generate-access-key', employeeController.generateAccessKey);
    router.get('/company/:companyId', employeeController.getEmployeesByCompany);
    router.get('/company/:companyId/stats', employeeController.getHRStats);
    router.get('/unit/:unitId', employeeController.getEmployeesByUnit);
    router.get('/role/:role', employeeController.getEmployeesByRole);
    router.get('/status/:status', employeeController.getEmployeesByStatus);
    router.get('/manager/:managerId/subordinates', employeeController.getSubordinates);
    router.get('/:id', employeeController.getEmployeeById);

    // Criação e atualização
    router.post('/', employeeController.createEmployee);
    router.put('/:id', employeeController.updateEmployee);

    // Ações especiais
    router.post('/:id/transfer', employeeController.transferEmployee);
    router.post('/:id/promote', employeeController.promoteEmployee);
    router.post('/:id/assign-manager', employeeController.assignManager);
    router.post('/:id/activate', employeeController.activateEmployee);
    router.post('/:id/deactivate', employeeController.deactivateEmployee);

    // Deleção
    router.delete('/:id', employeeController.terminateEmployee);
    router.delete('/:id/permanent', employeeController.deleteEmployee);

    return router;
}
