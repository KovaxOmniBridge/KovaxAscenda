// ==================== INICIALIZAÇÃO ====================
console.log('🚀 Iniciando dashboard-admin.js');

let currentUser = null;
let allUsers = [];
let allSquads = [];
let allChapters = [];
let allCountries = [];

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOM carregado - Iniciando dashboard Nível 01');
    
    // Inicializar dashboard usando dashboard-common.js
    currentUser = initDashboard(1); // Requer nível 1 (Administradores)
    
    if (currentUser) {
        console.log('✅ Usuário autenticado:', currentUser);
        await loadDashboardData();
    } else {
        console.error('❌ Falha na inicialização do dashboard');
    }
});


// ==================== CARREGAR DADOS DO DASHBOARD ====================
async function loadDashboardData() {
    console.log('📊 Carregando dados do dashboard...');
    
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
        
        console.log('✅ Dashboard carregado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao carregar dashboard:', error);
        showToast('Erro ao carregar dados do dashboard', 'error');
    }
}

// ==================== CARREGAR USUÁRIOS ====================
async function loadUsers() {
    try {
        console.log('👥 Carregando usuários...');
        const response = await fetchAPI('/users');
        
        if (response && Array.isArray(response)) {
            allUsers = response;
            console.log(`✅ ${allUsers.length} usuários carregados`);
            return allUsers;
        } else {
            console.warn('⚠️ Resposta de usuários inválida:', response);
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
        console.log('🚀 Carregando squads...');
        const response = await fetchAPI('/squads');
        
        if (response && Array.isArray(response)) {
            allSquads = response;
            console.log(`✅ ${allSquads.length} squads carregados`);
            displaySquads();
            return allSquads;
        } else {
            console.warn('⚠️ Resposta de squads inválida:', response);
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
        console.log('📚 Carregando chapters...');
        const response = await fetchAPI('/chapters');
        
        if (response && Array.isArray(response)) {
            allChapters = response;
            console.log(`✅ ${allChapters.length} chapters carregados`);
            displayChapters();
            return allChapters;
        } else {
            console.warn('⚠️ Resposta de chapters inválida:', response);
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
        console.log('🌍 Carregando países...');
        const response = await fetchAPI('/countries');
        
        if (response && Array.isArray(response)) {
            allCountries = response;
            console.log(`✅ ${allCountries.length} países carregados`);
            return allCountries;
        } else {
            console.warn('⚠️ Resposta de países inválida:', response);
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
    console.log('📈 Atualizando KPIs...');
    
    // Total de usuários
    const totalUsersEl = document.getElementById('totalUsers');
    if (totalUsersEl) {
        totalUsersEl.textContent = allUsers.length;
        console.log('✅ Total de usuários:', allUsers.length);
    }
    
    // Total de squads
    const totalSquadsEl = document.getElementById('totalSquads');
    if (totalSquadsEl) {
        totalSquadsEl.textContent = allSquads.length;
        console.log('✅ Total de squads:', allSquads.length);
    }
    
    // Total de chapters
    const totalChaptersEl = document.getElementById('totalChapters');
    if (totalChaptersEl) {
        totalChaptersEl.textContent = allChapters.length;
        console.log('✅ Total de chapters:', allChapters.length);
    }
    
    // Total de países (contar empresas únicas por país)
    const totalCountriesEl = document.getElementById('totalCountries');
    if (totalCountriesEl) {
        totalCountriesEl.textContent = allCountries.length;
        console.log('✅ Total de países:', allCountries.length);
    }
}

// ==================== ATUALIZAR DISTRIBUIÇÃO POR NÍVEL ====================
function updateUsersByLevel() {
    console.log('📊 Atualizando distribuição por nível...');
    
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
