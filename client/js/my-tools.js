// =====================================================
// MINHAS FERRAMENTAS - SELEÇÃO
// =====================================================

const API_URL = 'http://localhost:3000/api';

// Estado Global
const state = {
  loaded: false,
  user: null,
  toolsByCategory: [],
  selectedTools: new Set(),
  initialSelection: new Set(),
  hasChanges: false
};

// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function init() {
  if (state.loaded) return;
  state.loaded = true;

  console.log('🚀 Inicializando seleção de ferramentas...');

  // Verificar autenticação
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../public/login.html';
    return;
  }

  // Carregar dados do usuário e ferramentas
  await loadUserInfo();
  await loadAvailableTools();

  // Event listeners
  setupEventListeners();

  console.log('✅ Seleção de ferramentas inicializada');
}

function setupEventListeners() {
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  // Salvar preferências
  document.getElementById('save-btn')?.addEventListener('click', savePreferences);
}

// =====================================================
// CARREGAR DADOS
// =====================================================

async function loadUserInfo() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success && data.user) {
      state.user = data.user;
      
      // Atualizar UI
      const userInfo = document.getElementById('user-info');
      if (userInfo) {
        userInfo.innerHTML = `
          <span class="user-name">${data.user.name}</span>
          <span class="user-org">${data.user.organization?.name || ''}</span>
        `;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar informações do usuário:', error);
  }
}

async function loadAvailableTools() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/available-tools`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      state.toolsByCategory = data.toolsByCategory || [];
      
      // Inicializar seleção com ferramentas já habilitadas
      data.tools.forEach(tool => {
        if (tool.user_enabled) {
          state.selectedTools.add(tool.id);
          state.initialSelection.add(tool.id);
        }
      });

      // Atualizar UI
      updateStats(data.totalAvailable, state.selectedTools.size);
      renderTools();
      
      // Informações do cargo
      if (state.user?.position) {
        document.getElementById('user-position').textContent = state.user.position.name;
        document.getElementById('available-count').textContent = data.totalAvailable;
      }
    } else {
      showMessage(data.message || 'Erro ao carregar ferramentas', 'error');
    }
  } catch (error) {
    console.error('Erro ao carregar ferramentas:', error);
    showMessage('Erro ao carregar ferramentas', 'error');
  }
}

// =====================================================
// RENDERIZAÇÃO
// =====================================================

function renderTools() {
  const container = document.getElementById('tools-container');
  if (!container) return;

  if (state.toolsByCategory.length === 0) {
    container.innerHTML = `
      <div class="empty-tools">
        <div class="empty-tools-icon">🛠️</div>
        <h3>Nenhuma ferramenta disponível</h3>
        <p>Entre em contato com o administrador da sua empresa</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  state.toolsByCategory.forEach(category => {
    const categorySection = createCategorySection(category);
    container.appendChild(categorySection);
  });
}

function createCategorySection(category) {
  const section = document.createElement('div');
  section.className = 'category-section';

  const selectedInCategory = category.tools.filter(t => 
    state.selectedTools.has(t.id)
  ).length;

  section.innerHTML = `
    <div class="category-header">
      <span class="category-icon">${category.icon}</span>
      <div class="category-title">
        <h2>${category.name}</h2>
        <span class="category-count">
          ${selectedInCategory} de ${category.tools.length} selecionadas
        </span>
      </div>
      <div class="category-actions">
        <button onclick="window.selectAllInCategory('${category.name}')">
          Selecionar Todas
        </button>
        <button onclick="window.deselectAllInCategory('${category.name}')">
          Desmarcar Todas
        </button>
      </div>
    </div>
    <div class="tools-grid" id="tools-grid-${category.name.replace(/\s+/g, '-')}"></div>
  `;

  const grid = section.querySelector('.tools-grid');
  category.tools.forEach(tool => {
    const toolCard = createToolCard(tool);
    grid.appendChild(toolCard);
  });

  return section;
}

function createToolCard(tool) {
  const card = document.createElement('div');
  card.className = 'tool-card';
  card.dataset.toolId = tool.id;

  if (state.selectedTools.has(tool.id)) {
    card.classList.add('selected');
  }

  card.innerHTML = `
    <div class="tool-header">
      <span class="tool-icon">${tool.icon || '🔧'}</span>
      <div class="tool-info">
        <h3>${tool.name}</h3>
      </div>
    </div>
    ${tool.description ? `
      <p class="tool-description">${tool.description}</p>
    ` : ''}
    ${tool.url ? `
      <div class="tool-footer">
        <a href="${tool.url}" target="_blank" class="tool-link" onclick="event.stopPropagation()">
          🔗 Acessar ferramenta
        </a>
      </div>
    ` : ''}
  `;

  card.addEventListener('click', () => toggleToolSelection(tool.id));

  return card;
}

// =====================================================
// SELEÇÃO DE FERRAMENTAS
// =====================================================

function toggleToolSelection(toolId) {
  const card = document.querySelector(`[data-tool-id="${toolId}"]`);
  if (!card) return;

  if (state.selectedTools.has(toolId)) {
    state.selectedTools.delete(toolId);
    card.classList.remove('selected');
  } else {
    state.selectedTools.add(toolId);
    card.classList.add('selected');
  }

  checkForChanges();
  updateSelectedCount();
}

window.selectAllInCategory = function(categoryName) {
  const category = state.toolsByCategory.find(c => c.name === categoryName);
  if (!category) return;

  category.tools.forEach(tool => {
    state.selectedTools.add(tool.id);
    const card = document.querySelector(`[data-tool-id="${tool.id}"]`);
    if (card) card.classList.add('selected');
  });

  checkForChanges();
  updateSelectedCount();
  updateCategoryCount(categoryName);
};

window.deselectAllInCategory = function(categoryName) {
  const category = state.toolsByCategory.find(c => c.name === categoryName);
  if (!category) return;

  category.tools.forEach(tool => {
    state.selectedTools.delete(tool.id);
    const card = document.querySelector(`[data-tool-id="${tool.id}"]`);
    if (card) card.classList.remove('selected');
  });

  checkForChanges();
  updateSelectedCount();
  updateCategoryCount(categoryName);
};

// =====================================================
// ATUALIZAR CONTADORES
// =====================================================

function updateStats(total, selected) {
  document.getElementById('total-available').textContent = total;
  document.getElementById('total-selected').textContent = selected;
}

function updateSelectedCount() {
  const total = state.toolsByCategory.reduce((sum, cat) => sum + cat.tools.length, 0);
  updateStats(total, state.selectedTools.size);
  
  // Atualizar contadores de categoria
  state.toolsByCategory.forEach(category => {
    updateCategoryCount(category.name);
  });
}

function updateCategoryCount(categoryName) {
  const category = state.toolsByCategory.find(c => c.name === categoryName);
  if (!category) return;

  const selectedInCategory = category.tools.filter(t => 
    state.selectedTools.has(t.id)
  ).length;

  const countElement = document.querySelector(
    `#tools-grid-${categoryName.replace(/\s+/g, '-')}`
  )?.closest('.category-section')?.querySelector('.category-count');

  if (countElement) {
    countElement.textContent = `${selectedInCategory} de ${category.tools.length} selecionadas`;
  }
}

function checkForChanges() {
  // Comparar seleção atual com inicial
  const hasChanges = 
    state.selectedTools.size !== state.initialSelection.size ||
    ![...state.selectedTools].every(id => state.initialSelection.has(id));

  state.hasChanges = hasChanges;

  // Mostrar/ocultar toolbar
  const toolbar = document.getElementById('save-toolbar');
  const changesCount = document.getElementById('changes-count');
  
  if (toolbar) {
    toolbar.style.display = hasChanges ? 'block' : 'none';
  }

  if (changesCount) {
    const addedCount = [...state.selectedTools].filter(id => 
      !state.initialSelection.has(id)
    ).length;
    const removedCount = [...state.initialSelection].filter(id => 
      !state.selectedTools.has(id)
    ).length;
    
    changesCount.textContent = addedCount + removedCount;
  }
}

// =====================================================
// SALVAR PREFERÊNCIAS
// =====================================================

async function savePreferences() {
  const saveBtn = document.getElementById('save-btn');
  if (!saveBtn) return;

  // Desabilitar botão
  saveBtn.disabled = true;
  saveBtn.innerHTML = '⏳ Salvando...';

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/tool-preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tool_ids: Array.from(state.selectedTools)
      })
    });

    const data = await response.json();

    if (data.success) {
      // Atualizar seleção inicial
      state.initialSelection = new Set(state.selectedTools);
      state.hasChanges = false;

      // Ocultar toolbar
      const toolbar = document.getElementById('save-toolbar');
      if (toolbar) toolbar.style.display = 'none';

      showMessage('✅ Preferências salvas com sucesso!', 'success');

      // Redirecionar após 2 segundos
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
    } else {
      showMessage(data.message || 'Erro ao salvar preferências', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
    showMessage('Erro ao salvar preferências', 'error');
  } finally {
    // Reabilitar botão
    saveBtn.disabled = false;
    saveBtn.innerHTML = '💾 Salvar Preferências';
  }
}

// =====================================================
// LOGOUT
// =====================================================

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../public/login.html';
}

// =====================================================
// NOTIFICAÇÕES
// =====================================================

function showMessage(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `success-message ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// =====================================================
// INICIAR
// =====================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
