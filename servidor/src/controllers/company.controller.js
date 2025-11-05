/**
 * Controller de Empresas
 * Gerencia CRUD de empresas
 */

const bcrypt = require('bcryptjs');
const db = require('../config/database');

/**
 * Listar todas as empresas
 * GET /api/companies
 */
const listCompanies = (req, res) => {
    db.all('SELECT id, name FROM companies ORDER BY name', [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar empresas:', err);
            return res.status(500).json({ error: 'Erro ao buscar empresas' });
        }
        res.json(rows);
    });
};

/**
 * Obter detalhes de uma empresa
 * GET /api/companies/:id
 */
const getCompany = (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM companies WHERE id = ?', [id], (err, company) => {
        if (err) {
            console.error('Erro ao buscar empresa:', err);
            return res.status(500).json({ error: 'Erro ao buscar empresa' });
        }
        if (!company) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }
        res.json(company);
    });
};

/**
 * Criar nova empresa com administradores
 * POST /api/companies
 */
const createCompany = async (req, res) => {
    const { company, admins } = req.body;

    // Validações básicas
    if (!company || !admins || admins.length === 0) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Verificar se há pelo menos um admin principal
    const hasPrimary = admins.some(admin => admin.isPrimary);
    if (!hasPrimary) {
        return res.status(400).json({ error: 'Defina pelo menos um administrador principal' });
    }

    try {
        db.serialize(async () => {
            // Inserir empresa
            db.run(`
                INSERT INTO companies (name, legal_name, founded_year, size, industry, website, description)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                company.name,
                company.legalName,
                company.foundedYear,
                company.size,
                company.industry,
                company.website,
                company.description
            ], function(err) {
                if (err) {
                    console.error('Erro ao inserir empresa:', err);
                    return res.status(500).json({ error: 'Erro ao criar empresa' });
                }

                const companyId = this.lastID;
                let insertedAdmins = 0;
                let errorOccurred = false;

                // Inserir administradores
                admins.forEach(async (admin) => {
                    db.get('SELECT id FROM users WHERE access_key = ?', [admin.accessKey], async (err, existingUser) => {
                        if (err) {
                            console.error('Erro ao verificar access_key:', err);
                            if (!errorOccurred) {
                                errorOccurred = true;
                                return res.status(500).json({ error: 'Erro ao verificar chave de acesso' });
                            }
                            return;
                        }

                        if (existingUser) {
                            if (!errorOccurred) {
                                errorOccurred = true;
                                return res.status(400).json({ error: `Chave de acesso "${admin.accessKey}" já está em uso` });
                            }
                            return;
                        }

                        // Hash da senha com bcrypt
                        const salt = bcrypt.genSaltSync(10);
                        const hashedPassword = bcrypt.hashSync(admin.password, salt);

                        // Inserir usuário
                        db.run(`
                            INSERT INTO users (company_id, name, email, phone, department, access_key, password, role, is_primary, nivel)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, [
                            companyId,
                            admin.name,
                            admin.email,
                            admin.phone,
                            admin.department,
                            admin.accessKey,
                            hashedPassword,
                            admin.role,
                            admin.isPrimary ? 1 : 0,
                            1 // Nível 1 - Administradores Gerais
                        ], (err) => {
                            if (err) {
                                console.error('Erro ao inserir administrador:', err);
                                if (!errorOccurred) {
                                    errorOccurred = true;
                                    return res.status(500).json({ error: 'Erro ao criar administradores' });
                                }
                                return;
                            }

                            insertedAdmins++;

                            // Se todos os admins foram inseridos com sucesso
                            if (insertedAdmins === admins.length && !errorOccurred) {
                                res.status(201).json({
                                    message: 'Empresa cadastrada com sucesso',
                                    companyId: companyId
                                });
                            }
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Erro ao processar cadastro:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = {
    listCompanies,
    getCompany,
    createCompany
};
