// =====================================================
// GESTÃO DE CARGOS - DESENVOLVEDOR
// =====================================================

const API_URL = 'http://localhost:3000/api';

// Estado Global
const state = {
  loaded: false,
  selectedOrg: null,
  organizations: [],
  positions: [],
  tools: [],
  toolsByCategory: {},
  editingPosition: null
};

// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function init() {
  if (state.loaded) return;
  state.loaded = true;

  console.log('🚀 Inicializando gestão de cargos...');

  // Verificar autenticação
  const token = localStorage.getItem('dev_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Carregar dados iniciais
  await loadOrganizations();
  await loadTools();

  // Event listeners
  setupEventListeners();

  console.log('✅ Gestão de cargos inicializada');
}

function setupEventListeners() {
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  // Seletor de organização
  document.getElementById('org-select')?.addEventListener('change', (e) => {
    state.selectedOrg = e.target.value;
    if (state.selectedOrg) {
      loadPositions(state.selectedOrg);
      document.getElementById('new-position-btn').disabled = false;
    } else {
      document.getElementById('positions-grid').innerHTML = '';
      document.getElementById('new-position-btn').disabled = true;
    }
  });

  // Botão novo cargo
  document.getElementById('new-position-btn')?.addEventListener('click', () => {
    window.openPositionModal();
  });
}

// =====================================================
// CARREGAR DADOS
// =====================================================

async function loadOrganizations() {
  try {
    const token = localStorage.getItem('dev_token');
    const response = await fetch(`${API_URL}/organizations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      state.organizations = data.organizations || [];
      renderOrganizationSelector();
    }
  } catch (error) {
    console.error('Erro ao carregar organizações:', error);
    showNotification('Erro ao carregar empresas', 'error');
  }
}

async function loadTools() {
  try {
    const token = localStorage.getItem('dev_token');
    const response = await fetch(`${API_URL}/tools`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      state.tools = data.tools || [];
      
      // Agrupar por categoria
      state.toolsByCategory = state.tools.reduce((acc, tool) => {
        const category = tool.category_name || 'Outros';
        if (!acc[category]) {
          acc[category] = {
            name: category,
            icon: tool.category_icon || '📦',
            tools: []
          };
        }
        acc[category].tools.push(tool);
        return acc;
      }, {});

      console.log('✅ Ferramentas carregadas:', state.tools.length);
    }
  } catch (error) {
    console.error('Erro ao carregar ferramentas:', error);
  }
}

async function loadPositions(orgId) {
  try {
    const token = localStorage.getItem('dev_token');
    const response = await fetch(`${API_URL}/positions?organization_id=${orgId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      state.positions = data.positions || [];
      renderPositions();
    }
  } catch (error) {
    console.error('Erro ao carregar cargos:', error);
    showNotification('Erro ao carregar cargos', 'error');
  }
}

// =====================================================
// RENDERIZAÇÃO
// =====================================================

function renderOrganizationSelector() {
  const select = document.getElementById('org-select');
  if (!select) return;

  if (state.organizations.length === 0) {
    select.innerHTML = '<option value="">Nenhuma empresa cadastrada</option>';
    select.disabled = true;
    return;
  }

  select.innerHTML = '<option value="">Selecione uma empresa</option>';
  state.organizations.forEach(org => {
    const option = document.createElement('option');
    option.value = org.id;
    option.textContent = org.name;
    select.appendChild(option);
  });

  select.disabled = false;
}

function renderPositions() {
  const grid = document.getElementById('positions-grid');
  const emptyState = document.getElementById('empty-state');
  
  if (!grid) return;

  if (state.positions.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  grid.innerHTML = '';

  state.positions.forEach(position => {
    const card = createPositionCard(position);
    grid.appendChild(card);
  });
}

function createPositionCard(position) {
  const card = document.createElement('div');
  card.className = 'position-card';

  card.innerHTML = `
    <div class="position-header">
      <div class="position-title">
        <h3>
          👔 ${position.name}
        </h3>
      </div>
    </div>

    ${position.description ? `
      <p class="position-description">${position.description}</p>
    ` : ''}

    <div class="position-stats">
      <div class="stat-item">
        <span class="stat-icon">👥</span>
        <span class="stat-value">${position.users_count || 0}</span>
        <span class="stat-label">usuários</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">🛠️</span>
        <span class="stat-value">${position.tools_count || 0}</span>
        <span class="stat-label">ferramentas</span>
      </div>
    </div>

    <div class="position-tools" id="tools-${position.id}">
      <h4>Carregando ferramentas...</h4>
    </div>

    <div class="position-actions">
      <button class="btn-icon" onclick="window.editPosition('${position.id}')">
        ✏️ Editar
      </button>
      <button class="btn-icon danger" onclick="window.deletePosition('${position.id}', '${position.name}', ${position.users_count || 0})">
        🗑️ Excluir
      </button>
    </div>
  `;

  // Carregar ferramentas do cargo
  loadPositionTools(position.id);

  return card;
}

async function loadPositionTools(positionId) {
  try {
    const token = localStorage.getItem('dev_token');
    const response = await fetch(`${API_URL}/positions/${positionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success && data.position) {
      renderPositionTools(positionId, data.position.tools || []);
    }
  } catch (error) {
    console.error('Erro ao carregar ferramentas do cargo:', error);
  }
}

function renderPositionTools(positionId, tools) {
  const container = document.getElementById(`tools-${positionId}`);
  if (!container) return;

  if (tools.length === 0) {
    container.innerHTML = `
      <h4>Ferramentas Permitidas</h4>
      <p class="no-tools">Nenhuma ferramenta configurada</p>
    `;
    return;
  }

  const toolsHtml = tools.map(tool => `
    <span class="tool-badge">
      <span class="tool-badge-icon">${tool.icon || '🔧'}</span>
      ${tool.name}
    </span>
  `).join('');

  container.innerHTML = `
    <h4>Ferramentas Permitidas</h4>
    <div class="tools-list">
      ${toolsHtml}
    </div>
  `;
}

// =====================================================
// MODAL - CRIAR/EDITAR CARGO
// =====================================================

window.openPositionModal = async function(positionId = null) {
  const modal = document.getElementById('position-modal');
  const title = document.getElementById('modal-title');
  
  if (positionId) {
    // Modo edição
    title.textContent = 'Editar Cargo';
    await loadPositionForEdit(positionId);
  } else {
    // Modo criação
    title.textContent = 'Novo Cargo';
    state.editingPosition = null;
    document.getElementById('position-name').value = '';
    document.getElementById('position-description').value = '';
  }

  // Renderizar seleção de ferramentas
  renderToolsSelection();

  modal.classList.add('active');
};

window.closePositionModal = function() {
  const modal = document.getElementById('position-modal');
  modal.classList.remove('active');
  state.editingPosition = null;
};

async function loadPositionForEdit(positionId) {
  try {
    const token = localStorage.getItem('dev_token');
    const response = await fetch(`${API_URL}/positions/${positionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success && data.position) {
      state.editingPosition = data.position;
      
      // Preencher formulário
      document.getElementById('position-name').value = data.position.name;
      document.getElementById('position-description').value = data.position.description || '';
    }
  } catch (error) {
    console.error('Erro ao carregar cargo:', error);
    showNotification('Erro ao carregar cargo', 'error');
  }
}

function renderToolsSelection() {
  const container = document.getElementById('tools-selection');
  if (!container) return;

  if (Object.keys(state.toolsByCategory).length === 0) {
    container.innerHTML = '<div class="loading-tools">Nenhuma ferramenta disponível</div>';
    return;
  }

  const selectedTools = state.editingPosition?.tools?.map(t => t.id) || [];

  let html = '';
  
  Object.values(state.toolsByCategory).forEach(category => {
    html += `
      <div class="category-section">
        <div class="category-header">
          <span class="category-icon">${category.icon}</span>
          <span class="category-name">${category.name}</span>
        </div>
        <div class="tools-checkboxes">
    `;

    category.tools.forEach(tool => {
      const checked = selectedTools.includes(tool.id) ? 'checked' : '';
      const checkedClass = checked ? 'checked' : '';
      
      html += `
        <label class="tool-checkbox ${checkedClass}">
          <input 
            type="checkbox" 
            name="tools" 
            value="${tool.id}"
            ${checked}
            onchange="this.parentElement.classList.toggle('checked', this.checked)"
          >
          <span class="tool-label">
            <span class="tool-icon">${tool.icon || '🔧'}</span>
            <span class="tool-name">${tool.name}</span>
          </span>
        </label>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// =====================================================
// SALVAR CARGO
// =====================================================

window.savePosition = async function() {
  const name = document.getElementById('position-name').value.trim();
  const description = document.getElementById('position-description').value.trim();
  
  if (!name) {
    showNotification('Digite o nome do cargo', 'error');
    return;
  }

  if (!state.selectedOrg && !state.editingPosition) {
    showNotification('Selecione uma empresa', 'error');
    return;
  }

  // Coletar ferramentas selecionadas
  const toolCheckboxes = document.querySelectorAll('input[name="tools"]:checked');
  const toolIds = Array.from(toolCheckboxes).map(cb => cb.value);

  const positionData = {
    organization_id: state.selectedOrg,
    name,
    description,
    tool_ids: toolIds
  };

  try {
    const token = localStorage.getItem('dev_token');
    const url = state.editingPosition 
      ? `${API_URL}/positions/${state.editingPosition.id}`
      : `${API_URL}/positions`;
    
    const method = state.editingPosition ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(positionData)
    });

    const data = await response.json();

    if (data.success) {
      showNotification(
        state.editingPosition ? 'Cargo atualizado!' : 'Cargo criado!', 
        'success'
      );
      window.closePositionModal();
      await loadPositions(state.selectedOrg);
    } else {
      showNotification(data.message || 'Erro ao salvar cargo', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar cargo:', error);
    showNotification('Erro ao salvar cargo', 'error');
  }
};

// =====================================================
// EDITAR CARGO
// =====================================================

window.editPosition = async function(positionId) {
  await window.openPositionModal(positionId);
};

// =====================================================
// EXCLUIR CARGO
// =====================================================

let positionToDelete = null;

window.deletePosition = function(positionId, positionName, usersCount) {
  positionToDelete = positionId;
  
  const modal = document.getElementById('delete-modal');
  const message = document.getElementById('delete-message');
  const warning = document.getElementById('delete-warning');

  message.textContent = `Tem certeza que deseja excluir o cargo "${positionName}"?`;
  
  if (usersCount > 0) {
    warning.textContent = `⚠️ Atenção: ${usersCount} usuário(s) está(ão) vinculado(s) a este cargo. Eles perderão o acesso às ferramentas.`;
    warning.style.display = 'block';
  } else {
    warning.style.display = 'none';
  }

  modal.classList.add('active');
};

window.closeDeleteModal = function() {
  const modal = document.getElementById('delete-modal');
  modal.classList.remove('active');
  positionToDelete = null;
};

window.confirmDelete = async function() {
  if (!positionToDelete) return;

  try {
    const token = localStorage.getItem('dev_token');
    const response = await fetch(`${API_URL}/positions/${positionToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Cargo excluído com sucesso!', 'success');
      window.closeDeleteModal();
      await loadPositions(state.selectedOrg);
    } else {
      showNotification(data.message || 'Erro ao excluir cargo', 'error');
    }
  } catch (error) {
    console.error('Erro ao excluir cargo:', error);
    showNotification('Erro ao excluir cargo', 'error');
  }
};

// =====================================================
// LOGOUT
// =====================================================

function logout() {
  localStorage.removeItem('dev_token');
  window.location.href = 'login.html';
}

// =====================================================
// NOTIFICAÇÕES
// =====================================================

function showNotification(message, type = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Estilos inline
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
    color: 'white',
    fontWeight: '500',
    zIndex: '10000',
    animation: 'slideInRight 0.3s ease-out',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// =====================================================
// INICIAR QUANDO DOM ESTIVER PRONTO
// =====================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
