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
    const companyId = localStorage.getItem('companyId') || 1;
    
    try {
        const response = await fetch(`${API_BASE}/approvals/company/${companyId}`);
        
        if (response.ok) {
            allApprovals = await response.json();
        } else {
            // Dados de demonstração se API não existir
            allApprovals = generateDemoApprovals();
        }
        
        updateStats();
        filterApprovals();
    } catch (error) {
        console.error('Erro ao carregar aprovações:', error);
        allApprovals = generateDemoApprovals();
        updateStats();
        filterApprovals();
    }
}

function generateDemoApprovals() {
    return [
        {
            id: 1,
            type: 'hiring',
            title: 'Contratação de Diretor de TI',
            description: 'Necessária contratação de profissional sênior para liderar a transformação digital da empresa. Perfil: 10+ anos de experiência, liderança de times grandes, conhecimento em cloud e arquitetura.',
            requester: 'Carlos Silva',
            department: 'Recursos Humanos',
            priority: 'urgent',
            status: 'pending',
            amount: 25000,
            justification: 'A área de TI cresceu 300% no último ano e precisa de liderança estratégica para escalar processos e garantir a segurança da informação.',
            impact: 'Estruturação da área de TI, redução de riscos de segurança, melhoria na velocidade de entrega de projetos digitais.',
            created_at: '2024-11-04T10:30:00',
            decision_date: null,
            decision_notes: null
        },
        {
            id: 2,
            type: 'investment',
            title: 'Investimento em Nova Plataforma de CRM',
            description: 'Aquisição e implementação de plataforma Salesforce Enterprise para gestão completa do relacionamento com clientes.',
            requester: 'Ana Costa',
            department: 'Comercial',
            priority: 'high',
            status: 'pending',
            amount: 850000,
            justification: 'Sistema atual não suporta mais o volume de leads. Perdemos oportunidades por falta de automação e integração.',
            impact: 'Aumento de 40% na conversão de leads, redução de 60% no tempo de resposta ao cliente, melhor previsibilidade de vendas.',
            created_at: '2024-11-03T14:20:00',
            decision_date: null,
            decision_notes: null
        },
        {
            id: 3,
            type: 'project',
            title: 'Lançamento de Produto Premium',
            description: 'Desenvolvimento de linha premium de produtos voltada para o segmento corporativo de alto valor.',
            requester: 'Roberto Mendes',
            department: 'Produtos',
            priority: 'high',
            status: 'pending',
            amount: 1200000,
            justification: 'Pesquisa de mercado identificou demanda reprimida no segmento premium. Concorrentes já atuam nesse nicho com margem 3x superior.',
            impact: 'Nova fonte de receita estimada em R$ 5M no primeiro ano, posicionamento de marca mais forte, acesso a novos clientes.',
            created_at: '2024-11-02T09:15:00',
            decision_date: null,
            decision_notes: null
        },
        {
            id: 4,
            type: 'structure',
            title: 'Criação de Diretoria de Inovação',
            description: 'Proposta de nova estrutura organizacional com criação da Diretoria de Inovação reportando diretamente à Presidência.',
            requester: 'Fernanda Lima',
            department: 'Estratégia',
            priority: 'medium',
            status: 'pending',
            amount: 0,
            justification: 'Empresa precisa de foco dedicado em inovação para manter competitividade. Atuais iniciativas estão dispersas.',
            impact: 'Aceleração de projetos inovadores, cultura de experimentação, parcerias estratégicas com startups e universidades.',
            created_at: '2024-11-01T16:45:00',
            decision_date: null,
            decision_notes: null
        },
        {
            id: 5,
            type: 'budget',
            title: 'Orçamento Extraordinário - Marketing Digital',
            description: 'Aprovação de budget adicional para campanhas de Black Friday e fim de ano.',
            requester: 'Juliana Santos',
            department: 'Marketing',
            priority: 'urgent',
            status: 'approved',
            amount: 450000,
            justification: 'Oportunidade única de capturar market share. Concorrentes já anunciaram investimentos massivos.',
            impact: 'Estimativa de ROI de 3.5x, aumento de 25% na base de clientes, fortalecimento de marca.',
            created_at: '2024-10-28T11:00:00',
            decision_date: '2024-10-29T09:30:00',
            decision_notes: 'Aprovado. Impacto claro e timing adequado. Acompanhar métricas semanalmente.'
        },
        {
            id: 6,
            type: 'contract',
            title: 'Parceria com Distribuidor Regional',
            description: 'Contrato de exclusividade com distribuidor para região Sul por 3 anos.',
            requester: 'Pedro Oliveira',
            department: 'Comercial',
            priority: 'medium',
            status: 'approved',
            amount: 0,
            justification: 'Distribuidor tem capilaridade em 150 cidades e relacionamento consolidado com grandes redes.',
            impact: 'Expansão geográfica imediata, redução de custos logísticos, aumento de 30% em volume na região.',
            created_at: '2024-10-25T13:20:00',
            decision_date: '2024-10-27T15:00:00',
            decision_notes: 'Aprovado com ajustes nas cláusulas de exclusividade. Revisão anual obrigatória.'
        },
        {
            id: 7,
            type: 'hiring',
            title: 'Contratação de 3 Engenheiros Senior',
            description: 'Ampliação do time de desenvolvimento para suportar novos projetos.',
            requester: 'Marcos Tech',
            department: 'Tecnologia',
            priority: 'low',
            status: 'rejected',
            amount: 45000,
            justification: 'Backlog crescente e risco de atraso em entregas críticas.',
            impact: 'Aumento na capacidade de entrega, redução de sobrecarga da equipe atual.',
            created_at: '2024-10-20T10:00:00',
            decision_date: '2024-10-22T14:30:00',
            decision_notes: 'Rejeitado temporariamente. Priorizar otimização de processos antes de aumentar headcount. Reavaliar em Q1.'
        }
    ];
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
                <p>Nenhuma aprovação encontrada com os filtros aplicados</p>
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
                    <span>👤 ${approval.requester}</span>
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
    document.getElementById('detailRequester').textContent = approval.requester;
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
    
    if (!confirm('Confirma a APROVAÇÃO desta solicitação?')) return;
    
    try {
        const approval = allApprovals.find(a => a.id === currentApprovalId);
        approval.status = 'approved';
        approval.decision_date = new Date().toISOString();
        approval.decision_notes = notes || 'Aprovado sem comentários';
        
        alert('✅ Solicitação aprovada com sucesso!');
        closeApprovalModal();
        updateStats();
        filterApprovals();
    } catch (error) {
        console.error('Erro ao aprovar:', error);
        alert('❌ Erro ao processar aprovação');
    }
}

async function rejectRequest() {
    const notes = document.getElementById('decisionNotes').value;
    
    if (!notes.trim()) {
        alert('⚠️ Por favor, adicione um comentário explicando a rejeição.');
        return;
    }
    
    if (!confirm('Confirma a REJEIÇÃO desta solicitação?')) return;
    
    try {
        const approval = allApprovals.find(a => a.id === currentApprovalId);
        approval.status = 'rejected';
        approval.decision_date = new Date().toISOString();
        approval.decision_notes = notes;
        
        alert('❌ Solicitação rejeitada.');
        closeApprovalModal();
        updateStats();
        filterApprovals();
    } catch (error) {
        console.error('Erro ao rejeitar:', error);
        alert('❌ Erro ao processar rejeição');
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
    const newApproval = {
        id: Math.max(...allApprovals.map(a => a.id)) + 1,
        type: document.getElementById('newType').value,
        title: document.getElementById('newTitle').value,
        priority: document.getElementById('newPriority').value,
        amount: parseFloat(document.getElementById('newAmount').value) || 0,
        description: document.getElementById('newDescription').value,
        justification: document.getElementById('newJustification').value,
        impact: document.getElementById('newImpact').value,
        requester: currentUser?.name || 'Presidente',
        department: 'Presidência',
        status: 'pending',
        created_at: new Date().toISOString(),
        decision_date: null,
        decision_notes: null
    };
    
    allApprovals.unshift(newApproval);
    
    alert('✅ Solicitação criada com sucesso!');
    closeNewApprovalModal();
    updateStats();
    filterApprovals();
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
