const API_BASE = 'http://localhost:3000/api';
let currentCompany = null;
let currentUser = null;
let authToken = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // O dev-mode-indicator.js já configurou o localStorage se veio de impersonation
    checkAuth();
});

// Verificar autenticação
async function checkAuth() {
    // Buscar dados do localStorage (configurado pelo dev-mode-indicator.js ou login normal)
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
        
        console.log('✅ Usuário autenticado:', currentUser);
        console.log('✅ Empresa:', currentCompany);
        
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
        await loadDashboardData();
        
    } catch (error) {
        console.error('❌ Erro ao processar autenticação:', error);
        alert('Erro ao carregar dados da sessão');
        window.location.href = '/index.html';
    }
}

// Função auxiliar para fazer requisições autenticadas
async function fetchWithAuth(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...options.headers
    };
    
    return fetch(url, { ...options, headers });
}

// Carregar todos os dados do dashboard
async function loadDashboardData() {
    await Promise.all([
        loadKPIs(),
        loadSquads(),
        loadUsers(),
        loadChapters(),
        loadSquadGoals(),
        loadUrgentApprovals(),
        generateExecutiveAlerts()
    ]);
}

// Carregar KPIs reais do banco de dados
async function loadKPIs() {
    try {
        // Carregar dados reais
        const [users, squads, chapters] = await Promise.all([
            loadUsers(),
            loadSquads(),
            loadChapters()
        ]);
        
        // KPI 1: Total de Colaboradores (dados reais)
        const totalEmployeesElement = document.getElementById('totalEmployees');
        if (totalEmployeesElement) {
            totalEmployeesElement.textContent = users.length;
        }
        
        // KPI 2: Total de Squads Ativos
        const activeSquads = squads.filter(s => s.status === 'active').length;
        
        // KPI 3: Taxa de Distribuição em Squads
        // Calcular quantos usuários estão em squads
        const usersInSquads = new Set();
        for (const squad of squads) {
            try {
                const response = await fetchWithAuth(`${API_BASE}/squads/${squad.id}/members`);
                if (response.ok) {
                    const members = await response.json();
                    members.forEach(m => usersInSquads.add(m.user_id));
                }
            } catch (error) {
                console.error(`Erro ao carregar membros do squad ${squad.id}:`, error);
            }
        }
        const squadParticipation = users.length > 0 ? Math.round((usersInSquads.size / users.length) * 100) : 0;
        
        // KPI 4: Chapters Ativos
        const activeChapters = chapters.filter(c => c.status === 'active').length;
        
        // Atualizar interface com métricas reais
        updateKPICard('revenue', 'Squads Ativos', activeSquads, `${squads.length} total`, 'positive');
        updateKPICard('ebitda', 'Taxa de Alocação', `${squadParticipation}%`, 'em squads', squadParticipation > 70 ? 'positive' : 'neutral');
        // totalEmployees já foi atualizado acima
        const employeesTrend = document.querySelector('#totalEmployees').parentElement.querySelector('.kpi-trend');
        if (employeesTrend) {
            employeesTrend.textContent = `${users.length} colaboradores`;
            employeesTrend.className = 'kpi-trend neutral';
        }
        updateKPICard('nps', 'Chapters Ativos', activeChapters, `${chapters.length} total`, 'positive');
        
        console.log('✅ KPIs reais carregados:', {
            colaboradores: users.length,
            squadsAtivos: activeSquads,
            alocacaoSquads: `${squadParticipation}%`,
            chaptersAtivos: activeChapters
        });
        
    } catch (error) {
        console.error('❌ Erro ao carregar KPIs:', error);
    }
}

// Função auxiliar para atualizar cards de KPI
function updateKPICard(elementId, title, value, subtitle, trendType) {
    const element = document.getElementById(elementId);
    if (element) {
        // Atualizar título
        const titleElement = element.parentElement.querySelector('h3');
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        // Atualizar valor
        element.textContent = value;
        
        // Atualizar subtítulo/trend
        const trendElement = element.parentElement.querySelector('.kpi-trend');
        if (trendElement) {
            trendElement.textContent = subtitle;
            trendElement.className = `kpi-trend ${trendType}`;
        }
    }
}

// Carregar squads estratégicos
async function loadSquads() {
    const container = document.getElementById('squadsContainer');
    
    if (!container) return [];
    
    try {
        const response = await fetchWithAuth(`${API_BASE}/squads/company/${currentCompany.id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const squads = await response.json();
        
        console.log(`✅ ${squads.length} squads carregados`);
        
        if (squads.length === 0) {
            container.innerHTML = '<p class="loading">Nenhum squad cadastrado. <a href="../Nivel01-AdministradoresGerais/squads.html">Criar primeiro squad</a></p>';
            return [];
        }
        
        container.innerHTML = '';
        
        // Carregar membros de cada squad para exibir contagem real
        for (const squad of squads.slice(0, 6)) {
            try {
                const membersResponse = await fetchWithAuth(`${API_BASE}/squads/${squad.id}/members`);
                const members = membersResponse.ok ? await membersResponse.json() : [];
                squad.member_count = members.length;
            } catch (error) {
                squad.member_count = 0;
            }
            
            const card = document.createElement('div');
            card.className = 'squad-mini-card';
            card.innerHTML = `
                <h4>${squad.name}</h4>
                <p>${squad.member_count} membros · ${squad.squad_type || 'Squad'}</p>
                <span class="squad-status ${squad.status}">${squad.status === 'active' ? 'Ativo' : 'Inativo'}</span>
            `;
            container.appendChild(card);
        }
        
        if (squads.length > 6) {
            const moreCard = document.createElement('div');
            moreCard.className = 'squad-mini-card more-squads';
            moreCard.innerHTML = `
                <h4>+${squads.length - 6} squads</h4>
                <p><a href="../Nivel01-AdministradoresGerais/squads.html">Ver todos os squads</a></p>
            `;
            container.appendChild(moreCard);
        }
        
        return squads;
        
    } catch (error) {
        console.error('❌ Erro ao carregar squads:', error);
        if (container) {
            container.innerHTML = '<p class="loading">Erro ao carregar squads</p>';
        }
        return [];
    }
}

// Carregar usuários da empresa
async function loadUsers() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/users/company/${currentCompany.id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const users = await response.json();
        
        console.log(`✅ ${users.length} usuários carregados`);
        
        // Atualizar contador de colaboradores
        const totalEmployeesElement = document.getElementById('totalEmployees');
        if (totalEmployeesElement) {
            totalEmployeesElement.textContent = users.length;
        }
        
        return users;
        
    } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        const totalEmployeesElement = document.getElementById('totalEmployees');
        if (totalEmployeesElement) {
            totalEmployeesElement.textContent = '0';
        }
        return [];
    }
}

// Carregar chapters
async function loadChapters() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/chapters/company/${currentCompany.id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const chapters = await response.json();
        
        console.log(`✅ ${chapters.length} chapters carregados`);
        
        return chapters;
        
    } catch (error) {
        console.error('❌ Erro ao carregar chapters:', error);
        return [];
    }
}

// Carregar metas dos squads (squad_goals)
async function loadSquadGoals() {
    const goalsContainer = document.querySelector('.card-body');
    if (!goalsContainer) return;
    
    try {
        // Buscar todos os squads
        const squadsResponse = await fetchWithAuth(`${API_BASE}/squads/company/${currentCompany.id}`);
        if (!squadsResponse.ok) throw new Error('Erro ao carregar squads');
        
        const squads = await squadsResponse.json();
        const allGoals = [];
        
        // Buscar goals de cada squad
        for (const squad of squads) {
            try {
                const goalsResponse = await fetchWithAuth(`${API_BASE}/squads/${squad.id}/goals`);
                if (goalsResponse.ok) {
                    const goals = await goalsResponse.json();
                    goals.forEach(goal => {
                        goal.squad_name = squad.name;
                        allGoals.push(goal);
                    });
                }
            } catch (error) {
                console.error(`Erro ao carregar goals do squad ${squad.id}:`, error);
            }
        }
        
        console.log(`✅ ${allGoals.length} metas estratégicas carregadas`);
        
        // Atualizar interface com metas reais
        const goalsSection = document.querySelector('.card-body');
        if (goalsSection && allGoals.length > 0) {
            goalsSection.innerHTML = allGoals.slice(0, 5).map(goal => {
                const progress = goal.progress || 0;
                return `
                    <div class="goal-item">
                        <div class="goal-info">
                            <h4>${goal.title}</h4>
                            <p>${goal.description || goal.squad_name}</p>
                        </div>
                        <div class="goal-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <span class="progress-label">${progress}% completo</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            if (allGoals.length > 5) {
                goalsSection.innerHTML += `
                    <div class="goal-item">
                        <p style="text-align: center; color: #666;">
                            <a href="../Nivel01-AdministradoresGerais/squads.html">Ver todas as ${allGoals.length} metas estratégicas</a>
                        </p>
                    </div>
                `;
            }
        } else if (goalsSection && allGoals.length === 0) {
            goalsSection.innerHTML = `
                <p class="loading">
                    Nenhuma meta estratégica definida.<br>
                    <a href="../Nivel01-AdministradoresGerais/squads.html">Criar metas para os squads</a>
                </p>
            `;
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar metas estratégicas:', error);
    }
}

// Carregar aprovações urgentes
async function loadUrgentApprovals() {
    const container = document.getElementById('urgentApprovalsContainer');
    const badge = document.getElementById('urgentApprovalsCount');
    
    if (!container) return;
    
    try {
        const response = await fetchWithAuth(`${API_BASE}/approvals/company/${currentCompany.id}?status=pending`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const approvals = await response.json();
        
        // Filtrar apenas as urgentes e de alta prioridade
        const urgentApprovals = approvals
            .filter(a => a.priority === 'urgent' || a.priority === 'high')
            .slice(0, 3);
        
        console.log(`✅ ${urgentApprovals.length} aprovações urgentes carregadas`);
        
        // Atualizar badge
        if (badge) {
            badge.textContent = `${urgentApprovals.length} ${urgentApprovals.length === 1 ? 'pendente' : 'pendentes'}`;
        }
        
        if (urgentApprovals.length === 0) {
            container.innerHTML = `
                <p class="loading" style="color: #10b981;">
                    ✅ Nenhuma aprovação crítica pendente
                </p>
            `;
            return;
        }
        
        container.innerHTML = urgentApprovals.map(approval => {
            const icon = getApprovalIcon(approval.type);
            const amount = approval.amount > 0 ? `R$ ${approval.amount.toLocaleString('pt-BR')}` : '';
            const createdDate = new Date(approval.created_at);
            const daysAgo = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
            
            return `
                <div class="approval-item ${approval.priority}">
                    <div class="approval-icon">${icon}</div>
                    <div class="approval-content">
                        <h4>${approval.title}</h4>
                        <p>${approval.description.substring(0, 60)}...</p>
                        <span class="approval-date">${amount ? amount + ' · ' : ''}Há ${daysAgo} ${daysAgo === 1 ? 'dia' : 'dias'}</span>
                    </div>
                    <div class="approval-actions">
                        <button class="btn-view" onclick="window.location.href='aprovacoes.html'">Ver</button>
                    </div>
                </div>
            `;
        }).join('');
        
        if (urgentApprovals.length > 0) {
            container.innerHTML += `
                <div style="text-align: center; margin-top: 15px;">
                    <a href="aprovacoes.html" style="color: #667eea; text-decoration: none; font-weight: 500;">
                        Ver todas as ${approvals.length} aprovações →
                    </a>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar aprovações urgentes:', error);
        if (container) {
            container.innerHTML = '<p class="loading">Erro ao carregar aprovações</p>';
        }
    }
}

// Gerar alertas executivos baseados em métricas reais
async function generateExecutiveAlerts() {
    const container = document.getElementById('alertsContainer');
    if (!container) return;
    
    try {
        const alerts = [];
        
        // Buscar dados para análise
        const [users, squads, chapters, approvals] = await Promise.all([
            loadUsers(),
            loadSquads(),
            loadChapters(),
            fetchWithAuth(`${API_BASE}/approvals/company/${currentCompany.id}`).then(r => r.ok ? r.json() : [])
        ]);
        
        // ALERTA 1: Squads sem membros
        const emptySquads = squads.filter(s => s.status === 'active' && (s.member_count === 0 || !s.member_count));
        if (emptySquads.length > 0) {
            alerts.push({
                type: 'warning',
                message: `${emptySquads.length} squad(s) ativo(s) sem membros alocados`,
                time: 'Agora',
                priority: 2
            });
        }
        
        // ALERTA 2: Aprovações urgentes pendentes há muito tempo
        const oldUrgentApprovals = approvals.filter(a => {
            if (a.status !== 'pending' || a.priority !== 'urgent') return false;
            const daysAgo = Math.floor((new Date() - new Date(a.created_at)) / (1000 * 60 * 60 * 24));
            return daysAgo >= 3;
        });
        
        if (oldUrgentApprovals.length > 0) {
            alerts.push({
                type: 'critical',
                message: `${oldUrgentApprovals.length} aprovação(ões) urgente(s) pendente(s) há mais de 3 dias`,
                time: 'Crítico',
                priority: 1
            });
        }
        
        // ALERTA 3: Baixa taxa de alocação em squads
        const usersInSquads = new Set();
        for (const squad of squads) {
            try {
                const response = await fetchWithAuth(`${API_BASE}/squads/${squad.id}/members`);
                if (response.ok) {
                    const members = await response.json();
                    members.forEach(m => usersInSquads.add(m.user_id));
                }
            } catch (error) {
                // Ignorar erros
            }
        }
        
        const allocationRate = users.length > 0 ? (usersInSquads.size / users.length) * 100 : 0;
        if (allocationRate < 50 && users.length > 5) {
            alerts.push({
                type: 'warning',
                message: `Apenas ${Math.round(allocationRate)}% dos colaboradores estão alocados em squads`,
                time: 'Hoje',
                priority: 3
            });
        }
        
        // ALERTA 4: Chapters inativos
        const inactiveChapters = chapters.filter(c => c.status === 'inactive');
        if (inactiveChapters.length > 0) {
            alerts.push({
                type: 'info',
                message: `${inactiveChapters.length} chapter(s) marcado(s) como inativo(s)`,
                time: 'Esta semana',
                priority: 4
            });
        }
        
        // ALERTA 5: Muitos usuários sem superior definido
        const usersWithoutSuperior = users.filter(u => !u.superior_id && u.nivel > 0);
        if (usersWithoutSuperior.length > users.length * 0.3) {
            alerts.push({
                type: 'warning',
                message: `${usersWithoutSuperior.length} colaboradores sem superior hierárquico definido`,
                time: 'Esta semana',
                priority: 3
            });
        }
        
        // ALERTA POSITIVO: Tudo funcionando bem
        if (alerts.length === 0) {
            alerts.push({
                type: 'info',
                message: '✅ Todos os indicadores estão dentro dos parâmetros esperados',
                time: 'Atualizado agora',
                priority: 5
            });
        }
        
        // Ordenar por prioridade
        alerts.sort((a, b) => a.priority - b.priority);
        
        // Renderizar alertas (máximo 3)
        container.innerHTML = alerts.slice(0, 3).map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-header">
                    <span class="alert-badge">${getAlertBadge(alert.type)}</span>
                    <span class="alert-time">${alert.time}</span>
                </div>
                <p class="alert-message">${alert.message}</p>
            </div>
        `).join('');
        
        console.log(`✅ ${alerts.length} alertas executivos gerados`);
        
    } catch (error) {
        console.error('❌ Erro ao gerar alertas:', error);
        if (container) {
            container.innerHTML = '<p class="loading">Erro ao gerar alertas</p>';
        }
    }
}

// Helpers
function getApprovalIcon(type) {
    const icons = {
        hiring: '👥',
        investment: '💰',
        project: '🚀',
        structure: '🏢',
        budget: '💳',
        partnership: '🤝',
        other: '📋'
    };
    return icons[type] || '📋';
}

function getAlertBadge(type) {
    const badges = {
        critical: 'CRÍTICO',
        warning: 'ATENÇÃO',
        info: 'INFO'
    };
    return badges[type] || 'INFO';
}

// Navegação
function navigateTo(path) {
    // Manter a sessão ao navegar
    window.location.href = path;
}

// Logout
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
