import pool from '../config/database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function setupDatabase() {
  console.log('📦 Configurando banco de dados...')
  
  try {
    // Ler arquivo SQL de schema
    const schemaPath = path.join(__dirname, '../../database/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📝 Executando schema SQL...')
    await pool.query(schema)
    
    console.log('✅ Schema criado com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error)
    throw error
  } finally {
    await pool.end()
  }
}

setupDatabase()
