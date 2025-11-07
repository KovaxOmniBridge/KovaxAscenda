/**
 * Schema do Banco de Dados
 * Define todas as tabelas e suas estruturas
 */

const db = require('../config/database');

/**
 * Inicializa todas as tabelas do banco de dados
 */
function initializeSchema() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Array de todas as queries CREATE TABLE
            const tables = [
                // Tabela de Empresas
                {
                    name: 'companies',
                    sql: `CREATE TABLE IF NOT EXISTS companies (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        legal_name TEXT NOT NULL,
                        founded_year INTEGER NOT NULL,
                        size TEXT NOT NULL,
                        industry TEXT NOT NULL,
                        website TEXT NOT NULL,
                        description TEXT NOT NULL,
                        status TEXT DEFAULT 'active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )`
                },

                // Tabela de Usuários
                {
                    name: 'users',
                    sql: `CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        company_id INTEGER NOT NULL,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        phone TEXT NOT NULL,
                        department TEXT NOT NULL,
                        access_key TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        role TEXT NOT NULL DEFAULT 'Administrador Geral',
                        is_primary INTEGER DEFAULT 0,
                        nivel INTEGER DEFAULT 1,
                        superior_id INTEGER,
                        additional_roles TEXT,
                        can_switch_roles INTEGER DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                        FOREIGN KEY (superior_id) REFERENCES users(id) ON DELETE SET NULL
                    )`
                },

                // Tabela de Países/Filiais (deprecated mas mantida para compatibilidade)
                {
                    name: 'countries',
                    sql: `CREATE TABLE IF NOT EXISTS countries (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        company_id INTEGER NOT NULL,
                        country TEXT NOT NULL,
                        tax_id TEXT,
                        city TEXT,
                        address TEXT,
                        phone TEXT,
                        is_headquarters INTEGER DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
                    )`
                },

                // Tabela de Templates Organizacionais
                {
                    name: 'organization_templates',
                    sql: `CREATE TABLE IF NOT EXISTS organization_templates (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        company_id INTEGER NOT NULL UNIQUE,
                        template_type TEXT NOT NULL DEFAULT 'corporate',
                        active_levels TEXT NOT NULL DEFAULT '0,1,2,3,4,5,6,7',
                        level_names TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
                    )`
                },

                // Tabela de Squads
                {
                    name: 'squads',
                    sql: `CREATE TABLE IF NOT EXISTS squads (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        company_id INTEGER NOT NULL,
                        name TEXT NOT NULL,
                        description TEXT,
                        squad_type TEXT NOT NULL DEFAULT 'product',
                        status TEXT NOT NULL DEFAULT 'active',
                        start_date DATE NOT NULL,
                        end_date DATE,
                        created_by INTEGER,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
                    )`
                },

                // Tabela de Membros de Squads
                {
                    name: 'squad_members',
                    sql: `CREATE TABLE IF NOT EXISTS squad_members (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        squad_id INTEGER NOT NULL,
                        user_id INTEGER NOT NULL,
                        role TEXT NOT NULL DEFAULT 'member',
                        allocation_percent INTEGER DEFAULT 100,
                        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        left_at DATETIME,
                        FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )`
                },

                // Tabela de Chapters
                {
                    name: 'chapters',
                    sql: `CREATE TABLE IF NOT EXISTS chapters (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        company_id INTEGER NOT NULL,
                        name TEXT NOT NULL,
                        description TEXT,
                        specialty TEXT NOT NULL,
                        lead_user_id INTEGER,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                        FOREIGN KEY (lead_user_id) REFERENCES users(id) ON DELETE SET NULL
                    )`
                },

                // Tabela de Membros de Chapters
                {
                    name: 'chapter_members',
                    sql: `CREATE TABLE IF NOT EXISTS chapter_members (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        chapter_id INTEGER NOT NULL,
                        user_id INTEGER NOT NULL,
                        role TEXT NOT NULL DEFAULT 'member',
                        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )`
                },

                // Tabela de Metas/Objetivos de Squads
                {
                    name: 'squad_goals',
                    sql: `CREATE TABLE IF NOT EXISTS squad_goals (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        squad_id INTEGER NOT NULL,
                        title TEXT NOT NULL,
                        description TEXT,
                        status TEXT NOT NULL DEFAULT 'active',
                        due_date DATE,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE
                    )`
                },

                // Tabela de Desenvolvedores (Painel Dev)
                {
                    name: 'dev_users',
                    sql: `CREATE TABLE IF NOT EXISTS dev_users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        role TEXT NOT NULL DEFAULT 'developer',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        last_login DATETIME
                    )`
                },

                // Tabela de Pedidos de Cadastro de Empresas
                {
                    name: 'company_requests',
                    sql: `CREATE TABLE IF NOT EXISTS company_requests (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        status TEXT NOT NULL DEFAULT 'pending',
                        company_data TEXT NOT NULL,
                        president_data TEXT NOT NULL,
                        admins_data TEXT NOT NULL,
                        documents TEXT,
                        rejection_reason TEXT,
                        reviewed_by INTEGER,
                        reviewed_at DATETIME,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (reviewed_by) REFERENCES dev_users(id) ON DELETE SET NULL
                    )`
                },

                // Tabela de Aprovações Presidenciais
                {
                    name: 'approvals',
                    sql: `CREATE TABLE IF NOT EXISTS approvals (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        company_id INTEGER NOT NULL,
                        type TEXT NOT NULL,
                        title TEXT NOT NULL,
                        description TEXT NOT NULL,
                        requester_id INTEGER NOT NULL,
                        department TEXT NOT NULL,
                        priority TEXT NOT NULL DEFAULT 'normal',
                        status TEXT NOT NULL DEFAULT 'pending',
                        amount REAL,
                        justification TEXT,
                        impact TEXT,
                        decision_notes TEXT,
                        decided_by INTEGER,
                        decided_at DATETIME,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                        FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (decided_by) REFERENCES users(id) ON DELETE SET NULL
                    )`
                }
            ];

            let completed = 0;
            let errors = [];

            tables.forEach(table => {
                db.run(table.sql, (err) => {
                    if (err) {
                        console.error(`❌ Erro ao criar tabela ${table.name}:`, err);
                        errors.push({ table: table.name, error: err });
                    } else {
                        console.log(`✓ Tabela ${table.name} criada/verificada`);
                    }

                    completed++;
                    if (completed === tables.length) {
                        if (errors.length > 0) {
                            reject(errors);
                        } else {
                            resolve();
                        }
                    }
                });
            });
        });
    });
}

module.exports = { initializeSchema };
