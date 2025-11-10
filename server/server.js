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

// Criar nova organização (apenas desenvolvedores)
app.post('/api/organizations', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'developer') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas desenvolvedores podem criar organizações.'
      });
    }

    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Nome e slug são obrigatórios'
      });
    }

    // Verificar se slug já existe
    const existing = query('SELECT id FROM organizations WHERE slug = ?', [slug]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Slug já está em uso'
      });
    }

    const id = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    query(
      `INSERT INTO organizations (id, name, slug, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [id, name, slug, 'ativo']
    );

    const newOrg = query('SELECT * FROM organizations WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      organization: newOrg.rows[0],
      message: 'Organização criada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar organização:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar organização'
    });
  }
});

// Atualizar status de organização (apenas desenvolvedores)
app.put('/api/organizations/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'developer') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas desenvolvedores podem alterar status.'
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ativo', 'pausa', 'desativado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido. Use: ativo, pausa ou desativado'
      });
    }

    query(
      `UPDATE organizations SET status = ?, updated_at = datetime('now') WHERE id = ?`,
      [status, id]
    );

    const updated = query('SELECT * FROM organizations WHERE id = ?', [id]);

    res.json({
      success: true,
      organization: updated.rows[0],
      message: 'Status atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status'
    });
  }
});

// Atualizar organização completa (apenas desenvolvedores)
app.put('/api/organizations/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'developer') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas desenvolvedores podem editar organizações.'
      });
    }

    const { id } = req.params;
    const { name, slug, status } = req.body;

    // Verificar se slug já está em uso por outra organização
    if (slug) {
      const existing = query('SELECT id FROM organizations WHERE slug = ? AND id != ?', [slug, id]);
      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Slug já está em uso'
        });
      }
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (slug) {
      updates.push('slug = ?');
      values.push(slug);
    }
    if (status) {
      const validStatuses = ['ativo', 'pausa', 'desativado'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status inválido. Use: ativo, pausa ou desativado'
        });
      }
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    updates.push("updated_at = datetime('now')");
    values.push(id);

    query(
      `UPDATE organizations SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updated = query('SELECT * FROM organizations WHERE id = ?', [id]);

    res.json({
      success: true,
      organization: updated.rows[0],
      message: 'Organização atualizada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar organização:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar organização'
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
// ROTAS DE CARGOS (POSITIONS)
// =====================================================

// Listar cargos da organização
app.get('/api/positions', authenticateToken, async (req, res) => {
  try {
    let orgId;

    if (req.user.type === 'developer') {
      // Desenvolvedor precisa passar organization_id como query param
      orgId = req.query.organization_id;
      if (!orgId) {
        return res.status(400).json({
          success: false,
          message: 'organization_id é obrigatório para desenvolvedores'
        });
      }
    } else {
      // Usuário comum vê apenas cargos da sua organização
      orgId = req.user.organization_id;
    }

    const result = query(
      `SELECT p.*,
        (SELECT COUNT(*) FROM users WHERE position_id = p.id) as users_count,
        (SELECT COUNT(*) FROM position_tool_permissions WHERE position_id = p.id) as tools_count
       FROM positions p
       WHERE p.organization_id = ?
       ORDER BY p.name`,
      [orgId]
    );

    res.json({
      success: true,
      positions: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar cargos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar cargos'
    });
  }
});

// Criar cargo
app.post('/api/positions', authenticateToken, async (req, res) => {
  try {
    const { name, description, tool_ids } = req.body;
    
    let orgId;
    if (req.user.type === 'developer') {
      orgId = req.body.organization_id;
      if (!orgId) {
        return res.status(400).json({
          success: false,
          message: 'organization_id é obrigatório'
        });
      }
    } else {
      orgId = req.user.organization_id;
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nome do cargo é obrigatório'
      });
    }

    // Verificar se cargo já existe
    const existing = query(
      'SELECT id FROM positions WHERE organization_id = ? AND name = ?',
      [orgId, name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um cargo com este nome'
      });
    }

    const positionId = `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Criar cargo
    execute(
      `INSERT INTO positions (id, organization_id, name, description, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      [positionId, orgId, name, description || null]
    );

    // Adicionar permissões de ferramentas
    if (Array.isArray(tool_ids) && tool_ids.length > 0) {
      for (const toolId of tool_ids) {
        const permId = `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        execute(
          `INSERT INTO position_tool_permissions (id, position_id, tool_id, can_access, created_at)
           VALUES (?, ?, ?, 1, datetime('now'))`,
          [permId, positionId, toolId]
        );
      }
    }

    const newPosition = query('SELECT * FROM positions WHERE id = ?', [positionId]);

    res.status(201).json({
      success: true,
      position: newPosition.rows[0],
      message: 'Cargo criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar cargo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar cargo'
    });
  }
});

// Obter detalhes do cargo com ferramentas
app.get('/api/positions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const position = query('SELECT * FROM positions WHERE id = ?', [id]);
    
    if (position.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cargo não encontrado'
      });
    }

    // Buscar ferramentas do cargo
    const tools = query(
      `SELECT t.*, ptp.can_access
       FROM position_tool_permissions ptp
       INNER JOIN tools t ON ptp.tool_id = t.id
       WHERE ptp.position_id = ?
       ORDER BY t.name`,
      [id]
    );

    res.json({
      success: true,
      position: {
        ...position.rows[0],
        tools: tools.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar cargo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cargo'
    });
  }
});

// Atualizar cargo
app.put('/api/positions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_active, tool_ids } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active ? 1 : 0);
    }

    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      values.push(id);

      execute(
        `UPDATE positions SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Atualizar permissões de ferramentas se fornecido
    if (Array.isArray(tool_ids)) {
      // Remover permissões antigas
      execute('DELETE FROM position_tool_permissions WHERE position_id = ?', [id]);

      // Adicionar novas permissões
      for (const toolId of tool_ids) {
        const permId = `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        execute(
          `INSERT INTO position_tool_permissions (id, position_id, tool_id, can_access, created_at)
           VALUES (?, ?, ?, 1, datetime('now'))`,
          [permId, id, toolId]
        );
      }
    }

    const updated = query('SELECT * FROM positions WHERE id = ?', [id]);

    res.json({
      success: true,
      position: updated.rows[0],
      message: 'Cargo atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar cargo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar cargo'
    });
  }
});

// Deletar cargo
app.delete('/api/positions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se há usuários com este cargo
    const users = query('SELECT COUNT(*) as count FROM users WHERE position_id = ?', [id]);
    
    if (users.rows[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Não é possível deletar. Existem ${users.rows[0].count} usuário(s) com este cargo`
      });
    }

    execute('DELETE FROM positions WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Cargo deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar cargo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar cargo'
    });
  }
});

// Criar usuário
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { name, email, password, position_id } = req.body;
    
    let orgId;
    if (req.user.type === 'developer') {
      orgId = req.body.organization_id;
      if (!orgId) {
        return res.status(400).json({
          success: false,
          message: 'organization_id é obrigatório'
        });
      }
    } else {
      orgId = req.user.organization_id;
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // Verificar se email já existe na organização
    const existing = query(
      'SELECT id FROM users WHERE organization_id = ? AND email = ?',
      [orgId, email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um usuário com este email nesta organização'
      });
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = await bcrypt.hash(password, 10);

    execute(
      `INSERT INTO users (id, organization_id, name, email, password_hash, position_id, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      [userId, orgId, name, email, passwordHash, position_id || null]
    );

    const newUser = query(
      `SELECT u.*, o.name as organization_name, p.name as position_name
       FROM users u
       LEFT JOIN organizations o ON u.organization_id = o.id
       LEFT JOIN positions p ON u.position_id = p.id
       WHERE u.id = ?`,
      [userId]
    );

    // Remover password_hash da resposta
    const user = newUser.rows[0];
    delete user.password_hash;

    res.status(201).json({
      success: true,
      user,
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário'
    });
  }
});

// Atualizar usuário
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, position_id, is_active } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password !== undefined && password !== '') {
      const passwordHash = await bcrypt.hash(password, 10);
      updates.push('password_hash = ?');
      values.push(passwordHash);
    }
    if (position_id !== undefined) {
      updates.push('position_id = ?');
      values.push(position_id);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    updates.push("updated_at = datetime('now')");
    values.push(id);

    execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updated = query(
      `SELECT u.*, o.name as organization_name, p.name as position_name
       FROM users u
       LEFT JOIN organizations o ON u.organization_id = o.id
       LEFT JOIN positions p ON u.position_id = p.id
       WHERE u.id = ?`,
      [id]
    );

    const user = updated.rows[0];
    delete user.password_hash;

    res.json({
      success: true,
      user,
      message: 'Usuário atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário'
    });
  }
});

// Deletar usuário
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar usuário'
    });
  }
});

// =====================================================
// ROTAS DE PREFERÊNCIAS DE FERRAMENTAS (USER)
// =====================================================

// Listar ferramentas disponíveis para o usuário (baseado no cargo)
app.get('/api/user/available-tools', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar usuário e seu cargo
    const user = query('SELECT position_id FROM users WHERE id = ?', [userId]);
    
    if (user.rows.length === 0 || !user.rows[0].position_id) {
      return res.json({
        success: true,
        tools: [],
        message: 'Usuário não possui cargo definido'
      });
    }

    const positionId = user.rows[0].position_id;

    // Buscar ferramentas permitidas pelo cargo
    const tools = query(
      `SELECT 
        t.*,
        tc.name as category_name,
        tc.icon as category_icon,
        COALESCE(utp.is_enabled, 0) as user_enabled,
        utp.id as preference_id
       FROM position_tool_permissions ptp
       INNER JOIN tools t ON ptp.tool_id = t.id
       INNER JOIN tool_categories tc ON t.category_id = tc.id
       LEFT JOIN user_tool_preferences utp ON utp.tool_id = t.id AND utp.user_id = ?
       WHERE ptp.position_id = ? AND t.is_active = 1
       ORDER BY tc.display_order, t.display_order, t.name`,
      [userId, positionId]
    );

    // Agrupar por categoria
    const toolsByCategory = tools.rows.reduce((acc, tool) => {
      const categoryKey = tool.category_name || 'Outros';
      if (!acc[categoryKey]) {
        acc[categoryKey] = {
          name: categoryKey,
          icon: tool.category_icon || '📦',
          tools: []
        };
      }
      acc[categoryKey].tools.push({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        icon: tool.icon,
        url: tool.url,
        enabled: Boolean(tool.user_enabled),
        preference_id: tool.preference_id
      });
      return acc;
    }, {});

    res.json({
      success: true,
      tools: tools.rows,
      toolsByCategory: Object.values(toolsByCategory),
      totalAvailable: tools.rows.length,
      totalEnabled: tools.rows.filter(t => t.user_enabled).length
    });

  } catch (error) {
    console.error('Erro ao listar ferramentas disponíveis:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar ferramentas'
    });
  }
});

// Salvar preferências de ferramentas do usuário
app.post('/api/user/tool-preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { tool_ids } = req.body; // Array de IDs das ferramentas que o usuário quer habilitar

    if (!Array.isArray(tool_ids)) {
      return res.status(400).json({
        success: false,
        message: 'tool_ids deve ser um array'
      });
    }

    // Buscar usuário e seu cargo
    const user = query('SELECT position_id FROM users WHERE id = ?', [userId]);
    
    if (user.rows.length === 0 || !user.rows[0].position_id) {
      return res.status(400).json({
        success: false,
        message: 'Usuário não possui cargo definido'
      });
    }

    const positionId = user.rows[0].position_id;

    // Buscar todas as ferramentas permitidas pelo cargo
    const allowedTools = query(
      `SELECT tool_id FROM position_tool_permissions WHERE position_id = ?`,
      [positionId]
    );

    const allowedToolIds = allowedTools.rows.map(t => t.tool_id);

    // Validar que todas as ferramentas solicitadas são permitidas
    const invalidTools = tool_ids.filter(id => !allowedToolIds.includes(id));
    if (invalidTools.length > 0) {
      return res.status(403).json({
        success: false,
        message: 'Algumas ferramentas não são permitidas para seu cargo'
      });
    }

    // Remover todas as preferências antigas
    execute('DELETE FROM user_tool_preferences WHERE user_id = ?', [userId]);

    // Adicionar novas preferências
    for (const toolId of tool_ids) {
      const prefId = `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      execute(
        `INSERT INTO user_tool_preferences (id, user_id, tool_id, is_enabled, created_at)
         VALUES (?, ?, ?, 1, datetime('now'))`,
        [prefId, userId, toolId]
      );
    }

    res.json({
      success: true,
      message: 'Preferências salvas com sucesso',
      enabled_count: tool_ids.length
    });

  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao salvar preferências'
    });
  }
});

// Listar apenas ferramentas ativas do usuário (para exibir no dashboard)
app.get('/api/user/my-tools', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const tools = query(
      `SELECT 
        t.*,
        tc.name as category_name,
        tc.icon as category_icon
       FROM user_tool_preferences utp
       INNER JOIN tools t ON utp.tool_id = t.id
       INNER JOIN tool_categories tc ON t.category_id = tc.id
       WHERE utp.user_id = ? AND utp.is_enabled = 1 AND t.is_active = 1
       ORDER BY tc.display_order, t.display_order, t.name`,
      [userId]
    );

    // Agrupar por categoria
    const toolsByCategory = tools.rows.reduce((acc, tool) => {
      const categoryKey = tool.category_name || 'Outros';
      if (!acc[categoryKey]) {
        acc[categoryKey] = {
          name: categoryKey,
          icon: tool.category_icon || '📦',
          tools: []
        };
      }
      acc[categoryKey].tools.push(tool);
      return acc;
    }, {});

    res.json({
      success: true,
      tools: tools.rows,
      toolsByCategory: Object.values(toolsByCategory)
    });

  } catch (error) {
    console.error('Erro ao listar minhas ferramentas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar ferramentas'
    });
  }
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
