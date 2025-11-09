import express from 'express'
import ToolRepository from '../src/repositories/ToolRepository.js'

const router = express.Router()

// Listar todas as categorias de ferramentas
router.get('/categories', async (req, res) => {
  try {
    const categories = await ToolRepository.getAllCategories()
    res.json(categories)
  } catch (error) {
    console.error('Erro ao listar categorias:', error)
    res.status(500).json({ message: 'Erro ao listar categorias' })
  }
})

// Listar todas as ferramentas
router.get('/', async (req, res) => {
  try {
    const tools = await ToolRepository.getAllTools()
    res.json(tools)
  } catch (error) {
    console.error('Erro ao listar ferramentas:', error)
    res.status(500).json({ message: 'Erro ao listar ferramentas' })
  }
})

// Buscar ferramentas por categoria
router.get('/category/:categoryKey', async (req, res) => {
  try {
    const tools = await ToolRepository.getToolsByCategory(req.params.categoryKey)
    res.json(tools)
  } catch (error) {
    console.error('Erro ao buscar ferramentas da categoria:', error)
    res.status(500).json({ message: 'Erro ao buscar ferramentas' })
  }
})

// Buscar ferramenta específica
router.get('/:toolKey', async (req, res) => {
  try {
    const tool = await ToolRepository.findByKey(req.params.toolKey)
    
    if (!tool) {
      return res.status(404).json({ message: 'Ferramenta não encontrada' })
    }
    
    res.json(tool)
  } catch (error) {
    console.error('Erro ao buscar ferramenta:', error)
    res.status(500).json({ message: 'Erro ao buscar ferramenta' })
  }
})

export default router
