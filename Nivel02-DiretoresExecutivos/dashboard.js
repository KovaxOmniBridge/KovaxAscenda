// Configuração da API
const API_URL = 'http://localhost:3000/api';

// Dados do usuário logado
let currentUser = null;
let subordinates = [];

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        window.location.href = '../index.html';
        return;
    }

    currentUser = JSON.parse(user);

    // Verificar se é nível 2 (Diretor)
    if (currentUser.nivel !== 2 && currentUser.nivel !== 0 && currentUser.nivel !== 1) {
        alert('Acesso negado. Área restrita para Diretores.');
        window.location.href = '../index.html';
        return;
    }

    await loadDashboardData();
});

// Carregar dados do dashboard
async function loadDashboardData() {
    try {
        // Atualizar informações do header
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = currentUser.role;
        document.getElementById('companyName').textContent = currentUser.company.name;
        document.getElementById('departmentBreadcrumb').textContent = `${currentUser.company.name} > ${currentUser.department}`;
        
        // Iniciais do avatar
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('userAvatar').textContent = initials;
        document.getElementById('currentUserAvatar').textContent = initials;
        
        // Dados do usuário atual
        document.getElementById('currentUserName').textContent = currentUser.name;
        document.getElementById('currentUserDepartment').textContent = currentUser.department;
        
        // Carregar subordinados
        await loadSubordinates();
        
        // Atualizar estatísticas
        updateStats();
        
        // Preencher configurações
        document.getElementById('settingsName').value = currentUser.name;
        document.getElementById('settingsEmail').value = currentUser.email;
        document.getElementById('settingsPhone').value = currentUser.phone || '';
        document.getElementById('settingsDepartment').value = currentUser.department;

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showMessage('Erro ao carregar dados do dashboard', 'error');
    }
}

// Carregar subordinados
async function loadSubordinates() {
    try {
        const response = await fetch(`${API_URL}/users/subordinates/${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            subordinates = await response.json();
            renderSubordinates();
        } else {
            // Se o endpoint ainda não existe, usar dados mockados
            console.log('Endpoint de subordinados ainda não implementado, usando dados de exemplo');
            subordinates = [];
            renderSubordinates();
        }

    } catch (error) {
        console.error('Erro ao carregar subordinados:', error);
        subordinates = [];
        renderSubordinates();
    }
}

// Renderizar subordinados
function renderSubordinates() {
    const managers = subordinates.filter(u => u.nivel === 3);
    const managersGrid = document.getElementById('managersGrid');
    
    if (managers.length === 0) {
        managersGrid.innerHTML = `
            <div class="empty-state">
                <p>Nenhum gerente subordinado ainda</p>
                <button class="btn-primary" onclick="openAddManagerModal()">Adicionar Gerente</button>
            </div>
        `;
        document.getElementById('managersCount').textContent = '0';
    } else {
        managersGrid.innerHTML = managers.map(manager => {
            const initials = manager.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            return `
                <div class="user-card">
                    <div class="user-card-header">
                        <div class="user-card-avatar">${initials}</div>
                        <div>
                            <h4>${manager.name}</h4>
                            <p>${manager.role}</p>
                            <p style="font-size: 0.75rem; color: #6b7280;">${manager.email}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('managersCount').textContent = managers.length;
    }

    // Resumo da equipe completa
    const teamSummary = document.getElementById('teamSummary');
    const levels = {
        4: subordinates.filter(u => u.nivel === 4).length,
        5: subordinates.filter(u => u.nivel === 5).length,
        6: subordinates.filter(u => u.nivel === 6).length,
        7: subordinates.filter(u => u.nivel === 7).length
    };

    teamSummary.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
            <div style="text-align: center; padding: 1rem; background: white; border-radius: 0.5rem;">
                <div style="font-size: 2rem;">📊</div>
                <div style="font-size: 1.5rem; font-weight: bold;">${levels[4]}</div>
                <div style="font-size: 0.875rem; color: #6b7280;">Coordenadores</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: white; border-radius: 0.5rem;">
                <div style="font-size: 2rem;">⭐</div>
                <div style="font-size: 1.5rem; font-weight: bold;">${levels[5]}</div>
                <div style="font-size: 0.875rem; color: #6b7280;">Supervisores</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: white; border-radius: 0.5rem;">
                <div style="font-size: 2rem;">👤</div>
                <div style="font-size: 1.5rem; font-weight: bold;">${levels[6]}</div>
                <div style="font-size: 0.875rem; color: #6b7280;">Analistas</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: white; border-radius: 0.5rem;">
                <div style="font-size: 2rem;">👥</div>
                <div style="font-size: 1.5rem; font-weight: bold;">${levels[7]}</div>
                <div style="font-size: 0.875rem; color: #6b7280;">Assistentes</div>
            </div>
        </div>
    `;
    
    document.getElementById('teamCount').textContent = subordinates.length;
}

// Atualizar estatísticas
function updateStats() {
    const managers = subordinates.filter(u => u.nivel === 3);
    document.getElementById('totalSubordinates').textContent = subordinates.length;
    document.getElementById('totalManagers').textContent = managers.length;
    
    // Metas e performance são exemplos fixos por enquanto
    document.getElementById('goalsCompleted').textContent = '75%';
    document.getElementById('performance').textContent = '82%';
}

// Navegação entre seções
function showSection(sectionName) {
    // Remover active de todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remover active de todos os nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Ativar seção selecionada
    document.getElementById(`section-${sectionName}`).classList.add('active');
    
    // Ativar nav item correspondente
    event.target.closest('.nav-item').classList.add('active');

    // Atualizar título
    const titles = {
        'overview': 'Visão Geral do Departamento',
        'department': 'Meu Departamento',
        'team': 'Gerenciamento de Equipe',
        'reports': 'Relatórios do Departamento',
        'goals': 'Metas do Departamento',
        'settings': 'Configurações'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName];
}

// Filtrar equipe
function filterTeam() {
    // Implementação futura
    console.log('Filtrando equipe...');
}

// Modal: Adicionar Gerente
function openAddManagerModal() {
    showMessage('Funcionalidade de adicionar gerente em desenvolvimento. Use o painel de Administradores Gerais para adicionar usuários.', 'warning');
}

// Logout
function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    }
}

// Função para exibir mensagens
function showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        max-width: 400px;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#10b981';
        messageDiv.style.color = 'white';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#ef4444';
        messageDiv.style.color = 'white';
    } else if (type === 'warning') {
        messageDiv.style.backgroundColor = '#f59e0b';
        messageDiv.style.color = 'white';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
