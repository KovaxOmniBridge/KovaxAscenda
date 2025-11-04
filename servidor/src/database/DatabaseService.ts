import Database from 'better-sqlite3';
import path from 'path';

class DatabaseService {
    private static instance: Database.Database;

    static getConnection(): Database.Database {
        if (!DatabaseService.instance) {
            const dbPath = path.join(__dirname, '..', '..', 'database.db');
            DatabaseService.instance = new Database(dbPath);
            DatabaseService.instance.pragma('journal_mode = WAL');
            DatabaseService.initialize();
        }
        return DatabaseService.instance;
    }

    private static initialize(): void {
        const db = DatabaseService.instance;

        // Criar tabela de empresas
        db.exec(`
            CREATE TABLE IF NOT EXISTS companies (
                id TEXT PRIMARY KEY,
                cnpj TEXT UNIQUE NOT NULL,
                razaoSocial TEXT NOT NULL,
                nomeFantasia TEXT NOT NULL,
                porte TEXT NOT NULL,
                regimeTributario TEXT NOT NULL,
                situacaoCadastral TEXT NOT NULL,
                dataAbertura TEXT,
                endereco_cep TEXT NOT NULL,
                endereco_logradouro TEXT NOT NULL,
                endereco_numero TEXT NOT NULL,
                endereco_complemento TEXT,
                endereco_bairro TEXT,
                endereco_cidade TEXT NOT NULL,
                endereco_estado TEXT NOT NULL,
                endereco_pais TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            )
        `);

        // Criar tabela de contatos
        db.exec(`
            CREATE TABLE IF NOT EXISTS contacts (
                id TEXT PRIMARY KEY,
                tipo TEXT NOT NULL,
                valor TEXT NOT NULL,
                principal INTEGER NOT NULL DEFAULT 0,
                companyId TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        // Criar tabela de sócios
        db.exec(`
            CREATE TABLE IF NOT EXISTS partners (
                id TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                cpf TEXT NOT NULL,
                qualificacao TEXT NOT NULL,
                dataEntrada TEXT NOT NULL,
                companyId TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        // Criar índices para melhor performance
        db.exec(`
            CREATE INDEX IF NOT EXISTS idx_companies_cnpj ON companies(cnpj);
            CREATE INDEX IF NOT EXISTS idx_contacts_companyId ON contacts(companyId);
            CREATE INDEX IF NOT EXISTS idx_partners_companyId ON partners(companyId);
        `);

        console.log('✅ Banco de dados SQLite inicializado com sucesso!');
    }

    static close(): void {
        if (DatabaseService.instance) {
            DatabaseService.instance.close();
        }
    }
}

export default DatabaseService;
