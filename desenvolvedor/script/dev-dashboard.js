/**
 * =====================================================
 * DEV DASHBOARD - Gestão de Empresas com Células
 * =====================================================
 */

import { getCurrentDeveloper, logoutDeveloper, devApiRequest } from './dev-auth.js';

const API_URL = 'http://localhost:3000/api';
let currentSection = 'organizations';
let organizationsData = [];
let usersData = [];
let toolsData = [];
let hasLoadedOnce = false; // Controle único de carregamento

/**
 * Inicialização
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Inicializando dashboard...');
  
  // Verificar autenticação
  const developer = getCurrentDeveloper();
  
  if (!developer) {
    window.location.href = 'login.html';
    return;
  }

  // Exibir informações do desenvolvedor
  displayDeveloperInfo(developer);

  // Configurar navegação
  setupNavigation();

  // Configurar logout
  const logoutBtn = document.getElementById('dev-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutDeveloper);
  }

  // Setup event listeners
  setupEventListeners();
  
  // Carregar organizações APENAS UMA VEZ
  if (!hasLoadedOnce) {
    hasLoadedOnce = true;
    console.log('📊 Carregando organizações...');
    await loadOrganizationsOnce();
  }
});

/**
 * Exibir informações do desenvolvedor
 */
function displayDeveloperInfo(developer) {
  const userInfoEl = document.getElementById('dev-user-info');
  
  if (userInfoEl) {
    userInfoEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="color: var(--gray-600);">👨‍💻 ${developer.name || developer.email}</span>
        <button onclick="logoutDeveloper()" style="padding: 0.5rem 1rem; background: var(--flame-orange); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; font-weight: 600;">
          🚪 Sair
        </button>
      </div>
    `;
  }
}

/**
 * Configurar navegação entre seções
 */
function setupNavigation() {
  const navItems = document.querySelectorAll('.dev-nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const section = item.getAttribute('data-section');
      
      if (section) {
        switchSection(section);
      }
    });
  });
}

/**
 * Trocar seção ativa
 */
async function switchSection(sectionName) {
  // Atualizar navegação
  document.querySelectorAll('.dev-nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

  // Atualizar seções
  document.querySelectorAll('.dev-section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.getElementById(`section-${sectionName}`)?.classList.add('active');

  // Atualizar título
  const titles = {
    overview: 'Visão Geral',
    organizations: 'Empresas',
    users: 'Usuários',
    tools: 'Ferramentas',
    logs: 'Logs & Auditoria',
    settings: 'Configurações'
  };
  
  document.getElementById('dev-section-title').textContent = titles[sectionName] || 'Dashboard';

  currentSection = sectionName;

  // Carregar dados da seção
  await loadSectionData(sectionName);
}

/**
 * Carregar dados da visão geral
 */
async function loadOverviewData() {
  try {
    // Carregar estatísticas
    const [organizations, users, tools] = await Promise.all([
      devApiRequest('/api/organizations').catch(() => []),
      devApiRequest('/api/users').catch(() => []),
      devApiRequest('/api/tools').catch(() => [])
    ]);

    // Atualizar cards de estatísticas
    document.getElementById('stat-organizations').textContent = organizations.length || 0;
    document.getElementById('stat-users').textContent = users.length || 0;
    document.getElementById('stat-tools').textContent = tools.length || 0;

  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

/**
 * Carregar dados específicos da seção
 */
async function loadSectionData(sectionName) {
  // NÃO carregar automaticamente - apenas trocar visualização
  console.log(`📑 Trocando para seção: ${sectionName}`);
  
  switch (sectionName) {
    case 'organizations':
      // Não chamar loadOrganizations aqui - já foi carregado na inicialização
      console.log('✅ Seção de organizações já carregada');
      break;
    case 'users':
      await loadUsers();
      break;
    case 'tools':
      await loadTools();
      break;
    case 'logs':
      loadLogs();
      break;
    case 'settings':
      loadSettings();
      break;
  }
}

/**
 * Carregar usuários
 */
async function loadUsers() {
  const container = document.getElementById('users-list');
  
  try {
    const users = await devApiRequest('/api/users');
    
    if (users.length === 0) {
      container.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
      return;
    }

    container.innerHTML = `
      <table class="dev-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Cargo</th>
            <th>Empresa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td><strong>${user.name}</strong></td>
              <td>${user.email}</td>
              <td>${user.role}</td>
              <td>${user.organizationName || 'N/A'}</td>
              <td>
                <button class="btn-sm" onclick="editUser('${user.id}')">Editar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    container.innerHTML = '<p class="error">Erro ao carregar usuários.</p>';
  }
}

/**
 * Carregar ferramentas
 */
async function loadTools() {
  const container = document.getElementById('tools-list');
  
  try {
    const tools = await devApiRequest('/api/tools');
    
    if (tools.length === 0) {
      container.innerHTML = '<p>Nenhuma ferramenta cadastrada.</p>';
      return;
    }

    container.innerHTML = `
      <div class="tools-grid-dev">
        ${tools.map(tool => `
          <div class="tool-card-dev">
            <div class="tool-icon-dev">${tool.icon || '📦'}</div>
            <h4>${tool.name}</h4>
            <p>${tool.description}</p>
            <div class="tool-meta">
              <span class="badge">${tool.categoryKey}</span>
            </div>
            <button class="btn-sm" onclick="editTool('${tool.id}')">Editar</button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = '<p class="error">Erro ao carregar ferramentas.</p>';
  }
}

/**
 * Carregar logs
 */
function loadLogs() {
  const container = document.getElementById('logs-list');
  
  container.innerHTML = `
    <div class="log-entry">
      <span class="log-time">${new Date().toLocaleString('pt-BR')}</span>
      <span class="log-level log-info">INFO</span>
      <span class="log-message">Sistema de logs em desenvolvimento</span>
    </div>
    <div class="log-entry">
      <span class="log-time">${new Date().toLocaleString('pt-BR')}</span>
      <span class="log-level log-success">SUCCESS</span>
      <span class="log-message">Developer dashboard carregado com sucesso</span>
    </div>
  `;
}

/**
 * Carregar configurações
 */
function loadSettings() {
  const container = document.querySelector('.settings-container');
  
  container.innerHTML = `
    <h3>Configurações da Plataforma</h3>
    <div class="settings-grid">
      <div class="setting-item">
        <label>Nome da Plataforma</label>
        <input type="text" value="Ascenda Platform" disabled>
      </div>
      <div class="setting-item">
        <label>Versão</label>
        <input type="text" value="1.0.0" disabled>
      </div>
      <div class="setting-item">
        <label>Ambiente</label>
        <input type="text" value="Desenvolvimento" disabled>
      </div>
    </div>
    <p style="margin-top: 1rem; color: #666;">Configurações avançadas em desenvolvimento...</p>
  `;
}

// ============================================
// CARREGAR ORGANIZAÇÕES - APENAS UMA VEZ
// ============================================
async function loadOrganizationsOnce() {
  const grid = document.getElementById('organizations-grid');
  const token = localStorage.getItem('dev_token');
  
  if (!grid) {
    console.error('❌ Elemento organizations-grid não encontrado');
    return;
  }
  
  console.log('📡 Fazendo requisição para API...');
  
  // Mostrar loading
  grid.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Carregando empresas...</p>
    </div>
  `;
  
  try {
    const response = await fetch(`${API_URL}/organizations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao carregar organizações');
    }
    
    const data = await response.json();
    organizationsData = data.organizations || [];
    
    console.log(`✅ ${organizationsData.length} organizações encontradas`);
    
    // Carregar detalhes de cada organização
    for (const org of organizationsData) {
      await loadOrganizationDetailsOnce(org);
    }
    
    // Renderizar células
    renderOrganizations();
    
    // Atualizar stats
    updateStats();
    
    console.log('✅ Organizações carregadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao carregar organizações:', error);
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Erro ao carregar empresas</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

async function loadOrganizationDetailsOnce(org) {
  const token = localStorage.getItem('dev_token');
  
  try {
    // Carregar usuários
    const usersResponse = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      org.users = (usersData.users || []).filter(u => u.organization_id === org.id);
      org.userCount = org.users.length;
    } else {
      org.users = [];
      org.userCount = 0;
    }
    
    // Carregar ferramentas
    const toolsResponse = await fetch(`${API_URL}/tools`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (toolsResponse.ok) {
      const toolsData = await toolsResponse.json();
      org.tools = toolsData.tools || [];
      org.toolCount = org.tools.length;
    } else {
      org.tools = [];
      org.toolCount = 0;
    }
    
  } catch (error) {
    console.error(`Erro ao carregar detalhes:`, error);
    org.users = [];
    org.userCount = 0;
    org.tools = [];
    org.toolCount = 0;
  }
}

function renderOrganizations() {
  const grid = document.getElementById('organizations-grid');
  
  if (organizationsData.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏢</div>
        <h3>Nenhuma empresa cadastrada</h3>
        <p>Clique em "Nova Empresa" para começar</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = organizationsData.map(org => createOrganizationCell(org)).join('');
}

function createOrganizationCell(org) {
  const createdDate = new Date(org.created_at).toLocaleDateString('pt-BR');
  const isActive = org.is_active !== false;
  
  return `
    <div class="organization-cell" data-org-id="${org.id}">
      <div class="org-cell-header">
        <div class="org-name-row">
          <h3 class="org-name">${org.name}</h3>
          <span class="org-status ${isActive ? 'active' : 'inactive'}">
            ${isActive ? '✓ Ativa' : '○ Inativa'}
          </span>
        </div>
        <div class="org-info-row">
          <div class="org-info-item">
            <span>📅</span>
            <span>${createdDate}</span>
          </div>
          <div class="org-info-item">
            <span>🆔</span>
            <span>${org.id.substring(0, 8)}...</span>
          </div>
        </div>
      </div>
      
      <div class="org-cell-body">
        <div class="org-stats-grid">
          <div class="org-stat-item">
            <div class="org-stat-icon">👥</div>
            <div class="org-stat-value">${org.userCount || 0}</div>
            <div class="org-stat-label">Usuários</div>
          </div>
          
          <div class="org-stat-item">
            <div class="org-stat-icon">🛠️</div>
            <div class="org-stat-value">${org.toolCount || 0}</div>
            <div class="org-stat-label">Ferramentas</div>
          </div>
          
          <div class="org-stat-item">
            <div class="org-stat-icon">📊</div>
            <div class="org-stat-value">${org.userCount > 0 ? Math.min(100, org.userCount * 10) : 0}%</div>
            <div class="org-stat-label">Adoção</div>
          </div>
        </div>
        
        <div class="org-cell-actions">
          <button class="org-action-btn" onclick="viewUsers('${org.id}')">
            <span class="icon">👥</span>
            <span>Ver Usuários</span>
          </button>
          
          <button class="org-action-btn" onclick="viewTools('${org.id}')">
            <span class="icon">🛠️</span>
            <span>Ferramentas</span>
          </button>
          
          <button class="org-action-btn" onclick="viewDetails('${org.id}')">
            <span class="icon">📋</span>
            <span>Detalhes</span>
          </button>
          
          <button class="org-action-btn" onclick="editOrganization('${org.id}')">
            <span class="icon">⚙️</span>
            <span>Editar</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function updateStats() {
  const totalOrgs = organizationsData.length;
  const totalUsers = organizationsData.reduce((sum, org) => sum + (org.userCount || 0), 0);
  
  const statOrgs = document.getElementById('stat-organizations');
  const statUsers = document.getElementById('stat-users');
  
  if (statOrgs) statOrgs.textContent = totalOrgs;
  if (statUsers) statUsers.textContent = totalUsers;
}

function setupEventListeners() {
  window.refreshOrganizations = async () => {
    console.log('🔄 Refresh manual solicitado');
    hasLoadedOnce = false; // Permitir recarregar
    await loadOrganizationsOnce();
  };
  window.openNewOrgModal = () => alert('Modal de nova empresa em desenvolvimento...');
}

// Funções globais para ações
window.viewUsers = (orgId) => {
  const org = organizationsData.find(o => o.id === orgId);
  if (!org) return;
  alert(`Usuários da ${org.name}:\n\n${org.users.map(u => `• ${u.name} (${u.email})`).join('\n') || 'Nenhum usuário'}`);
};

window.viewTools = (orgId) => {
  const org = organizationsData.find(o => o.id === orgId);
  if (!org) return;
  alert(`Ferramentas:\n\n${org.tools.map(t => `• ${t.name}`).join('\n') || 'Nenhuma ferramenta'}`);
};

window.viewDetails = (orgId) => {
  const org = organizationsData.find(o => o.id === orgId);
  if (!org) return;
  alert(`📊 DETALHES\n\n🏢 ${org.name}\n🆔 ${org.id}\n📅 ${new Date(org.created_at).toLocaleString('pt-BR')}\n👥 ${org.userCount} usuários\n🛠️ ${org.toolCount} ferramentas`);
};

window.editOrganization = (id) => alert(`Editar empresa: ${id}`);
window.editUser = (id) => alert(`Editar usuário: ${id}`);
window.editTool = (id) => alert(`Editar ferramenta: ${id}`);
