/**
 * =====================================================
 * DASHBOARD - ASCENDA PLATFORM
 * =====================================================
 */

import { getCurrentUser, logout, getAccessibleCategories } from './auth.js';

// Categorias de ferramentas
const CATEGORIES = {
  lideranca: { name: 'Liderança', icon: '🎯', description: 'Planejamento estratégico' },
  diretoria: { name: 'Diretoria', icon: '📊', description: 'Gestão de indicadores' },
  administracao: { name: 'Administração', icon: '⚙️', description: 'Controle administrativo' },
  coordenacao: { name: 'Coordenação', icon: '🎓', description: 'Coordenação de projetos' },
  gerenciamento: { name: 'Gerenciamento', icon: '📈', description: 'Gestão de recursos' },
  supervisao: { name: 'Supervisão', icon: '👥', description: 'Monitoramento' },
  operacional: { name: 'Operacional', icon: '🔧', description: 'Execução operacional' }
};

// Ferramentas por categoria (será carregado da API)
let allTools = [];

/**
 * Inicialização
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Verificar autenticação
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = '../../index.html';
    return;
  }

  // Exibir informações do usuário
  displayUserInfo(user);

  // Configurar logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Carregar e renderizar ferramentas
  await loadAndRenderTools(user);
});

/**
 * Exibir informações do usuário
 */
function displayUserInfo(user) {
  const userInfoEl = document.getElementById('user-info');
  const welcomeMsg = document.getElementById('welcome-message');
  
  if (userInfoEl) {
    userInfoEl.innerHTML = `
      <span class="user-name">${user.name}</span>
      <span class="user-role">${user.role}</span>
    `;
  }
  
  if (welcomeMsg) {
    welcomeMsg.textContent = `Olá, ${user.name}! Aqui estão suas ferramentas disponíveis.`;
  }
}

/**
 * Carregar ferramentas da API e renderizar
 */
async function loadAndRenderTools(user) {
  const dashboardContent = document.getElementById('dashboard-content');
  
  if (!dashboardContent) return;

  try {
    // Buscar ferramentas da API
    const response = await fetch('http://localhost:3000/api/tools');
    
    if (!response.ok) {
      throw new Error('Erro ao carregar ferramentas');
    }

    allTools = await response.json();
    
    // Renderizar ferramentas do usuário
    renderDashboard(user);

  } catch (error) {
    console.error('Erro ao carregar ferramentas:', error);
    dashboardContent.innerHTML = `
      <div class="alert alert-error">
        Erro ao carregar ferramentas. Verifique se o servidor está rodando.
      </div>
    `;
  }
}

/**
 * Renderizar dashboard com ferramentas
 */
function renderDashboard(user) {
  const dashboardContent = document.getElementById('dashboard-content');
  
  if (!dashboardContent) return;

  // Obter categorias permitidas
  const allowedCategories = getAccessibleCategories();
  
  if (allowedCategories.length === 0) {
    dashboardContent.innerHTML = `
      <div class="alert alert-info">
        Nenhuma ferramenta disponível para seu perfil.
      </div>
    `;
    return;
  }

  // Limpar conteúdo
  dashboardContent.innerHTML = '';

  // Renderizar cada categoria
  allowedCategories.forEach(categoryKey => {
    const category = CATEGORIES[categoryKey];
    
    if (!category) return;

    // Filtrar ferramentas desta categoria
    const categoryTools = allTools.filter(tool => tool.categoryKey === categoryKey);
    
    if (categoryTools.length === 0) return;

    // Criar seção da categoria
    const categorySection = createCategorySection(categoryKey, category, categoryTools);
    dashboardContent.appendChild(categorySection);
  });
}

/**
 * Criar seção de categoria
 */
function createCategorySection(categoryKey, category, tools) {
  const section = document.createElement('div');
  section.className = 'category-section';
  
  section.innerHTML = `
    <div class="category-header">
      <h2>
        <span class="category-icon">${category.icon}</span>
        ${category.name}
      </h2>
      <p class="category-description">${category.description}</p>
    </div>
    <div class="tools-grid">
      ${tools.map(tool => createToolCard(tool)).join('')}
    </div>
  `;
  
  return section;
}

/**
 * Criar card de ferramenta
 */
function createToolCard(tool) {
  return `
    <div class="tool-card" onclick="openTool('${tool.id}', '${tool.name}')">
      <div class="tool-icon">${tool.icon || '📦'}</div>
      <h3 class="tool-name">${tool.name}</h3>
      <p class="tool-description">${tool.description}</p>
    </div>
  `;
}

/**
 * Abrir ferramenta (global para onclick)
 */
window.openTool = function(toolId, toolName) {
  console.log(`Abrindo ferramenta: ${toolName} (ID: ${toolId})`);
  
  // Por enquanto, apenas mostrar alerta
  // Futuramente, navegar para página da ferramenta
  alert(`Ferramenta "${toolName}" em desenvolvimento.\n\nID: ${toolId}`);
  
  // TODO: Implementar navegação para ferramentas
  // window.location.href = `tools/${toolId}.html`;
};
