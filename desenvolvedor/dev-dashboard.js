const API_BASE = 'http://localhost:3000/api';

// ==================== HELPER - REQUISIÇÕES AUTENTICADAS ====================

// Função helper para fazer fetch com token de desenvolvedor
async function fetchWithDevAuth(url, options = {}) {
    const devToken = localStorage.getItem('devToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Adicionar token de desenvolvedor se existir
    if (devToken) {
        headers['Authorization'] = `Bearer ${devToken}`;
    }
    
    return fetch(url, {
        ...options,
        headers
    });
}

// ==================== AUTENTICAÇÃO ====================

function checkDevAuth() {
    const token = localStorage.getItem('devToken');
    
    if (!token) {
        // Não está autenticado, redirecionar para login
        window.location.href = 'dev-login.html';
        return false;
    }
    
    // Verificar validade do token
    fetch(`${API_BASE}/dev/auth/verify`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Token inválido');
        }
        return response.json();
    })
    .then(data => {
        // Token válido, mostrar info do usuário
        displayDevUser(data.user);
    })
    .catch(error => {
        console.error('Erro ao verificar token:', error);
        // Token inválido, limpar e redirecionar
        localStorage.removeItem('devToken');
        localStorage.removeItem('devUser');
        window.location.href = 'dev-login.html';
    });
    
    return true;
}

function displayDevUser(user) {
    // Adicionar info do usuário no header se necessário
    const headerRight = document.querySelector('.header-right');
    if (headerRight && !document.getElementById('devUserInfo')) {
        const userInfo = document.createElement('div');
        userInfo.id = 'devUserInfo';
        userInfo.style.cssText = 'display: flex; align-items: center; gap: 1rem; margin-right: 1rem; color: #2d3748;';
        userInfo.innerHTML = `
            <div style="text-align: right;">
                <div style="font-weight: 600;">${user.name}</div>
                <div style="font-size: 0.85rem; color: #6c757d;">${getRoleLabel(user.role)}</div>
            </div>
            <button class="btn-secondary" onclick="logout()" style="padding: 0.5rem 1rem;">
                🚪 Sair
            </button>
        `;
        headerRight.insertBefore(userInfo, headerRight.firstChild);
    }
}

function getRoleLabel(role) {
    const labels = {
        'developer': '🧑‍💻 Desenvolvedor',
        'tester': '🧪 Tester/QA',
        'designer': '🎨 Designer',
        'manager': '📊 Gerente',
        'admin': '👑 Admin'
    };
    return labels[role] || role;
}

function logout() {
    if (confirm('Deseja realmente sair do painel de desenvolvedor?')) {
        localStorage.removeItem('devToken');
        localStorage.removeItem('devUser');
        window.location.href = 'dev-login.html';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação primeiro
    if (!checkDevAuth()) {
        return;
    }
    
    // Carregar dados
    loadStats();
    loadCompanies();
    loadAllUsers();
    loadQuickLogin();
});

// ==================== NAVEGAÇÃO ====================

function showTab(tabName) {
    // Atualizar botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Atualizar painéis
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Carregar dados específicos
    if (tabName === 'quick-login') loadQuickLogin();
    if (tabName === 'interfaces') loadCompaniesForInterfaces();
}

// ==================== ESTATÍSTICAS ====================

async function loadStats() {
    try {
        // Empresas
        const companiesRes = await fetch(`${API_BASE}/companies`);
        const companies = await companiesRes.json();
        document.getElementById('totalCompanies').textContent = companies.length;
        
        // Usuários (usando rota DEV sem auth)
        let totalUsers = 0;
        for (const company of companies) {
            try {
                const usersRes = await fetch(`${API_BASE}/dev/users/company/${company.id}`);
                const users = await usersRes.json();
                totalUsers += users.length;
            } catch (e) {
                console.error('Erro ao carregar usuários:', e);
            }
        }
        document.getElementById('totalUsers').textContent = totalUsers;
        
        // Squads (usando rota DEV sem auth)
        let totalSquads = 0;
        for (const company of companies) {
            try {
                const squadsRes = await fetch(`${API_BASE}/dev/squads/company/${company.id}`);
                const squads = await squadsRes.json();
                totalSquads += squads.length;
            } catch (e) {
                console.error('Erro ao carregar squads:', e);
            }
        }
        document.getElementById('totalSquads').textContent = totalSquads;
        
        // Chapters (usando rota DEV sem auth)
        let totalChapters = 0;
        for (const company of companies) {
            try {
                const chaptersRes = await fetch(`${API_BASE}/dev/chapters/company/${company.id}`);
                const chapters = await chaptersRes.json();
                totalChapters += chapters.length;
            } catch (e) {
                console.error('Erro ao carregar chapters:', e);
            }
        }
        document.getElementById('totalChapters').textContent = totalChapters;
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// ==================== EMPRESAS ====================

async function loadCompanies() {
    try {
        const response = await fetch(`${API_BASE}/dev/companies`);
        const companies = await response.json();
        
        const tbody = document.getElementById('companiesTableBody');
        const filterSelect = document.getElementById('filterCompany');
        
        // Preencher tabela
        tbody.innerHTML = companies.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.legal_name || '-'}</td>
                <td>${c.industry || '-'}</td>
                <td>${getSizeName(c.size)}</td>
                <td><button class="btn-secondary" onclick="viewTemplate(${c.id})">Ver Template</button></td>
                <td>
                    <button class="btn-secondary" onclick="viewCompany(${c.id})">👁️</button>
                    <button class="btn-danger" onclick="deleteCompany(${c.id}, '${c.name}')">🗑️</button>
                </td>
            </tr>
        `).join('');
        
        // Preencher filtro
        filterSelect.innerHTML = '<option value="">Todas as Empresas</option>' + 
            companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            
    } catch (error) {
        console.error('Erro ao carregar empresas:', error);
    }
}

function getSizeName(size) {
    const names = { small: 'Pequena', medium: 'Média', large: 'Grande' };
    return names[size] || size;
}

function openCompanyModal() {
    document.getElementById('companyModal').classList.add('active');
}

function closeCompanyModal() {
    document.getElementById('companyModal').classList.remove('active');
}

async function saveCompany() {
    const data = {
        company: {
            name: document.getElementById('companyName').value,
            legal_name: document.getElementById('companyLegalName').value,
            founded_year: parseInt(document.getElementById('companyYear').value),
            size: document.getElementById('companySize').value,
            industry: document.getElementById('companyIndustry').value,
            website: document.getElementById('companyWebsite').value,
            description: 'Empresa criada via painel dev'
        },
        admins: [{
            name: 'Administrador',
            email: `admin@${document.getElementById('companyName').value.toLowerCase().replace(/\s+/g, '')}.com`,
            phone: '+55 11 99999-9999',
            department: 'TI',
            access_key: 'admin',
            password: '123456'
        }]
    };
    
    try {
        const response = await fetch(`${API_BASE}/companies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('✅ Empresa criada com sucesso!');
            closeCompanyModal();
            loadCompanies();
            loadStats();
        } else {
            alert('❌ Erro ao criar empresa');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao criar empresa');
    }
}

async function deleteCompany(id, name) {
    if (id === 1) {
        alert('❌ Não é possível deletar a empresa demonstrativa!');
        return;
    }
    
    if (!confirm(`⚠️ ATENÇÃO: Deletar "${name}"?\n\nIsso deletará:\n- Todos os usuários\n- Todos os squads\n- Todos os chapters\n- Todos os dados relacionados\n\nEsta ação é IRREVERSÍVEL!`)) return;
    
    if (!confirm(`⚠️ CONFIRMAÇÃO FINAL: Tem CERTEZA ABSOLUTA?`)) return;
    
    try {
        const response = await fetch(`${API_BASE}/dev/companies/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`✅ ${result.message}`);
            loadCompanies();
            loadStats();
            loadAllUsers();
        } else {
            alert('❌ Erro ao deletar empresa');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao deletar empresa');
    }
}

async function viewCompany(id) {
    try {
        const response = await fetch(`${API_BASE}/companies/${id}`);
        const company = await response.json();
        
        const info = `
🏢 DETALHES DA EMPRESA

ID: ${company.id}
Nome: ${company.name}
Razão Social: ${company.legal_name}
Ano Fundação: ${company.founded_year}
Tamanho: ${getSizeName(company.size)}
Setor: ${company.industry}
Website: ${company.website}
Descrição: ${company.description}
        `.trim();
        
        alert(info);
    } catch (error) {
        alert('Erro ao buscar detalhes da empresa');
    }
}

async function viewTemplate(companyId) {
    try {
        const response = await fetch(`${API_BASE}/templates/${companyId}`);
        const template = await response.json();
        
        let levels = [];
        if (template.active_levels) {
            const activeLevels = template.active_levels.split(',');
            const names = typeof template.level_names === 'string' 
                ? JSON.parse(template.level_names) 
                : template.level_names;
            
            activeLevels.forEach(level => {
                if (names[level]) {
                    levels.push(`Nível ${level}: ${names[level]}`);
                }
            });
        }
        
        const info = `
⚙️ TEMPLATE ORGANIZACIONAL

Tipo: ${template.template_type || 'Não configurado'}
Níveis Ativos: ${template.active_levels ? template.active_levels.split(',').length : 0}

${levels.length > 0 ? '\nESTRUTURA:\n' + levels.join('\n') : 'Nenhum nível configurado'}
        `.trim();
        
        alert(info);
    } catch (error) {
        alert('Erro ao buscar template');
    }
}

// ==================== USUÁRIOS ====================

async function loadAllUsers() {
    const filterCompanyId = document.getElementById('filterCompany').value;
    const filterNivel = document.getElementById('filterNivel').value;
    
    try {
        const companiesRes = await fetch(`${API_BASE}/companies`);
        const companies = await companiesRes.json();
        
        let allUsers = [];
        
        for (const company of companies) {
            if (filterCompanyId && company.id != filterCompanyId) continue;
            
            try {
                const usersRes = await fetch(`${API_BASE}/dev/users/company/${company.id}`);
                const users = await usersRes.json();
                
                users.forEach(user => {
                    user.company_name = company.name;
                });
                
                allUsers = allUsers.concat(users);
            } catch (e) {
                console.error('Erro ao carregar usuários:', e);
            }
        }
        
        // Filtrar por nível
        if (filterNivel) {
            allUsers = allUsers.filter(u => u.nivel == filterNivel);
        }
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = allUsers.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.company_name}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="nivel-badge">N${u.nivel}</span></td>
                <td>${u.department}</td>
                <td><code>${u.access_key}</code></td>
                <td>
                    <button class="btn-primary" onclick="quickLoginAs(${u.id}, ${u.company_id})">Login</button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// ==================== LOGIN RÁPIDO ====================

async function loadQuickLogin() {
    try {
        const companiesRes = await fetch(`${API_BASE}/companies`);
        const companies = await companiesRes.json();
        
        let allUsers = [];
        
        for (const company of companies) {
            try {
                const usersRes = await fetch(`${API_BASE}/dev/users/company/${company.id}`);
                const users = await usersRes.json();
                
                users.forEach(user => {
                    user.company_name = company.name;
                });
                
                allUsers = allUsers.concat(users);
            } catch (e) {}
        }
        
        const grid = document.getElementById('quickLoginGrid');
        grid.innerHTML = allUsers.map(u => `
            <div class="login-card">
                <h3>${u.name}</h3>
                <p><strong>Empresa:</strong> ${u.company_name}</p>
                <p><strong>Email:</strong> ${u.email}</p>
                <p><strong>Departamento:</strong> ${u.department}</p>
                <span class="nivel-badge">Nível ${u.nivel}</span>
                <button class="btn-primary" onclick="quickLoginAs(${u.id}, ${u.company_id})">
                    🚀 Login Rápido
                </button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro:', error);
    }
}

function quickLoginAs(userId, companyId) {
    // Simular login sem senha
    fetch(`${API_BASE}/companies/${companyId}`)
        .then(res => res.json())
        .then(company => {
            return fetch(`${API_BASE}/users/company/${companyId}`);
        })
        .then(res => res.json())
        .then(users => {
            const user = users.find(u => u.id === userId);
            
            if (user) {
                // Gerar token fake (em produção viria do backend)
                const fakeToken = btoa(JSON.stringify({ userId, companyId, exp: Date.now() + 86400000 }));
                
                // Salvar no localStorage
                localStorage.setItem('token', fakeToken);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Redirecionar baseado no nível
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
                
                const dashboard = dashboards[user.nivel] || dashboards[1];
                window.location.href = dashboard;
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao fazer login rápido');
        });
}

// ==================== BANCO DE DADOS ====================

async function viewTable(tableName) {
    try {
        const response = await fetch(`${API_BASE}/dev/table/${tableName}`);
        const data = await response.json();
        
        const viewDiv = document.getElementById('tableDataView');
        const titleH3 = document.getElementById('tableTitle');
        const contentDiv = document.getElementById('tableDataContent');
        
        titleH3.textContent = `📊 Tabela: ${tableName} (${data.length} registros)`;
        contentDiv.textContent = JSON.stringify(data, null, 2);
        
        viewDiv.style.display = 'block';
        viewDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert(`Erro ao buscar dados da tabela ${tableName}`);
    }
}

// ==================== TESTAR API ====================

async function testAPI() {
    const method = document.getElementById('apiMethod').value;
    const endpoint = document.getElementById('apiEndpoint').value;
    const body = document.getElementById('apiBody').value;
    const useAuth = document.getElementById('apiAuth').checked;
    
    const url = `http://localhost:3000${endpoint}`;
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    
    if (useAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    if ((method === 'POST' || method === 'PUT') && body) {
        try {
            options.body = body;
        } catch (e) {
            alert('JSON inválido no body');
            return;
        }
    }
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        const result = {
            status: response.status,
            statusText: response.statusText,
            data: data
        };
        
        document.getElementById('apiResponseContent').textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('apiResponseContent').textContent = `ERRO: ${error.message}`;
    }
}

// ==================== DADOS DE TESTE ====================

async function seedTechStartup() {
    if (!confirm('🚀 Criar Startup de Tecnologia?\n\n- 15 funcionários\n- 3 squads ativos\n- Template: Startup')) return;
    
    try {
        const response = await fetch(`${API_BASE}/dev/seed/tech-startup`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`✅ ${result.message}\n\nID da Empresa: ${result.companyId}\nUsuários: ${result.users}\nSquads: ${result.squads}\n\n${result.credentials}`);
            loadStats();
            loadCompanies();
            loadAllUsers();
            loadQuickLogin();
        } else {
            alert('❌ Erro ao criar startup');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao criar startup');
    }
}

async function seedCorporate() {
    if (!confirm('🏢 Criar Grande Corporação?\n\n- Estrutura completa (8 níveis)\n- Template: Corporate')) return;
    
    try {
        const response = await fetch(`${API_BASE}/dev/seed/corporate`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`✅ ${result.message}\n\nID da Empresa: ${result.companyId}\n\n${result.note}`);
            loadStats();
            loadCompanies();
        } else {
            alert('❌ Erro ao criar corporação');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao criar corporação');
    }
}

async function seedAgency() {
    if (!confirm('🎨 Criar Agência de Marketing?\n\n- Estrutura média (5 níveis)\n- Template: Scale-up')) return;
    
    try {
        const response = await fetch(`${API_BASE}/dev/seed/agency`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`✅ ${result.message}\n\nID da Empresa: ${result.companyId}\n\n${result.note}`);
            loadStats();
            loadCompanies();
        } else {
            alert('❌ Erro ao criar agência');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao criar agência');
    }
}

async function clearAllData() {
    if (!confirm('⚠️ ATENÇÃO: Deletar TODOS OS DADOS?\n\nApenas a empresa demonstrativa será mantida.\n\nTem certeza?')) return;
    if (!confirm('⚠️ ÚLTIMA CHANCE! Realmente deseja deletar tudo?')) return;
    if (!confirm('⚠️ CONFIRMAÇÃO FINAL: Digite OK no próximo prompt')) {
        const confirmation = prompt('Digite OK para confirmar:');
        if (confirmation !== 'OK') {
            alert('❌ Operação cancelada');
            return;
        }
    }
    
    try {
        const response = await fetch(`${API_BASE}/dev/clear-all`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`✅ ${result.message}\n\nTodos os dados foram removidos exceto a empresa demonstrativa.`);
            loadStats();
            loadCompanies();
            loadAllUsers();
            loadQuickLogin();
        } else {
            alert('❌ Erro ao limpar dados');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao limpar dados');
    }
}

// ==================== EXPLORAR INTERFACES ====================

// Estrutura de todas as interfaces disponíveis - Ascenda Flex
const INTERFACES_MAP = [
    // Nível 0 - Presidentes
    {
        level: 0,
        icon: '👑',
        name: 'Dashboard Presidência',
        description: 'Visão estratégica global, decisões corporativas críticas e análise de indicadores macro',
        path: '/Nivel00-Presidentes/dashboard-presidentes.html'
    },
    
    // Nível 1 - Administradores Gerais
    {
        level: 1,
        icon: '⚙️',
        name: 'Dashboard Administrativo',
        description: 'Painel administrativo completo com gestão de toda organização Ascenda Flex',
        path: '/Nivel01-AdministradoresGerais/dashboard-admin.html'
    },
    {
        level: 1,
        icon: '📋',
        name: 'Templates Organizacionais',
        description: 'Configurar estrutura da empresa: Startup, Scale-up ou Corporate',
        path: '/Nivel01-AdministradoresGerais/templates.html'
    },
    {
        level: 1,
        icon: '🚀',
        name: 'Gestão de Squads',
        description: 'Criar e gerenciar squads multifuncionais, alocar membros e definir metas',
        path: '/Nivel01-AdministradoresGerais/squads.html'
    },
    {
        level: 1,
        icon: '📚',
        name: 'Gestão de Chapters',
        description: 'Gerenciar comunidades de prática por especialidade técnica',
        path: '/Nivel01-AdministradoresGerais/chapters.html'
    },
    {
        level: 1,
        icon: '👥',
        name: 'Gestão de Usuários',
        description: 'CRUD completo de usuários, permissões e níveis hierárquicos',
        path: '/Nivel01-AdministradoresGerais/usuarios.html'
    },
    
    // Nível 2 - Diretores Executivos
    {
        level: 2,
        icon: '📊',
        name: 'Dashboard Diretoria',
        description: 'Gestão departamental, KPIs, orçamentos e estratégia tática',
        path: '/Nivel02-DiretoresExecutivos/dashboard-diretores.html'
    },
    
    // Nível 3 - Gerentes
    {
        level: 3,
        icon: '📈',
        name: 'Dashboard Gerência',
        description: 'Supervisão de operações, gestão de equipe e controle de metas',
        path: '/Nivel03-Gerentes/dashboard-gerentes.html'
    },
    
    // Nível 4 - Coordenadores
    {
        level: 4,
        icon: '🎯',
        name: 'Dashboard Coordenação',
        description: 'Coordenação de projetos, sprints, atividades e recursos',
        path: '/Nivel04-Coordenadores/dashboard-coordenadores.html'
    },
    
    // Nível 5 - Supervisores
    {
        level: 5,
        icon: '👁️',
        name: 'Dashboard Supervisão',
        description: 'Supervisão direta de equipe, controle de qualidade e tarefas operacionais',
        path: '/Nivel05-Supervisores/dashboard-supervisores.html'
    },
    
    // Nível 6 - Especialistas
    {
        level: 6,
        icon: '💼',
        name: 'Dashboard Especialistas',
        description: 'Execução técnica especializada e contribuição em chapters',
        path: '/Nivel06-Especialistas/dashboard-especialistas.html'
    },
    
    // Nível 7 - Operacional
    {
        level: 7,
        icon: '📝',
        name: 'Dashboard Operacional',
        description: 'Execução de tarefas operacionais, checklists diários e timesheet',
        path: '/Nivel07-Operacional/dashboard-operacional.html'
    }
];

async function loadInterfacesByCompany() {
    const companyId = document.getElementById('interfaceCompanySelect').value;
    const grid = document.getElementById('interfacesGrid');
    
    if (!companyId) {
        grid.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 40px;">Selecione uma empresa acima</p>';
        return;
    }
    
    // Buscar dados da empresa
    try {
        const response = await fetch(`${API_BASE}/dev/companies`);
        const companies = await response.json();
        const company = companies.find(c => c.id == companyId);
        
        if (!company) {
            grid.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 40px;">❌ Empresa não encontrada</p>';
            return;
        }
        
        // Renderizar cards de interfaces
        grid.innerHTML = INTERFACES_MAP.map(interface => `
            <div class="interface-card" onclick="openInterface('${interface.path}', ${companyId})">
                <div class="interface-card-header">
                    <div class="interface-icon">${interface.icon}</div>
                    <div class="interface-info">
                        <h3>${interface.name}</h3>
                        <span class="interface-level">Nível ${interface.level}</span>
                    </div>
                </div>
                <p class="interface-description">${interface.description}</p>
                <div class="interface-path">${interface.path}</div>
                <div class="interface-actions">
                    <button class="btn-interface btn-open" onclick="event.stopPropagation(); openInterface('${interface.path}', ${companyId})">
                        🚀 Abrir
                    </button>
                    <button class="btn-interface btn-new-tab" onclick="event.stopPropagation(); openInterfaceNewTab('${interface.path}', ${companyId})">
                        🔗 Nova Aba
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar interfaces:', error);
        grid.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 40px;">❌ Erro ao carregar interfaces</p>';
    }
}

function openInterface(path, companyId) {
    // Salvar contexto da empresa no localStorage
    localStorage.setItem('devModeCompanyId', companyId);
    
    // Construir URL absoluta usando o servidor
    const baseUrl = 'http://localhost:3000';
    const fullUrl = baseUrl + path;
    
    // Abrir interface na mesma aba
    window.location.href = fullUrl;
}

function openInterfaceNewTab(path, companyId) {
    // Salvar contexto da empresa no localStorage
    localStorage.setItem('devModeCompanyId', companyId);
    
    // Construir URL absoluta usando o servidor
    const baseUrl = 'http://localhost:3000';
    const fullUrl = baseUrl + path;
    
    // Abrir interface em nova aba
    window.open(fullUrl, '_blank');
}

// Carregar empresas no select quando abrir a aba
async function loadCompaniesForInterfaces() {
    try {
        const response = await fetch(`${API_BASE}/companies`);
        const companies = await response.json();
        
        const select = document.getElementById('interfaceCompanySelect');
        select.innerHTML = `
            <option value="">-- Selecione uma empresa --</option>
            ${companies.map(c => `
                <option value="${c.id}">${c.name} (ID: ${c.id})</option>
            `).join('')}
        `;
    } catch (error) {
        console.error('Erro ao carregar empresas:', error);
    }
}

// Exportar funções para uso global
window.showTab = showTab;
window.openCompanyModal = openCompanyModal;
window.closeCompanyModal = closeCompanyModal;
window.saveCompany = saveCompany;
window.deleteCompany = deleteCompany;
window.viewCompany = viewCompany;
window.viewTemplate = viewTemplate;
window.quickLoginAs = quickLoginAs;
window.viewTable = viewTable;
window.testAPI = testAPI;
window.seedTechStartup = seedTechStartup;
window.seedCorporate = seedCorporate;
window.seedAgency = seedAgency;
window.clearAllData = clearAllData;
window.loadInterfacesByCompany = loadInterfacesByCompany;
window.openInterface = openInterface;
window.openInterfaceNewTab = openInterfaceNewTab;
window.logout = logout;
