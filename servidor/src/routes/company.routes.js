/**
 * Rotas de Empresas
 */

const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

// Rotas públicas
router.get('/', companyController.listCompanies);
router.get('/:id', companyController.getCompany);
router.post('/', companyController.createCompany);

module.exports = router;
