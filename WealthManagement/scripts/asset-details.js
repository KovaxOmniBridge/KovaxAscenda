let currentAsset = null;
let assetId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    assetId = urlParams.get('id');
    
    if (!assetId) {
        showToast('Ativo não encontrado', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    await loadAssetDetails();
});

// Carregar detalhes do ativo
async function loadAssetDetails() {
    try {
        currentAsset = await api.getAssetById(assetId);
        renderAssetDetails();
    } catch (error) {
        console.error('Erro ao carregar ativo:', error);
        showToast('Erro ao carregar detalhes do ativo', 'error');
    }
}

// Renderizar detalhes
function renderAssetDetails() {
    const asset = currentAsset;
    
    // Nome no header
    document.getElementById('assetName').textContent = `${getAssetIcon(asset.type)} ${asset.name}`;
    
    // Status
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = translateAssetStatus(asset.status);
    statusBadge.className = `status-badge-large status-${asset.status}`;
    
    // Valores
    document.getElementById('purchaseValue').textContent = formatCurrency(asset.purchaseValue);
    document.getElementById('currentValue').textContent = formatCurrency(asset.currentValue);
    document.getElementById('estimatedValue').textContent = formatCurrency(asset.estimatedValue);
    document.getElementById('monthlyExpense').textContent = formatCurrency(asset.monthlyExpense);
    
    // Datas
    document.getElementById('purchaseDate').textContent = formatDate(asset.purchaseDate);
    document.getElementById('warrantyDate').textContent = formatDate(asset.warrantyExpiryDate);
    document.getElementById('createdAt').textContent = formatDate(asset.createdAt);
    
    // Informações principais
    renderMainInfo(asset);
    
    // Localização
    if (asset.location) {
        renderLocationInfo(asset.location);
    }
    
    // Características físicas
    if (asset.area || asset.capacity || asset.rooms || asset.floors || asset.parkingSpaces) {
        renderPhysicalInfo(asset);
    }
    
    // Fotos
    if (asset.photos && asset.photos.length > 0) {
        renderPhotoGallery(asset.photos);
    }
    
    // Documentos
    if (asset.documents && asset.documents.length > 0) {
        renderDocuments(asset.documents);
    }
    
    // Despesas
    if (asset.expenses && asset.expenses.length > 0) {
        renderExpenses(asset.expenses);
    }
    
    // Notas
    if (asset.notes) {
        document.getElementById('notesCard').style.display = 'block';
        document.getElementById('notesContent').textContent = asset.notes;
    }
    
    // Tags
    if (asset.tags && asset.tags.length > 0) {
        renderTags(asset.tags);
    }
}

// Renderizar informações principais
function renderMainInfo(asset) {
    const info = document.getElementById('mainInfo');
    const items = [];
    
    items.push({ label: 'Tipo', value: translateAssetType(asset.type) });
    items.push({ label: 'Tipo de Propriedade', value: translateOwnershipType(asset.ownershipType) });
    
    if (asset.description) {
        items.push({ label: 'Descrição', value: asset.description, fullWidth: true });
    }
    
    if (asset.brand) items.push({ label: 'Marca', value: asset.brand });
    if (asset.model) items.push({ label: 'Modelo', value: asset.model });
    if (asset.year) items.push({ label: 'Ano', value: asset.year });
    if (asset.licensePlate) items.push({ label: 'Placa', value: asset.licensePlate });
    if (asset.serialNumber) items.push({ label: 'Número de Série', value: asset.serialNumber });
    
    info.innerHTML = items.map(item => `
        <div class="info-item" ${item.fullWidth ? 'style="grid-column: 1 / -1;"' : ''}>
            <span class="info-label">${item.label}</span>
            <span class="info-value">${item.value}</span>
        </div>
    `).join('');
}

// Renderizar localização
function renderLocationInfo(location) {
    document.getElementById('locationCard').style.display = 'block';
    const info = document.getElementById('locationInfo');
    const items = [];
    
    if (location.address) items.push({ label: 'Endereço', value: location.address });
    if (location.city) items.push({ label: 'Cidade', value: location.city });
    if (location.state) items.push({ label: 'Estado', value: location.state });
    if (location.zipCode) items.push({ label: 'CEP', value: location.zipCode });
    if (location.country) items.push({ label: 'País', value: location.country });
    if (location.latitude && location.longitude) {
        items.push({ 
            label: 'Coordenadas', 
            value: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
            fullWidth: true 
        });
    }
    
    info.innerHTML = items.map(item => `
        <div class="info-item" ${item.fullWidth ? 'style="grid-column: 1 / -1;"' : ''}>
            <span class="info-label">${item.label}</span>
            <span class="info-value">${item.value}</span>
        </div>
    `).join('');
}

// Renderizar características físicas
function renderPhysicalInfo(asset) {
    document.getElementById('physicalCard').style.display = 'block';
    const info = document.getElementById('physicalInfo');
    const items = [];
    
    if (asset.area) items.push({ label: 'Área', value: `${asset.area} m²` });
    if (asset.capacity) items.push({ label: 'Capacidade', value: asset.capacity });
    if (asset.rooms) items.push({ label: 'Quartos/Salas', value: asset.rooms });
    if (asset.floors) items.push({ label: 'Andares', value: asset.floors });
    if (asset.parkingSpaces) items.push({ label: 'Vagas de Garagem', value: asset.parkingSpaces });
    
    info.innerHTML = items.map(item => `
        <div class="info-item">
            <span class="info-label">${item.label}</span>
            <span class="info-value">${item.value}</span>
        </div>
    `).join('');
}

// Renderizar galeria de fotos
function renderPhotoGallery(photos) {
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = photos.map((photo, index) => `
        <div class="photo-gallery-item" onclick="openPhotoModal('${photo}')">
            <img src="${photo}" alt="Foto ${index + 1}">
        </div>
    `).join('');
}

// Renderizar documentos
function renderDocuments(documents) {
    const list = document.getElementById('documentsList');
    list.innerHTML = documents.map(doc => `
        <div class="document-item-view">
            <div class="document-info-view">
                <span class="document-icon-view">📄</span>
                <div class="document-details-view">
                    <h4>${doc.name}</h4>
                    <p>${translateDocumentType(doc.type)} • ${formatDate(doc.uploadedAt)}</p>
                </div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="viewDocument('${doc.url}')">
                Ver
            </button>
        </div>
    `).join('');
}

// Renderizar despesas
function renderExpenses(expenses) {
    const list = document.getElementById('expensesList');
    const summary = document.getElementById('expenseSummary');
    
    list.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-info">
                <h4>${expense.description}</h4>
                <p>${translateExpenseCategory(expense.category)} • ${formatDate(expense.date)}</p>
            </div>
            <span class="expense-amount">${formatCurrency(expense.amount)}</span>
        </div>
    `).join('');
    
    // Calcular total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    summary.style.display = 'flex';
    summary.innerHTML = `
        <span class="expense-summary-label">Total de Despesas:</span>
        <span class="expense-summary-value">${formatCurrency(total)}</span>
    `;
}

// Renderizar tags
function renderTags(tags) {
    document.getElementById('tagsCard').style.display = 'block';
    const list = document.getElementById('tagsList');
    list.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
}

// Abrir modal de foto
function openPhotoModal(photoUrl) {
    document.getElementById('photoModalImage').src = photoUrl;
    document.getElementById('photoModal').style.display = 'flex';
}

// Fechar modal de foto
function closePhotoModal() {
    document.getElementById('photoModal').style.display = 'none';
}

// Ver documento
function viewDocument(url) {
    window.open(url, '_blank');
}

// Abrir modal de adicionar despesa
function openAddExpenseModal() {
    document.getElementById('expenseModal').style.display = 'flex';
}

// Fechar modal de adicionar despesa
function closeAddExpenseModal() {
    document.getElementById('expenseModal').style.display = 'none';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
}

// Adicionar despesa
async function handleAddExpense(event) {
    event.preventDefault();
    
    const expense = {
        description: document.getElementById('expenseDescription').value,
        amount: parseFloat(document.getElementById('expenseAmount').value),
        category: document.getElementById('expenseCategory').value
    };
    
    try {
        currentAsset = await api.addExpense(assetId, expense);
        showToast('Despesa adicionada com sucesso!', 'success');
        closeAddExpenseModal();
        renderExpenses(currentAsset.expenses);
        document.getElementById('monthlyExpense').textContent = formatCurrency(currentAsset.monthlyExpense);
    } catch (error) {
        console.error('Erro ao adicionar despesa:', error);
        showToast('Erro ao adicionar despesa', 'error');
    }
}

// Editar ativo
function editAsset() {
    window.location.href = `add-asset.html?id=${assetId}`;
}

// Deletar ativo
async function deleteAsset() {
    if (!confirmAction('Tem certeza que deseja excluir este ativo?')) {
        return;
    }
    
    try {
        await api.deleteAsset(assetId);
        showToast('Ativo excluído com sucesso!', 'success');
        setTimeout(() => window.location.href = 'index.html', 1500);
    } catch (error) {
        console.error('Erro ao excluir ativo:', error);
        showToast('Erro ao excluir ativo', 'error');
    }
}

// Traduzir tipo de documento
function translateDocumentType(type) {
    const translations = {
        'contract': 'Contrato',
        'deed': 'Escritura',
        'photo': 'Foto',
        'invoice': 'Nota Fiscal',
        'other': 'Outro'
    };
    return translations[type] || type;
}

// Traduzir categoria de despesa
function translateExpenseCategory(category) {
    const translations = {
        'maintenance': 'Manutenção',
        'tax': 'Impostos',
        'insurance': 'Seguro',
        'rent': 'Aluguel',
        'utility': 'Utilidades',
        'other': 'Outro'
    };
    return translations[category] || category;
}
