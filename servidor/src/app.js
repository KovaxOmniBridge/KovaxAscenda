/**
 * Configuração do Express App
 * Middlewares, rotas e configurações gerais
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { errorHandler } = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

// ==================== MIDDLEWARES ====================

// CORS: Permite requisições de qualquer origem (desenvolvimento)
app.use(cors());

// Body Parser: Permite receber JSON nas requisições
app.use(express.json());

// Static Files: Serve arquivos HTML/CSS/JS da raiz do projeto
app.use(express.static(path.join(__dirname, '..')));

// Logger: Log simples de todas as requisições para debug
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ==================== ROTAS ====================

// Rota raiz com informações da API
app.get('/', (req, res) => {
    res.json({
        name: 'Ascenda Flex API',
        version: '2.0.0',
        description: 'API para gestão organizacional híbrida',
        lastUpdate: '2025-11-05',
        architecture: 'MVC Pattern',
        documentation: {
            authentication: 'JWT Bearer Token (24h expiration)',
            publicEndpoints: [
                'GET /api/companies',
                'GET /api/companies/:id',
                'POST /api/companies',
                'POST /api/auth/login'
            ],
            protectedEndpoints: {
                users: 'CRUD completo de usuários',
                templates: 'Gerenciamento de templates organizacionais',
                squads: 'CRUD completo de squads e membros',
                chapters: 'CRUD completo de chapters e membros'
            },
            developerEndpoints: {
                prefix: '/api/dev/*',
                description: 'Endpoints sem autenticação para painel de desenvolvimento',
                note: 'NÃO USAR EM PRODUÇÃO'
            }
        },
        database: {
            type: 'SQLite',
            tables: 10,
            hierarchicalLevels: 8
        },
        features: [
            'Autenticação JWT',
            'Hierarquia 8 níveis (0-7)',
            'Squads ágeis multifuncionais',
            'Chapters (comunidades de prática)',
            'Templates organizacionais',
            'Painel de desenvolvedor'
        ]
    });
});

// Todas as rotas da API
app.use('/api', routes);

// ==================== ERROR HANDLER ====================

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

module.exports = app;
