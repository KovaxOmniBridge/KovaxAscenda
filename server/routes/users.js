import express from 'express'
import UserRepository from '../src/repositories/UserRepository.js'

const router = express.Router()

// Middleware simples de autenticação (melhorar em produção)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado' })
  }
  // TODO: Validar JWT token
  next()
}

// Listar usuários da organização
router.get('/', authMiddleware, async (req, res) => {
  try {
    // TODO: Pegar organizationId do token JWT
    const organizationId = '00000000-0000-0000-0000-000000000001'
    
    const users = await UserRepository.findByOrganization(organizationId)
    res.json(users)
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    res.status(500).json({ message: 'Erro ao listar usuários' })
  }
})

// Buscar usuário por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await UserRepository.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    
    const permissions = await UserRepository.getUserPermissions(user.id)
    const toolCategories = await UserRepository.getUserToolCategories(user.id)
    
    res.json({
      ...user,
      permissions: {
        toolCategories: toolCategories.map(tc => tc.category_key),
        ...permissions.reduce((acc, p) => {
          acc[p.permission_key] = true
          return acc
        }, {})
      }
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({ message: 'Erro ao buscar usuário' })
  }
})

// Buscar ferramentas disponíveis para o usuário
router.get('/:id/tools', authMiddleware, async (req, res) => {
  try {
    const tools = await UserRepository.getUserTools(req.params.id)
    
    // Agrupar ferramentas por categoria
    const toolsByCategory = tools.reduce((acc, tool) => {
      const categoryKey = tool.category_key
      
      if (!acc[categoryKey]) {
        acc[categoryKey] = {
          key: categoryKey,
          name: tool.category_name,
          icon: tool.category_icon,
          tools: []
        }
      }
      
      acc[categoryKey].tools.push({
        id: tool.tool_id,
        key: tool.tool_key,
        name: tool.tool_name,
        description: tool.tool_description,
        icon: tool.tool_icon,
        route: tool.tool_route
      })
      
      return acc
    }, {})
    
    res.json(Object.values(toolsByCategory))
  } catch (error) {
    console.error('Erro ao buscar ferramentas do usuário:', error)
    res.status(500).json({ message: 'Erro ao buscar ferramentas' })
  }
})

export default router
