import express from 'express';
import cors from 'cors';
import companyRoutes from './routes/companyRoutes';
import productRoutes from './routes/productRoutes';
import serviceRoutes from './routes/serviceRoutes';
import companySiteRoutes from './routes/companySiteRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentar limite para imagens Base64
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rotas
app.use('/api', companyRoutes);
app.use('/api', productRoutes);
app.use('/api', serviceRoutes);
app.use('/api', companySiteRoutes);

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
