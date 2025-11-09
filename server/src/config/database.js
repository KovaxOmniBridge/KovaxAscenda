import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Pool de conexões com PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ascenda_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Testa conexão
pool.on('connect', () => {
  console.log('✓ Conectado ao PostgreSQL')
})

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente PostgreSQL:', err)
  process.exit(-1)
})

// Função auxiliar para executar queries
export const query = async (text, params) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executada:', { text, duration, rows: res.rowCount })
    }
    
    return res
  } catch (error) {
    console.error('Erro na query:', error)
    throw error
  }
}

// Função para transações
export const transaction = async (callback) => {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Obter um cliente do pool para múltiplas queries
export const getClient = async () => {
  return await pool.connect()
}

export default pool
