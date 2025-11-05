const API_BASE = 'http://localhost:3000/api';
let currentCompany = null;
let currentUser = null;
let authToken = null;
let allUsers = [];
let allSquads = [];
let allChapters = [];

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

async function checkAuth() {
    authToken = localStorage.getItem('token');
    const userDataString = localStorage.getItem('user');
    const companyDataString = localStorage.getItem('company');
    
    if (!authToken || !userDataString || !companyDataString) {
        alert('❌ Sessão inválida. Redirecionando para login...');
        window.location.href = '/index.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(userDataString);
        currentCompany = JSON.parse(companyDataString);
        
        // Verificar se é nível 0 (Presidente) ou modo explorador
        if (currentUser.nivel !== 0 && !currentUser.isExplorer) {
            alert('❌ Acesso negado. Apenas Presidentes (Nível 0) podem acessar este painel.');
            window.location.href = '/index.html';
            return;
        }
        
        // Atualizar interface
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('companyName').textContent = currentCompany.name;
        
        // Carregar dados
        await loadOrganizationData();
        
    } catch (error) {
        console.error('❌ Erro ao processar autenticação:', error);
        alert('Erro ao carregar dados da sessão');
        window.location.href = '/index.html';
    }
}

function fetchWithAuth(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...options.headers
    };
    
    return fetch(url, { ...options, headers });
}

async function loadOrganizationData() {
    try {
        // Carregar usuários
        const usersRes = await fetchWithAuth(`${API_BASE}/users/company/${currentCompany.id}`);
        allUsers = usersRes.ok ? await usersRes.json() : [];
        
        // Carregar squads com contagem de membros
        const squadsRes = await fetchWithAuth(`${API_BASE}/squads/company/${currentCompany.id}`);
        allSquads = squadsRes.ok ? await squadsRes.json() : [];
        
        // Buscar contagem de membros de cada squad
        for (const squad of allSquads) {
            try {
                const membersRes = await fetchWithAuth(`${API_BASE}/squads/${squad.id}/members`);
                const members = membersRes.ok ? await membersRes.json() : [];
                squad.member_count = members.length;
            } catch (error) {
                squad.member_count = 0;
            }
        }
        
        // Carregar chapters com contagem de membros
        const chaptersRes = await fetchWithAuth(`${API_BASE}/chapters/company/${currentCompany.id}`);
        allChapters = chaptersRes.ok ? await chaptersRes.json() : [];
        
        // Buscar contagem de membros de cada chapter
        for (const chapter of allChapters) {
            try {
                const membersRes = await fetchWithAuth(`${API_BASE}/chapters/${chapter.id}/members`);
                const members = membersRes.ok ? await membersRes.json() : [];
                chapter.member_count = members.length;
            } catch (error) {
                chapter.member_count = 0;
            }
        }
        
        console.log(`✅ Dados carregados: ${allUsers.length} usuários, ${allSquads.length} squads, ${allChapters.length} chapters`);
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        allUsers = [];
        allSquads = [];
        allChapters = [];
    }
    
    updateStats();
    renderHierarchy();
    renderSquads();
    renderChapters();
}

function updateStats() {
    document.getElementById('totalPeople').textContent = allUsers.length;
    document.getElementById('totalSquads').textContent = allSquads.length;
    document.getElementById('totalChapters').textContent = allChapters.length;
}

function showView(viewName) {
    document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.view-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`view-${viewName}`).classList.add('active');
}

function renderHierarchy() {
    const levels = [
        { level: 0, name: 'Presidentes', icon: '👑', color: '#dc2626' },
        { level: 1, name: 'Administradores Gerais', icon: '⚡', color: '#ea580c' },
        { level: 2, name: 'Diretores Executivos', icon: '🎯', color: '#f59e0b' },
        { level: 3, name: 'Gerentes', icon: '📈', color: '#10b981' },
        { level: 4, name: 'Coordenadores', icon: '🎯', color: '#3b82f6' },
        { level: 5, name: 'Supervisores', icon: '👁️', color: '#8b5cf6' },
        { level: 6, name: 'Especialistas', icon: '💼', color: '#ec4899' },
        { level: 7, name: 'Operacional', icon: '📝', color: '#6b7280' }
    ];
    
    const hierarchyContainer = document.getElementById('hierarchyContainer');
    const levelBars = document.getElementById('levelBars');
    
    hierarchyContainer.innerHTML = levels.map(level => {
        const usersInLevel = allUsers.filter(u => u.hierarchical_level === level.level);
        return `
            <div class="level-box" style="border-left-color: ${level.color}">
                <div class="level-header">
                    <span class="level-icon">${level.icon}</span>
                    <div class="level-info">
                        <h3>Nível ${level.level} - ${level.name}</h3>
                        <p>${usersInLevel.length} pessoa(s)</p>
                    </div>
                </div>
                <div class="level-users">
                    ${usersInLevel.slice(0, 5).map(u => `<span class="user-chip">${u.name}</span>`).join('')}
                    ${usersInLevel.length > 5 ? `<span class="user-chip">+${usersInLevel.length - 5}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    const maxCount = Math.max(...levels.map(l => allUsers.filter(u => u.hierarchical_level === l.level).length));
    levelBars.innerHTML = levels.map(level => {
        const count = allUsers.filter(u => u.hierarchical_level === level.level).length;
        const percentage = (count / maxCount) * 100;
        return `
            <div class="level-bar">
                <div class="bar-label">${level.icon} N${level.level}</div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${percentage}%; background: ${level.color}"></div>
                </div>
                <div class="bar-value">${count}</div>
            </div>
        `;
    }).join('');
}

function renderSquads() {
    const container = document.getElementById('squadsGrid');
    if (allSquads.length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                Nenhum squad cadastrado.<br>
                <a href="../Nivel01-AdministradoresGerais/squads.html">Criar primeiro squad</a>
            </p>
        `;
        return;
    }
    
    container.innerHTML = allSquads.map(squad => {
        const statusLabel = squad.status === 'active' ? 'Ativo' : 'Inativo';
        const statusClass = squad.status === 'active' ? 'success' : 'neutral';
        return `
            <div class="squad-card">
                <div class="card-header">
                    <h3>🚀 ${squad.name}</h3>
                    <span class="badge ${statusClass}">${statusLabel}</span>
                </div>
                <p class="card-description">${squad.description || 'Squad ágil multidisciplinar'}</p>
                <div class="card-footer">
                    <span>� ${squad.member_count || 0} membros</span>
                    <span>📅 ${squad.start_date ? new Date(squad.start_date).toLocaleDateString('pt-BR') : 'N/A'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderChapters() {
    const container = document.getElementById('chaptersGrid');
    if (allChapters.length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                Nenhum chapter cadastrado.<br>
                <a href="../Nivel01-AdministradoresGerais/chapters.html">Criar primeiro chapter</a>
            </p>
        `;
        return;
    }
    
    container.innerHTML = allChapters.map(chapter => {
        const statusLabel = chapter.status === 'active' ? 'Ativo' : 'Inativo';
        const statusClass = chapter.status === 'active' ? 'success' : 'neutral';
        return `
            <div class="chapter-card">
                <div class="card-header">
                    <h3>📚 ${chapter.name}</h3>
                    <span class="badge ${statusClass}">${statusLabel}</span>
                </div>
                <p class="card-description">${chapter.description || 'Comunidade de especialistas'}</p>
                <div class="card-footer">
                    <span>� ${chapter.member_count || 0} membros</span>
                    <span>🎯 ${chapter.specialty || 'Especialidade'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function logout() {
    if (confirm('Deseja realmente sair?')) {
        // Limpar apenas dados da sessão, manter devMode se existir
        const devMode = localStorage.getItem('devMode');
        const impersonatedBy = localStorage.getItem('impersonatedBy');
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('company');
        
        // Se estava em modo dev, voltar para o dashboard do dev
        if (devMode === 'true' && impersonatedBy) {
            window.location.href = '/desenvolvedor/dev-dashboard.html';
        } else {
            localStorage.clear();
            window.location.href = '/index.html';
        }
    }
}
