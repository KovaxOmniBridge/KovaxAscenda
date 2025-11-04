import DatabaseService from '../database/DatabaseService';

console.log('🔄 Iniciando migração do banco de dados...');

try {
    const db = DatabaseService.getConnection();
    
    // Fazer backup da tabela antiga
    console.log('📦 Fazendo backup da tabela products...');
    db.exec(`
        CREATE TABLE IF NOT EXISTS products_backup AS 
        SELECT * FROM products;
    `);
    
    // Dropar tabela antiga
    console.log('🗑️  Removendo tabela antiga...');
    db.exec(`DROP TABLE IF EXISTS products;`);
    
    // Criar nova tabela com estrutura atualizada
    console.log('✨ Criando nova estrutura...');
    db.exec(`
        CREATE TABLE products (
            id TEXT PRIMARY KEY,
            companyId TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            code TEXT,
            barcode TEXT,
            qrcode TEXT,
            category TEXT NOT NULL,
            tags TEXT,
            price REAL NOT NULL,
            status TEXT NOT NULL,
            images TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
        );
    `);
    
    // Criar índices
    console.log('🔍 Criando índices...');
    db.exec(`CREATE INDEX idx_products_companyId ON products(companyId);`);
    db.exec(`CREATE INDEX idx_products_category ON products(category);`);
    db.exec(`CREATE INDEX idx_products_status ON products(status);`);
    db.exec(`CREATE INDEX idx_products_barcode ON products(barcode);`);
    
    console.log('✅ Migração concluída com sucesso!');
    console.log('📝 Nota: A tabela antiga foi salva como products_backup');
    
} catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
}

process.exit(0);
