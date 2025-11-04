import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';

const router = Router();
const companyController = new CompanyController();

// GET /api/companies - Listar todas as empresas
router.get('/', (req, res) => companyController.listAll(req, res));

// GET /api/companies/:id - Buscar empresa por ID
router.get('/:id', (req, res) => companyController.getById(req, res));

// GET /api/companies/cnpj/:cnpj - Buscar empresa por CNPJ
router.get('/cnpj/:cnpj', (req, res) => companyController.getByCnpj(req, res));

// POST /api/companies - Criar nova empresa
router.post('/', (req, res) => companyController.create(req, res));

// PUT /api/companies/:id - Atualizar empresa
router.put('/:id', (req, res) => companyController.update(req, res));

// DELETE /api/companies/:id - Deletar empresa
router.delete('/:id', (req, res) => companyController.delete(req, res));

export default router;
