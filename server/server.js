/**
 * =====================================================
 * ASCENDA PLATFORM - SERVIDOR PRINCIPAL
 * =====================================================
 * Servidor Express com autenticação e SQLite
 * =====================================================
 */

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { query, execute, testConnection } from './config/database-sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do servidor
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'ascenda-secret-key-2024';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta raiz do projeto
const staticPath = path.join(__dirname, '..');
app.use(express.static(staticPath));
console.log(`📁 Servindo arquivos estáticos de: ${staticPath}`);

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// =====================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// =====================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token não fornecido' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido ou expirado' 
      });
    }
    req.user = decoded;
    next();
  });
}

// =====================================================
// ROTAS DE AUTENTICAÇÃO
// =====================================================

/**
 * POST /api/auth/login/client
 * Login de clientes (usuários de organizações)
 */
app.post('/api/auth/login/client', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const result = query(
      `SELECT u.*, o.name as organization_name, o.slug as organization_slug
       FROM users u
       INNER JOIN organizations o ON u.organization_id = o.id
       WHERE u.email = ? AND u.is_active = 1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    const user = result.rows[0];

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Atualizar último login
    query(
      "UPDATE users SET last_login_at = datetime('now') WHERE id = ?",
      [user.id]
    );

    // Gerar token JWT (24 horas)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        organizationId: user.organization_id,
        type: 'client'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✓ Login bem-sucedido (CLIENT): ${email}`);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organization_id,
        organizationName: user.organization_name,
        organizationSlug: user.organization_slug,
        type: 'client'
      }
    });

  } catch (error) {
    console.error('Erro no login de cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar login'
    });
  }
});

/**
 * POST /api/auth/login/developer
 * Login de desenvolvedores
 */
app.post('/api/auth/login/developer', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar desenvolvedor
    const result = query(
      'SELECT * FROM developers WHERE email = ? AND is_active = 1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      console.log(`⚠ Tentativa de login com email não encontrado: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    const developer = result.rows[0];

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, developer.password_hash);
    if (!passwordMatch) {
      console.log(`⚠ Tentativa de login com senha incorreta: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Atualizar último login
    execute(
      "UPDATE developers SET last_login_at = datetime('now') WHERE id = ?",
      [developer.id]
    );

    // Gerar token JWT (2 horas)
    const token = jwt.sign(
      {
        developerId: developer.id,
        email: developer.email,
        role: developer.role,
        type: 'developer'
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log(`🔐 Login DEVELOPER bem-sucedido: ${email} | Role: ${developer.role}`);

    // Parse permissions (JSON string to object)
    let permissions = {};
    try {
      permissions = JSON.parse(developer.permissions);
    } catch (e) {
      permissions = {};
    }

    res.json({
      success: true,
      message: 'Login de desenvolvedor realizado com sucesso',
      token,
      user: {
        id: developer.id,
        name: developer.name,
        email: developer.email,
        role: developer.role,
        permissions,
        type: 'developer'
      }
    });

  } catch (error) {
    console.error('Erro no login de desenvolvedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar login'
    });
  }
});

/**
 * POST /api/auth/logout
 */
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

/**
 * GET /api/auth/verify
 */
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    let userData = null;

    if (req.user.type === 'developer') {
      const result = query(
        'SELECT id, name, email, role, permissions FROM developers WHERE id = ? AND is_active = 1',
        [req.user.developerId]
      );
      if (result.rows.length > 0) {
        const dev = result.rows[0];
        let permissions = {};
        try {
          permissions = JSON.parse(dev.permissions);
        } catch (e) {
          permissions = {};
        }
        userData = {
          ...dev,
          permissions,
          type: 'developer'
        };
      }
    } else {
      const result = query(
        `SELECT u.*, o.name as organization_name, o.slug as organization_slug
         FROM users u
         INNER JOIN organizations o ON u.organization_id = o.id
         WHERE u.id = ? AND u.is_active = 1`,
        [req.user.userId]
      );
      if (result.rows.length > 0) {
        const user = result.rows[0];
        userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          organizationId: user.organization_id,
          organizationName: user.organization_name,
          organizationSlug: user.organization_slug,
          type: 'client'
        };
      }
    }

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar autenticação'
    });
  }
});

// =====================================================
// ROTAS DE ORGANIZAÇÕES
// =====================================================

app.get('/api/organizations', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'developer') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas desenvolvedores podem listar todas as organizações.'
      });
    }

    const result = query('SELECT * FROM organizations ORDER BY name');

    res.json({
      success: true,
      organizations: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar organizações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar organizações'
    });
  }
});

// =====================================================
// ROTAS DE USUÁRIOS
// =====================================================

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    let result;

    if (req.user.type === 'developer') {
      result = query(
        `SELECT u.*, o.name as organization_name
         FROM users u
         INNER JOIN organizations o ON u.organization_id = o.id
         ORDER BY o.name, u.name`
      );
    } else {
      result = query(
        `SELECT u.*, o.name as organization_name
         FROM users u
         INNER JOIN organizations o ON u.organization_id = o.id
         WHERE u.organization_id = ?
         ORDER BY u.name`,
        [req.user.organizationId]
      );
    }

    res.json({
      success: true,
      users: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários'
    });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = query(
      `SELECT u.*, o.name as organization_name, o.slug as organization_slug
       FROM users u
       INNER JOIN organizations o ON u.organization_id = o.id
       WHERE u.id = ?`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const user = result.rows[0];

    if (req.user.type !== 'developer' && user.organization_id !== req.user.organizationId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário'
    });
  }
});

// =====================================================
// ROTAS DE FERRAMENTAS
// =====================================================

app.get('/api/tools/categories', async (req, res) => {
  try {
    const result = query('SELECT * FROM tool_categories ORDER BY display_order');

    res.json({
      success: true,
      categories: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar categorias'
    });
  }
});

app.get('/api/tools', async (req, res) => {
  try {
    const result = query(
      `SELECT t.*, tc.name as category_name, tc.key as category_key
       FROM tools t
       INNER JOIN tool_categories tc ON t.category_id = tc.id
       WHERE t.is_active = 1
       ORDER BY tc.display_order, t.name`
    );

    res.json({
      success: true,
      tools: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar ferramentas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar ferramentas'
    });
  }
});

app.get('/api/tools/category/:categoryKey', async (req, res) => {
  try {
    const { categoryKey } = req.params;

    const result = query(
      `SELECT t.*, tc.name as category_name, tc.key as category_key
       FROM tools t
       INNER JOIN tool_categories tc ON t.category_id = tc.id
       WHERE tc.key = ? AND t.is_active = 1
       ORDER BY t.name`,
      [categoryKey]
    );

    res.json({
      success: true,
      tools: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar ferramentas por categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar ferramentas'
    });
  }
});

// =====================================================
// ROTAS DE SAÚDE E INFORMAÇÕES
// =====================================================

app.get('/health', async (req, res) => {
  try {
    const dbResult = query("SELECT datetime('now') as now");
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'SQLite',
      dbTime: dbResult.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

app.get('/api', (req, res) => {
  res.json({
    name: 'Ascenda Platform API',
    version: '2.0.0',
    database: 'SQLite',
    endpoints: {
      auth: {
        'POST /api/auth/login/client': 'Login de clientes',
        'POST /api/auth/login/developer': 'Login de desenvolvedores',
        'POST /api/auth/logout': 'Logout',
        'GET /api/auth/verify': 'Verificar token'
      },
      organizations: {
        'GET /api/organizations': 'Listar organizações (dev only)'
      },
      users: {
        'GET /api/users': 'Listar usuários',
        'GET /api/users/:id': 'Obter usuário'
      },
      tools: {
        'GET /api/tools/categories': 'Listar categorias',
        'GET /api/tools': 'Listar ferramentas',
        'GET /api/tools/category/:categoryKey': 'Ferramentas por categoria'
      }
    }
  });
});

// Rota raiz - redireciona para index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function startServer() {
  try {
    console.log('\n🚀 Iniciando Ascenda Platform Server (SQLite)...\n');
    
    // Testar conexão com banco
    const dbConnected = testConnection();
    if (!dbConnected) {
      console.error('\n❌ Não foi possível conectar ao banco de dados');
      console.log('\n💡 Execute: npm run db:init:sqlite\n');
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n✓ Servidor rodando na porta ${PORT}`);
      console.log(`✓ API disponível em http://localhost:${PORT}/api`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ Banco de dados: SQLite\n`);
      console.log('📝 Endpoints disponíveis:');
      console.log('   POST /api/auth/login/client - Login de clientes');
      console.log('   POST /api/auth/login/developer - Login de desenvolvedores');
      console.log('   GET  /api/organizations - Listar organizações (dev)');
      console.log('   GET  /api/users - Listar usuários');
      console.log('   GET  /api/tools - Listar ferramentas\n');
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⏹ SIGTERM recebido, fechando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⏹ SIGINT recebido, fechando servidor...');
  process.exit(0);
});

// Iniciar
startServer();
