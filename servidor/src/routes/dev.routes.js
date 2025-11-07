/**
 * Rotas do Painel de Desenvolvedor
 * Rotas protegidas por autenticação JWT de desenvolvedor
 * Apenas após login de desenvolvedor
 * 
 * IMPORTANTE: Usa devAuth.middleware.js que valida tokens de desenvolvedor
 * Tokens de usuários normais são REJEITADOS
 */

const express = require('express');
const router = express.Router();
const devController = require('../controllers/dev.controller');
const { devAuth } = require('../middlewares/devAuth.middleware');
const { auditLog } = require('../middlewares/audit.middleware');

// ========================================
// ROTAS PÚBLICAS (Sem autenticação)
// ========================================

// Autenticação de desenvolvedores
router.post('/auth/register', devController.register);
router.post('/auth/login', devController.login);

// ========================================
// ROTAS PROTEGIDAS (Requer token de dev)
// Todas as rotas abaixo são auditadas
// BLOQUEIO: Usuários normais NÃO podem acessar
// ========================================

// Aplicar proteção de desenvolvedor em todas as rotas abaixo
router.use(devAuth);  // ← Middleware que bloqueia tokens de usuários normais
router.use(auditLog);

// Verificação e gestão de desenvolvedores
router.get('/auth/verify', devController.verifyToken);
router.get('/auth/users', devController.listDevelopers);
router.delete('/auth/clear-all', devController.clearAllDevelopers);

// Gerenciamento de empresas
router.get('/companies', devController.listCompanies);
router.put('/companies/:id/status', devController.updateCompanyStatus);
router.delete('/companies/:id', devController.deleteCompany);

// Gerenciamento de usuários, squads e chapters por empresa
router.get('/users/company/:companyId', devController.getUsersByCompany);
router.get('/squads/company/:companyId', devController.getSquadsByCompany);
router.get('/chapters/company/:companyId', devController.getChaptersByCompany);

// Visualização de dados
router.get('/table/:tableName', devController.viewTable);

// Limpeza de dados
router.post('/clear-all', devController.clearAllData);

// Personificação de usuários
router.post('/impersonate/:userId', devController.impersonateUser);

// Explorador de interfaces - criar sessão customizada
router.post('/explorer/auth/:companyId', devController.createExplorerSession);

// Logs de auditoria
router.get('/audit/logs', devController.getAuditLogsController);

module.exports = router;
