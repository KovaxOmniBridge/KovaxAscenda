import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserRepository from '../src/repositories/UserRepository.js'
import OrganizationRepository from '../src/repositories/OrganizationRepository.js'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, organizationSlug = 'empresa-modelo' } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email e senha são obrigatórios' 
      })
    }
    
    // Buscar organização
    const organization = await OrganizationRepository.findBySlug(organizationSlug)
    if (!organization) {
      return res.status(404).json({ 
        success: false, 
        message: 'Organização não encontrada' 
      })
    }
    
    // Buscar usuário
    const user = await UserRepository.findByEmailAndOrganization(email, organization.id)
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      })
    }
    
    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      })
    }
    
    // Buscar permissões e categorias
    const permissions = await UserRepository.getUserPermissions(user.id)
    const toolCategories = await UserRepository.getUserToolCategories(user.id)
    
    // Atualizar último login
    await UserRepository.updateLastLogin(user.id)
    
    // Gerar JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        organizationId: organization.id 
      },
      process.env.JWT_SECRET || 'secret-key-change-in-production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
    
    // Formatar permissões
    const userPermissions = {
      toolCategories: toolCategories.map(tc => tc.category_key),
      ...permissions.reduce((acc, p) => {
        acc[p.permission_key] = true
        return acc
      }, {})
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar_url,
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug
        },
        permissions: userPermissions
      },
      token
    })
    
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logout realizado com sucesso' })
})

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token não fornecido' 
      })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-change-in-production')
    const user = await UserRepository.findById(decoded.userId)
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      })
    }
    
    const permissions = await UserRepository.getUserPermissions(user.id)
    const toolCategories = await UserRepository.getUserToolCategories(user.id)
    
    const userPermissions = {
      toolCategories: toolCategories.map(tc => tc.category_key),
      ...permissions.reduce((acc, p) => {
        acc[p.permission_key] = true
        return acc
      }, {})
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar_url,
        permissions: userPermissions
      }
    })
    
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido ou expirado' 
    })
  }
})

export default router
