import { Router } from 'express';
import CompanyController from '../controllers/CompanyController';

const router = Router();

// Rotas de empresas
router.get('/companies', CompanyController.index);
router.get('/companies/:id', CompanyController.show);
router.get('/companies/cnpj/:cnpj', CompanyController.showByCnpj);
router.post('/companies', CompanyController.store);
router.put('/companies/:id', CompanyController.update);
router.delete('/companies/:id', CompanyController.delete);

export default router;
