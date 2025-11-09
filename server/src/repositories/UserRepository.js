import { query } from '../config/database.js'

/**
 * Repository para gerenciar usuários
 */
export class UserRepository {
  
  /**
   * Buscar usuário por email e organização
   */
  async findByEmailAndOrganization(email, organizationId) {
    const result = await query(
      `SELECT u.*, o.name as organization_name, o.slug as organization_slug
       FROM users u
       JOIN organizations o ON u.organization_id = o.id
       WHERE u.email = $1 AND u.organization_id = $2 AND u.is_active = true`,
      [email, organizationId]
    )
    return result.rows[0]
  }
  
  /**
   * Buscar usuário por ID
   */
  async findById(userId) {
    const result = await query(
      `SELECT u.*, o.name as organization_name, o.slug as organization_slug
       FROM users u
       JOIN organizations o ON u.organization_id = o.id
       WHERE u.id = $1 AND u.is_active = true`,
      [userId]
    )
    return result.rows[0]
  }
  
  /**
   * Buscar todas as permissões de um usuário
   */
  async getUserPermissions(userId) {
    const result = await query(
      `SELECT DISTINCT permission_key, permission_name
       FROM user_all_permissions
       WHERE user_id = $1`,
      [userId]
    )
    return result.rows
  }
  
  /**
   * Buscar todas as categorias de ferramentas de um usuário
   */
  async getUserToolCategories(userId) {
    const result = await query(
      `SELECT DISTINCT category_key, category_name
       FROM user_all_tool_categories
       WHERE user_id = $1
       ORDER BY category_key`,
      [userId]
    )
    return result.rows
  }
  
  /**
   * Buscar ferramentas disponíveis para um usuário
   */
  async getUserTools(userId) {
    const result = await query(
      `SELECT DISTINCT
         tc.key as category_key,
         tc.name as category_name,
         tc.icon as category_icon,
         t.id as tool_id,
         t.key as tool_key,
         t.name as tool_name,
         t.description as tool_description,
         t.icon as tool_icon,
         t.route as tool_route,
         t.display_order
       FROM user_all_tool_categories uatc
       JOIN tool_categories tc ON uatc.tool_category_id = tc.id
       JOIN tools t ON t.tool_category_id = tc.id
       WHERE uatc.user_id = $1 AND t.is_active = true
       ORDER BY tc.display_order, t.display_order`,
      [userId]
    )
    return result.rows
  }
  
  /**
   * Atualizar último login
   */
  async updateLastLogin(userId) {
    await query(
      `UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    )
  }
  
  /**
   * Criar novo usuário
   */
  async create(userData) {
    const { organizationId, email, passwordHash, name, avatarUrl } = userData
    
    const result = await query(
      `INSERT INTO users (organization_id, email, password_hash, name, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [organizationId, email, passwordHash, name, avatarUrl || null]
    )
    return result.rows[0]
  }
  
  /**
   * Listar todos os usuários de uma organização
   */
  async findByOrganization(organizationId, options = {}) {
    const { limit = 50, offset = 0, isActive = true } = options
    
    const result = await query(
      `SELECT u.id, u.email, u.name, u.avatar_url, u.is_active, u.created_at, u.last_login_at
       FROM users u
       WHERE u.organization_id = $1 AND ($2::boolean IS NULL OR u.is_active = $2)
       ORDER BY u.name
       LIMIT $3 OFFSET $4`,
      [organizationId, isActive, limit, offset]
    )
    return result.rows
  }
}

export default new UserRepository()
