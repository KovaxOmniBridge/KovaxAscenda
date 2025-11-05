import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import companyRoutes from './routes/companyRoutes';
import productRoutes from './routes/productRoutes';
import serviceRoutes from './routes/serviceRoutes';
import companySiteRoutes from './routes/companySiteRoutes';
import assetRoutes from './routes/assetRoutes';
import physicalUnitRoutes from './routes/physicalUnitRoutes';
import { createAuthRoutes } from './routes/authRoutes';
import { createEmployeeRoutes } from './routes/employeeRoutes';
import { createExecutiveRoutes } from './routes/executiveRoutes';
import { EmployeeRepository } from './repositories/EmployeeRepository';
import { ExecutiveParticipationRepository } from './repositories/ExecutiveParticipationRepository';
import { AuthService } from './services/AuthService';
import { EmployeeService } from './services/EmployeeService';
import { ExecutiveService } from './services/ExecutiveService';
import { AuthController } from './controllers/AuthController';
import { EmployeeController } from './controllers/EmployeeController';
import { ExecutiveController } from './controllers/ExecutiveController';

const app = express();
const PORT = process.env.PORT || 3001;

// Inicializar banco de dados
const db = new Database('ascenda.db');

// Inicializar repositórios
const employeeRepository = new EmployeeRepository(db);
const participationRepository = new ExecutiveParticipationRepository(db);

// Inicializar serviços
const authService = new AuthService(employeeRepository);
const employeeService = new EmployeeService(employeeRepository);
const executiveService = new ExecutiveService(participationRepository, employeeRepository, db);

// Inicializar controllers
const authController = new AuthController(authService, employeeService);
const employeeController = new EmployeeController(employeeService, authService);
const executiveController = new ExecutiveController(executiveService);

// Criar rotas
const authRoutes = createAuthRoutes(authController);
const employeeRoutes = createEmployeeRoutes(employeeController);
const executiveRoutes = createExecutiveRoutes(executiveController);

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentar limite para imagens Base64
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rotas
app.use('/api', companyRoutes);
app.use('/api', productRoutes);
app.use('/api', serviceRoutes);
app.use('/api', companySiteRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/units', physicalUnitRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/executive', executiveRoutes);

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor Ascenda rodando!' });
});

// Tratamento de rota não encontrada
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 API disponível em: http://localhost:${PORT}/api`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

export default app;
