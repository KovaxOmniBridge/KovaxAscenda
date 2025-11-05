/**
 * Controller do Painel de Desenvolvedor
 * Gerencia autenticação de devs e operações administrativas
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

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
            
            const devToken = jwt.sign({ devId: this.lastID, email, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
            
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
        
        const devToken = jwt.sign({ devId: dev.id, email: dev.email, role: dev.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
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

module.exports = {
    register,
    login,
    verifyToken,
    listDevelopers,
    listCompanies,
    deleteCompany,
    clearAllDevelopers,
    viewTable,
    clearAllData
};
