/**
 * Rotas do Painel de Desenvolvedor
 * Todas as rotas são PÚBLICAS (sem autenticação)
 * NÃO USAR EM PRODUÇÃO
 */

const express = require('express');
const router = express.Router();
const devController = require('../controllers/dev.controller');

// Autenticação de desenvolvedores
router.post('/auth/register', devController.register);
router.post('/auth/login', devController.login);
router.get('/auth/verify', devController.verifyToken);
router.get('/auth/users', devController.listDevelopers);
router.delete('/auth/clear-all', devController.clearAllDevelopers);

// Gerenciamento de empresas
router.get('/companies', devController.listCompanies);
router.delete('/companies/:id', devController.deleteCompany);

// Visualização de dados
router.get('/table/:tableName', devController.viewTable);

// Limpeza de dados
router.post('/clear-all', devController.clearAllData);

module.exports = router;
