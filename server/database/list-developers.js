import { query } from '../config/database-sqlite.js';

console.log('\n📋 DESENVOLVEDORES CADASTRADOS\n');
console.log('='.repeat(60));

try {
  const result = query('SELECT id, name, email, is_active, role, created_at FROM developers ORDER BY created_at');
  
  if (result.rows.length === 0) {
    console.log('\n❌ Nenhum desenvolvedor cadastrado\n');
  } else {
    result.rows.forEach((dev, index) => {
      console.log(`\n${index + 1}. ${dev.name}`);
      console.log(`   Email: ${dev.email}`);
      console.log(`   ID: ${dev.id}`);
      console.log(`   Role: ${dev.role || 'developer'}`);
      console.log(`   Status: ${dev.is_active ? '✅ Ativo' : '❌ Inativo'}`);
      console.log(`   Cadastrado em: ${dev.created_at}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log(`\nTotal: ${result.rows.length} desenvolvedor(es) cadastrado(s)\n`);
  }
  
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Erro ao consultar desenvolvedores:', error.message);
  process.exit(1);
}
