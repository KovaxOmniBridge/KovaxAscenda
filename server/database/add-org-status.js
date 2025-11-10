import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'ascenda.db');
const db = new sqlite3.verbose().Database(dbPath);

console.log('🔧 Adicionando campo status à tabela organizations...');

db.serialize(() => {
  // Verificar se a coluna já existe
  db.all("PRAGMA table_info(organizations)", (err, columns) => {
    if (err) {
      console.error('❌ Erro ao verificar tabela:', err);
      return;
    }

    const hasStatus = columns.some(col => col.name === 'status');
    
    if (hasStatus) {
      console.log('✅ Campo status já existe!');
      db.close();
      return;
    }

    // Adicionar coluna status
    db.run(`
      ALTER TABLE organizations 
      ADD COLUMN status TEXT DEFAULT 'ativo'
    `, (err) => {
      if (err) {
        console.error('❌ Erro ao adicionar coluna:', err);
      } else {
        console.log('✅ Campo status adicionado com sucesso!');
        
        // Atualizar todas as empresas existentes para 'ativo'
        db.run(`UPDATE organizations SET status = 'ativo' WHERE status IS NULL`, (err) => {
          if (err) {
            console.error('❌ Erro ao atualizar registros:', err);
          } else {
            console.log('✅ Registros atualizados para status ativo');
          }
          db.close();
        });
      }
    });
  });
});
