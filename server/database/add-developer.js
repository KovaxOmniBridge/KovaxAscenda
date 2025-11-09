// Script para adicionar desenvolvedor
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'ascenda.db'));

async function addDeveloper() {
  try {
    const email = 'dinizdavi658@gmail.com';
    const password = 'Davidiniz425.';
    const name = 'Davi Diniz';
    
    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Inserir desenvolvedor
    const stmt = db.prepare(`
      INSERT INTO developers (id, email, password_hash, name, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    const id = 'dev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    
    const result = stmt.run(
      id,
      email,
      passwordHash,
      name,
      'admin',
      1
    );
    
    console.log('✅ Desenvolvedor cadastrado com sucesso!');
    console.log('📧 Email:', email);
    console.log('👤 Nome:', name);
    console.log('🆔 ID:', id);
    console.log('🔑 Senha: Davidiniz425.');
    console.log('\n🔐 Hash gerado:', passwordHash);
    
    // Verificar
    const developer = db.prepare('SELECT * FROM developers WHERE email = ?').get(email);
    console.log('\n✓ Verificação:', developer);
    
  } catch (error) {
    console.error('❌ Erro ao cadastrar desenvolvedor:', error.message);
  } finally {
    db.close();
  }
}

addDeveloper();
