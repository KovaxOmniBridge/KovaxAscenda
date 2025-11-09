import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from '../routes/auth.js'
import userRoutes from '../routes/users.js'
import toolRoutes from '../routes/tools.js'
import pool from './config/database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      timestamp: new Date().toISOString() 
    })
  }
})

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tools', toolRoutes)

// Rota base da API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Ascenda API v1.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      tools: '/api/tools'
    }
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 API disponível em: http://localhost:${PORT}/api`)
})

export default app
