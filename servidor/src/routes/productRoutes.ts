import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

// Rota para buscar TODOS os produtos (para o GeneralMarket)
router.get('/products', productController.index);

// Rotas de produtos por empresa
router.get('/companies/:companyId/products', productController.index);
router.get('/companies/:companyId/products/:id', productController.show);
router.post('/companies/:companyId/products', productController.store);
router.put('/companies/:companyId/products/:id', productController.update);
router.delete('/companies/:companyId/products/:id', productController.delete);

export default router;
