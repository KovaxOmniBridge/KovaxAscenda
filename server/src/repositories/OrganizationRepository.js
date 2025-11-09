import { query } from '../config/database.js'

/**
 * Repository para gerenciar organizações
 */
export class OrganizationRepository {
  
  /**
   * Buscar organização por slug
   */
  async findBySlug(slug) {
    const result = await query(
      `SELECT * FROM organizations WHERE slug = $1 AND is_active = true`,
      [slug]
    )
    return result.rows[0]
  }
  
  /**
   * Buscar organização por ID
   */
  async findById(id) {
    const result = await query(
      `SELECT * FROM organizations WHERE id = $1 AND is_active = true`,
      [id]
    )
    return result.rows[0]
  }
  
  /**
   * Listar todas as organizações ativas
   */
  async findAll(options = {}) {
    const { limit = 50, offset = 0 } = options
    
    const result = await query(
      `SELECT * FROM organizations 
       WHERE is_active = true 
       ORDER BY name
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    return result.rows
  }
  
  /**
   * Criar nova organização
   */
  async create(orgData) {
    const { name, slug, description, logoUrl } = orgData
    
    const result = await query(
      `INSERT INTO organizations (name, slug, description, logo_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, slug, description || null, logoUrl || null]
    )
    return result.rows[0]
  }
  
  /**
   * Atualizar organização
   */
  async update(id, orgData) {
    const { name, description, logoUrl, isActive } = orgData
    
    const result = await query(
      `UPDATE organizations 
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           logo_url = COALESCE($4, logo_url),
           is_active = COALESCE($5, is_active)
       WHERE id = $1
       RETURNING *`,
      [id, name, description, logoUrl, isActive]
    )
    return result.rows[0]
  }
}

export default new OrganizationRepository()
