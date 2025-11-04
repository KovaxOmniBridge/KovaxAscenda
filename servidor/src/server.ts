import express, { Application } from 'express';
import cors from 'cors';
import companyRoutes from './routes/companyRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/companies', companyRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Ascenda - Gerenciamento de Empresas' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api/companies`);
});

export default app;
