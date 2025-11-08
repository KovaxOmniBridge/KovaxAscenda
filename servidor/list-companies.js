/**
 * Listar todas as empresas no banco
 */

const db = require('./src/config/database');

console.log('🏢 Listando empresas cadastradas...\n');

db.all('SELECT id, name, legal_name, size FROM companies ORDER BY id', [], (err, rows) => {
    if (err) {
        console.error('❌ Erro ao consultar empresas:', err);
        process.exit(1);
    }

    if (!rows || rows.length === 0) {
        console.log('⚠️  Nenhuma empresa encontrada no banco');
        process.exit(0);
    }

    console.log(`✅ Total de empresas: ${rows.length}\n`);
    
    rows.forEach(row => {
        console.log(`ID: ${row.id} | ${row.name} (${row.size})`);
    });

    console.log('\n📋 Use esses IDs no login do frontend');
    console.log('💡 Exemplo: companyId = ' + rows[0].id);

    db.close();
    process.exit(0);
});
