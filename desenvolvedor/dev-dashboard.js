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
        console.log('❌ Token não encontrado, redirecionando para login...');
        window.location.href = 'dev-login.html';
        return false;
    }
    
    console.log('✅ Token encontrado, verificando validade...');
    
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
        console.log('✅ Token válido! Dados:', data);
        // Token válido, mostrar info do usuário
        // Pegar dados completos do localStorage (que tem o name)
        const devUserStorage = localStorage.getItem('devUser');
        console.log('📦 devUser do localStorage:', devUserStorage);
        let devUser = { name: 'Desenvolvedor', role: 'developer' };
        
        if (devUserStorage) {
            try {
                devUser = JSON.parse(devUserStorage);
                console.log('✅ devUser parseado:', devUser);
            } catch (e) {
                console.error('Erro ao parsear devUser do localStorage:', e);
            }
        }
        
        // Se o localStorage não tem name, usar o email como fallback
        if (!devUser.name && data.developer && data.developer.email) {
            devUser.name = data.developer.email.split('@')[0];
            console.log('⚠️ Usando email como fallback para name:', devUser.name);
        }
        
        // Garantir que role está atualizado do token
        if (data.developer && data.developer.role) {
            devUser.role = data.developer.role;
        }
        
        console.log('🎯 Chamando displayDevUser com:', devUser);
        displayDevUser(devUser);
    })
    .catch(error => {
        console.error('❌ Erro ao verificar token:', error);
        // Token inválido, limpar e redirecionar
        localStorage.removeItem('devToken');
        localStorage.removeItem('devUser');
        window.location.href = 'dev-login.html';
    });
    
    return true;
}

function displayDevUser(user) {
    console.log('📋 Exibindo dados do desenvolvedor:', user);
    
    // Garantir que temos os dados mínimos
    const devName = user.name || user.email?.split('@')[0] || 'Desenvolvedor';
    const devRole = user.role || 'developer';
    
    // Adicionar info do usuário no header se necessário
    const headerRight = document.querySelector('.header-right');
    if (headerRight && !document.getElementById('devUserInfo')) {
        const userInfo = document.createElement('div');
        userInfo.id = 'devUserInfo';
        userInfo.style.cssText = 'display: flex; align-items: center; gap: 1rem; margin-right: 1rem; color: #2d3748;';
        userInfo.innerHTML = `
            <div style="text-align: right;">
                <div style="font-weight: 600;">${devName}</div>
                <div style="font-size: 0.85rem; color: #6c757d;">${getRoleLabel(devRole)}</div>
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
    
    // Carregar dados iniciais
    loadStats();
    loadCompanies();
    loadRequests('pending'); // Carregar pedidos pendentes
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
    if (tabName === 'requests') loadRequests('pending');
    if (tabName === 'developers') loadDevelopers();
    if (tabName === 'interfaces') loadCompaniesForInterfaces();
}

// ==================== ESTATÍSTICAS ====================

async function loadStats() {
    try {
        console.log('📊 Carregando estatísticas...');
        
        // Empresas
        const companiesRes = await fetchWithDevAuth(`${API_BASE}/dev/companies`);
        const companies = await companiesRes.json();
        document.getElementById('totalCompanies').textContent = companies.length;
        console.log(`✅ ${companies.length} empresas encontradas`);
        
        // Usuários
        let totalUsers = 0;
        for (const company of companies) {
            try {
                const usersRes = await fetchWithDevAuth(`${API_BASE}/dev/users/company/${company.id}`);
                const users = await usersRes.json();
                totalUsers += users.length;
            } catch (e) {
                console.error('Erro ao carregar usuários da empresa', company.id, ':', e);
            }
        }
        document.getElementById('totalUsers').textContent = totalUsers;
        console.log(`✅ ${totalUsers} usuários encontrados`);
        
        // Squads
        let totalSquads = 0;
        for (const company of companies) {
            try {
                const squadsRes = await fetchWithDevAuth(`${API_BASE}/dev/squads/company/${company.id}`);
                const squads = await squadsRes.json();
                totalSquads += squads.length;
            } catch (e) {
                console.error('Erro ao carregar squads da empresa', company.id, ':', e);
            }
        }
        document.getElementById('totalSquads').textContent = totalSquads;
        console.log(`✅ ${totalSquads} squads encontrados`);
        
        // Chapters
        let totalChapters = 0;
        for (const company of companies) {
            try {
                const chaptersRes = await fetchWithDevAuth(`${API_BASE}/dev/chapters/company/${company.id}`);
                const chapters = await chaptersRes.json();
                totalChapters += chapters.length;
            } catch (e) {
                console.error('Erro ao carregar chapters da empresa', company.id, ':', e);
            }
        }
        document.getElementById('totalChapters').textContent = totalChapters;
        console.log(`✅ ${totalChapters} chapters encontrados`);
        
    } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error);
    }
}

// ==================== EMPRESAS ====================

async function loadCompanies() {
    try {
        console.log('🏢 Carregando empresas...');
        const response = await fetchWithDevAuth(`${API_BASE}/dev/companies`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const companies = await response.json();
        console.log(`✅ ${companies.length} empresas carregadas:`, companies);
        
        const tbody = document.getElementById('companiesTableBody');
        const filterSelect = document.getElementById('filterCompany');
        
        if (!tbody) {
            console.error('❌ Elemento companiesTableBody não encontrado!');
            return;
        }
        
        // Preencher tabela
        tbody.innerHTML = companies.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.legal_name || '-'}</td>
                <td>${c.industry || '-'}</td>
                <td>${getSizeName(c.size)}</td>
                <td><span class="status-badge status-${c.status || 'active'}">${getStatusLabel(c.status || 'active')}</span></td>
                <td>
                    <button class="btn-secondary" onclick="viewCompanyUsers(${c.id}, '${c.name}')" title="Ver usuários e fazer login rápido">👥 Usuários</button>
                    <button class="btn-secondary" onclick="viewCompanyDetails(${c.id})" title="Ver detalhes da empresa">👁️ Detalhes</button>
                    <button class="btn-warning" onclick="changeCompanyStatus(${c.id}, '${c.name}', '${c.status || 'active'}')" title="Alterar status">⚙️ Status</button>
                </td>
            </tr>
        `).join('');
        
        // Preencher filtro
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">Todas as Empresas</option>' + 
                companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
            
    } catch (error) {
        console.error('❌ Erro ao carregar empresas:', error);
    }
}

function getSizeName(size) {
    const names = { small: 'Pequena', medium: 'Média', large: 'Grande' };
    return names[size] || size;
}

function getStatusLabel(status) {
    const labels = {
        'active': '✅ Ativa',
        'inactive': '⏸️ Desativada',
        'suspended': '⚠️ Suspensa'
    };
    return labels[status] || '✅ Ativa';
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
        const response = await fetchWithDevAuth(`${API_BASE}/dev/companies/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`✅ ${result.message}`);
            loadCompanies();
            loadStats();
        } else {
            alert('❌ Erro ao deletar empresa');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao deletar empresa');
    }
}

// Nova função: Ver usuários de uma empresa específica
let currentCompanyUsers = [];
let currentCompanyId = null;
let currentCompanyName = '';

async function viewCompanyUsers(companyId, companyName) {
    try {
        console.log(`👥 Carregando usuários da empresa ${companyName} (ID: ${companyId})...`);
        
        currentCompanyId = companyId;
        currentCompanyName = companyName;
        
        const response = await fetchWithDevAuth(`${API_BASE}/dev/users/company/${companyId}`);
        const users = await response.json();
        
        currentCompanyUsers = users;
        
        console.log(`✅ ${users.length} usuários encontrados`);
        
        // Atualizar título do modal
        document.getElementById('companyUsersTitle').textContent = companyName;
        
        // Renderizar usuários
        renderCompanyUsers(users);
        
        // Abrir modal
        document.getElementById('companyUsersModal').classList.add('active');
        
    } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        alert('❌ Erro ao carregar usuários da empresa');
    }
}

function renderCompanyUsers(users) {
    const grid = document.getElementById('companyUsersGrid');
    
    if (users.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #6c757d;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📭</div>
                <h3>Nenhum usuário cadastrado</h3>
                <p>Esta empresa ainda não possui usuários.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = users.map(user => `
        <div class="user-card">
            <h4>${user.name}</h4>
            <p><strong>📧 Email:</strong> ${user.email}</p>
            <p><strong>🏷️ Depto:</strong> ${user.department}</p>
            <p><strong>📊 Role:</strong> ${user.role || 'Não definido'}</p>
            <p><strong>🔑 Chave:</strong> <code>${user.access_key}</code></p>
            ${user.phone ? `<p><strong>📞 Tel:</strong> ${user.phone}</p>` : ''}
            <span class="nivel-badge">Nível ${user.nivel}</span>
            <button class="btn-primary" onclick="quickLoginAs(${user.id}, ${currentCompanyId})">
                🚀 Login Rápido
            </button>
        </div>
    `).join('');
}

function filterModalUsers() {
    const nivelFilter = document.getElementById('modalFilterNivel').value;
    const searchTerm = document.getElementById('modalSearchUser').value.toLowerCase();
    
    let filtered = currentCompanyUsers;
    
    // Filtrar por nível
    if (nivelFilter) {
        filtered = filtered.filter(u => u.nivel == nivelFilter);
    }
    
    // Filtrar por busca
    if (searchTerm) {
        filtered = filtered.filter(u => 
            u.name.toLowerCase().includes(searchTerm) ||
            u.email.toLowerCase().includes(searchTerm) ||
            u.department.toLowerCase().includes(searchTerm)
        );
    }
    
    renderCompanyUsers(filtered);
}

function closeCompanyUsersModal() {
    document.getElementById('companyUsersModal').classList.remove('active');
    document.getElementById('modalFilterNivel').value = '';
    document.getElementById('modalSearchUser').value = '';
    currentCompanyUsers = [];
}

// Nova função: Ver detalhes completos da empresa
async function viewCompanyDetails(id) {
    try {
        console.log(`🏢 Carregando detalhes da empresa ID: ${id}...`);
        
        const response = await fetchWithDevAuth(`${API_BASE}/dev/companies`);
        const companies = await response.json();
        const company = companies.find(c => c.id === id);
        
        if (!company) {
            alert('❌ Empresa não encontrada');
            return;
        }
        
        // Buscar estatísticas da empresa
        const usersRes = await fetchWithDevAuth(`${API_BASE}/dev/users/company/${id}`);
        const users = await usersRes.json();
        
        const squadsRes = await fetchWithDevAuth(`${API_BASE}/dev/squads/company/${id}`);
        const squads = await squadsRes.json();
        
        const chaptersRes = await fetchWithDevAuth(`${API_BASE}/dev/chapters/company/${id}`);
        const chapters = await chaptersRes.json();
        
        // Renderizar conteúdo do modal
        const content = document.getElementById('companyDetailsContent');
        content.innerHTML = `
            <div class="details-section">
                <h4>📋 Informações Básicas</h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <label>ID</label>
                        <p>${company.id}</p>
                    </div>
                    <div class="detail-item">
                        <label>Nome</label>
                        <p>${company.name}</p>
                    </div>
                    <div class="detail-item">
                        <label>Razão Social</label>
                        <p>${company.legal_name || '-'}</p>
                    </div>
                    <div class="detail-item">
                        <label>Ano de Fundação</label>
                        <p>${company.founded_year || '-'}</p>
                    </div>
                    <div class="detail-item">
                        <label>Tamanho</label>
                        <p>${getSizeName(company.size)}</p>
                    </div>
                    <div class="detail-item">
                        <label>Setor</label>
                        <p>${company.industry || '-'}</p>
                    </div>
                    <div class="detail-item">
                        <label>Website</label>
                        <p><a href="${company.website || '#'}" target="_blank">${company.website || '-'}</a></p>
                    </div>
                    <div class="detail-item">
                        <label>Status</label>
                        <p><span class="status-badge status-${company.status || 'active'}">${getStatusLabel(company.status || 'active')}</span></p>
                    </div>
                </div>
            </div>
            
            <div class="details-section">
                <h4>📊 Estatísticas</h4>
                <div class="stats-cards">
                    <div class="stat-detail-card">
                        <h3>${users.length}</h3>
                        <p>� Usuários</p>
                    </div>
                    <div class="stat-detail-card">
                        <h3>${squads.length}</h3>
                        <p>� Squads</p>
                    </div>
                    <div class="stat-detail-card">
                        <h3>${chapters.length}</h3>
                        <p>📚 Chapters</p>
                    </div>
                </div>
            </div>
            
            <div class="details-section">
                <h4>📝 Descrição</h4>
                <p style="color: #6c757d; line-height: 1.6;">${company.description || 'Sem descrição disponível.'}</p>
            </div>
        `;
        
        // Abrir modal
        document.getElementById('companyDetailsModal').classList.add('active');
        console.log('✅ Detalhes exibidos com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao carregar detalhes:', error);
        alert('❌ Erro ao carregar detalhes da empresa');
    }
}

function closeCompanyDetailsModal() {
    document.getElementById('companyDetailsModal').classList.remove('active');
}

// Nova função: Alterar status da empresa
let statusChangeCompanyId = null;
let statusChangeCompanyName = '';
let statusChangeCurrent = '';

async function changeCompanyStatus(id, name, currentStatus) {
    statusChangeCompanyId = id;
    statusChangeCompanyName = name;
    statusChangeCurrent = currentStatus;
    
    // Atualizar informações do modal
    document.getElementById('statusCompanyName').textContent = name;
    document.getElementById('statusCurrentLabel').textContent = getStatusLabel(currentStatus);
    
    // Abrir modal
    document.getElementById('statusModal').classList.add('active');
}

async function selectStatus(newStatus) {
    if (newStatus === statusChangeCurrent) {
        alert('ℹ️ O status selecionado é o mesmo que o atual');
        closeStatusModal();
        return;
    }
    
    const statusLabels = {
        'active': '✅ Ativa',
        'inactive': '⏸️ Desativada',
        'suspended': '⚠️ Suspensa'
    };
    
    if (!confirm(`Confirma alterar o status de "${statusChangeCompanyName}" para ${statusLabels[newStatus]}?`)) {
        return;
    }
    
    try {
        console.log(`⚙️ Alterando status da empresa ${statusChangeCompanyId} para: ${newStatus}...`);
        
        const response = await fetchWithDevAuth(`${API_BASE}/dev/companies/${statusChangeCompanyId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao alterar status');
        }
        
        const result = await response.json();
        
        alert(`✅ ${result.message}\n\n"${statusChangeCompanyName}" agora está: ${statusLabels[newStatus]}`);
        console.log(`✅ Status da empresa ${statusChangeCompanyId} alterado para: ${newStatus}`);
        
        // Fechar modal
        closeStatusModal();
        
        // Recarregar lista
        loadCompanies();
        loadStats();
    } catch (error) {
        console.error('❌ Erro ao alterar status:', error);
        alert(`❌ Erro ao alterar status da empresa: ${error.message}`);
    }
}

function closeStatusModal() {
    document.getElementById('statusModal').classList.remove('active');
    statusChangeCompanyId = null;
    statusChangeCompanyName = '';
    statusChangeCurrent = '';
}

// ==================== GERENCIAMENTO DE DESENVOLVEDORES ====================

async function loadDevelopers() {
    try {
        console.log('🧑‍💻 Carregando desenvolvedores...');
        
        const response = await fetchWithDevAuth(`${API_BASE}/dev/auth/users`);
        const developers = await response.json();
        
        console.log(`✅ ${developers.length} desenvolvedores encontrados`);
        
        const tbody = document.getElementById('developersTableBody');
        
        if (!tbody) {
            console.error('❌ Elemento developersTableBody não encontrado!');
            return;
        }
        
        tbody.innerHTML = developers.map(dev => `
            <tr>
                <td>${dev.id}</td>
                <td>${dev.name}</td>
                <td>${dev.email}</td>
                <td><span class="role-badge role-${dev.role}">${getRoleLabel(dev.role)}</span></td>
                <td>${new Date(dev.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="btn-secondary" onclick="viewDeveloperDetails(${dev.id})" title="Ver detalhes">👁️ Ver</button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('❌ Erro ao carregar desenvolvedores:', error);
    }
}

async function viewDeveloperDetails(devId) {
    try {
        console.log(`🧑‍💻 Carregando detalhes do desenvolvedor ID: ${devId}...`);
        
        const response = await fetchWithDevAuth(`${API_BASE}/dev/auth/users`);
        const developers = await response.json();
        const dev = developers.find(d => d.id === devId);
        
        if (!dev) {
            alert('❌ Desenvolvedor não encontrado');
            return;
        }
        
        const info = `
🧑‍💻 DETALHES DO DESENVOLVEDOR

${'='.repeat(60)}
ID: ${dev.id}
Nome: ${dev.name}
Email: ${dev.email}
Role: ${getRoleLabel(dev.role)}
Criado em: ${new Date(dev.created_at).toLocaleString('pt-BR')}
${'='.repeat(60)}
        `;
        
        alert(info);
        console.log('✅ Detalhes do desenvolvedor exibidos');
    } catch (error) {
        console.error('❌ Erro ao carregar detalhes do desenvolvedor:', error);
        alert('❌ Erro ao carregar detalhes');
    }
}

// ==================== USUÁRIOS DAS EMPRESAS ====================
// NOTA: Esta função não é mais necessária, pois os usuários são exibidos 
// no modal dentro da visualização de cada empresa

// ==================== LOGIN RÁPIDO ====================

// ==================== QUICK LOGIN ====================

async function quickLoginAs(userId, companyId) {
    try {
        console.log(`🚀 Iniciando login rápido - Usuário ID: ${userId}, Empresa ID: ${companyId}`);
        
        // Validar se está rodando via HTTP
        const serverUrl = window.location.origin;
        if (serverUrl === 'null' || serverUrl.startsWith('file://')) {
            alert('⚠️ ERRO: Painel Dev deve ser acessado via servidor HTTP!\n\n' +
                  '❌ Não use: file:///C:/Users/.../dev-dashboard.html\n' +
                  '✅ Use: http://localhost:3000/desenvolvedor/dev-dashboard.html\n\n' +
                  'Certifique-se que o servidor está rodando (node server.js)');
            return;
        }
        
        console.log(`🌐 Server URL: ${serverUrl}`);
        
        // Chamar endpoint de impersonation - servidor processa tudo
        const response = await fetchWithDevAuth(`${API_BASE}/dev/impersonate/${userId}`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao gerar sessão de impersonation');
        }
        
        const data = await response.json();
        
        console.log(`✅ Impersonation configurado para: ${data.user.name}`);
        console.log(`📊 Empresa: ${data.company.name}`);
        console.log(`🎯 Dashboard: ${data.dashboardPath}`);
        
        // Montar URL completa do dashboard
        const fullDashboardUrl = `${serverUrl}${data.dashboardUrl}`;
        
        console.log(`🔗 Abrindo URL: ${fullDashboardUrl}`);
        
        // Abrir dashboard diretamente em nova aba
        const newWindow = window.open(fullDashboardUrl, '_blank');
        
        if (!newWindow) {
            alert('❌ Popup bloqueado! Permita popups para este site.');
            return;
        }
        
        console.log('✅ Nova janela aberta com sessão do usuário');
        
    } catch (error) {
        console.error('❌ Erro ao fazer login rápido:', error);
        alert(`❌ Erro ao fazer login rápido: ${error.message}`);
    }
}

// ==================== BANCO DE DADOS ====================

async function viewTable(tableName) {
    try {
        const response = await fetchWithDevAuth(`${API_BASE}/dev/table/${tableName}`);
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
        const response = await fetchWithDevAuth(`${API_BASE}/dev/clear-all`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`✅ ${result.message}\n\nTodos os dados foram removidos exceto a empresa demonstrativa.`);
            loadStats();
            loadCompanies();
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
        const response = await fetchWithDevAuth(`${API_BASE}/dev/companies`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
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

// ==================== EXPLORADOR DE INTERFACES ====================

async function openInterface(path, companyId) {
    try {
        // Criar sessão do explorador no backend
        const response = await fetchWithDevAuth(`${API_BASE}/dev/explorer/auth/${companyId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interfacePath: path })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar sessão');
        }
        
        const result = await response.json();
        
        // Construir URL absoluta
        const baseUrl = 'http://localhost:3000';
        const fullUrl = baseUrl + result.dashboardUrl;
        
        // Abrir interface na mesma aba
        window.location.href = fullUrl;
        
        console.log(`🎨 Explorador: Acessando ${result.company.name} - ${path}`);
        
    } catch (error) {
        console.error('Erro ao abrir interface:', error);
        alert(`❌ Erro: ${error.message}`);
    }
}

async function openInterfaceNewTab(path, companyId) {
    try {
        // Criar sessão do explorador no backend
        const response = await fetchWithDevAuth(`${API_BASE}/dev/explorer/auth/${companyId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interfacePath: path })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar sessão');
        }
        
        const result = await response.json();
        
        // Construir URL absoluta
        const baseUrl = 'http://localhost:3000';
        const fullUrl = baseUrl + result.dashboardUrl;
        
        // Abrir interface em nova aba
        window.open(fullUrl, '_blank');
        
        console.log(`🎨 Explorador: Acessando ${result.company.name} - ${path} (Nova Aba)`);
        
    } catch (error) {
        console.error('Erro ao abrir interface:', error);
        alert(`❌ Erro: ${error.message}`);
    }
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

// ==================== PEDIDOS DE CADASTRO ====================

let currentRequestsFilter = 'pending';

async function loadRequests(status = 'pending') {
    try {
        const url = status === 'all' 
            ? `${API_BASE}/company-requests` 
            : `${API_BASE}/company-requests?status=${status}`;
        
        const response = await fetchWithDevAuth(url);
        const requests = await response.json();
        
        const requestsList = document.getElementById('requestsList');
        
        if (requests.length === 0) {
            requestsList.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <h3>📭 Nenhum pedido ${status === 'all' ? '' : status === 'pending' ? 'pendente' : status === 'approved' ? 'aprovado' : 'rejeitado'}</h3>
                    <p>Não há pedidos de cadastro neste status no momento.</p>
                </div>
            `;
            return;
        }
        
        requestsList.innerHTML = requests.map(request => {
            const statusBadge = {
                'pending': '<span class="badge badge-warning">⏳ Pendente</span>',
                'approved': '<span class="badge badge-success">✅ Aprovado</span>',
                'rejected': '<span class="badge badge-danger">❌ Rejeitado</span>'
            }[request.status];
            
            return `
                <div class="request-card ${request.status}">
                    <div class="request-header">
                        <h3>${request.company.name}</h3>
                        ${statusBadge}
                    </div>
                    <div class="request-body">
                        <p><strong>Razão Social:</strong> ${request.company.legalName}</p>
                        <p><strong>Setor:</strong> ${request.company.industry}</p>
                        <p><strong>Presidente:</strong> ${request.president.name} (${request.president.email})</p>
                        <p><strong>Admins:</strong> ${request.admins.length} cadastrado(s)</p>
                        <p><strong>Documentos:</strong> ${request.documents.length} arquivo(s)</p>
                        <p><strong>Data do Pedido:</strong> ${new Date(request.createdAt).toLocaleString('pt-BR')}</p>
                        ${request.rejectionReason ? `<p style="color: #dc2626;"><strong>Motivo da Rejeição:</strong> ${request.rejectionReason}</p>` : ''}
                    </div>
                    <div class="request-actions">
                        <button class="btn-secondary" onclick="viewRequestDetails(${request.id})">
                            👁️ Ver Detalhes
                        </button>
                        ${request.status === 'pending' ? `
                            <button class="btn-primary" onclick="approveRequest(${request.id})">
                                ✅ Aprovar
                            </button>
                            <button class="btn-danger" onclick="rejectRequest(${request.id})">
                                ❌ Rejeitar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        alert('Erro ao carregar pedidos');
    }
}

function filterRequests(status) {
    currentRequestsFilter = status;
    
    // Atualizar botões
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Carregar pedidos filtrados
    loadRequests(status === 'all' ? null : status);
}

async function viewRequestDetails(requestId) {
    try {
        const response = await fetchWithDevAuth(`${API_BASE}/company-requests/${requestId}`);
        const request = await response.json();
        
        const details = `
=== DETALHES DO PEDIDO #${request.id} ===

📋 STATUS: ${request.status.toUpperCase()}

🏢 EMPRESA:
Nome: ${request.company.name}
Razão Social: ${request.company.legalName}
Fundação: ${request.company.foundedYear}
Setor: ${request.company.industry}
Porte: ${request.company.size}
Descrição: ${request.company.description}

👑 PRESIDENTE (Nível 0):
Nome: ${request.president.name}
Email: ${request.president.email}
Telefone: ${request.president.phone || 'Não informado'}
Usuário: ${request.president.accessKey}
Cargo: ${request.president.role}

👥 ADMINISTRADORES (Nível 1):
${request.admins.map((admin, i) => `
${i + 1}. ${admin.name} - ${admin.email}
   Departamento: ${admin.department}
   Usuário: ${admin.accessKey}
   Principal: ${admin.isPrimary ? 'Sim' : 'Não'}
`).join('\n')}

📎 DOCUMENTOS: ${request.documents.length} arquivo(s)
${request.documents.map((doc, i) => `${i + 1}. ${doc.originalName} (${(doc.size / 1024).toFixed(2)} KB)`).join('\n')}

📅 CRIADO EM: ${new Date(request.createdAt).toLocaleString('pt-BR')}
${request.reviewedAt ? `✅ REVISADO EM: ${new Date(request.reviewedAt).toLocaleString('pt-BR')}` : ''}
${request.rejectionReason ? `❌ MOTIVO DA REJEIÇÃO: ${request.rejectionReason}` : ''}
        `;
        
        alert(details);
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        alert('Erro ao carregar detalhes do pedido');
    }
}

async function approveRequest(requestId) {
    if (!confirm('Tem certeza que deseja APROVAR este pedido?\n\nIsso criará a empresa e todos os usuários cadastrados no sistema.')) {
        return;
    }
    
    try {
        const devUser = JSON.parse(localStorage.getItem('devUser'));
        
        const response = await fetchWithDevAuth(`${API_BASE}/company-requests/${requestId}/approve`, {
            method: 'PATCH',
            body: JSON.stringify({
                reviewerId: devUser.id
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            alert(`❌ Erro: ${result.error}`);
            return;
        }
        
        alert(`✅ Pedido aprovado com sucesso!\n\nEmpresa criada com ID: ${result.companyId}\n\nOs usuários já podem fazer login.`);
        loadRequests(currentRequestsFilter);
        loadStats(); // Atualizar estatísticas
        
    } catch (error) {
        console.error('Erro ao aprovar pedido:', error);
        alert('Erro ao aprovar pedido');
    }
}

async function rejectRequest(requestId) {
    const reason = prompt('Informe o motivo da rejeição:\n\n(Esta mensagem será enviada ao solicitante)');
    
    if (!reason || reason.trim() === '') {
        alert('É necessário informar um motivo para rejeitar o pedido.');
        return;
    }
    
    try {
        const devUser = JSON.parse(localStorage.getItem('devUser'));
        
        const response = await fetchWithDevAuth(`${API_BASE}/company-requests/${requestId}/reject`, {
            method: 'PATCH',
            body: JSON.stringify({
                reason: reason.trim(),
                reviewerId: devUser.id
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            alert(`❌ Erro: ${result.error}`);
            return;
        }
        
        alert(`✅ Pedido rejeitado com sucesso.\n\nMotivo registrado: ${reason}`);
        loadRequests(currentRequestsFilter);
        
    } catch (error) {
        console.error('Erro ao rejeitar pedido:', error);
        alert('Erro ao rejeitar pedido');
    }
}

// Exportar funções para uso global
window.showTab = showTab;
window.openCompanyModal = openCompanyModal;
window.closeCompanyModal = closeCompanyModal;
window.saveCompany = saveCompany;
window.deleteCompany = deleteCompany;
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
window.loadRequests = loadRequests;
window.filterRequests = filterRequests;
window.viewRequestDetails = viewRequestDetails;
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;

