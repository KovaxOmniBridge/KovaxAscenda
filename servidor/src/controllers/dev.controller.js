/**
 * Controller do Painel de Desenvolvedor
 * Gerencia autenticação de devs e operações administrativas
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { getAuditLogs } = require('../middlewares/audit.middleware');

// Registrar desenvolvedor
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    db.get('SELECT id FROM dev_users WHERE email = ?', [email], async (err, existing) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar email' });
        if (existing) return res.status(400).json({ error: 'Email já cadastrado' });
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        db.run(`INSERT INTO dev_users (name, email, password, role) VALUES (?, ?, ?, ?)`, 
            [name, email, hashedPassword, role], function(err) {
            if (err) return res.status(500).json({ error: 'Erro ao criar desenvolvedor' });
            
            const devToken = jwt.sign(
                { 
                    devId: this.lastID, 
                    email, 
                    role,
                    isDeveloper: true  // Flag para identificar token de desenvolvedor
                }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );
            
            res.status(201).json({
                message: 'Desenvolvedor registrado com sucesso',
                devToken,
                developer: { id: this.lastID, name, email, role }
            });
        });
    });
};

// Login de desenvolvedor
const login = (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    db.get('SELECT * FROM dev_users WHERE email = ?', [email], (err, dev) => {
        if (err) return res.status(500).json({ error: 'Erro ao processar login' });
        if (!dev) return res.status(401).json({ error: 'Email ou senha incorretos' });
        
        const isValidPassword = bcrypt.compareSync(password, dev.password);
        if (!isValidPassword) return res.status(401).json({ error: 'Email ou senha incorretos' });
        
        db.run('UPDATE dev_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [dev.id]);
        
        const devToken = jwt.sign(
            { 
                devId: dev.id, 
                email: dev.email, 
                role: dev.role,
                isDeveloper: true  // Flag para identificar token de desenvolvedor
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.json({
            devToken,
            developer: { id: dev.id, name: dev.name, email: dev.email, role: dev.role }
        });
    });
};

// Verificar token
const verifyToken = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        res.json({ valid: true, developer: decoded });
    });
};

// Listar desenvolvedores
const listDevelopers = (req, res) => {
    db.all('SELECT id, name, email, role, created_at, last_login FROM dev_users ORDER BY name', [], (err, devs) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar desenvolvedores' });
        res.json(devs);
    });
};

// Listar empresas (sem autenticação)
const listCompanies = (req, res) => {
    db.all('SELECT * FROM companies ORDER BY name', [], (err, companies) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar empresas' });
        res.json(companies);
    });
};

// Deletar empresa
const deleteCompany = (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM companies WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao deletar empresa' });
        res.json({ message: 'Empresa deletada com sucesso', deletedRows: this.changes });
    });
};

// Alterar status da empresa
const updateCompanyStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validar status
    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status inválido. Use: active, inactive ou suspended' });
    }
    
    db.run('UPDATE companies SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
        [status, id], 
        function(err) {
            if (err) return res.status(500).json({ error: 'Erro ao atualizar status' });
            if (this.changes === 0) return res.status(404).json({ error: 'Empresa não encontrada' });
            res.json({ message: 'Status atualizado com sucesso', status });
        }
    );
};

// Limpar todos desenvolvedores
const clearAllDevelopers = (req, res) => {
    db.run('DELETE FROM dev_users', function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao limpar registros' });
        res.json({ message: 'Todos os desenvolvedores foram deletados', deletedRows: this.changes });
    });
};

// Visualizar tabela
const viewTable = (req, res) => {
    const { tableName } = req.params;
    
    const allowedTables = ['companies', 'users', 'countries', 'organization_templates', 
                          'squads', 'squad_members', 'chapters', 'chapter_members', 'squad_goals', 'dev_users'];
    
    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: 'Tabela não permitida' });
    }
    
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar dados' });
        res.json(rows);
    });
};

// Limpar todos os dados (exceto empresa demo)
const clearAllData = (req, res) => {
    db.serialize(() => {
        db.run('DELETE FROM companies WHERE id != 1', (err) => {
            if (err) return res.status(500).json({ error: 'Erro ao limpar dados' });
            
            db.run('DELETE FROM users WHERE company_id NOT IN (SELECT id FROM companies)');
            db.run('DELETE FROM organization_templates WHERE company_id NOT IN (SELECT id FROM companies)');
            db.run('DELETE FROM squads WHERE company_id NOT IN (SELECT id FROM companies)');
            db.run('DELETE FROM chapters WHERE company_id NOT IN (SELECT id FROM companies)');
            
            res.json({ message: 'Dados limpos com sucesso (empresa demo mantida)' });
        });
    });
};

// Personificar usuário (gerar token como se fosse o usuário)
const impersonateUser = (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ error: 'ID do usuário não fornecido' });
    }
    
    // Buscar usuário completo com dados da empresa
    db.get(`
        SELECT u.*, c.name as company_name, c.legal_name, c.industry, c.size, c.website
        FROM users u
        JOIN companies c ON u.company_id = c.id
        WHERE u.id = ?
    `, [userId], (err, user) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        // Buscar nome do desenvolvedor
        const devName = req.developer.name || 'Desenvolvedor';
        
        // Gerar token JWT como se fosse o usuário
        const userToken = jwt.sign(
            {
                userId: user.id,
                companyId: user.company_id,
                accessKey: user.access_key,
                role: user.role,
                nivel: user.nivel || 1,
                impersonatedBy: req.developer.devId,  // Registra quem personificou
                isDevMode: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Definir dashboard baseado no nível do usuário
        const dashboards = {
            0: '/Nivel00-Presidentes/dashboard-presidentes.html',
            1: '/Nivel01-AdministradoresGerais/dashboard-admin.html',
            2: '/Nivel02-DiretoresExecutivos/dashboard-diretores.html',
            3: '/Nivel03-Gerentes/dashboard-gerentes.html',
            4: '/Nivel04-Coordenadores/dashboard-coordenadores.html',
            5: '/Nivel05-Supervisores/dashboard-supervisores.html',
            6: '/Nivel06-Especialistas/dashboard-especialistas.html',
            7: '/Nivel07-Operacional/dashboard-operacional.html'
        };
        
        const dashboardPath = dashboards[user.nivel] || dashboards[1];
        
        // Preparar dados completos da sessão (SEM A SENHA)
        const sessionData = {
            token: userToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || null,
                department: user.department || null,
                access_key: user.access_key,
                role: user.role,
                nivel: user.nivel || 1,
                company_id: user.company_id,
                superior_id: user.superior_id || null,
                is_primary: user.is_primary === 1
            },
            company: {
                id: user.company_id,
                name: user.company_name,
                legal_name: user.legal_name || null,
                industry: user.industry || null,
                size: user.size || null,
                website: user.website || null
            },
            devMode: 'true',
            impersonatedBy: devName
        };
        
        // Codificar dados em Base64 para passar na URL
        const sessionEncoded = Buffer.from(JSON.stringify(sessionData)).toString('base64');
        
        // Criar URL completa que já abre o dashboard com dados na query string
        const fullUrl = `${dashboardPath}?impersonate=${encodeURIComponent(sessionEncoded)}`;
        
        // Retornar dados para o frontend
        res.json({
            success: true,
            message: `Impersonation ativado para: ${user.name}`,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                nivel: user.nivel || 1,
                role: user.role
            },
            company: {
                id: user.company_id,
                name: user.company_name
            },
            dashboardUrl: fullUrl,  // URL direta do dashboard com dados
            dashboardPath: dashboardPath,
            sessionData: sessionEncoded
        });
        
        console.log(`✅ Impersonation: ${devName} -> ${user.name} (Nível ${user.nivel})`);
    });
};

// Controller para obter logs de auditoria// Visualizar logs de auditoria
const getAuditLogsController = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const logs = await getAuditLogs(limit);
        
        res.json({
            total: logs.length,
            limit,
            logs
        });
    } catch (error) {
        console.error('Erro ao buscar logs:', error);
        res.status(500).json({ error: 'Erro ao buscar logs de auditoria' });
    }
};

// Listar usuários de uma empresa
const getUsersByCompany = (req, res) => {
    const { companyId } = req.params;
    
    db.all('SELECT * FROM users WHERE company_id = ? ORDER BY name', [companyId], (err, users) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar usuários' });
        res.json(users);
    });
};

// Listar squads de uma empresa
const getSquadsByCompany = (req, res) => {
    const { companyId } = req.params;
    
    db.all('SELECT * FROM squads WHERE company_id = ? ORDER BY name', [companyId], (err, squads) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar squads' });
        res.json(squads);
    });
};

// Listar chapters de uma empresa
const getChaptersByCompany = (req, res) => {
    const { companyId } = req.params;
    
    db.all('SELECT * FROM chapters WHERE company_id = ? ORDER BY name', [companyId], (err, chapters) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar chapters' });
        res.json(chapters);
    });
};

// Criar sessão customizada para explorador de interfaces
const createExplorerSession = (req, res) => {
    const { companyId } = req.params;
    const { interfacePath } = req.body;
    
    // Validar dados obrigatórios
    if (!companyId) {
        return res.status(400).json({ error: 'ID da empresa é obrigatório' });
    }
    
    if (!interfacePath) {
        return res.status(400).json({ error: 'Caminho da interface é obrigatório' });
    }
    
    // Detectar nível baseado no caminho da interface
    const nivelMatch = interfacePath.match(/Nivel(\d{2})/);
    const nivel = nivelMatch ? parseInt(nivelMatch[1]) : 1;
    
    // Usuário geral padrão do explorador
    const name = 'Explorador Geral';
    const email = 'explorador@ascenda.dev';
    const role = 'God Mode Explorer';
    
    // Buscar dados da empresa
    db.get('SELECT * FROM companies WHERE id = ?', [companyId], (err, company) => {
        if (err) {
            console.error('Erro ao buscar empresa:', err);
            return res.status(500).json({ error: 'Erro ao buscar empresa' });
        }
        
        if (!company) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }
        
        // Buscar nome do desenvolvedor
        const devName = req.developer.name || 'Desenvolvedor';
        
        // Gerar token JWT temporário para sessão do explorador
        const explorerToken = jwt.sign(
            {
                userId: `explorer-${Date.now()}`, // ID único temporário
                companyId: company.id,
                accessKey: 'EXPLORER_FULL_ACCESS',
                role: role,
                nivel: nivel,
                isExplorer: true, // Flag identificando sessão do explorador
                impersonatedBy: req.developer.devId,
                isDevMode: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Preparar dados da sessão customizada
        const sessionData = {
            token: explorerToken,
            user: {
                id: `explorer-${Date.now()}`,
                name: name,
                email: email,
                phone: null,
                department: 'Explorador',
                access_key: 'EXPLORER_FULL_ACCESS',
                role: role,
                nivel: nivel,
                company_id: company.id,
                superior_id: null,
                is_primary: false,
                isExplorer: true
            },
            company: {
                id: company.id,
                name: company.name,
                legal_name: company.legal_name || null,
                industry: company.industry || null,
                size: company.size || null,
                website: company.website || null
            },
            devMode: 'true',
            explorerMode: 'true',
            impersonatedBy: devName
        };
        
        // Codificar dados em Base64 para passar na URL
        const sessionEncoded = Buffer.from(JSON.stringify(sessionData)).toString('base64');
        
        // Criar URL completa que já abre a interface com dados na query string
        const fullUrl = `${interfacePath}?impersonate=${encodeURIComponent(sessionEncoded)}`;
        
        // Retornar dados para o frontend
        res.json({
            success: true,
            message: `Sessão de explorador criada para: ${company.name}`,
            user: {
                name: name,
                email: email,
                nivel: nivel,
                role: role
            },
            company: {
                id: company.id,
                name: company.name
            },
            dashboardUrl: fullUrl,
            dashboardPath: interfacePath,
            sessionData: sessionEncoded
        });
        
        console.log(`🎨 Explorer: ${devName} -> ${company.name} (${interfacePath})`);
    });
};

module.exports = {
    register,
    login,
    verifyToken,
    listDevelopers,
    listCompanies,
    deleteCompany,
    updateCompanyStatus,
    clearAllDevelopers,
    viewTable,
    clearAllData,
    impersonateUser,
    getAuditLogsController,
    getUsersByCompany,
    getSquadsByCompany,
    getChaptersByCompany,
    createExplorerSession
};
