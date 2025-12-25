const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Usa as rotas de autenticação/cadastro
app.use('/api', authRoutes);

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});