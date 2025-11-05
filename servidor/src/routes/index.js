/**
 * Rotas Principais da API
 * Agregador de todas as rotas por domínio
 */

const express = require('express');
const router = express.Router();

// Importar rotas por domínio
const authRoutes = require('./auth.routes');
const companyRoutes = require('./company.routes');
const userRoutes = require('./user.routes');
const squadRoutes = require('./squad.routes');
const chapterRoutes = require('./chapter.routes');
const templateRoutes = require('./template.routes');
const devRoutes = require('./dev.routes');

// Usar rotas
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/users', userRoutes);
router.use('/squads', squadRoutes);
router.use('/chapters', chapterRoutes);
router.use('/templates', templateRoutes);
router.use('/dev', devRoutes);

// Rota de health check
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API funcionando',
        architecture: 'MVC Pattern',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
