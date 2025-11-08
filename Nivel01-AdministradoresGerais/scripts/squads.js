const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token || !user.id || user.nivel > 1) {
    window.location.href = '../index.html';
}

let squads = [];
let users = [];
let currentSquadId = null;

const squadsGrid = document.getElementById('squadsGrid');
const filterStatus = document.getElementById('filterStatus');
const filterType = document.getElementById('filterType');
const squadModal = document.getElementById('squadModal');
const membersModal = document.getElementById('membersModal');

document.addEventListener('DOMContentLoaded', () => {
    loadSquads();
    loadUsers();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('newSquadBtn').addEventListener('click', () => openSquadModal());
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '../index.html';
    });
    filterStatus.addEventListener('change', filterSquads);
    filterType.addEventListener('change', filterSquads);
}

async function loadSquads() {
    try {
        const response = await fetch(`http://localhost:3000/api/squads/company/${user.company_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            squads = await response.json();
            renderSquads();
        }
    } catch (error) {
        console.error('Erro ao carregar squads:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`http://localhost:3000/api/users/company/${user.company_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            users = await response.json();
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

function renderSquads() {
    const filtered = squads.filter(s => {
        const statusMatch = !filterStatus.value || s.status === filterStatus.value;
        const typeMatch = !filterType.value || s.squad_type === filterType.value;
        return statusMatch && typeMatch;
    });

    if (filtered.length === 0) {
        squadsGrid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🚀</div><p>Nenhum squad encontrado</p></div>';
        return;
    }

    squadsGrid.innerHTML = filtered.map(s => `
        <div class="squad-card ${s.status}">
            <div class="squad-header">
                <div>
                    <div class="squad-name">${s.name}</div>
                    <span class="squad-type ${s.squad_type}">${getTypeName(s.squad_type)}</span>
                </div>
                <span class="squad-status ${s.status}">${getStatusName(s.status)}</span>
            </div>
            <p class="squad-description">${s.description || 'Sem descrição'}</p>
            <div class="squad-meta">
                <div class="meta-item">
                    <span class="meta-label">Início</span>
                    <span class="meta-value">${formatDate(s.start_date)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Término</span>
                    <span class="meta-value">${s.end_date ? formatDate(s.end_date) : '-'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Criado por</span>
                    <span class="meta-value">${s.created_by_name}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Membros</span>
                    <span class="meta-value">${s.member_count || 0}</span>
                </div>
            </div>
            <div class="squad-actions">
                <button class="btn-squad members" onclick="openMembersModal(${s.id})">👥 Membros</button>
                <button class="btn-squad edit" onclick="editSquad(${s.id})">✏️</button>
                <button class="btn-squad delete" onclick="deleteSquad(${s.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function filterSquads() {
    renderSquads();
}

function getTypeName(type) {
    const names = { feature: 'Feature', project: 'Projeto', problem: 'Problema', innovation: 'Inovação' };
    return names[type] || type;
}

function getStatusName(status) {
    const names = { active: 'Ativo', paused: 'Pausado', completed: 'Concluído', cancelled: 'Cancelado' };
    return names[status] || status;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-BR');
}

function openSquadModal(squadData = null) {
    document.getElementById('modalTitle').textContent = squadData ? 'Editar Squad' : 'Novo Squad';
    document.getElementById('squadId').value = squadData?.id || '';
    document.getElementById('squadName').value = squadData?.name || '';
    document.getElementById('squadType').value = squadData?.squad_type || '';
    document.getElementById('squadDescription').value = squadData?.description || '';
    document.getElementById('squadStartDate').value = squadData?.start_date || '';
    document.getElementById('squadEndDate').value = squadData?.end_date || '';
    document.getElementById('squadStatus').value = squadData?.status || 'active';
    squadModal.classList.add('active');
}

function closeSquadModal() {
    squadModal.classList.remove('active');
}

async function saveSquad() {
    const id = document.getElementById('squadId').value;
    const data = {
        company_id: user.company_id,
        name: document.getElementById('squadName').value,
        squad_type: document.getElementById('squadType').value,
        description: document.getElementById('squadDescription').value,
        start_date: document.getElementById('squadStartDate').value,
        end_date: document.getElementById('squadEndDate').value || null,
        status: document.getElementById('squadStatus').value,
        created_by: user.id
    };

    try {
        const url = id ? `http://localhost:3000/api/squads/${id}` : 'http://localhost:3000/api/squads';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Squad salvo com sucesso!');
            closeSquadModal();
            loadSquads();
        } else {
            alert('Erro ao salvar squad');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar squad');
    }
}

function editSquad(id) {
    const squad = squads.find(s => s.id === id);
    if (squad) openSquadModal(squad);
}

async function deleteSquad(id) {
    if (!confirm('Deseja realmente deletar este squad?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/squads/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Squad deletado com sucesso!');
            loadSquads();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function openMembersModal(squadId) {
    currentSquadId = squadId;
    const squad = squads.find(s => s.id === squadId);
    document.getElementById('membersModalTitle').textContent = `Membros: ${squad.name}`;
    
    // Preencher select de usuários
    const select = document.getElementById('memberUserId');
    select.innerHTML = '<option value="">Selecione...</option>' + 
        users.map(u => `<option value="${u.id}">${u.name} - ${u.department}</option>`).join('');
    
    loadMembers(squadId);
    membersModal.classList.add('active');
}

function closeMembersModal() {
    membersModal.classList.remove('active');
}

async function loadMembers(squadId) {
    try {
        const response = await fetch(`http://localhost:3000/api/squads/${squadId}/members`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const members = await response.json();
            const tbody = document.getElementById('membersTableBody');
            
            if (members.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><p>Nenhum membro ainda</p></td></tr>';
                return;
            }
            
            tbody.innerHTML = members.map(m => `
                <tr>
                    <td>${m.name}</td>
                    <td>${m.department}</td>
                    <td>Nível ${m.nivel}</td>
                    <td><span class="role-badge ${m.role}">${m.role}</span></td>
                    <td>${m.allocation_percent}%</td>
                    <td><button class="btn-remove" onclick="removeMember(${squadId}, ${m.user_id})">Remover</button></td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function addMember() {
    const userId = document.getElementById('memberUserId').value;
    const role = document.getElementById('memberRole').value;
    const allocation = document.getElementById('memberAllocation').value;

    if (!userId) {
        alert('Selecione um usuário');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/squads/${currentSquadId}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ user_id: userId, role, allocation_percent: allocation })
        });

        if (response.ok) {
            alert('Membro adicionado!');
            loadMembers(currentSquadId);
            loadSquads(); // Atualizar contagem
            document.getElementById('memberUserId').value = '';
        } else {
            alert('Erro ao adicionar membro');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function removeMember(squadId, userId) {
    if (!confirm('Remover este membro?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/squads/${squadId}/members/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Membro removido!');
            loadMembers(squadId);
            loadSquads();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

window.closeSquadModal = closeSquadModal;
window.closeMembersModal = closeMembersModal;
window.saveSquad = saveSquad;
window.editSquad = editSquad;
window.deleteSquad = deleteSquad;
window.openMembersModal = openMembersModal;
window.addMember = addMember;
window.removeMember = removeMember;
