import express from 'express';
import cors from 'cors';
import companyRoutes from './routes/companyRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', companyRoutes);

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
