// ==================== INICIALIZAÇÃO ====================
let currentUser = null;
let allUsers = [];
let allSquads = [];
let allChapters = [];
let allCountries = [];

// Aguardar CSS carregar antes de inicializar (evita flash de conteúdo sem estilo)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminDashboard);
} else {
    initAdminDashboard();
}

function initAdminDashboard() {
    // Aguardar um frame para garantir que CSS foi aplicado
    requestAnimationFrame(() => {
        setTimeout(async () => {
            // Inicializar dashboard usando dashboard-common.js
            currentUser = initDashboard(1); // Requer nível 1 (Administradores)
            
            if (currentUser) {
                await loadDashboardData();
            } else {
                console.error('❌ Falha na inicialização do dashboard');
            }
        }, 50);
    });
}


// ==================== CARREGAR DADOS DO DASHBOARD ====================
async function loadDashboardData() {
    try {
        // Carregar dados em paralelo
        await Promise.all([
            loadUsers(),
            loadSquads(),
            loadChapters(),
            loadCountries()
        ]);
        
        // Atualizar estatísticas
        updateKPIs();
        updateUsersByLevel();
    } catch (error) {
        console.error('❌ Erro ao carregar dashboard:', error);
        showToast('Erro ao carregar dados do dashboard', 'error');
    }
}

// ==================== CARREGAR USUÁRIOS ====================
async function loadUsers() {
    try {
        const response = await fetchAPI('/users');
        
        if (response && Array.isArray(response)) {
            allUsers = response;
            return allUsers;
        } else {
            allUsers = [];
            return [];
        }
    } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        allUsers = [];
        return [];
    }
}

// ==================== CARREGAR SQUADS ====================
async function loadSquads() {
    try {
        const response = await fetchAPI('/squads');
        
        if (response && Array.isArray(response)) {
            allSquads = response;
            displaySquads();
            return allSquads;
        } else {
            allSquads = [];
            return [];
        }
    } catch (error) {
        console.error('❌ Erro ao carregar squads:', error);
        allSquads = [];
        const container = document.getElementById('squadsContainer');
        if (container) {
            container.innerHTML = '<p class="loading">Erro ao carregar squads</p>';
        }
        return [];
    }
}

// ==================== CARREGAR CHAPTERS ====================
async function loadChapters() {
    try {
        const response = await fetchAPI('/chapters');
        
        if (response && Array.isArray(response)) {
            allChapters = response;
            displayChapters();
            return allChapters;
        } else {
            allChapters = [];
            return [];
        }
    } catch (error) {
        console.error('❌ Erro ao carregar chapters:', error);
        allChapters = [];
        const container = document.getElementById('chaptersContainer');
        if (container) {
            container.innerHTML = '<p class="loading">Erro ao carregar chapters</p>';
        }
        return [];
    }
}

// ==================== CARREGAR PAÍSES ====================
async function loadCountries() {
    try {
        const response = await fetchAPI('/countries');
        
        if (response && Array.isArray(response)) {
            allCountries = response;
            return allCountries;
        } else {
            allCountries = [];
            return [];
        }
    } catch (error) {
        console.error('❌ Erro ao carregar países:', error);
        allCountries = [];
        return [];
    }
}

// ==================== ATUALIZAR KPIs ====================
function updateKPIs() {
    // Total de usuários
    const totalUsersEl = document.getElementById('totalUsers');
    if (totalUsersEl) {
        totalUsersEl.textContent = allUsers.length;
    }
    
    // Total de squads
    const totalSquadsEl = document.getElementById('totalSquads');
    if (totalSquadsEl) {
        totalSquadsEl.textContent = allSquads.length;
    }
    
    // Total de chapters
    const totalChaptersEl = document.getElementById('totalChapters');
    if (totalChaptersEl) {
        totalChaptersEl.textContent = allChapters.length;
    }
    
    // Total de países
    const totalCountriesEl = document.getElementById('totalCountries');
    if (totalCountriesEl) {
        totalCountriesEl.textContent = allCountries.length;
    }
}

// ==================== ATUALIZAR DISTRIBUIÇÃO POR NÍVEL ====================
function updateUsersByLevel() {
    const container = document.getElementById('usersByLevelContainer');
    if (!container) {
        console.warn('⚠️ Container de níveis não encontrado');
        return;
    }
    
    // Contar usuários por nível
    const levelCounts = {};
    for (let i = 0; i <= 7; i++) {
        levelCounts[i] = 0;
    }
    
    allUsers.forEach(user => {
        const nivel = user.nivel || 0;
        if (nivel >= 0 && nivel <= 7) {
            levelCounts[nivel]++;
        }
    });
    
    // Nomes dos níveis
    const levelNames = [
        { icon: '👑', name: 'Presidentes', description: 'Nível 00' },
        { icon: '⚙️', name: 'Administradores', description: 'Nível 01' },
        { icon: '🎯', name: 'Diretores', description: 'Nível 02' },
        { icon: '📊', name: 'Gerentes', description: 'Nível 03' },
        { icon: '🔧', name: 'Coordenadores', description: 'Nível 04' },
        { icon: '👁️', name: 'Supervisores', description: 'Nível 05' },
        { icon: '⭐', name: 'Especialistas', description: 'Nível 06' },
        { icon: '👤', name: 'Operacional', description: 'Nível 07' }
    ];
    
    // Renderizar
    let html = '';
    for (let i = 0; i <= 7; i++) {
        html += `
            <div class="level-item">
                <div class="level-info">
                    <div class="level-icon">${levelNames[i].icon}</div>
                    <div class="level-details">
                        <h4>${levelNames[i].name}</h4>
                        <p>${levelNames[i].description}</p>
                    </div>
                </div>
                <div class="level-count">${levelCounts[i]}</div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    console.log('✅ Distribuição por nível atualizada');
}

// ==================== EXIBIR SQUADS ====================
function displaySquads() {
    console.log('🚀 Exibindo squads...');
    
    const container = document.getElementById('squadsContainer');
    if (!container) {
        console.warn('⚠️ Container de squads não encontrado');
        return;
    }
    
    if (allSquads.length === 0) {
        container.innerHTML = '<p class="loading">Nenhum squad encontrado</p>';
        return;
    }
    
    let html = '';
    allSquads.forEach(squad => {
        const status = squad.status || 'active';
        const statusClass = status === 'active' ? 'active' : 'inactive';
        const statusText = status === 'active' ? 'Ativo' : 'Inativo';
        
        html += `
            <div class="squad-item">
                <div class="squad-header">
                    <span class="squad-name">${squad.name || 'Squad sem nome'}</span>
                    <span class="squad-status ${statusClass}">${statusText}</span>
                </div>
                <p class="squad-description">${squad.description || 'Sem descrição'}</p>
                <p class="squad-members">👥 ${squad.member_count || 0} membros</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
    console.log(`✅ ${allSquads.length} squads exibidos`);
}

// ==================== EXIBIR CHAPTERS ====================
function displayChapters() {
    console.log('📚 Exibindo chapters...');
    
    const container = document.getElementById('chaptersContainer');
    if (!container) {
        console.warn('⚠️ Container de chapters não encontrado');
        return;
    }
    
    if (allChapters.length === 0) {
        container.innerHTML = '<p class="loading">Nenhum chapter encontrado</p>';
        return;
    }
    
    let html = '';
    allChapters.forEach(chapter => {
        html += `
            <div class="chapter-item">
                <div class="chapter-header">
                    <span class="chapter-name">${chapter.name || 'Chapter sem nome'}</span>
                </div>
                <p class="chapter-description">${chapter.description || 'Sem descrição'}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
    console.log(`✅ ${allChapters.length} chapters exibidos`);
}

// ==================== NAVEGAÇÃO RÁPIDA ====================
function navigateToUsers() {
    window.location.href = 'usuarios.html';
}

function navigateToSquads() {
    window.location.href = 'squads.html';
}

function navigateToChapters() {
    window.location.href = 'chapters.html';
}

function navigateToTemplates() {
    window.location.href = 'templates.html';
}

// ==================== LOGOUT ====================
function logout() {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}
