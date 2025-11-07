/**
 * Sistema de Seleção de Papéis (Multi-Role)
 * Permite que usuários com múltiplos acessos escolham qual interface acessar
 */

const API_URL = 'http://localhost:3000/api';

// Mapeamento de níveis hierárquicos
const ROLE_CONFIG = {
    0: {
        icon: '👑',
        title: 'Presidente / C-Level',
        description: 'Dashboard executivo e aprovações estratégicas',
        path: '/Nivel00-Presidentes/dashboard-presidentes.html'
    },
    1: {
        icon: '⚙️',
        title: 'Administrador Geral',
        description: 'Gestão completa da empresa',
        path: '/Nivel01-AdministradoresGerais/dashboard-admin.html'
    },
    2: {
        icon: '💼',
        title: 'Diretor Executivo',
        description: 'Gestão de setores e departamentos',
        path: '/Nivel02-DiretoresExecutivos/dashboard-diretores.html'
    },
    3: {
        icon: '📊',
        title: 'Gerente',
        description: 'Gestão de departamento',
        path: '/Nivel03-Gerentes/dashboard-gerentes.html'
    },
    4: {
        icon: '📋',
        title: 'Coordenador',
        description: 'Coordenação de projetos e equipes',
        path: '/Nivel04-Coordenadores/dashboard-coordenadores.html'
    },
    5: {
        icon: '👥',
        title: 'Supervisor',
        description: 'Supervisão de equipe operacional',
        path: '/Nivel05-Supervisores/dashboard-supervisores.html'
    },
    6: {
        icon: '🎯',
        title: 'Especialista',
        description: 'Funções técnicas especializadas',
        path: '/Nivel06-Especialistas/dashboard-especialistas.html'
    },
    7: {
        icon: '🔧',
        title: 'Operacional',
        description: 'Operações do dia a dia',
        path: '/Nivel07-Operacional/dashboard-operacional.html'
    }
};

// Carregar dados do usuário do localStorage
function loadUserData() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
        window.location.href = '/index.html';
        return null;
    }

    return JSON.parse(userData);
}

// Renderizar lista de papéis disponíveis
function renderRoles() {
    const user = loadUserData();
    if (!user) return;

    // Atualizar nome do usuário
    document.getElementById('userName').textContent = user.name;

    // Papel primário
    const primaryRole = user.nivel;
    
    // Papéis adicionais (JSON array)
    let additionalRoles = [];
    try {
        if (user.additional_roles) {
            additionalRoles = JSON.parse(user.additional_roles);
        }
    } catch (e) {
        console.error('Erro ao parsear additional_roles:', e);
    }

    // Combinar todos os papéis disponíveis
    const allRoles = [primaryRole, ...additionalRoles].filter((role, index, self) => 
        self.indexOf(role) === index // Remove duplicatas
    );

    // Renderizar cards
    const rolesList = document.getElementById('rolesList');
    rolesList.innerHTML = '';

    allRoles.forEach(roleLevel => {
        const config = ROLE_CONFIG[roleLevel];
        if (!config) return;

        const isPrimary = roleLevel === primaryRole;

        const roleCard = document.createElement('div');
        roleCard.className = `role-card ${isPrimary ? 'primary' : ''}`;
        roleCard.onclick = () => selectRole(roleLevel, config.path);

        roleCard.innerHTML = `
            <div class="role-icon">${config.icon}</div>
            <div class="role-info">
                <div class="role-title">${config.title}</div>
                <div class="role-description">${config.description}</div>
            </div>
            ${isPrimary ? '<span class="role-badge">PRINCIPAL</span>' : ''}
        `;

        rolesList.appendChild(roleCard);
    });
}

// Selecionar papel e redirecionar
function selectRole(nivel, path) {
    // Salvar papel selecionado no localStorage
    localStorage.setItem('selectedRole', nivel);
    
    // Armazenar timestamp da seleção
    localStorage.setItem('roleSelectedAt', Date.now());

    // Redirecionar para o dashboard correspondente
    window.location.href = path;
}

// Verificar se usuário precisa selecionar papel
function checkNeedRoleSelection() {
    const user = loadUserData();
    if (!user) return;

    // Se não tem papéis adicionais, redireciona direto
    if (!user.additional_roles || user.additional_roles === '[]') {
        const config = ROLE_CONFIG[user.nivel];
        if (config) {
            localStorage.setItem('selectedRole', user.nivel);
            window.location.href = config.path;
        }
        return;
    }

    // Se tem papéis adicionais, mostra seleção
    renderRoles();
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    checkNeedRoleSelection();
});
