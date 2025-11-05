const API_BASE = 'http://localhost:3000/api';
let currentCompany = null;
let currentUser = null;
let allApprovals = [];
let currentApprovalId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadCompanyData();
    loadApprovals();
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

// ==================== CARREGAR APROVAÇÕES ====================

async function loadApprovals() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('❌ Sessão inválida');
        window.location.href = '/index.html';
        return;
    }
    
    const companyId = currentCompany?.id || localStorage.getItem('companyId') || 1;
    
    try {
        const response = await fetch(`${API_BASE}/approvals/company/${companyId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            allApprovals = await response.json();
            console.log(`✅ ${allApprovals.length} aprovações carregadas`);
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
        
        updateStats();
        filterApprovals();
    } catch (error) {
        console.error('❌ Erro ao carregar aprovações:', error);
        allApprovals = [];
        updateStats();
        filterApprovals();
    }
}

// ==================== ESTATÍSTICAS ====================

function updateStats() {
    const pending = allApprovals.filter(a => a.status === 'pending').length;
    const approved = allApprovals.filter(a => a.status === 'approved' && isRecent(a.decision_date, 30)).length;
    const rejected = allApprovals.filter(a => a.status === 'rejected' && isRecent(a.decision_date, 30)).length;
    const urgent = allApprovals.filter(a => a.status === 'pending' && a.priority === 'urgent').length;
    
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('rejectedCount').textContent = rejected;
    document.getElementById('urgentCount').textContent = urgent;
}

function isRecent(date, days) {
    if (!date) return false;
    const diffTime = new Date() - new Date(date);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= days;
}

// ==================== FILTROS ====================

function filterApprovals() {
    const statusFilter = document.getElementById('filterStatus').value;
    const typeFilter = document.getElementById('filterType').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = allApprovals.filter(approval => {
        const matchStatus = !statusFilter || approval.status === statusFilter;
        const matchType = !typeFilter || approval.type === typeFilter;
        const matchPriority = !priorityFilter || approval.priority === priorityFilter;
        const matchSearch = !searchText || 
            approval.title.toLowerCase().includes(searchText) ||
            approval.requester.toLowerCase().includes(searchText);
        
        return matchStatus && matchType && matchPriority && matchSearch;
    });
    
    displayApprovals(filtered);
}

function displayApprovals(approvals) {
    const container = document.getElementById('approvalsContainer');
    
    if (approvals.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📭</div>
                <p>Nenhuma aprovação encontrada</p>
                <button onclick="openNewApprovalModal()" class="btn-primary">+ Criar Nova Solicitação</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = approvals.map(approval => `
        <div class="approval-card ${approval.priority}" onclick="openApprovalModal(${approval.id})">
            <div class="approval-main">
                <div class="approval-header">
                    <span class="approval-type">${getTypeIcon(approval.type)}</span>
                    <h3 class="approval-title">${approval.title}</h3>
                </div>
                
                <div class="approval-meta">
                    <span>👤 ${approval.requester_name || approval.requester || 'N/A'}</span>
                    <span>🏢 ${approval.department}</span>
                    <span>📅 ${formatDate(approval.created_at)}</span>
                    ${approval.amount > 0 ? `<span>💰 ${formatCurrency(approval.amount)}</span>` : ''}
                </div>
                
                <p class="approval-description">${truncate(approval.description, 150)}</p>
                
                <div class="approval-footer">
                    <span class="badge ${approval.status}">${getStatusLabel(approval.status)}</span>
                    <span class="badge ${approval.type}">${getTypeLabel(approval.type)}</span>
                    <span class="badge">${getPriorityIcon(approval.priority)} ${getPriorityLabel(approval.priority)}</span>
                </div>
            </div>
            
            <div class="approval-actions">
                <button class="btn-view" onclick="event.stopPropagation(); openApprovalModal(${approval.id})">
                    Ver Detalhes →
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== MODAL DE DETALHES ====================

function openApprovalModal(id) {
    const approval = allApprovals.find(a => a.id === id);
    if (!approval) return;
    
    currentApprovalId = id;
    
    // Preencher dados
    document.getElementById('modalTitle').textContent = approval.title;
    document.getElementById('modalBadge').textContent = getStatusLabel(approval.status);
    document.getElementById('modalBadge').className = `badge ${approval.status}`;
    
    document.getElementById('detailType').textContent = `${getTypeIcon(approval.type)} ${getTypeLabel(approval.type)}`;
    document.getElementById('detailPriority').textContent = `${getPriorityIcon(approval.priority)} ${getPriorityLabel(approval.priority)}`;
    document.getElementById('detailRequester').textContent = approval.requester_name || approval.requester || 'N/A';
    document.getElementById('detailDepartment').textContent = approval.department;
    document.getElementById('detailDate').textContent = formatDateTime(approval.created_at);
    document.getElementById('detailDescription').textContent = approval.description;
    
    // Mostrar/ocultar campos opcionais
    if (approval.amount > 0) {
        document.getElementById('detailAmountRow').style.display = 'grid';
        document.getElementById('detailAmount').textContent = formatCurrency(approval.amount);
    } else {
        document.getElementById('detailAmountRow').style.display = 'none';
    }
    
    if (approval.justification) {
        document.getElementById('detailJustificationRow').style.display = 'grid';
        document.getElementById('detailJustification').textContent = approval.justification;
    } else {
        document.getElementById('detailJustificationRow').style.display = 'none';
    }
    
    if (approval.impact) {
        document.getElementById('detailImpactRow').style.display = 'grid';
        document.getElementById('detailImpact').textContent = approval.impact;
    } else {
        document.getElementById('detailImpactRow').style.display = 'none';
    }
    
    // Mostrar área de decisão ou histórico
    if (approval.status === 'pending') {
        document.getElementById('decisionArea').style.display = 'block';
        document.getElementById('decisionHistory').style.display = 'none';
        document.getElementById('decisionNotes').value = '';
    } else {
        document.getElementById('decisionArea').style.display = 'none';
        document.getElementById('decisionHistory').style.display = 'block';
        document.getElementById('historyStatus').textContent = getStatusLabel(approval.status);
        document.getElementById('historyDate').textContent = formatDateTime(approval.decision_date);
        document.getElementById('historyNotes').textContent = approval.decision_notes || 'Sem comentários';
    }
    
    document.getElementById('approvalModal').classList.add('active');
}

function closeApprovalModal() {
    document.getElementById('approvalModal').classList.remove('active');
    currentApprovalId = null;
}

// ==================== DECISÕES ====================

async function approveRequest() {
    const notes = document.getElementById('decisionNotes').value;
    const token = localStorage.getItem('token');
    const userId = currentUser?.id || localStorage.getItem('userId');
    
    if (!confirm('Confirma a APROVAÇÃO desta solicitação?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/approvals/${currentApprovalId}/approve`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                decision_notes: notes || 'Aprovado',
                decided_by: userId
            })
        });
        
        if (response.ok) {
            alert('✅ Solicitação aprovada com sucesso!');
            closeApprovalModal();
            await loadApprovals();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao aprovar');
        }
    } catch (error) {
        console.error('❌ Erro ao aprovar:', error);
        alert(`❌ Erro: ${error.message}`);
    }
}

async function rejectRequest() {
    const notes = document.getElementById('decisionNotes').value;
    const token = localStorage.getItem('token');
    const userId = currentUser?.id || localStorage.getItem('userId');
    
    if (!notes.trim()) {
        alert('⚠️ Por favor, adicione um comentário explicando a rejeição.');
        return;
    }
    
    if (!confirm('Confirma a REJEIÇÃO desta solicitação?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/approvals/${currentApprovalId}/reject`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                decision_notes: notes,
                decided_by: userId
            })
        });
        
        if (response.ok) {
            alert('❌ Solicitação rejeitada.');
            closeApprovalModal();
            await loadApprovals();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao rejeitar');
        }
    } catch (error) {
        console.error('❌ Erro ao rejeitar:', error);
        alert(`❌ Erro: ${error.message}`);
    }
}

// ==================== NOVA SOLICITAÇÃO ====================

function openNewApprovalModal() {
    document.getElementById('newApprovalForm').reset();
    document.getElementById('newApprovalModal').classList.add('active');
}

function closeNewApprovalModal() {
    document.getElementById('newApprovalModal').classList.remove('active');
}

function updateFormFields() {
    const type = document.getElementById('newType').value;
    const amountField = document.getElementById('amountField');
    
    if (type === 'investment' || type === 'hiring' || type === 'budget') {
        amountField.style.display = 'block';
        document.getElementById('newAmount').required = true;
    } else {
        amountField.style.display = 'none';
        document.getElementById('newAmount').required = false;
    }
}

async function createApproval() {
    const token = localStorage.getItem('token');
    const userId = currentUser?.id || localStorage.getItem('userId');
    const companyId = currentCompany?.id || localStorage.getItem('companyId');
    
    const newApproval = {
        company_id: companyId,
        type: document.getElementById('newType').value,
        title: document.getElementById('newTitle').value,
        priority: document.getElementById('newPriority').value,
        amount: parseFloat(document.getElementById('newAmount').value) || 0,
        description: document.getElementById('newDescription').value,
        justification: document.getElementById('newJustification').value,
        impact: document.getElementById('newImpact').value,
        requester_id: userId,
        department: currentUser?.department || 'Presidência'
    };
    
    try {
        const response = await fetch(`${API_BASE}/approvals`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newApproval)
        });
        
        if (response.ok) {
            alert('✅ Solicitação criada com sucesso!');
            closeNewApprovalModal();
            await loadApprovals();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar solicitação');
        }
    } catch (error) {
        console.error('❌ Erro ao criar aprovação:', error);
        alert(`❌ Erro: ${error.message}`);
    }
}

// ==================== HELPERS ====================

function getTypeIcon(type) {
    const icons = {
        hiring: '👥',
        investment: '💰',
        project: '🚀',
        structure: '🏢',
        budget: '💳',
        contract: '📄'
    };
    return icons[type] || '📋';
}

function getTypeLabel(type) {
    const labels = {
        hiring: 'Contratação',
        investment: 'Investimento',
        project: 'Projeto',
        structure: 'Estrutura',
        budget: 'Orçamento',
        contract: 'Contrato'
    };
    return labels[type] || type;
}

function getStatusLabel(status) {
    const labels = {
        pending: '⏳ Pendente',
        approved: '✅ Aprovada',
        rejected: '❌ Rejeitada'
    };
    return labels[status] || status;
}

function getPriorityIcon(priority) {
    const icons = {
        urgent: '🔥',
        high: '⚠️',
        medium: '📊',
        low: '📋'
    };
    return icons[priority] || '';
}

function getPriorityLabel(priority) {
    const labels = {
        urgent: 'Urgente',
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa'
    };
    return labels[priority] || priority;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('pt-BR');
}

function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}
