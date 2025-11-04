import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/database.sqlite');
const db = new Database(dbPath);

console.log('🔄 Iniciando migração: Adicionar campos editorType e customLayout...\n');

try {
    // Adicionar coluna editorType
    console.log('➡️  Adicionando coluna editorType...');
    db.exec(`
        ALTER TABLE company_sites 
        ADD COLUMN editorType TEXT DEFAULT 'simple';
    `);
    console.log('✅ Coluna editorType adicionada com sucesso!\n');

    // Adicionar coluna customLayout
    console.log('➡️  Adicionando coluna customLayout...');
    db.exec(`
        ALTER TABLE company_sites 
        ADD COLUMN customLayout TEXT;
    `);
    console.log('✅ Coluna customLayout adicionada com sucesso!\n');

    // Verificar estrutura atualizada
    console.log('📊 Estrutura atualizada da tabela company_sites:');
    const tableInfo = db.prepare('PRAGMA table_info(company_sites)').all() as any[];
    tableInfo.forEach(col => {
        console.log(`   - ${col.name} (${col.type})`);
    });

    console.log('\n✅ Migração concluída com sucesso!');
} catch (error: any) {
    if (error.message.includes('duplicate column name')) {
        console.log('ℹ️  As colunas já existem. Migração não necessária.');
    } else {
        console.error('❌ Erro na migração:', error.message);
        process.exit(1);
    }
} finally {
    db.close();
}
