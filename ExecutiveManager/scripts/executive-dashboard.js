// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// State Management
let currentExecutive = null;
let dashboardData = null;
let selectedCompany = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadDashboard();
});

// Check if user is authenticated
function checkAuthentication() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
        window.location.href = '../HumanManagement/login.html';
        return;
    }

    const user = JSON.parse(userData);
    currentExecutive = user;
    
    // Update user info in header
    document.getElementById('userName').textContent = user.name || user.fullName;
    document.getElementById('userRole').textContent = translateRole(user.role);
}

// Load Dashboard Data
async function loadDashboard() {
    if (!currentExecutive || !currentExecutive.id) {
        showError('Usuário não identificado. Faça login novamente.');
        return;
    }

    showLoading();

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/executive/dashboard/${currentExecutive.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '../HumanManagement/login.html';
                return;
            }
            throw new Error(`Erro ao carregar dashboard: ${response.status}`);
        }

        dashboardData = await response.json();
        renderDashboard();
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showError(error.message);
    }
}

// Show Loading State
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'none';
}

// Show Error State
function showError(message) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('errorMessage').textContent = message;
}

// Render Dashboard
function renderDashboard() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';

    // Render summary cards
    renderSummaryCards();

    // Render roles distribution
    renderRolesDistribution();

    // Render companies grid
    renderCompaniesGrid();
}

// Render Summary Cards
function renderSummaryCards() {
    const { totalCompanies, activeParticipations, financialSummary } = dashboardData;

    document.getElementById('totalCompanies').textContent = totalCompanies || 0;
    document.getElementById('activeParticipations').textContent = activeParticipations || 0;
    document.getElementById('totalEquity').textContent = `${(financialSummary?.totalEquity || 0).toFixed(2)}%`;
    document.getElementById('totalIncome').textContent = formatCurrency(financialSummary?.totalMonthlyIncome || 0);
    document.getElementById('totalEmployees').textContent = financialSummary?.totalEmployees || 0;
    document.getElementById('totalAssets').textContent = financialSummary?.totalAssets || 0;
}

// Render Roles Distribution
function renderRolesDistribution() {
    const rolesContainer = document.getElementById('rolesDistribution');
    const { rolesDistribution } = dashboardData;

    if (!rolesDistribution || Object.keys(rolesDistribution).length === 0) {
        rolesContainer.innerHTML = '<p style="color: var(--text-secondary);">Nenhum papel atribuído</p>';
        return;
    }

    const roleLabels = {
        'OWNER': '👑 Proprietário',
        'CEO': '💼 CEO',
        'BOARD_MEMBER': '🎯 Conselheiro',
        'INVESTOR': '💰 Investidor',
        'ADVISOR': '🧠 Consultor',
        'PARTNER': '🤝 Sócio'
    };

    const roleClasses = {
        'OWNER': 'owner',
        'CEO': 'ceo',
        'BOARD_MEMBER': 'board-member',
        'INVESTOR': 'investor',
        'ADVISOR': 'advisor',
        'PARTNER': 'partner'
    };

    rolesContainer.innerHTML = Object.entries(rolesDistribution)
        .map(([role, count]) => `
            <div class="role-badge ${roleClasses[role] || ''}">
                <span>${roleLabels[role] || role}</span>
                <span class="role-count">${count}</span>
            </div>
        `).join('');
}

// Render Companies Grid
function renderCompaniesGrid() {
    const companiesContainer = document.getElementById('companiesGrid');
    const { companiesData, participations } = dashboardData;

    if (!companiesData || companiesData.length === 0) {
        companiesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--surface); border-radius: 12px;">
                <p style="color: var(--text-secondary); font-size: 16px;">Nenhuma empresa encontrada</p>
            </div>
        `;
        return;
    }

    companiesContainer.innerHTML = companiesData.map(company => {
        const participation = participations.find(p => p.companyId === company.generalData.id);
        return createCompanyCard(company, participation);
    }).join('');
}

// Create Company Card HTML
function createCompanyCard(companyData, participation) {
    const { generalData, hr, assets } = companyData;

    const roleIcons = {
        'OWNER': '👑',
        'CEO': '💼',
        'BOARD_MEMBER': '🎯',
        'INVESTOR': '💰',
        'ADVISOR': '🧠',
        'PARTNER': '🤝'
    };

    const roleLabels = {
        'OWNER': 'Proprietário',
        'CEO': 'CEO',
        'BOARD_MEMBER': 'Conselheiro',
        'INVESTOR': 'Investidor',
        'ADVISOR': 'Consultor',
        'PARTNER': 'Sócio'
    };

    const permissions = [];
    if (participation.hasFullAccess) permissions.push('Acesso Total');
    if (participation.canViewFinancials) permissions.push('Financeiro');
    if (participation.canViewEmployees) permissions.push('RH');
    if (participation.canViewAssets) permissions.push('Patrimônio');

    return `
        <div class="company-card" onclick="openCompanyModal('${generalData.id}')">
            <div class="company-header">
                <div class="company-name">${generalData.name || 'Empresa sem nome'}</div>
                <div class="company-role">${roleIcons[participation.role]} ${roleLabels[participation.role]}</div>
            </div>
            <div class="company-body">
                <div class="company-stats">
                    <div class="stat-item">
                        <div class="stat-icon">👥</div>
                        <div class="stat-content">
                            <p>Funcionários</p>
                            <p>${hr?.totalEmployees || 0}</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">🏗️</div>
                        <div class="stat-content">
                            <p>Ativos</p>
                            <p>${assets?.totalAssets || 0}</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <p>Folha Mensal</p>
                            <p>${formatCurrency(hr?.monthlyPayroll || 0)}</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <p>Patrimônio</p>
                            <p>${formatCurrency(assets?.totalValue || 0)}</p>
                        </div>
                    </div>
                </div>
                ${participation.equityPercentage ? `
                    <div style="margin-top: 15px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; text-align: center;">
                        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 3px;">Participação</p>
                        <p style="font-size: 18px; font-weight: 700; color: var(--success-color);">${participation.equityPercentage.toFixed(2)}%</p>
                    </div>
                ` : ''}
                <div class="company-permissions">
                    ${permissions.map(p => `<span class="permission-badge active">${p}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Open Company Modal
function openCompanyModal(companyId) {
    const company = dashboardData.companiesData.find(c => c.generalData.id === companyId);
    const participation = dashboardData.participations.find(p => p.companyId === companyId);

    if (!company) return;

    selectedCompany = { ...company, participation };

    // Set modal title
    document.getElementById('modalCompanyName').textContent = company.generalData.name;

    // Render general info
    renderModalGeneralInfo(company.generalData);

    // Render HR stats
    renderModalHRStats(company.hr);

    // Render assets stats
    renderModalAssetsStats(company.assets);

    // Render physical units
    renderModalUnitsStats(company.assets);

    // Show modal
    document.getElementById('companyModal').style.display = 'block';
}

// Close Modal
function closeModal() {
    document.getElementById('companyModal').style.display = 'none';
    selectedCompany = null;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('companyModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Render Modal General Info
function renderModalGeneralInfo(generalData) {
    const container = document.getElementById('modalGeneralInfo');
    container.innerHTML = `
        <div class="info-item">
            <p>CNPJ</p>
            <p>${generalData.cnpj || 'N/A'}</p>
        </div>
        <div class="info-item">
            <p>Razão Social</p>
            <p>${generalData.legalName || 'N/A'}</p>
        </div>
        <div class="info-item">
            <p>E-mail</p>
            <p>${generalData.email || 'N/A'}</p>
        </div>
        <div class="info-item">
            <p>Telefone</p>
            <p>${generalData.phone || 'N/A'}</p>
        </div>
    `;
}

// Render Modal HR Stats
function renderModalHRStats(hrData) {
    const container = document.getElementById('modalHRStats');
    
    if (!hrData) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Sem dados de RH disponíveis</p>';
        return;
    }

    container.innerHTML = `
        <div class="info-item">
            <p>Total de Funcionários</p>
            <p>${hrData.totalEmployees || 0}</p>
        </div>
        <div class="info-item">
            <p>Funcionários Ativos</p>
            <p>${hrData.activeEmployees || 0}</p>
        </div>
        <div class="info-item">
            <p>Folha Mensal</p>
            <p>${formatCurrency(hrData.monthlyPayroll || 0)}</p>
        </div>
        <div class="info-item">
            <p>Salário Médio</p>
            <p>${formatCurrency(hrData.averageSalary || 0)}</p>
        </div>
    `;

    // Add top roles if available
    if (hrData.topRoles && hrData.topRoles.length > 0) {
        container.innerHTML += `
            <div style="grid-column: 1/-1; margin-top: 15px;">
                <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--text-secondary);">Principais Cargos</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${hrData.topRoles.map(role => `
                        <span class="permission-badge active">${translateRole(role.role)} (${role.count})</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Render Modal Assets Stats
function renderModalAssetsStats(assetsData) {
    const container = document.getElementById('modalAssetsStats');
    
    if (!assetsData) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Sem dados de patrimônio disponíveis</p>';
        return;
    }

    container.innerHTML = `
        <div class="info-item">
            <p>Total de Ativos</p>
            <p>${assetsData.totalAssets || 0}</p>
        </div>
        <div class="info-item">
            <p>Valor Total</p>
            <p>${formatCurrency(assetsData.totalValue || 0)}</p>
        </div>
    `;

    // Add breakdown by category if available
    if (assetsData.byCategory && assetsData.byCategory.length > 0) {
        container.innerHTML += `
            <div style="grid-column: 1/-1; margin-top: 15px;">
                <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--text-secondary);">Por Categoria</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                    ${assetsData.byCategory.map(cat => `
                        <div class="info-item">
                            <p>${cat.category}</p>
                            <p>${cat.count} (${formatCurrency(cat.totalValue || 0)})</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Render Modal Physical Units Stats
function renderModalUnitsStats(assetsData) {
    const container = document.getElementById('modalUnitsStats');
    
    if (!assetsData || !assetsData.physicalUnits || assetsData.physicalUnits.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Sem unidades físicas cadastradas</p>';
        return;
    }

    const unitIcons = {
        'SEDE': '🏢',
        'FILIAL': '🏪',
        'DEPOSITO': '📦',
        'FABRICA': '🏭',
        'ESCRITORIO': '💼'
    };

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
            ${assetsData.physicalUnits.map(unit => `
                <div class="info-item">
                    <p>${unitIcons[unit.type] || '📍'} ${unit.type}</p>
                    <p>${unit.count || 0}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Utility Functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}

function translateRole(role) {
    const roles = {
        'ADMINISTRADOR': 'Administrador',
        'GERENTE': 'Gerente',
        'FUNCIONARIO': 'Funcionário',
        'OWNER': 'Proprietário',
        'CEO': 'CEO',
        'BOARD_MEMBER': 'Conselheiro',
        'INVESTOR': 'Investidor',
        'ADVISOR': 'Consultor',
        'PARTNER': 'Sócio'
    };
    return roles[role] || role;
}

function logout() {
    localStorage.clear();
    window.location.href = '../HumanManagement/login.html';
}
