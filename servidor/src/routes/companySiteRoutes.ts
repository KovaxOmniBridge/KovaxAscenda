import { Router } from 'express';
import { CompanySiteController } from '../controllers/CompanySiteController';

const router = Router();
const siteController = new CompanySiteController();

// Rotas de sites por empresa
router.get('/companies/:companyId/site', siteController.show);
router.post('/companies/:companyId/site', siteController.createOrUpdate);
router.delete('/companies/:companyId/site', siteController.delete);

// Rotas globais de sites
router.get('/sites', siteController.index);
router.get('/sites/:slug', siteController.showBySlug);

export default router;
