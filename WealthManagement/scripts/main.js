let allAssets = [];
let companies = [];
let currentCompanyId = '';

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await loadCompanies();
    await loadAssets();
});

// Carregar empresas
async function loadCompanies() {
    try {
        companies = await api.getCompanies();
        const companyFilter = document.getElementById('companyFilter');
        
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company.id;
            option.textContent = company.name;
            companyFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        showToast('Erro ao carregar empresas', 'error');
    }
}

// Carregar ativos
async function loadAssets() {
    try {
        allAssets = await api.getAssets();
        filterAssets();
        updateStats();
    } catch (error) {
        console.error('Erro ao carregar ativos:', error);
        showToast('Erro ao carregar ativos', 'error');
    }
}

// Filtrar ativos
function filterAssets() {
    const companyId = document.getElementById('companyFilter').value;
    const type = document.getElementById('typeFilter').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();

    let filtered = allAssets;

    if (companyId) {
        filtered = filtered.filter(asset => asset.companyId === companyId);
        currentCompanyId = companyId;
    }

    if (type) {
        filtered = filtered.filter(asset => asset.type === type);
    }

    if (status) {
        filtered = filtered.filter(asset => asset.status === status);
    }

    if (search) {
        filtered = filtered.filter(asset => {
            const searchIn = [
                asset.name,
                asset.description,
                ...(asset.tags || [])
            ].join(' ').toLowerCase();
            return searchIn.includes(search);
        });
    }

    renderAssets(filtered);
    updateStatsForFiltered(companyId);
}

// Renderizar ativos
function renderAssets(assets) {
    const grid = document.getElementById('assetsGrid');
    const emptyState = document.getElementById('emptyState');

    if (assets.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    grid.innerHTML = assets.map(asset => createAssetCard(asset)).join('');
}

// Criar card de ativo
function createAssetCard(asset) {
    const photo = asset.photos && asset.photos.length > 0 ? asset.photos[0] : null;
    const icon = getAssetIcon(asset.type);

    return `
        <div class="asset-card" onclick="viewAsset('${asset.id}')">
            <div class="asset-image">
                ${photo ? `<img src="${photo}" alt="${asset.name}">` : `<span>${icon}</span>`}
                <span class="asset-type-badge">${translateAssetType(asset.type).split(' ')[1]}</span>
                <span class="asset-status-badge status-${asset.status}">
                    ${translateAssetStatus(asset.status).split(' ')[1]}
                </span>
            </div>
            <div class="asset-content">
                <div class="asset-header">
                    <h3 class="asset-name">${asset.name}</h3>
                    ${asset.description ? `<p class="asset-description">${asset.description.substring(0, 80)}${asset.description.length > 80 ? '...' : ''}</p>` : ''}
                </div>
                <div class="asset-info">
                    <div class="info-row">
                        <span class="info-label">Valor Atual:</span>
                        <span class="info-value">${formatCurrency(asset.currentValue)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Propriedade:</span>
                        <span class="info-value">${translateOwnershipType(asset.ownershipType)}</span>
                    </div>
                    ${asset.location ? `
                    <div class="info-row">
                        <span class="info-label">Local:</span>
                        <span class="info-value">${asset.location.city}, ${asset.location.state}</span>
                    </div>
                    ` : ''}
                </div>
                ${asset.tags && asset.tags.length > 0 ? `
                <div class="asset-tags">
                    ${asset.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                ` : ''}
                <div class="asset-actions" onclick="event.stopPropagation()">
                    <button class="btn btn-sm btn-primary" onclick="editAsset('${asset.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAsset('${asset.id}')">Excluir</button>
                </div>
            </div>
        </div>
    `;
}

// Atualizar estatísticas
function updateStats() {
    const totalAssets = allAssets.length;
    const totalValue = allAssets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
    const activeAssets = allAssets.filter(asset => asset.isActive).length;
    const monthlyExpenses = allAssets.reduce((sum, asset) => sum + (asset.monthlyExpense || 0), 0);

    document.getElementById('totalAssets').textContent = totalAssets;
    document.getElementById('totalValue').textContent = formatCurrency(totalValue);
    document.getElementById('activeAssets').textContent = activeAssets;
    document.getElementById('monthlyExpenses').textContent = formatCurrency(monthlyExpenses);
}

// Atualizar estatísticas filtradas
async function updateStatsForFiltered(companyId) {
    if (!companyId) {
        updateStats();
        return;
    }

    try {
        const stats = await api.getAssetStats(companyId);
        document.getElementById('totalAssets').textContent = stats.totalAssets;
        document.getElementById('totalValue').textContent = formatCurrency(stats.totalValue);
        document.getElementById('activeAssets').textContent = stats.activeAssets;
        document.getElementById('monthlyExpenses').textContent = formatCurrency(stats.totalMonthlyExpenses);
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Ver detalhes do ativo
function viewAsset(id) {
    window.location.href = `asset-details.html?id=${id}`;
}

// Editar ativo
function editAsset(id) {
    window.location.href = `add-asset.html?id=${id}`;
}

// Deletar ativo
async function deleteAsset(id) {
    if (!confirmAction('Tem certeza que deseja excluir este ativo?')) {
        return;
    }

    try {
        await api.deleteAsset(id);
        showToast('Ativo excluído com sucesso!', 'success');
        await loadAssets();
    } catch (error) {
        console.error('Erro ao excluir ativo:', error);
        showToast('Erro ao excluir ativo', 'error');
    }
}
