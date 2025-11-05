/**
 * Dashboard do Administrador
 */

let currentEmployee = null;
let currentSession = null;
let hrStats = null;

// Carrega dados ao iniciar
window.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticação
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Carrega dados do usuário
        currentSession = JSON.parse(localStorage.getItem('session'));
        currentEmployee = JSON.parse(localStorage.getItem('employee'));

        if (!currentEmployee) {
            const response = await api.getMe();
            currentEmployee = response.employee;
            currentSession = response.session;
            
            localStorage.setItem('employee', JSON.stringify(currentEmployee));
            localStorage.setItem('session', JSON.stringify(currentSession));
        }

        // Verifica se é admin
        if (!['ADMIN', 'MANAGER', 'HR'].includes(currentEmployee.role)) {
            window.location.href = 'employee-dashboard.html';
            return;
        }

        // Renderiza dados
        renderUserInfo();
        await loadDashboardData();
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        
        if (error.message.includes('Sessão expirada')) {
            window.location.href = 'login.html';
        }
    }
});

/**
 * Renderiza informações do usuário
 */
function renderUserInfo() {
    document.getElementById('userName').textContent = currentEmployee.fullName;
}

/**
 * Carrega dados do dashboard
 */
async function loadDashboardData() {
    try {
        // Carrega estatísticas de RH
        hrStats = await api.get(`/employees/company/${currentEmployee.companyId}/stats`);
        
        // Carrega funcionários
        const employees = await api.get(`/employees/company/${currentEmployee.companyId}`);
        
        // Renderiza estatísticas
        renderStats(hrStats, employees);
        
        // Renderiza gráficos
        renderCharts(hrStats);
        
        // Renderiza tabela de funcionários
        renderRecentEmployees(employees);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

/**
 * Renderiza estatísticas
 */
function renderStats(stats, employees) {
    document.getElementById('statTotalEmployees').textContent = stats.totalEmployees;
    document.getElementById('statActiveEmployees').textContent = stats.activeEmployees;
    
    // Calcula porcentagem de ativos
    const activePercent = stats.totalEmployees > 0 
        ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) 
        : 0;
    document.querySelector('#statActiveEmployees').nextElementSibling.textContent = `${activePercent}% do total`;
    
    // Unidades (placeholder - requer API de unidades)
    document.getElementById('statUnits').textContent = '0';
    
    // Folha de pagamento
    const payroll = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(stats.totalPayroll);
    document.getElementById('statPayroll').textContent = payroll;
}

/**
 * Renderiza gráficos
 */
function renderCharts(stats) {
    // Gráfico de cargos
    const rolesContainer = document.getElementById('chartRoles');
    const rolesData = Object.entries(stats.byRole)
        .filter(([role, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    if (rolesData.length === 0) {
        rolesContainer.innerHTML = '<div class="empty-state"><p>Nenhum dado disponível</p></div>';
    } else {
        const maxValue = Math.max(...rolesData.map(([_, count]) => count));
        rolesContainer.innerHTML = `
            <div class="chart-bar">
                ${rolesData.map(([role, count]) => `
                    <div class="chart-bar-item">
                        <div class="chart-bar-label">${translateRole(role)}</div>
                        <div class="chart-bar-visual">
                            <div class="chart-bar-fill" style="width: ${(count / maxValue) * 100}%"></div>
                        </div>
                        <div class="chart-bar-value">${count}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Gráfico de status
    const statusContainer = document.getElementById('chartStatus');
    const statusData = Object.entries(stats.byStatus)
        .filter(([status, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]);
    
    if (statusData.length === 0) {
        statusContainer.innerHTML = '<div class="empty-state"><p>Nenhum dado disponível</p></div>';
    } else {
        const maxValue = Math.max(...statusData.map(([_, count]) => count));
        statusContainer.innerHTML = `
            <div class="chart-bar">
                ${statusData.map(([status, count]) => `
                    <div class="chart-bar-item">
                        <div class="chart-bar-label">${translateStatus(status)}</div>
                        <div class="chart-bar-visual">
                            <div class="chart-bar-fill" style="width: ${(count / maxValue) * 100}%"></div>
                        </div>
                        <div class="chart-bar-value">${count}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

/**
 * Renderiza funcionários recentes
 */
function renderRecentEmployees(employees) {
    const container = document.getElementById('recentEmployees');
    
    if (employees.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhum funcionário cadastrado</p></div>';
        return;
    }
    
    // Ordena por data de criação (mais recentes primeiro)
    const sortedEmployees = [...employees]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Funcionário</th>
                    <th>Cargo</th>
                    <th>Status</th>
                    <th>Contratação</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${sortedEmployees.map(emp => `
                    <tr>
                        <td>
                            <div class="employee-info">
                                <div class="employee-avatar">👤</div>
                                <div class="employee-details">
                                    <span class="employee-name">${emp.fullName}</span>
                                    <span class="employee-role">${emp.email}</span>
                                </div>
                            </div>
                        </td>
                        <td>${translateRole(emp.role)}</td>
                        <td>
                            <span class="badge ${getStatusBadgeClass(emp.status)}">
                                ${translateStatus(emp.status)}
                            </span>
                        </td>
                        <td>${formatDate(emp.hireDate)}</td>
                        <td>
                            <div class="table-actions">
                                <button class="action-btn" onclick="viewEmployee('${emp.id}')">Ver</button>
                                <button class="action-btn" onclick="editEmployee('${emp.id}')">Editar</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * Traduz cargo
 */
function translateRole(role) {
    const roles = {
        'ADMIN': 'Administrador',
        'MANAGER': 'Gerente',
        'SUPERVISOR': 'Supervisor',
        'HR': 'RH',
        'ACCOUNTANT': 'Contador',
        'SALES': 'Vendedor',
        'STOCK_KEEPER': 'Estoquista',
        'CASHIER': 'Caixa',
        'ATTENDANT': 'Atendente',
        'SECURITY': 'Segurança',
        'CLEANER': 'Limpeza',
        'MAINTENANCE': 'Manutenção',
        'DRIVER': 'Motorista',
        'ASSISTANT': 'Assistente',
        'INTERN': 'Estagiário'
    };
    return roles[role] || role;
}

/**
 * Traduz status
 */
function translateStatus(status) {
    const statuses = {
        'ACTIVE': 'Ativo',
        'ON_VACATION': 'De Férias',
        'ON_LEAVE': 'Afastado',
        'SUSPENDED': 'Suspenso',
        'TERMINATED': 'Desligado'
    };
    return statuses[status] || status;
}

/**
 * Retorna classe do badge de status
 */
function getStatusBadgeClass(status) {
    if (status === 'ACTIVE') return 'badge-success';
    if (status === 'TERMINATED' || status === 'SUSPENDED') return 'badge-error';
    return 'badge-warning';
}

/**
 * Formata data
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

/**
 * Ver funcionário
 */
function viewEmployee(id) {
    alert('Visualizar funcionário: ' + id);
    // TODO: Implementar modal ou página de detalhes
}

/**
 * Editar funcionário
 */
function editEmployee(id) {
    alert('Editar funcionário: ' + id);
    // TODO: Implementar modal ou página de edição
}

// Event Listeners
document.getElementById('btnLogout').addEventListener('click', async () => {
    if (confirm('Deseja realmente sair?')) {
        await api.logout();
    }
});

document.getElementById('btnAddEmployee').addEventListener('click', () => {
    alert('Adicionar novo funcionário');
    // TODO: Implementar modal ou página de cadastro
});

document.getElementById('btnViewAllEmployees').addEventListener('click', () => {
    alert('Ver todos os funcionários');
    // TODO: Implementar página de listagem completa
});
