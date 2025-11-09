import { query } from '../config/database.js'

/**
 * Repository para gerenciar ferramentas
 */
export class ToolRepository {
  
  /**
   * Buscar todas as categorias de ferramentas
   */
  async getAllCategories() {
    const result = await query(
      `SELECT * FROM tool_categories 
       WHERE is_active = true 
       ORDER BY display_order`
    )
    return result.rows
  }
  
  /**
   * Buscar todas as ferramentas
   */
  async getAllTools() {
    const result = await query(
      `SELECT 
         t.*,
         tc.key as category_key,
         tc.name as category_name
       FROM tools t
       JOIN tool_categories tc ON t.tool_category_id = tc.id
       WHERE t.is_active = true AND tc.is_active = true
       ORDER BY tc.display_order, t.display_order`
    )
    return result.rows
  }
  
  /**
   * Buscar ferramentas por categoria
   */
  async getToolsByCategory(categoryKey) {
    const result = await query(
      `SELECT t.*
       FROM tools t
       JOIN tool_categories tc ON t.tool_category_id = tc.id
       WHERE tc.key = $1 AND t.is_active = true AND tc.is_active = true
       ORDER BY t.display_order`,
      [categoryKey]
    )
    return result.rows
  }
  
  /**
   * Buscar ferramenta por key
   */
  async findByKey(toolKey) {
    const result = await query(
      `SELECT 
         t.*,
         tc.key as category_key,
         tc.name as category_name
       FROM tools t
       JOIN tool_categories tc ON t.tool_category_id = tc.id
       WHERE t.key = $1 AND t.is_active = true`,
      [toolKey]
    )
    return result.rows[0]
  }
}

export default new ToolRepository()
