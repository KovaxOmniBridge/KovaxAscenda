import { Router } from 'express';
import { AssetController } from '../controllers/AssetController';

const router = Router();
const assetController = new AssetController();

// CRUD básico
router.post('/', assetController.createAsset);
router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

// Busca por empresa
router.get('/company/:companyId', assetController.getAssetsByCompany);

// Estatísticas
router.get('/stats/:companyId', assetController.getAssetStats);

// Busca por tipo e status
router.get('/type/:type', assetController.getAssetsByType);
router.get('/status/:status', assetController.getAssetsByStatus);

// Documentos
router.post('/:id/documents', assetController.addDocument);
router.delete('/:id/documents/:documentId', assetController.removeDocument);

// Fotos
router.post('/:id/photos', assetController.addPhoto);
router.delete('/:id/photos', assetController.removePhoto);

// Despesas
router.post('/:id/expenses', assetController.addExpense);
router.delete('/:id/expenses/:expenseId', assetController.removeExpense);

export default router;
