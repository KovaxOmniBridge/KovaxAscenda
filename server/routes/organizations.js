import express from 'express'
import OrganizationRepository from '../src/repositories/OrganizationRepository.js'

const router = express.Router()

// Criar nova organização
router.post('/', async (req, res) => {
  try {
    const { name, slug, description, logo_url } = req.body
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Nome e slug são obrigatórios' })
    }
    const org = await OrganizationRepository.create({
      name,
      slug,
      description,
      logoUrl: logo_url
    })
    res.json({ success: true, data: org })
  } catch (error) {
    console.error('Erro ao cadastrar empresa:', error)
    res.status(500).json({ success: false, message: 'Erro ao cadastrar empresa' })
  }
})

// Listar organizações
router.get('/', async (req, res) => {
  try {
    const orgs = await OrganizationRepository.findAll()
    res.json({ success: true, data: orgs })
  } catch (error) {
    console.error('Erro ao listar empresas:', error)
    res.status(500).json({ success: false, message: 'Erro ao listar empresas' })
  }
})

export default router
