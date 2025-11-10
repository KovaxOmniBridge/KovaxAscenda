// =====================================================
// GESTÃO DE USUÁRIOS - DESENVOLVEDOR
// =====================================================

const API_URL = 'http://localhost:3000/api';

// Estado Global
const state = {
  loaded: false,
  selectedOrg: null,
  organizations: [],
  users: [],
  positions: [],
  filteredUsers: [],
  editingUser: null,
  filters: {
    search: '',
    position: '',
    status: ''
  }
};

// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function init() {
  if (state.loaded) return;
  state.loaded = true;

  console.log('🚀 Inicializando gestão de usuários...');

  // Verificar autenticação
  const token = localStorage.getItem('dev_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Carregar dados iniciais
  await loadOrganizations();

  // Event listeners
  setupEventListeners();

  console.log('✅ Gestão de usuários inicializada');
}

function setupEventListeners() {
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  // Seletor de organização
  document.getElementById('org-select')?.addEventListener('change', async (e) => {
    state.selectedOrg = e.target.value;
    if (state.selectedOrg) {
      await Promise.all([
        loadUsers(state.selectedOrg),
        loadPositions(state.selectedOrg)
      ]);
      document.getElementById('new-user-btn').disabled = false;
    } else {
      document.getElementById('users-tbody').innerHTML = '';
      document.getElementById('new-user-btn').disabled = true;
    }
  });

  // Botão novo usuário
  document.getElementById('new-user-btn')?.addEventListener('click', () => {
    window.openUserModal();
  });

  // Filtros
  document.getElementById('search-input')?.addEventListener('input', (e) => {
    state.filters.search = e.target.value.toLowerCase();
    applyFilters();
  });

  document.getElementById('position-filter')?.addEventListener('change', (e) => {
    state.filters.position = e.target.value;
    applyFilters();
  });

  document.getElementById('status-filter')?.addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    applyFilters();
  });

  // Seletor de cargo no modal
  document.getElementById('user-position')?.addEventListener('change', (e) => {
    const positionId = e.target.value;
    if (positionId) {
      showPositionToolsPreview(positionId);
    } else {
      hidePositionToolsPreview();
    }
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

async function loadUsers(orgId) {
  try {
    const token = localStorage.getItem('dev_token');
    const response = await fetch(`${API_URL}/users?organization_id=${orgId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      state.users = data.users || [];
      state.filteredUsers = [...state.users];
      renderUsers();
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    showNotification('Erro ao carregar usuários', 'error');
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
      renderPositionFilters();
      renderPositionSelect();
    }
  } catch (error) {
    console.error('Erro ao carregar cargos:', error);
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

function renderPositionFilters() {
  const select = document.getElementById('position-filter');
  if (!select) return;

  const currentValue = select.value;
  select.innerHTML = '<option value="">Todos os cargos</option>';
  
  state.positions.forEach(pos => {
    const option = document.createElement('option');
    option.value = pos.id;
    option.textContent = pos.name;
    select.appendChild(option);
  });

  select.value = currentValue;
}

function renderPositionSelect() {
  const select = document.getElementById('user-position');
  if (!select) return;

  const currentValue = select.value;
  select.innerHTML = '<option value="">Selecione um cargo</option>';
  
  state.positions
    .filter(pos => pos.is_active)
    .forEach(pos => {
      const option = document.createElement('option');
      option.value = pos.id;
      option.textContent = `${pos.name}${pos.tools_count ? ` (${pos.tools_count} ferramentas)` : ''}`;
      select.appendChild(option);
    });

  select.value = currentValue;
}

function renderUsers() {
  const tbody = document.getElementById('users-tbody');
  const emptyState = document.getElementById('empty-state');
  const container = document.getElementById('users-container');
  
  if (!tbody) return;

  if (state.filteredUsers.length === 0) {
    tbody.innerHTML = '';
    container.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  container.style.display = 'block';
  emptyState.style.display = 'none';
  tbody.innerHTML = '';

  state.filteredUsers.forEach(user => {
    const row = createUserRow(user);
    tbody.appendChild(row);
  });
}

function createUserRow(user) {
  const tr = document.createElement('tr');

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const position = state.positions.find(p => p.id === user.position_id);
  const positionName = position ? position.name : 'Sem cargo';

  const createdDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('pt-BR')
    : '-';

  tr.innerHTML = `
    <td>
      <div class="user-cell">
        <div class="user-avatar">${initials}</div>
        <div class="user-info">
          <h4>${user.name}</h4>
          <p>${user.type === 'developer' ? '🔧 Desenvolvedor' : '👤 Funcionário'}</p>
        </div>
      </div>
    </td>
    <td>
      <span class="position-badge">
        👔 ${positionName}
      </span>
    </td>
    <td>${user.email}</td>
    <td>
      <span class="status-badge ${user.is_active ? 'active' : 'inactive'}">
        <span class="status-indicator"></span>
        ${user.is_active ? 'Ativo' : 'Inativo'}
      </span>
    </td>
    <td>${createdDate}</td>
    <td>
      <div class="table-actions">
        <button class="action-btn" onclick="window.editUser('${user.id}')">
          ✏️ Editar
        </button>
        <button class="action-btn danger" onclick="window.deleteUser('${user.id}', '${user.name}')">
          🗑️ Excluir
        </button>
      </div>
    </td>
  `;

  return tr;
}

// =====================================================
// FILTROS
// =====================================================

function applyFilters() {
  state.filteredUsers = state.users.filter(user => {
    // Filtro de busca
    if (state.filters.search) {
      const searchLower = state.filters.search;
      const matchesName = user.name.toLowerCase().includes(searchLower);
      const matchesEmail = user.email.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesEmail) return false;
    }

    // Filtro de cargo
    if (state.filters.position && user.position_id !== state.filters.position) {
      return false;
    }

    // Filtro de status
    if (state.filters.status !== '') {
      const isActive = parseInt(state.filters.status);
      if (user.is_active !== isActive) return false;
    }

    return true;
  });

  renderUsers();
}

// =====================================================
// MODAL - CRIAR/EDITAR USUÁRIO
// =====================================================

window.openUserModal = async function(userId = null) {
  const modal = document.getElementById('user-modal');
  const title = document.getElementById('modal-title');
  const passwordRow = document.getElementById('password-row');
  
  if (userId) {
    // Modo edição
    title.textContent = 'Editar Usuário';
    await loadUserForEdit(userId);
    
    // Tornar senha opcional na edição
    document.getElementById('user-password').removeAttribute('required');
    document.getElementById('user-password-confirm').removeAttribute('required');
    document.querySelector('#password-row .form-hint').style.display = 'block';
  } else {
    // Modo criação
    title.textContent = 'Novo Usuário';
    state.editingUser = null;
    
    // Limpar formulário
    document.getElementById('user-name').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-password-confirm').value = '';
    document.getElementById('user-position').value = '';
    document.getElementById('user-active').checked = true;
    
    // Senha obrigatória na criação
    document.getElementById('user-password').setAttribute('required', 'required');
    document.getElementById('user-password-confirm').setAttribute('required', 'required');
    document.querySelector('#password-row .form-hint').style.display = 'none';
    
    hidePositionToolsPreview();
  }

  modal.classList.add('active');
};

window.closeUserModal = function() {
  const modal = document.getElementById('user-modal');
  modal.classList.remove('active');
  state.editingUser = null;
};

async function loadUserForEdit(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) {
    showNotification('Usuário não encontrado', 'error');
    return;
  }

  state.editingUser = user;

  // Preencher formulário
  document.getElementById('user-name').value = user.name;
  document.getElementById('user-email').value = user.email;
  document.getElementById('user-position').value = user.position_id || '';
  document.getElementById('user-active').checked = user.is_active;

  if (user.position_id) {
    showPositionToolsPreview(user.position_id);
  }
}

async function showPositionToolsPreview(positionId) {
  const preview = document.getElementById('position-tools-preview');
  if (!preview) return;

  try {
    const token = localStorage.getItem('dev_token');
    const response = await fetch(`${API_URL}/positions/${positionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success && data.position && data.position.tools) {
      const tools = data.position.tools;
      
      if (tools.length === 0) {
        preview.innerHTML = `
          <h5>🛠️ Ferramentas Permitidas</h5>
          <p style="color: var(--text-light); font-size: 0.9rem;">Este cargo não tem ferramentas configuradas</p>
        `;
      } else {
        const toolsHtml = tools.map(tool => `
          <span class="preview-tool-badge">
            ${tool.icon || '🔧'} ${tool.name}
          </span>
        `).join('');
        
        preview.innerHTML = `
          <h5>🛠️ Ferramentas Permitidas (${tools.length})</h5>
          <div class="preview-tools-list">
            ${toolsHtml}
          </div>
        `;
      }

      preview.classList.add('active');
    }
  } catch (error) {
    console.error('Erro ao carregar ferramentas do cargo:', error);
  }
}

function hidePositionToolsPreview() {
  const preview = document.getElementById('position-tools-preview');
  if (preview) {
    preview.classList.remove('active');
  }
}

// =====================================================
// SALVAR USUÁRIO
// =====================================================

window.saveUser = async function() {
  const name = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const password = document.getElementById('user-password').value;
  const passwordConfirm = document.getElementById('user-password-confirm').value;
  const positionId = document.getElementById('user-position').value;
  const isActive = document.getElementById('user-active').checked;

  // Validações
  if (!name || !email || !positionId) {
    showNotification('Preencha todos os campos obrigatórios', 'error');
    return;
  }

  if (!state.selectedOrg && !state.editingUser) {
    showNotification('Selecione uma empresa', 'error');
    return;
  }

  // Validar senha apenas se estiver criando ou se preencheu a senha na edição
  if (!state.editingUser || password) {
    if (!password || password.length < 6) {
      showNotification('A senha deve ter no mínimo 6 caracteres', 'error');
      return;
    }

    if (password !== passwordConfirm) {
      showNotification('As senhas não coincidem', 'error');
      return;
    }
  }

  const userData = {
    organization_id: state.selectedOrg,
    name,
    email,
    position_id: positionId,
    is_active: isActive ? 1 : 0
  };

  // Incluir senha apenas se foi fornecida
  if (password) {
    userData.password = password;
  }

  try {
    const token = localStorage.getItem('dev_token');
    const url = state.editingUser 
      ? `${API_URL}/users/${state.editingUser.id}`
      : `${API_URL}/users`;
    
    const method = state.editingUser ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (data.success) {
      showNotification(
        state.editingUser ? 'Usuário atualizado!' : 'Usuário criado!', 
        'success'
      );
      window.closeUserModal();
      await loadUsers(state.selectedOrg);
    } else {
      showNotification(data.message || 'Erro ao salvar usuário', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    showNotification('Erro ao salvar usuário', 'error');
  }
};

// =====================================================
// EDITAR USUÁRIO
// =====================================================

window.editUser = async function(userId) {
  await window.openUserModal(userId);
};

// =====================================================
// EXCLUIR USUÁRIO
// =====================================================

let userToDelete = null;

window.deleteUser = function(userId, userName) {
  userToDelete = userId;
  
  const modal = document.getElementById('delete-modal');
  const message = document.getElementById('delete-message');

  message.textContent = `Tem certeza que deseja excluir o usuário "${userName}"?`;

  modal.classList.add('active');
};

window.closeDeleteModal = function() {
  const modal = document.getElementById('delete-modal');
  modal.classList.remove('active');
  userToDelete = null;
};

window.confirmDelete = async function() {
  if (!userToDelete) return;

  try {
    const token = localStorage.getItem('dev_token');
    const response = await fetch(`${API_URL}/users/${userToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Usuário excluído com sucesso!', 'success');
      window.closeDeleteModal();
      await loadUsers(state.selectedOrg);
    } else {
      showNotification(data.message || 'Erro ao excluir usuário', 'error');
    }
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    showNotification('Erro ao excluir usuário', 'error');
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
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
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
