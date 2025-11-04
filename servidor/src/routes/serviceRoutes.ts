import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';

const router = Router();
const serviceController = new ServiceController();

// Rotas de serviços por empresa
router.get('/companies/:companyId/services', serviceController.index);
router.get('/companies/:companyId/services/:id', serviceController.show);
router.post('/companies/:companyId/services', serviceController.store);
router.put('/companies/:companyId/services/:id', serviceController.update);
router.delete('/companies/:companyId/services/:id', serviceController.delete);

export default router;
