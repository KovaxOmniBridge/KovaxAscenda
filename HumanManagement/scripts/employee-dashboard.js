/**
 * Dashboard do Funcionário
 */

let currentEmployee = null;
let currentSession = null;

// Carrega dados ao iniciar
window.addEventListener('DOMContentLoaded', async () => {
    // Verifica se está autenticado
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Carrega dados do usuário
        currentSession = JSON.parse(localStorage.getItem('session'));
        currentEmployee = JSON.parse(localStorage.getItem('employee'));

        if (!currentEmployee) {
            // Tenta buscar do servidor
            const response = await api.getMe();
            currentEmployee = response.employee;
            currentSession = response.session;
            
            localStorage.setItem('employee', JSON.stringify(currentEmployee));
            localStorage.setItem('session', JSON.stringify(currentSession));
        }

        // Renderiza dados
        renderUserInfo();
        renderSummaryCards();
        renderWorkSchedule();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        
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
    document.getElementById('userRole').textContent = translateRole(currentEmployee.role);
    
    const welcomeHeader = document.querySelector('.header h1');
    welcomeHeader.textContent = `Bem-vindo(a), ${currentEmployee.fullName.split(' ')[0]}!`;
}

/**
 * Renderiza cards de resumo
 */
function renderSummaryCards() {
    // Cargo
    document.getElementById('cardRole').textContent = translateRole(currentEmployee.role);
    
    // Unidade
    if (currentEmployee.unitId) {
        document.getElementById('cardUnit').textContent = 'Unidade ' + currentEmployee.unitId.substring(0, 8);
    } else {
        document.getElementById('cardUnit').textContent = 'Sem unidade';
    }
    
    // Tempo de casa
    const hireDate = new Date(currentEmployee.hireDate);
    const now = new Date();
    const monthsWorked = Math.floor((now - hireDate) / (1000 * 60 * 60 * 24 * 30));
    
    if (monthsWorked < 12) {
        document.getElementById('cardTenure').textContent = `${monthsWorked} meses`;
    } else {
        const years = Math.floor(monthsWorked / 12);
        const months = monthsWorked % 12;
        document.getElementById('cardTenure').textContent = `${years} ano${years > 1 ? 's' : ''}${months > 0 ? ` e ${months} meses` : ''}`;
    }
    
    // Status
    const statusElement = document.getElementById('cardStatus');
    statusElement.textContent = translateStatus(currentEmployee.status);
    
    if (currentEmployee.status === 'ACTIVE') {
        statusElement.className = 'card-value success';
    } else {
        statusElement.className = 'card-value warning';
    }
}

/**
 * Renderiza horário de trabalho
 */
function renderWorkSchedule() {
    const scheduleContainer = document.getElementById('workSchedule');
    
    if (!currentEmployee.workSchedule) {
        scheduleContainer.innerHTML = '<div class="empty-state"><p>Horário de trabalho não definido</p></div>';
        return;
    }

    const schedule = currentEmployee.workSchedule;
    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    
    let html = '';
    
    for (let i = 0; i < 7; i++) {
        const isWorkDay = schedule.workDays.includes(i);
        
        html += `
            <div class="schedule-day">
                <span class="day-name">${daysOfWeek[i]}</span>
                <span class="${isWorkDay ? 'day-hours' : 'day-closed'}">
                    ${isWorkDay ? `${schedule.startTime} - ${schedule.endTime}` : 'Folga'}
                </span>
            </div>
        `;
    }
    
    scheduleContainer.innerHTML = html;
}

/**
 * Traduz cargo
 */
function translateRole(role) {
    const roles = {
        'ADMIN': '👑 Administrador',
        'MANAGER': '📊 Gerente',
        'SUPERVISOR': '🎯 Supervisor',
        'HR': '👥 Recursos Humanos',
        'ACCOUNTANT': '💰 Contador',
        'SALES': '🛍️ Vendedor',
        'STOCK_KEEPER': '📦 Estoquista',
        'CASHIER': '💵 Caixa',
        'ATTENDANT': '🤝 Atendente',
        'SECURITY': '🛡️ Segurança',
        'CLEANER': '🧹 Limpeza',
        'MAINTENANCE': '🔧 Manutenção',
        'DRIVER': '🚗 Motorista',
        'ASSISTANT': '📋 Assistente',
        'INTERN': '🎓 Estagiário'
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

// Logout
document.getElementById('btnLogout').addEventListener('click', async () => {
    if (confirm('Deseja realmente sair?')) {
        await api.logout();
    }
});
