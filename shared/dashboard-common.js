/**
 * Dashboard Common - Funções comuns para todos os dashboards
 * Carrega dados do usuário, valida sessão e fornece utilitários
 */

const API_BASE = 'http://localhost:3000/api';

// ==================== UTILITÁRIOS ====================

/**
 * Detecta se a ABA ATUAL está em modo desenvolvedor
 * IMPORTANTE: Verifica sessionStorage (tab-specific) primeiro
 * localStorage sozinho não é suficiente pois é compartilhado entre abas
 */
function isDevModeActive() {
    // PRIORIDADE 1: sessionStorage (específico desta aba)
    // Se dev_mode está em sessionStorage, esta aba está definitivamente em dev mode
    const sessionDevMode = sessionStorage.getItem('dev_mode') === 'true';
    
    if (sessionDevMode) {
        console.log('🔧 isDevModeActive: DEV MODE ativo (sessionStorage)');
        return true;
    }
    
    // PRIORIDADE 2: Verificar se tem SessionManager ativo com token normal
    // Se tem SessionManager ativo, NUNCA é dev mode (mesmo que localStorage tenha dev_mode)
    if (window.SessionManager) {
        const normalToken = window.SessionManager.getSession('token');
        const normalUserData = window.SessionManager.getSession('userData');
        
        if (normalToken && normalUserData) {
            console.log('� isDevModeActive: LOGIN NORMAL detectado (SessionManager tem precedência)');
            return false;  // ← LOGIN NORMAL tem prioridade absoluta
        }
    }
    
    // PRIORIDADE 3: localStorage (compartilhado entre abas) - APENAS SE NÃO HÁ SESSÃO NORMAL
    if (localStorage.getItem('dev_mode') === 'true') {
        // Verificar se tem dados dev válidos
        const hasDevToken = !!localStorage.getItem('dev_token');
        const hasDevUserData = !!localStorage.getItem('dev_userData');
        
        // Só considerar dev mode se tem dados dev completos
        if (hasDevToken && hasDevUserData) {
            console.log('� isDevModeActive: DEV MODE ativo (localStorage, sem SessionManager)');
            return true;
        }
    }
    
    console.log('💼 isDevModeActive: Modo NORMAL (não é dev mode)');
    return false;
}

// ==================== INICIALIZAÇÃO ====================

/**
 * Inicializa o dashboard carregando dados do usuário
 * Suporta multi-sessão via SessionManager
 */
function initDashboard(requiredLevel = null) {
    console.group('🔍 DIAGNÓSTICO: initDashboard()');
    console.log('📄 Página atual:', window.location.pathname);
    console.log('🎯 Nível requerido:', requiredLevel);
    
    // Verificar se está em modo desenvolvedor (usa namespace dev_*)
    const isDevMode = isDevModeActive();
    console.log('🔧 isDevMode resultado:', isDevMode);
    
    // DEBUG: Estado completo dos storages
    console.log('📦 Estado dos Storages:', {
        sessionStorage_dev_mode: sessionStorage.getItem('dev_mode'),
        localStorage_dev_mode: localStorage.getItem('dev_mode'),
        localStorage_dev_token: localStorage.getItem('dev_token') ? 'EXISTS' : 'null',
        localStorage_dev_userData: localStorage.getItem('dev_userData') ? 'EXISTS' : 'null',
        hasSessionManager: !!window.SessionManager,
        sessionManager_token: window.SessionManager ? (window.SessionManager.getSession('token') ? 'EXISTS' : 'null') : 'N/A',
        sessionManager_userData: window.SessionManager ? (window.SessionManager.getSession('userData') ? 'EXISTS' : 'null') : 'N/A'
    });
    
    // Obter token e userData do storage correto
    let token, userData;
    
    if (isDevMode) {
        console.log('🔧 Usando namespace DEV (dev_*)');
        token = localStorage.getItem('dev_token');
        userData = getDevUserData();
    } else if (window.SessionManager) {
        console.log('💼 Usando SessionManager (login normal)');
        token = window.SessionManager.getSession('token');
        userData = window.SessionManager.getSession('userData', true);
        
        // Debug de múltiplas sessões
        const sessions = window.SessionManager.getActiveSessions();
        if (sessions.length > 1) {
            console.log(`📊 Múltiplas sessões ativas (${sessions.length}):`, sessions);
        }
    } else {
        console.log('💾 Usando localStorage fallback (sem SessionManager)');
        token = localStorage.getItem('token');
        userData = getUserData();
    }
    
    console.log('🔑 Token obtido:', token ? 'EXISTS (' + token.substring(0, 20) + '...)' : 'NULL');
    console.log('👤 UserData obtido:', userData ? { name: userData.name, nivel: userData.nivel } : 'NULL');
    
    if (!token || !userData) {
        // Se estiver em devMode, pode ser que os dados ainda não foram configurados
        if (isDevMode) {
            console.warn('⚠️ Modo desenvolvedor ativo, mas dados não configurados ainda. Aguardando...');
            // Dar mais tempo para o dev-session-handler configurar os dados
            setTimeout(() => {
                const retryUserData = getDevUserData();
                const retryToken = localStorage.getItem('dev_token');
                if (!retryToken || !retryUserData) {
                    console.error('❌ Dados não configurados após aguardar. Redirecionando...');
                    window.location.href = '/desenvolvedor/dev-dashboard.html';
                }
            }, 500);
            return null;
        }
        
        console.warn('⚠️ Usuário não autenticado. Redirecionando para login...');
        window.location.href = '/index.html';
        return null;
    }
    
    // Verificar nível de acesso se especificado
    if (requiredLevel !== null) {
        const selectedRoleKey = isDevMode ? 'dev_selectedRole' : 'selectedRole';
        const selectedRoleValue = localStorage.getItem(selectedRoleKey);
        const selectedRole = selectedRoleValue !== null && selectedRoleValue !== 'null' ? parseInt(selectedRoleValue) : null;
        const userLevel = (selectedRole !== null && !isNaN(selectedRole)) ? selectedRole : userData.nivel;
        
        console.log('🔐 Verificação de Permissão:', {
            requiredLevel,
            userLevel,
            selectedRole,
            selectedRoleKey,
            selectedRoleValue,
            'userData.nivel': userData.nivel,
            isDevMode
        });
        
        if (userLevel !== requiredLevel) {
            console.warn(`⚠️ Nível de acesso incompatível. Esperado: ${requiredLevel}, Atual: ${userLevel}`);
            
            // Se está em devMode, permitir acesso mesmo com nível diferente
            if (isDevMode) {
                console.log('🎭 Modo desenvolvedor: permitindo acesso ao dashboard de nível diferente');
            } else {
                console.error('❌ PERMISSÃO NEGADA: Não é dev mode e nível incompatível');
                console.groupEnd();
                showToast(`Você não tem permissão para acessar esta página (Nível ${requiredLevel} requerido)`, 'error');
                setTimeout(() => {
                    const correctDashboard = getDashboardUrl(userLevel);
                    window.location.href = correctDashboard;
                }, 2000);
                return null;
            }
        }
    }
    
    // Atualizar interface com dados do usuário
    updateUserInterface(userData);
    
    if (isDevMode) {
        const impersonatedBy = localStorage.getItem('dev_impersonatedBy') || 'Desenvolvedor';
        console.log('%c✅ MODO DESENVOLVEDOR ATIVO', 'background: #f093fb; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
        console.log('📋 Dados da sessão DEV:', {
            user: userData.name,
            nivel: userData.nivel,
            selectedRole: localStorage.getItem('dev_selectedRole'),
            company: userData.company.name,
            impersonatedBy: impersonatedBy,
            sessionStorage_dev_mode: sessionStorage.getItem('dev_mode'),
            localStorage_dev_mode: localStorage.getItem('dev_mode')
        });
    } else {
        console.log('%c✅ MODO NORMAL (Login de Usuário)', 'background: #4CAF50; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
        console.log('📋 Dados da sessão NORMAL:', {
            user: userData.name,
            nivel: userData.nivel,
            selectedRole: localStorage.getItem('selectedRole'),
            company: userData.company.name,
            sessionStorage_dev_mode: sessionStorage.getItem('dev_mode') || 'null',
            hasSessionManager: !!window.SessionManager
        });
    }
    
    console.log('✅ initDashboard concluído com sucesso');
    console.groupEnd();
    
    return userData;
}

// ==================== DADOS DO USUÁRIO ====================

/**
 * Obtém dados do usuário do localStorage/sessionStorage
 * Verifica namespace correto baseado no modo
 * Usa SessionManager se disponível (multi-sessão)
 */
function getUserData() {
    try {
        // Se está em modo dev, usar namespace dev_*
        const isDevMode = isDevModeActive();
        
        if (isDevMode) {
            const userDataString = localStorage.getItem('dev_userData');
            if (!userDataString) return null;
            return JSON.parse(userDataString);
        }
        
        // Modo normal - usar SessionManager se disponível
        if (window.SessionManager) {
            return window.SessionManager.getSession('userData', true);
        }
        
        // Fallback: usar localStorage diretamente
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) return null;
        return JSON.parse(userDataString);
    } catch (e) {
        console.error('❌ Erro ao parsear userData:', e);
        return null;
    }
}

/**
 * Obtém dados do usuário SOMENTE do namespace de desenvolvedor
 */
function getDevUserData() {
    try {
        const userDataString = localStorage.getItem('dev_userData');
        if (!userDataString) return null;
        return JSON.parse(userDataString);
    } catch (e) {
        console.error('❌ Erro ao parsear dev_userData:', e);
        return null;
    }
}

/**
 * Obtém o nível/papel atual do usuário
 */
function getCurrentLevel() {
    const selectedRole = localStorage.getItem('selectedRole');
    if (selectedRole !== null) {
        return parseInt(selectedRole);
    }
    
    const userData = getUserData();
    return userData ? userData.nivel : null;
}

/**
 * Verifica se o usuário tem um papel específico
 */
function hasRole(nivel) {
    const userData = getUserData();
    if (!userData) return false;
    
    // Verificar papel principal
    if (userData.nivel === nivel) return true;
    
    // Verificar papéis adicionais
    if (userData.additional_roles && Array.isArray(userData.additional_roles)) {
        return userData.additional_roles.includes(nivel);
    }
    
    return false;
}

// ==================== INTERFACE DO USUÁRIO ====================

/**
 * Atualiza elementos da interface com dados do usuário
 */
function updateUserInterface(userData) {
    console.log('🎨 updateUserInterface chamado com:', userData);
    
    // Nome do usuário
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        console.log('✅ Atualizando userName:', userData.name);
        userNameElement.textContent = userData.name;
    } else {
        console.warn('⚠️ Elemento #userName não encontrado');
    }
    
    // Nome da empresa
    const companyNameElement = document.getElementById('companyName');
    if (companyNameElement) {
        console.log('✅ Atualizando companyName:', userData.company.name);
        companyNameElement.textContent = userData.company.name;
    } else {
        console.warn('⚠️ Elemento #companyName não encontrado');
    }
    
    // Chave de acesso (se houver elemento)
    const accessKeyElement = document.getElementById('accessKey');
    if (accessKeyElement && userData.access_key) {
        accessKeyElement.textContent = userData.access_key;
    }
    
    // Departamento (se houver elemento)
    const departmentElement = document.getElementById('department');
    if (departmentElement && userData.department) {
        departmentElement.textContent = userData.department;
    }
    
    // Nível atual
    const currentLevelElement = document.getElementById('currentLevel');
    if (currentLevelElement) {
        const currentLevel = getCurrentLevel();
        currentLevelElement.textContent = `Nível ${currentLevel}`;
    }
    
    // Atualizar title da página
    document.title = `${getRoleName(getCurrentLevel())} - ${userData.company.name} - Ascenda`;
    console.log('✅ Interface atualizada com sucesso');
}

/**
 * Retorna o nome do papel baseado no nível
 */
function getRoleName(nivel) {
    const roles = {
        0: 'Presidência',
        1: 'Administração Geral',
        2: 'Diretoria Executiva',
        3: 'Gerência',
        4: 'Coordenação',
        5: 'Supervisão',
        6: 'Especialistas',
        7: 'Operacional'
    };
    return roles[nivel] || 'Dashboard';
}

/**
 * Retorna ícone do papel baseado no nível
 */
function getRoleIcon(nivel) {
    const icons = {
        0: '👑',
        1: '⚙️',
        2: '📊',
        3: '📈',
        4: '🎯',
        5: '👁️',
        6: '💼',
        7: '⚡'
    };
    return icons[nivel] || '📋';
}

// ==================== NAVEGAÇÃO ====================

/**
 * Retorna URL do dashboard baseado no nível
 */
function getDashboardUrl(nivel) {
    const dashboards = {
        0: '/Nivel00-Presidentes/dashboard-presidentes.html',
        1: '/Nivel01-AdministradoresGerais/dashboard-admin.html',
        2: '/Nivel02-DiretoresExecutivos/dashboard-diretores.html',
        3: '/Nivel03-Gerentes/dashboard-gerentes.html',
        4: '/Nivel04-Coordenadores/dashboard-coordenadores.html',
        5: '/Nivel05-Supervisores/dashboard-supervisores.html',
        6: '/Nivel06-Especialistas/dashboard-especialistas.html',
        7: '/Nivel07-Operacional/dashboard-operacional.html'
    };
    return dashboards[nivel] || '/index.html';
}

/**
 * Navega para uma URL
 */
function navigateTo(url) {
    window.location.href = url;
}

// ==================== LOGOUT ====================

/**
 * Realiza logout do usuário
 * Se estiver em modo dev, limpa apenas sessão dev e volta para painel
 * Se usar SessionManager, limpa apenas sessão da aba atual
 */
function logout() {
    const isDevMode = isDevModeActive();
    
    if (isDevMode) {
        if (confirm('Deseja sair do modo de impersonation?')) {
            // Limpar APENAS dados de desenvolvedor (namespace dev_*)
            sessionStorage.removeItem('dev_mode');  // ← Tab-specific
            localStorage.removeItem('dev_token');
            localStorage.removeItem('dev_userData');
            localStorage.removeItem('dev_selectedRole');
            localStorage.removeItem('dev_mode');
            localStorage.removeItem('dev_impersonatedBy');
            localStorage.removeItem('dev_sessionTimestamp');
            
            console.log('✅ Logout do modo desenvolvedor realizado');
            console.log('ℹ️  Sessão normal do usuário (se existir) foi preservada');
            
            // Redirecionar para painel dev
            window.location.href = '/desenvolvedor/dev-dashboard.html';
        }
    } else if (window.SessionManager) {
        // Modo multi-sessão
        const sessions = window.SessionManager.getActiveSessions();
        const hasMultipleSessions = sessions.length > 1;
        
        const message = hasMultipleSessions 
            ? `Deseja sair desta sessão?\n\n(${sessions.length - 1} outra(s) sessão(ões) ativa(s) serão preservadas)`
            : 'Deseja realmente sair?';
        
        if (confirm(message)) {
            // Limpar apenas sessão desta aba
            window.SessionManager.clearSession();
            
            console.log('✅ Logout realizado (sessão da aba)');
            if (hasMultipleSessions) {
                console.log(`ℹ️  ${sessions.length - 1} outra(s) sessão(ões) preservada(s)`);
            }
            
            // Redirecionar para página inicial
            window.location.href = '/index.html';
        }
    } else {
        // Fallback: modo tradicional
        if (confirm('Deseja realmente sair?')) {
            // Limpar dados de autenticação normal
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            localStorage.removeItem('selectedRole');
            
            console.log('✅ Logout realizado com sucesso');
            
            // Redirecionar para página inicial
            window.location.href = '/index.html';
        }
    }
}

// ==================== API ====================

/**
 * Faz requisição autenticada à API
 * Usa token correto baseado no modo (dev_token ou token)
 * Suporta SessionManager para multi-sessão
 */
async function fetchAPI(endpoint, options = {}) {
    // Verificar se está em modo desenvolvedor
    const isDevMode = localStorage.getItem('dev_mode') === 'true';
    
    // Obter token do namespace correto
    let token;
    if (isDevMode) {
        token = localStorage.getItem('dev_token');
    } else if (window.SessionManager) {
        token = window.SessionManager.getSession('token');
    } else {
        token = localStorage.getItem('token');
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, mergedOptions);
        
        // Se não autorizado, fazer logout
        if (response.status === 401) {
            console.warn('⚠️ Token inválido ou expirado');
            logout();
            return null;
        }
        
        // Se resposta não for ok, tentar parsear erro
        if (!response.ok) {
            try {
                const errorData = await response.json();
                console.error('❌ Erro na API:', errorData);
                showToast(errorData.error || 'Erro na requisição', 'error');
                return null;
            } catch (e) {
                console.error('❌ Erro HTTP:', response.status);
                showToast(`Erro na requisição: ${response.status}`, 'error');
                return null;
            }
        }
        
        // Parsear resposta JSON
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        showToast('Erro de conexão com o servidor', 'error');
        return null;
    }
}

// ==================== NOTIFICAÇÕES ====================

/**
 * Exibe toast notification
 */
function showToast(message, type = 'info', duration = 4000) {
    // Remover toast anterior se existir
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Criar toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    
    // Estilos inline
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        font-size: 0.938rem;
    `;
    
    // Cores por tipo
    const colors = {
        success: { bg: '#10b981', color: '#fff' },
        error: { bg: '#ef4444', color: '#fff' },
        warning: { bg: '#f59e0b', color: '#fff' },
        info: { bg: '#3b82f6', color: '#fff' }
    };
    
    const colorScheme = colors[type] || colors.info;
    toast.style.backgroundColor = colorScheme.bg;
    toast.style.color = colorScheme.color;
    
    document.body.appendChild(toast);
    
    // Remover após duração
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================== FORMATAÇÃO ====================

/**
 * Formata número como moeda BRL
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Formata número com separadores
 */
function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata data
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
}

/**
 * Formata data e hora
 */
function formatDateTime(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// ==================== ANIMAÇÕES CSS ====================

// Adicionar estilos de animação se não existirem
if (!document.getElementById('dashboard-common-styles')) {
    const style = document.createElement('style');
    style.id = 'dashboard-common-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== EXPORTAR ====================

// Tornar funções disponíveis globalmente
window.dashboardCommon = {
    initDashboard,
    getUserData,
    getCurrentLevel,
    hasRole,
    updateUserInterface,
    getRoleName,
    getRoleIcon,
    getDashboardUrl,
    navigateTo,
    logout,
    fetchAPI,
    showToast,
    formatCurrency,
    formatNumber,
    formatDate,
    formatDateTime
};

console.log('✅ Dashboard Common carregado');
