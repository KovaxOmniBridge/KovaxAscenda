import { getCurrentDeveloper, logoutDeveloper } from './dev-auth.js';

const state = {
  organizations: [],
  users: [],
  tools: [],
  loaded: false
};

document.addEventListener('DOMContentLoaded', async () => {
  const dev = getCurrentDeveloper();
  if (!dev) {
    window.location.href = 'login.html';
    return;
  }

  const userInfo = document.getElementById('dev-user-info');
  if (userInfo) userInfo.innerHTML = '<span>' + dev.email + '</span>';

  const logoutBtn = document.getElementById('dev-logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logoutDeveloper);

  setupNavigation();
  await loadData();
});

function setupNavigation() {
  document.querySelectorAll('.dev-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.getAttribute('data-section');
      switchSection(section);
    });
  });
}

function switchSection(section) {
  document.querySelectorAll('.dev-nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector('[data-section="' + section + '"]')?.classList.add('active');

  document.querySelectorAll('.dev-section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + section)?.classList.add('active');

  const titles = {
    overview: 'Visao Geral',
    organizations: 'Empresas',
    users: 'Usuarios',
    tools: 'Ferramentas',
    logs: 'Logs',
    settings: 'Configuracoes'
  };
  
  const titleEl = document.getElementById('dev-section-title');
  if (titleEl) titleEl.textContent = titles[section] || 'Dashboard';
}

async function loadData() {
  if (state.loaded) return;

  const token = localStorage.getItem('dev_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };

  try {
    const [orgsData, usersData, toolsData] = await Promise.all([
      fetch('http://localhost:3000/api/organizations', { headers }).then(r => r.json()),
      fetch('http://localhost:3000/api/users', { headers }).then(r => r.json()),
      fetch('http://localhost:3000/api/tools', { headers }).then(r => r.json())
    ]);

    console.log('Resposta organizations:', orgsData);
    console.log('Resposta users:', usersData);
    console.log('Resposta tools:', toolsData);

    state.organizations = Array.isArray(orgsData?.organizations) ? orgsData.organizations : (Array.isArray(orgsData) ? orgsData : []);
    state.users = Array.isArray(usersData?.users) ? usersData.users : (Array.isArray(usersData) ? usersData : []);
    state.tools = Array.isArray(toolsData?.tools) ? toolsData.tools : (Array.isArray(toolsData) ? toolsData : []);
    state.loaded = true;

    console.log('Carregado:', state.organizations.length, 'empresas', state.users.length, 'usuarios', state.tools.length, 'ferramentas');

    renderOrganizations();
    renderUsers();
    renderTools();
    updateStats();

  } catch (error) {
    console.error('Erro:', error);
    showError();
  }
}

function updateStats() {
  const statsOrgs = document.getElementById('stat-organizations');
  const statsUsers = document.getElementById('stat-users');
  const statsTools = document.getElementById('stat-tools');

  if (statsOrgs) statsOrgs.textContent = state.organizations.length;
  if (statsUsers) statsUsers.textContent = state.users.length;
  if (statsTools) statsTools.textContent = state.tools.length;
}

function renderOrganizations() {
  const container = document.getElementById('organizations-grid');
  if (!container) {
    console.error('Container organizations-grid nao encontrado');
    return;
  }

  if (!Array.isArray(state.organizations) || state.organizations.length === 0) {
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;background:white;border-radius:8px;">' +
      '<p style="color:#666;">Nenhuma empresa cadastrada</p>' +
      '</div>';
    return;
  }

  const statusColors = {
    'ativo': { bg: '#e8f5e9', color: '#2e7d32', label: '✓ Ativo' },
    'pausa': { bg: '#fff3e0', color: '#e65100', label: '⏸ Pausa' },
    'desativado': { bg: '#ffebee', color: '#c62828', label: '✕ Desativado' }
  };

  container.innerHTML = state.organizations.map(org => {
    const status = org.status || 'ativo';
    const statusStyle = statusColors[status] || statusColors['ativo'];
    
    return '<div class="org-card" data-org-id="' + org.id + '" style="background:white;border:1px solid #e0e0e0;border-radius:12px;padding:1.5rem;box-shadow:0 2px 8px rgba(0,0,0,0.05);position:relative;">' +
      
      // Menu dropdown de status no topo direito
      '<div class="status-dropdown-top" data-org-id="' + org.id + '" style="position:absolute;top:1rem;right:1rem;z-index:10;">' +
        '<button onclick="toggleStatusDropdown(\'' + org.id + '\')" class="dropdown-trigger-compact" style="padding:0.375rem 0.75rem;border:1px solid ' + (status === 'ativo' ? '#2e7d32' : status === 'pausa' ? '#e65100' : '#c62828') + ';background:' + statusStyle.bg + ';color:' + statusStyle.color + ';border-radius:20px;font-size:0.75rem;font-weight:600;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:0.5rem;">' +
          '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:' + (status === 'ativo' ? '#2e7d32' : status === 'pausa' ? '#e65100' : '#c62828') + ';"></span>' +
          statusStyle.label +
          '<span style="font-size:0.6rem;transition:transform 0.3s;">▼</span>' +
        '</button>' +
        '<div class="dropdown-menu" data-dropdown="' + org.id + '" style="display:none;position:absolute;top:calc(100% + 0.5rem);right:0;min-width:220px;background:white;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:1000;overflow:hidden;">' +
          '<div onclick="selectStatus(\'' + org.id + '\', \'ativo\')" class="dropdown-item ' + (status === 'ativo' ? 'active' : '') + '" style="padding:0.75rem 1rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:0.75rem;border-left:3px solid transparent;position:relative;border-bottom:1px solid #f0f0f0;">' +
            '<span style="width:10px;height:10px;border-radius:50%;background:#2e7d32;box-shadow:0 0 0 2px rgba(46,125,50,0.1);"></span>' +
            '<div style="flex:1;">' +
              '<div style="font-weight:600;color:#2e7d32;font-size:0.875rem;">✓ Ativo</div>' +
              '<div style="font-size:0.75rem;color:#999;">Operando normalmente</div>' +
            '</div>' +
            (status === 'ativo' ? '<span style="color:#2e7d32;font-size:1.2rem;animation:checkmark 0.3s ease-out;">✓</span>' : '') +
          '</div>' +
          '<div onclick="selectStatus(\'' + org.id + '\', \'pausa\')" class="dropdown-item ' + (status === 'pausa' ? 'active' : '') + '" style="padding:0.75rem 1rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:0.75rem;border-left:3px solid transparent;position:relative;border-bottom:1px solid #f0f0f0;">' +
            '<span style="width:10px;height:10px;border-radius:50%;background:#e65100;box-shadow:0 0 0 2px rgba(230,81,0,0.1);"></span>' +
            '<div style="flex:1;">' +
              '<div style="font-weight:600;color:#e65100;font-size:0.875rem;">⏸ Pausa</div>' +
              '<div style="font-size:0.75rem;color:#999;">Temporariamente pausada</div>' +
            '</div>' +
            (status === 'pausa' ? '<span style="color:#e65100;font-size:1.2rem;animation:checkmark 0.3s ease-out;">✓</span>' : '') +
          '</div>' +
          '<div onclick="selectStatus(\'' + org.id + '\', \'desativado\')" class="dropdown-item ' + (status === 'desativado' ? 'active' : '') + '" style="padding:0.75rem 1rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:0.75rem;border-left:3px solid transparent;position:relative;">' +
            '<span style="width:10px;height:10px;border-radius:50%;background:#c62828;box-shadow:0 0 0 2px rgba(198,40,40,0.1);"></span>' +
            '<div style="flex:1;">' +
              '<div style="font-weight:600;color:#c62828;font-size:0.875rem;">✕ Desativado</div>' +
              '<div style="font-size:0.75rem;color:#999;">Completamente desativada</div>' +
            '</div>' +
            (status === 'desativado' ? '<span style="color:#c62828;font-size:1.2rem;animation:checkmark 0.3s ease-out;">✓</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      
      // Header da empresa
      '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;padding-right:6rem;">' +
        '<div style="width:48px;height:48px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;font-weight:bold;">' +
          (org.name ? org.name.charAt(0).toUpperCase() : '?') +
        '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<h3 style="margin:0;font-size:1.125rem;color:#1a1a1a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (org.name || 'Sem nome') + '</h3>' +
          '<p style="margin:0;font-size:0.75rem;color:#999;">ID: ' + (org.id || 'N/A') + '</p>' +
        '</div>' +
      '</div>' +
      
      // Stats
      '<div style="display:flex;gap:1.5rem;padding-top:1rem;border-top:1px solid #f0f0f0;margin-bottom:0;">' +
        '<div style="flex:1;">' +
          '<div style="font-size:1.5rem;font-weight:bold;color:#ff6b35;">' + (org.users_count || 0) + '</div>' +
          '<div style="font-size:0.75rem;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Usuários</div>' +
        '</div>' +
        '<div style="flex:1;">' +
          '<div style="font-size:1.5rem;font-weight:bold;color:#f7931e;">' + (org.tools_count || 0) + '</div>' +
          '<div style="font-size:0.75rem;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Ferramentas</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  
  console.log('Renderizado:', state.organizations.length, 'empresas');
  
  // Fechar dropdown ao clicar fora
  document.addEventListener('click', closeAllDropdowns);
}

window.toggleStatusDropdown = function(orgId) {
  event.stopPropagation();
  
  const dropdown = document.querySelector(`[data-dropdown="${orgId}"]`);
  const trigger = event.currentTarget;
  const arrow = trigger.querySelector('span:last-child');
  
  if (!dropdown) return;
  
  // Fechar outros dropdowns
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu !== dropdown) {
      menu.style.display = 'none';
      const parentDropdown = menu.closest('.status-dropdown, .status-dropdown-top');
      if (parentDropdown) {
        const otherTrigger = parentDropdown.querySelector('.dropdown-trigger, .dropdown-trigger-compact');
        if (otherTrigger) {
          const otherArrow = otherTrigger.querySelector('span:last-child');
          if (otherArrow) otherArrow.style.transform = 'rotate(0deg)';
        }
      }
    }
  });
  
  // Toggle dropdown atual
  const isOpen = dropdown.style.display === 'block';
  
  if (isOpen) {
    dropdown.style.animation = 'dropdownOut 0.2s ease-out';
    setTimeout(() => {
      dropdown.style.display = 'none';
      dropdown.style.animation = '';
    }, 200);
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  } else {
    dropdown.style.display = 'block';
    dropdown.style.animation = 'dropdownIn 0.3s ease-out';
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  }
};

window.selectStatus = function(orgId, newStatus) {
  event.stopPropagation();
  
  // Fechar dropdown
  const dropdown = document.querySelector(`[data-dropdown="${orgId}"]`);
  if (dropdown) {
    dropdown.style.display = 'none';
    const trigger = dropdown.previousElementSibling;
    const arrow = trigger.querySelector('span:last-child');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }
  
  // Chamar função de alteração com confirmação
  changeOrgStatus(orgId, newStatus);
};

function closeAllDropdowns(event) {
  if (!event.target.closest('.status-dropdown') && !event.target.closest('.status-dropdown-top')) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.style.display = 'none';
      const parentDropdown = menu.closest('.status-dropdown, .status-dropdown-top');
      if (parentDropdown) {
        const trigger = parentDropdown.querySelector('.dropdown-trigger, .dropdown-trigger-compact');
        if (trigger) {
          const arrow = trigger.querySelector('span:last-child');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
      }
    });
  }
}

function addRippleEffect() {
  // Removido - não precisa mais do ripple nos botões de status
}

function renderUsers() {
  const container = document.getElementById('users-list');
  if (!container) return;

  if (!Array.isArray(state.users) || state.users.length === 0) {
    container.innerHTML = '<p style="text-align:center;">Nenhum usuario</p>';
    return;
  }

  let html = '<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f5f5f5;">';
  html += '<th style="padding:0.75rem;">Nome</th><th style="padding:0.75rem;">Email</th></tr></thead><tbody>';
  
  state.users.forEach(user => {
    html += '<tr style="border-bottom:1px solid #eee;">';
    html += '<td style="padding:0.75rem;">' + user.name + '</td>';
    html += '<td style="padding:0.75rem;">' + user.email + '</td>';
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderTools() {
  const container = document.getElementById('tools-list');
  if (!container) return;

  if (!Array.isArray(state.tools) || state.tools.length === 0) {
    container.innerHTML = '<p style="text-align:center;">Nenhuma ferramenta</p>';
    return;
  }

  container.innerHTML = state.tools.map(tool =>
    '<div style="border:1px solid #ddd;padding:1rem;margin-bottom:1rem;border-radius:8px;">' +
    '<h4>' + tool.name + '</h4>' +
    '<p>' + (tool.description || '') + '</p>' +
    '</div>'
  ).join('');
}

function showError() {
  const container = document.getElementById('organizations-list');
  if (container) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;background:#fff3cd;border:1px solid #ffc107;border-radius:8px;">' +
      '<p style="color:#856404;">Erro ao carregar dados. Verifique se o servidor esta rodando.</p>' +
      '<button onclick="location.reload()" style="padding:0.75rem 1.5rem;background:#ff5722;color:white;border:none;border-radius:8px;cursor:pointer;">Recarregar</button>' +
      '</div>';
  }
}

window.refreshOrganizations = function() {
  state.loaded = false;
  loadData();
};

window.changeOrgStatus = async function(orgId, newStatus) {
  const org = state.organizations.find(o => o.id === orgId);
  if (!org) return;

  const statusLabels = {
    'ativo': '✓ Ativo',
    'pausa': '⏸ Pausa',
    'desativado': '✕ Desativado'
  };

  const statusWarnings = {
    'pausa': 'A empresa ficará temporariamente pausada. Usuários não poderão acessar o sistema.',
    'desativado': '⚠️ ATENÇÃO: Esta ação desativará completamente a empresa. Todos os usuários perderão acesso imediatamente.',
    'ativo': 'A empresa voltará a funcionar normalmente e todos os usuários terão acesso restaurado.'
  };

  // Abrir modal de confirmação
  const modal = document.getElementById('confirm-modal');
  const confirmText = document.getElementById('confirm-text');
  const confirmOrgName = document.getElementById('confirm-org-name');
  const confirmNewStatus = document.getElementById('confirm-new-status');
  const confirmWarning = document.getElementById('confirm-warning');
  
  if (modal && confirmText && confirmOrgName && confirmNewStatus && confirmWarning) {
    confirmOrgName.textContent = org.name;
    confirmNewStatus.textContent = statusLabels[newStatus];
    confirmWarning.textContent = statusWarnings[newStatus];
    
    // Adicionar classe de perigo se for desativação
    confirmWarning.className = newStatus === 'desativado' ? 'warning-danger' : 'warning-info';
    
    modal.style.display = 'flex';
    
    // Guardar dados para confirmação
    window.pendingStatusChange = { orgId, newStatus };
  }
};

window.confirmStatusChange = async function() {
  const { orgId, newStatus } = window.pendingStatusChange || {};
  if (!orgId || !newStatus) return;

  try {
    const token = localStorage.getItem('dev_token');
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      closeConfirmModal();
      return;
    }

    // Mostrar loading
    const confirmBtn = document.querySelector('.btn-confirm');
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = '⏳ Processando...';
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.7';

    const response = await fetch(`http://localhost:3000/api/organizations/${orgId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await response.json();

    if (data.success) {
      console.log('✓ Status atualizado:', newStatus);
      
      // Atualizar estado local
      const org = state.organizations.find(o => o.id === orgId);
      if (org) {
        const oldStatus = org.status;
        org.status = newStatus;
        
        // Fechar modal
        closeConfirmModal();
        
        // Animação de cascata
        await animateCascadeEffect(orgId, newStatus);
        
        // Re-renderizar
        renderOrganizations();
        
        // Mostrar notificação de sucesso
        const statusEmojis = {
          'ativo': '✅',
          'pausa': '⏸️',
          'desativado': '🔴'
        };
        showNotification(
          `${statusEmojis[newStatus]} ${org.name} - Status alterado para ${newStatus}`,
          'success'
        );
      }
      
    } else {
      confirmBtn.textContent = originalText;
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
      alert('Erro: ' + data.message);
    }

  } catch (error) {
    console.error('Erro ao alterar status:', error);
    showNotification('❌ Erro ao alterar status da empresa', 'error');
    closeConfirmModal();
  }
};

window.closeConfirmModal = function() {
  const modal = document.getElementById('confirm-modal');
  if (modal) {
    modal.style.display = 'none';
    window.pendingStatusChange = null;
  }
};

async function animateCascadeEffect(orgId, newStatus) {
  const container = document.getElementById('organizations-grid');
  if (!container) return;
  
  const cards = container.querySelectorAll('.org-card');
  
  // Encontrar o card alterado
  let targetCard = null;
  let targetIndex = -1;
  
  cards.forEach((card, index) => {
    if (card.dataset.orgId === orgId) {
      targetCard = card;
      targetIndex = index;
    }
  });

  if (targetCard) {
    // Efeito visual inicial - destaque do card
    targetCard.style.transition = 'all 0.3s ease-out';
    targetCard.style.transform = 'scale(1.05)';
    targetCard.style.boxShadow = '0 12px 32px rgba(255, 107, 53, 0.4)';
    targetCard.style.zIndex = '100';
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Efeito de pulse
    targetCard.style.animation = 'pulse-status 0.6s ease-out';
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Efeito cascata - animar cards adjacentes
    const animateAdjacentCards = async (distance) => {
      const leftCard = cards[targetIndex - distance];
      const rightCard = cards[targetIndex + distance];
      
      const animateCard = (card) => {
        if (card) {
          card.style.transition = 'transform 0.2s ease-out';
          card.style.transform = 'translateY(-4px)';
          setTimeout(() => {
            card.style.transform = '';
          }, 200);
        }
      };
      
      animateCard(leftCard);
      animateCard(rightCard);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    };
    
    // Cascata em ondas
    for (let i = 1; i <= 2 && (targetIndex - i >= 0 || targetIndex + i < cards.length); i++) {
      await animateAdjacentCards(i);
    }
    
    // Resetar card principal
    targetCard.style.transform = '';
    targetCard.style.boxShadow = '';
    targetCard.style.zIndex = '';
    targetCard.style.animation = '';
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: ${type === 'success' ? 'linear-gradient(135deg, #4caf50, #45a049)' : 'linear-gradient(135deg, #f44336, #e53935)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    font-weight: 600;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

window.openNewOrgModal = function() {
  const modal = document.getElementById('org-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('org-name').value = '';
    document.getElementById('org-slug').value = '';
    
    // Auto-gerar slug baseado no nome
    const nameInput = document.getElementById('org-name');
    const slugInput = document.getElementById('org-slug');
    
    nameInput.addEventListener('input', function() {
      const slug = this.value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-|-$/g, ''); // Remove hífens do início/fim
      slugInput.value = slug;
    });
  }
};

window.closeOrgModal = function() {
  const modal = document.getElementById('org-modal');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.createOrganization = async function() {
  try {
    const name = document.getElementById('org-name').value.trim();
    const slug = document.getElementById('org-slug').value.trim();

    if (!name || !slug) {
      alert('Preencha todos os campos');
      return;
    }

    const token = localStorage.getItem('dev_token');
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

    const response = await fetch('http://localhost:3000/api/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, slug })
    });

    const data = await response.json();

    if (data.success) {
      alert('Empresa criada com sucesso!');
      closeOrgModal();
      refreshOrganizations();
    } else {
      alert('Erro: ' + data.message);
    }

  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    alert('Erro ao criar empresa');
  }
};
