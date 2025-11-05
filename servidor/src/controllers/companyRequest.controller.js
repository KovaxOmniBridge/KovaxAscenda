/**
 * Controller para Gerenciar Pedidos de Cadastro de Empresas
 */

const db = require('../config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Diretório para armazenar documentos
const DOCUMENTS_DIR = path.join(__dirname, '..', '..', 'uploads', 'company-documents');

// Garantir que o diretório existe
if (!fs.existsSync(DOCUMENTS_DIR)) {
    fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
}

/**
 * Listar todos os pedidos de cadastro
 * GET /api/company-requests
 */
const listRequests = async (req, res) => {
    const { status } = req.query;

    let query = 'SELECT * FROM company_requests';
    const params = [];

    if (status) {
        query += ' WHERE status = ?';
        params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar pedidos:', err);
            return res.status(500).json({ error: 'Erro ao buscar pedidos' });
        }

        // Parsear JSON dos dados armazenados
        const requests = rows.map(row => ({
            id: row.id,
            status: row.status,
            company: JSON.parse(row.company_data),
            president: JSON.parse(row.president_data),
            admins: JSON.parse(row.admins_data),
            documents: row.documents ? JSON.parse(row.documents) : [],
            rejectionReason: row.rejection_reason,
            reviewedBy: row.reviewed_by,
            reviewedAt: row.reviewed_at,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));

        res.json(requests);
    });
};

/**
 * Obter detalhes de um pedido específico
 * GET /api/company-requests/:id
 */
const getRequest = async (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM company_requests WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Erro ao buscar pedido:', err);
            return res.status(500).json({ error: 'Erro ao buscar pedido' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const request = {
            id: row.id,
            status: row.status,
            company: JSON.parse(row.company_data),
            president: JSON.parse(row.president_data),
            admins: JSON.parse(row.admins_data),
            documents: row.documents ? JSON.parse(row.documents) : [],
            rejectionReason: row.rejection_reason,
            reviewedBy: row.reviewed_by,
            reviewedAt: row.reviewed_at,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };

        res.json(request);
    });
};

/**
 * Criar novo pedido de cadastro
 * POST /api/company-requests
 */
const createRequest = async (req, res) => {
    try {
        const { company, president, admins } = req.body;

        // Parsear dados se vieram como string (FormData)
        const companyData = typeof company === 'string' ? JSON.parse(company) : company;
        const presidentData = typeof president === 'string' ? JSON.parse(president) : president;
        const adminsData = typeof admins === 'string' ? JSON.parse(admins) : admins;

        // Validações básicas
        if (!companyData || !presidentData || !adminsData) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        // Processar documentos enviados
        const documents = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                documents.push({
                    originalName: file.originalname,
                    filename: file.filename,
                    path: file.path,
                    size: file.size,
                    mimetype: file.mimetype
                });
            }
        }

        // Inserir pedido no banco
        db.run(`
            INSERT INTO company_requests (
                status, 
                company_data, 
                president_data, 
                admins_data, 
                documents
            )
            VALUES (?, ?, ?, ?, ?)
        `, [
            'pending',
            JSON.stringify(companyData),
            JSON.stringify(presidentData),
            JSON.stringify(adminsData),
            JSON.stringify(documents)
        ], function(err) {
            if (err) {
                console.error('Erro ao criar pedido:', err);
                return res.status(500).json({ error: 'Erro ao criar pedido de cadastro' });
            }

            res.status(201).json({
                message: 'Pedido de cadastro recebido com sucesso',
                requestId: this.lastID
            });
        });

    } catch (error) {
        console.error('Erro ao processar pedido:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

/**
 * Aprovar pedido de cadastro (cria empresa e usuários)
 * PATCH /api/company-requests/:id/approve
 */
const approveRequest = async (req, res) => {
    const { id } = req.params;
    const { reviewerId } = req.body; // ID do desenvolvedor que está aprovando

    try {
        // Buscar pedido
        db.get('SELECT * FROM company_requests WHERE id = ?', [id], async (err, request) => {
            if (err) {
                console.error('Erro ao buscar pedido:', err);
                return res.status(500).json({ error: 'Erro ao buscar pedido' });
            }

            if (!request) {
                return res.status(404).json({ error: 'Pedido não encontrado' });
            }

            if (request.status !== 'pending') {
                return res.status(400).json({ error: 'Este pedido já foi processado' });
            }

            // Parsear dados
            const company = JSON.parse(request.company_data);
            const president = JSON.parse(request.president_data);
            const admins = JSON.parse(request.admins_data);

            // Criar empresa e usuários (usar lógica do company.controller.js)
            db.serialize(() => {
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
                    company.website || `https://${company.name.toLowerCase().replace(/\s+/g, '')}.ascenda.com`,
                    company.description
                ], function(err) {
                    if (err) {
                        console.error('Erro ao criar empresa:', err);
                        return res.status(500).json({ error: 'Erro ao criar empresa' });
                    }

                    const companyId = this.lastID;
                    let insertedUsers = 0;
                    let totalUsers = 1 + admins.length;
                    let errorOccurred = false;

                    // Criar Presidente (Nível 0)
                    const salt = bcrypt.genSaltSync(10);
                    const presidentHash = bcrypt.hashSync(president.password, salt);

                    db.run(`
                        INSERT INTO users (company_id, name, email, phone, department, access_key, password, role, is_primary, nivel)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        companyId,
                        president.name,
                        president.email,
                        president.phone || '',
                        president.department || 'Presidência',
                        president.accessKey,
                        presidentHash,
                        president.role || 'Presidente',
                        1,
                        0
                    ], (err) => {
                        if (err) {
                            console.error('Erro ao criar presidente:', err);
                            return res.status(500).json({ error: 'Erro ao criar presidente' });
                        }

                        insertedUsers++;

                        // Criar Administradores (Nível 1)
                        admins.forEach(async (admin) => {
                            const adminHash = bcrypt.hashSync(admin.password, bcrypt.genSaltSync(10));

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
                                adminHash,
                                admin.role,
                                admin.isPrimary ? 1 : 0,
                                1
                            ], (err) => {
                                if (err && !errorOccurred) {
                                    errorOccurred = true;
                                    console.error('Erro ao criar admin:', err);
                                    return res.status(500).json({ error: 'Erro ao criar administradores' });
                                }

                                insertedUsers++;

                                // Se todos criados, atualizar pedido
                                if (insertedUsers === totalUsers && !errorOccurred) {
                                    db.run(`
                                        UPDATE company_requests 
                                        SET status = 'approved', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
                                        WHERE id = ?
                                    `, [reviewerId, id], (err) => {
                                        if (err) {
                                            console.error('Erro ao atualizar pedido:', err);
                                        }

                                        res.json({
                                            message: 'Pedido aprovado e empresa criada com sucesso',
                                            companyId: companyId
                                        });
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Erro ao aprovar pedido:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

/**
 * Rejeitar pedido de cadastro
 * PATCH /api/company-requests/:id/reject
 */
const rejectRequest = async (req, res) => {
    const { id } = req.params;
    const { reason, reviewerId } = req.body;

    if (!reason) {
        return res.status(400).json({ error: 'Motivo da rejeição é obrigatório' });
    }

    db.run(`
        UPDATE company_requests 
        SET status = 'rejected', rejection_reason = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status = 'pending'
    `, [reason, reviewerId, id], function(err) {
        if (err) {
            console.error('Erro ao rejeitar pedido:', err);
            return res.status(500).json({ error: 'Erro ao rejeitar pedido' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado ou já processado' });
        }

        res.json({ message: 'Pedido rejeitado com sucesso' });
    });
};

module.exports = {
    listRequests,
    getRequest,
    createRequest,
    approveRequest,
    rejectRequest
};
