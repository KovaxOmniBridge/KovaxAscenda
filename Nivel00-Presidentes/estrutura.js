const API_BASE = 'http://localhost:3000/api';
let currentCompany = null;
let currentUser = null;
let allUsers = [];
let allSquads = [];
let allChapters = [];

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadCompanyData();
    loadOrganizationData();
});

async function loadUserData() {
    const devToken = localStorage.getItem('devToken');
    if (devToken) {
        document.getElementById('userName').textContent = 'Desenvolvedor (God Mode)';
        return;
    }
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        if (response.ok) {
            currentUser = await response.json();
            document.getElementById('userName').textContent = currentUser.name;
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function loadCompanyData() {
    const companyId = localStorage.getItem('companyId') || 1;
    try {
        const response = await fetch(`${API_BASE}/companies/${companyId}`);
        if (response.ok) {
            currentCompany = await response.json();
            document.getElementById('companyName').textContent = currentCompany.name;
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function loadOrganizationData() {
    const companyId = localStorage.getItem('companyId') || 1;
    
    try {
        // Carregar usuários
        const usersRes = await fetch(`${API_BASE}/dev/users/company/${companyId}`);
        allUsers = usersRes.ok ? await usersRes.json() : generateDemoUsers();
        
        // Carregar squads
        const squadsRes = await fetch(`${API_BASE}/dev/squads/company/${companyId}`);
        allSquads = squadsRes.ok ? await squadsRes.json() : generateDemoSquads();
        
        // Carregar chapters
        const chaptersRes = await fetch(`${API_BASE}/dev/chapters/company/${companyId}`);
        allChapters = chaptersRes.ok ? await chaptersRes.json() : generateDemoChapters();
    } catch (error) {
        allUsers = generateDemoUsers();
        allSquads = generateDemoSquads();
        allChapters = generateDemoChapters();
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
        container.innerHTML = '<p class="empty-state">Nenhum squad cadastrado</p>';
        return;
    }
    
    container.innerHTML = allSquads.map(squad => `
        <div class="squad-card">
            <div class="card-header">
                <h3>🚀 ${squad.name}</h3>
                <span class="badge">${squad.member_count || 0} membros</span>
            </div>
            <p class="card-description">${squad.description || 'Squad ágil multidisciplinar'}</p>
            <div class="card-footer">
                <span>📌 ${squad.project || 'Projeto'}</span>
            </div>
        </div>
    `).join('');
}

function renderChapters() {
    const container = document.getElementById('chaptersGrid');
    if (allChapters.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum chapter cadastrado</p>';
        return;
    }
    
    container.innerHTML = allChapters.map(chapter => `
        <div class="chapter-card">
            <div class="card-header">
                <h3>📚 ${chapter.name}</h3>
                <span class="badge">${chapter.member_count || 0} membros</span>
            </div>
            <p class="card-description">${chapter.specialty || 'Comunidade de especialistas'}</p>
            <div class="card-footer">
                <span>👤 Líder: ${chapter.lead_name || 'Não definido'}</span>
            </div>
        </div>
    `).join('');
}

function generateDemoUsers() {
    return [
        { name: 'CEO Maria Santos', hierarchical_level: 0 },
        { name: 'Admin João Silva', hierarchical_level: 1 },
        { name: 'Admin Ana Costa', hierarchical_level: 1 },
        { name: 'Diretor Pedro Lima', hierarchical_level: 2 },
        { name: 'Diretora Carla Souza', hierarchical_level: 2 },
        { name: 'Gerente Carlos Tech', hierarchical_level: 3 }
    ];
}

function generateDemoSquads() {
    return [
        { name: 'Mobile Team', member_count: 8, project: 'App iOS/Android' },
        { name: 'Backend Core', member_count: 12, project: 'API & Microservices' }
    ];
}

function generateDemoChapters() {
    return [
        { name: 'Frontend', member_count: 15, specialty: 'React, Vue, Angular' },
        { name: 'DevOps', member_count: 8, specialty: 'AWS, Docker, K8s' }
    ];
}

function logout() {
    localStorage.clear();
    window.location.href = '/index.html';
}
