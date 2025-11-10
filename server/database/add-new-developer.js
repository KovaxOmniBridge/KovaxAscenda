import { query, execute } from '../config/database-sqlite.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const newDeveloper = {
  email: 'dinizdavi658@gmail.com',
  password: 'Davidiniz425.',
  name: 'Diniz Davi',
  role: 'developer'
};

console.log('\n🔧 Cadastrando novo desenvolvedor...\n');

try {
  // Verificar se já existe
  const existing = query('SELECT email FROM developers WHERE email = ?', [newDeveloper.email]);
  
  if (existing.rows.length > 0) {
    console.log('⚠️  Desenvolvedor já existe com este email!');
    console.log(`   Email: ${newDeveloper.email}\n`);
    process.exit(0);
  }
  
  // Hash da senha
  const passwordHash = await bcrypt.hash(newDeveloper.password, 10);
  const id = randomUUID();
  
  // Inserir desenvolvedor
  execute(
    `INSERT INTO developers (id, name, email, password_hash, role, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
    [id, newDeveloper.name, newDeveloper.email, passwordHash, newDeveloper.role]
  );
  
  console.log('✅ Desenvolvedor cadastrado com sucesso!\n');
  console.log('📋 Dados do desenvolvedor:');
  console.log(`   Nome: ${newDeveloper.name}`);
  console.log(`   Email: ${newDeveloper.email}`);
  console.log(`   Senha: ${newDeveloper.password}`);
  console.log(`   Role: ${newDeveloper.role}`);
  console.log(`   ID: ${id}`);
  console.log(`   Status: ✅ Ativo\n`);
  
  // Listar todos os desenvolvedores
  const all = query('SELECT name, email, role, is_active FROM developers ORDER BY created_at');
  console.log('📊 Total de desenvolvedores cadastrados:', all.rows.length);
  all.rows.forEach((dev, i) => {
    console.log(`   ${i + 1}. ${dev.name} (${dev.email}) - ${dev.role} - ${dev.is_active ? 'Ativo' : 'Inativo'}`);
  });
  console.log('');
  
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Erro ao cadastrar desenvolvedor:', error.message);
  console.error(error.stack);
  process.exit(1);
}
