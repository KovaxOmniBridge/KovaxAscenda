import pool from '../config/database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function seedDatabase() {
  console.log('🌱 Populando banco de dados com dados iniciais...')
  
  try {
    // Ler arquivo SQL de seeds
    const seedsPath = path.join(__dirname, '../../database/seeds.sql')
    const seeds = fs.readFileSync(seedsPath, 'utf8')
    
    console.log('📝 Executando seeds SQL...')
    await pool.query(seeds)
    
    console.log('✅ Dados iniciais inseridos com sucesso!')
    console.log('')
    console.log('👤 Usuários de teste criados (senha: senha123):')
    console.log('   - ceo@empresa.com (CEO - Acesso total)')
    console.log('   - diretor@empresa.com (Diretor)')
    console.log('   - admin@empresa.com (Administrador)')
    console.log('   - coordenador@empresa.com (Coordenador)')
    console.log('   - gerente@empresa.com (Gerente)')
    console.log('   - supervisor@empresa.com (Supervisor)')
    console.log('   - operador@empresa.com (Operacional)')
    console.log('   - dev@empresa.com (Desenvolvedor - Acesso dev)')
    
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error)
    throw error
  } finally {
    await pool.end()
  }
}

seedDatabase()
