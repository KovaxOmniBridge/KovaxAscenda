const API_BASE = 'http://localhost:3000/api';
let currentCompany = null;
let currentUser = null;
let charts = {};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadCompanyData();
    loadReports();
    createCharts();
});

// ==================== AUTENTICAÇÃO ====================

async function loadUserData() {
    const companyId = localStorage.getItem('companyId');
    const userId = localStorage.getItem('userId');
    const devToken = localStorage.getItem('devToken');
    
    if (devToken) {
        document.getElementById('userName').textContent = 'Desenvolvedor (God Mode)';
        return;
    }
    
    if (!companyId || !userId) {
        alert('❌ Sessão inválida. Redirecionando para login...');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        if (response.ok) {
            currentUser = await response.json();
            document.getElementById('userName').textContent = currentUser.name;
            
            if (currentUser.hierarchical_level !== 0) {
                alert('❌ Acesso negado. Apenas Presidentes podem acessar este painel.');
                window.location.href = '/index.html';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
    }
}

async function loadCompanyData() {
    const companyId = localStorage.getItem('companyId');
    
    if (!companyId) {
        document.getElementById('companyName').textContent = 'Empresa não definida';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/companies/${companyId}`);
        if (response.ok) {
            currentCompany = await response.json();
            document.getElementById('companyName').textContent = currentCompany.name;
        }
    } catch (error) {
        console.error('Erro ao carregar empresa:', error);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '/index.html';
}

// ==================== CARREGAR RELATÓRIOS ====================

function loadReports() {
    // Dados de demonstração
    updateKPIs();
    updateOperationalMetrics();
    updateDepartmentsTable();
    generateInsights();
}

function updateReports() {
    // Recarregar com novo período
    loadReports();
    updateCharts();
}

// ==================== KPIs FINANCEIROS ====================

function updateKPIs() {
    // Dados simulados
    const data = {
        revenue: 15750000,
        revenueTrend: 12.5,
        profit: 3937500,
        profitTrend: 18.3,
        margin: 68.5,
        marginTrend: 2.3,
        ebitda: 5512500,
        ebitdaTrend: 15.7
    };
    
    document.getElementById('revenue').textContent = formatCurrency(data.revenue);
    document.getElementById('revenueTrend').textContent = `+${data.revenueTrend}%`;
    document.getElementById('revenueTrend').className = data.revenueTrend > 0 ? 'trend positive' : 'trend negative';
    
    document.getElementById('profit').textContent = formatCurrency(data.profit);
    document.getElementById('profitTrend').textContent = `+${data.profitTrend}%`;
    document.getElementById('profitTrend').className = data.profitTrend > 0 ? 'trend positive' : 'trend negative';
    
    document.getElementById('margin').textContent = `${data.margin}%`;
    document.getElementById('marginTrend').textContent = `+${data.marginTrend}pp`;
    document.getElementById('marginTrend').className = 'trend neutral';
    
    document.getElementById('ebitda').textContent = formatCurrency(data.ebitda);
    document.getElementById('ebitdaTrend').textContent = `+${data.ebitdaTrend}%`;
    document.getElementById('ebitdaTrend').className = data.ebitdaTrend > 0 ? 'trend positive' : 'trend negative';
}

// ==================== MÉTRICAS OPERACIONAIS ====================

function updateOperationalMetrics() {
    document.getElementById('headcount').textContent = '247';
    document.getElementById('activeProjects').textContent = '18';
    document.getElementById('activeSquads').textContent = '12';
    document.getElementById('nps').textContent = '72';
    document.getElementById('deliveries').textContent = '34';
    document.getElementById('trainings').textContent = '156';
}

// ==================== GRÁFICOS ====================

function createCharts() {
    createRevenueChart();
    createDepartmentChart();
    createGrowthChart();
    createCostsChart();
}

function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'],
            datasets: [{
                label: 'Receita (R$ milhões)',
                data: [12.5, 13.2, 14.1, 13.8, 15.2, 15.8],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value + 'M';
                        }
                    }
                }
            }
        }
    });
}

function createDepartmentChart() {
    const ctx = document.getElementById('departmentChart').getContext('2d');
    charts.department = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Comercial', 'Produtos', 'Tecnologia', 'Marketing', 'Operações'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#8b5cf6',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function createGrowthChart() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    charts.growth = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'],
            datasets: [{
                label: 'Crescimento %',
                data: [8.5, 5.6, 6.8, -2.1, 10.1, 3.9],
                backgroundColor: function(context) {
                    const value = context.parsed.y;
                    return value < 0 ? '#ef4444' : '#10b981';
                },
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function createCostsChart() {
    const ctx = document.getElementById('costsChart').getContext('2d');
    charts.costs = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pessoal', 'Marketing', 'Tecnologia', 'Infraestrutura', 'Outros'],
            datasets: [{
                data: [45, 20, 18, 10, 7],
                backgroundColor: [
                    '#3b82f6',
                    '#f59e0b',
                    '#8b5cf6',
                    '#10b981',
                    '#6b7280'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function updateCharts() {
    // Atualizar dados dos gráficos com novo período
    Object.values(charts).forEach(chart => {
        chart.update();
    });
}

// ==================== TABELA DE DEPARTAMENTOS ====================

function updateDepartmentsTable() {
    const departments = [
        { name: 'Comercial', revenue: 5512500, costs: 1653750, margin: 70, headcount: 45, efficiency: 122444 },
        { name: 'Produtos', revenue: 3937500, costs: 1181250, margin: 70, headcount: 38, efficiency: 103618 },
        { name: 'Tecnologia', revenue: 3150000, costs: 1260000, margin: 60, headcount: 52, efficiency: 60577 },
        { name: 'Marketing', revenue: 1890000, costs: 945000, margin: 50, headcount: 28, efficiency: 67500 },
        { name: 'Operações', revenue: 1260000, costs: 504000, margin: 60, headcount: 42, efficiency: 30000 },
        { name: 'Administrativo', revenue: 0, costs: 850000, margin: 0, headcount: 42, efficiency: 0 }
    ];
    
    const tbody = document.getElementById('departmentsTableBody');
    tbody.innerHTML = departments.map(dept => `
        <tr>
            <td class="department-name">${dept.name}</td>
            <td class="${dept.revenue > 0 ? 'value-positive' : ''}">${formatCurrency(dept.revenue)}</td>
            <td>${formatCurrency(dept.costs)}</td>
            <td><strong>${dept.margin}%</strong></td>
            <td>${dept.headcount} pessoas</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div class="efficiency-bar">
                        <div class="efficiency-fill" style="width: ${Math.min(dept.efficiency / 1500, 100)}%"></div>
                    </div>
                    <span>${formatCurrency(dept.efficiency)}/pessoa</span>
                </div>
            </td>
        </tr>
    `).join('');
}

// ==================== INSIGHTS ====================

function generateInsights() {
    const insights = [
        {
            type: 'positive',
            icon: '🎉',
            title: 'Crescimento Acelerado',
            description: 'A receita cresceu 12.5% no último mês, superando a meta de 10%. O departamento Comercial teve performance excepcional com 18% de crescimento.',
            action: 'Ver Detalhes'
        },
        {
            type: 'warning',
            icon: '⚠️',
            title: 'Custos de Marketing Elevados',
            description: 'Os custos de marketing aumentaram 23% no período, mas a conversão caiu 5%. Recomenda-se revisão da estratégia e otimização de campanhas.',
            action: 'Analisar Campanhas'
        },
        {
            type: 'positive',
            icon: '💪',
            title: 'Eficiência Operacional',
            description: 'O time de Produtos mantém a maior eficiência com R$ 103.6k de receita por colaborador, 15% acima da média da empresa.',
            action: 'Ver Boas Práticas'
        },
        {
            type: 'critical',
            icon: '🚨',
            title: 'Headcount vs. Produtividade',
            description: 'O departamento de Tecnologia cresceu 28% em headcount mas a produtividade caiu 12%. Possível problema de onboarding ou processos.',
            action: 'Investigar Causa'
        },
        {
            type: 'positive',
            icon: '🎯',
            title: 'NPS em Alta',
            description: 'NPS atingiu 72 pontos, um aumento de 8 pontos vs. trimestre anterior. Clientes destacam qualidade do atendimento e velocidade de entrega.',
            action: 'Ler Feedbacks'
        }
    ];
    
    const container = document.getElementById('insightsContainer');
    container.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.type}">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
                <span class="insight-action">${insight.action} →</span>
            </div>
        </div>
    `).join('');
}

// ==================== EXPORTAÇÃO ====================

function exportReport(format) {
    if (format === 'pdf') {
        alert('📄 Gerando PDF...\n\nEm produção, isso exportaria um relatório completo em PDF com todos os gráficos e tabelas.');
    } else if (format === 'excel') {
        alert('📊 Gerando Excel...\n\nEm produção, isso exportaria uma planilha Excel com todos os dados e análises detalhadas.');
    }
}

// ==================== HELPERS ====================

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}
