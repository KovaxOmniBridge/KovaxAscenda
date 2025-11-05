let editingAssetId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await loadCompanies();
    
    // Verificar se está editando
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id');
    
    if (assetId) {
        editingAssetId = assetId;
        document.getElementById('pageTitle').innerHTML = '✏️ Editar Ativo';
        await loadAssetData(assetId);
    }
});

// Carregar empresas
async function loadCompanies() {
    try {
        const companies = await api.getCompanies();
        const select = document.getElementById('companyId');
        
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company.id;
            option.textContent = company.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        showToast('Erro ao carregar empresas', 'error');
    }
}

// Carregar dados do ativo para edição
async function loadAssetData(id) {
    try {
        const asset = await api.getAssetById(id);
        
        // Preencher campos básicos
        document.getElementById('companyId').value = asset.companyId;
        document.getElementById('type').value = asset.type;
        document.getElementById('status').value = asset.status;
        document.getElementById('name').value = asset.name;
        document.getElementById('description').value = asset.description || '';
        
        // Valores
        if (asset.purchaseValue) document.getElementById('purchaseValue').value = asset.purchaseValue;
        if (asset.currentValue) document.getElementById('currentValue').value = asset.currentValue;
        if (asset.estimatedValue) document.getElementById('estimatedValue').value = asset.estimatedValue;
        if (asset.purchaseDate) document.getElementById('purchaseDate').value = asset.purchaseDate.split('T')[0];
        document.getElementById('ownershipType').value = asset.ownershipType;
        if (asset.monthlyExpense) document.getElementById('monthlyExpense').value = asset.monthlyExpense;
        
        // Localização
        if (asset.location) {
            if (asset.location.address) document.getElementById('address').value = asset.location.address;
            if (asset.location.city) document.getElementById('city').value = asset.location.city;
            if (asset.location.state) document.getElementById('state').value = asset.location.state;
            if (asset.location.zipCode) document.getElementById('zipCode').value = asset.location.zipCode;
            if (asset.location.country) document.getElementById('country').value = asset.location.country;
            if (asset.location.latitude) document.getElementById('latitude').value = asset.location.latitude;
            if (asset.location.longitude) document.getElementById('longitude').value = asset.location.longitude;
        }
        
        // Características físicas
        if (asset.area) document.getElementById('area').value = asset.area;
        if (asset.capacity) document.getElementById('capacity').value = asset.capacity;
        if (asset.rooms) document.getElementById('rooms').value = asset.rooms;
        if (asset.floors) document.getElementById('floors').value = asset.floors;
        if (asset.parkingSpaces) document.getElementById('parkingSpaces').value = asset.parkingSpaces;
        
        // Veículo/Equipamento
        if (asset.brand) document.getElementById('brand').value = asset.brand;
        if (asset.model) document.getElementById('model').value = asset.model;
        if (asset.year) document.getElementById('year').value = asset.year;
        if (asset.licensePlate) document.getElementById('licensePlate').value = asset.licensePlate;
        if (asset.serialNumber) document.getElementById('serialNumber').value = asset.serialNumber;
        
        // Adicionais
        if (asset.notes) document.getElementById('notes').value = asset.notes;
        if (asset.tags) document.getElementById('tags').value = asset.tags.join(', ');
        document.getElementById('isActive').checked = asset.isActive;
        
        // Fotos
        if (asset.photos && asset.photos.length > 0) {
            uploadedPhotos = [...asset.photos];
            renderPhotoPreview();
        }
        
        // Documentos
        if (asset.documents && asset.documents.length > 0) {
            uploadedDocuments = asset.documents.map(doc => ({
                name: doc.name,
                type: doc.type,
                url: doc.url
            }));
            renderDocumentList();
        }
        
        updateFormFields();
    } catch (error) {
        console.error('Erro ao carregar ativo:', error);
        showToast('Erro ao carregar dados do ativo', 'error');
    }
}

// Atualizar campos do formulário baseado no tipo
function updateFormFields() {
    const type = document.getElementById('type').value;
    const physicalFields = document.getElementById('physicalFields');
    const vehicleFields = document.getElementById('vehicleFields');
    
    // Mostrar campos físicos para imóveis
    if (['STORE', 'WAREHOUSE', 'REAL_ESTATE', 'CLINIC'].includes(type)) {
        physicalFields.style.display = 'block';
    } else {
        physicalFields.style.display = 'none';
    }
    
    // Mostrar campos de veículo
    if (['VEHICLE', 'EQUIPMENT'].includes(type)) {
        vehicleFields.style.display = 'block';
    } else {
        vehicleFields.style.display = 'none';
    }
}

// Submeter formulário
async function handleSubmit(event) {
    event.preventDefault();
    
    try {
        const data = getFormData();
        
        if (editingAssetId) {
            await api.updateAsset(editingAssetId, data);
            showToast('Ativo atualizado com sucesso!', 'success');
        } else {
            await api.createAsset(data);
            showToast('Ativo criado com sucesso!', 'success');
        }
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        console.error('Erro ao salvar ativo:', error);
        showToast(error.message || 'Erro ao salvar ativo', 'error');
    }
}

// Obter dados do formulário
function getFormData() {
    const data = {
        companyId: document.getElementById('companyId').value,
        type: document.getElementById('type').value,
        status: document.getElementById('status').value,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value || undefined,
        ownershipType: document.getElementById('ownershipType').value,
        isActive: document.getElementById('isActive').checked
    };
    
    // Valores
    const purchaseValue = parseFloat(document.getElementById('purchaseValue').value);
    if (!isNaN(purchaseValue)) data.purchaseValue = purchaseValue;
    
    const currentValue = parseFloat(document.getElementById('currentValue').value);
    if (!isNaN(currentValue)) data.currentValue = currentValue;
    
    const estimatedValue = parseFloat(document.getElementById('estimatedValue').value);
    if (!isNaN(estimatedValue)) data.estimatedValue = estimatedValue;
    
    const monthlyExpense = parseFloat(document.getElementById('monthlyExpense').value);
    if (!isNaN(monthlyExpense)) data.monthlyExpense = monthlyExpense;
    
    const purchaseDate = document.getElementById('purchaseDate').value;
    if (purchaseDate) data.purchaseDate = purchaseDate;
    
    // Localização
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    
    if (address || city || state) {
        data.location = {
            address: address || undefined,
            city: city || undefined,
            state: state || undefined,
            zipCode: document.getElementById('zipCode').value || undefined,
            country: document.getElementById('country').value || undefined
        };
        
        const lat = parseFloat(document.getElementById('latitude').value);
        const lng = parseFloat(document.getElementById('longitude').value);
        if (!isNaN(lat)) data.location.latitude = lat;
        if (!isNaN(lng)) data.location.longitude = lng;
    }
    
    // Características físicas
    const area = parseFloat(document.getElementById('area').value);
    if (!isNaN(area)) data.area = area;
    
    const capacity = parseInt(document.getElementById('capacity').value);
    if (!isNaN(capacity)) data.capacity = capacity;
    
    const rooms = parseInt(document.getElementById('rooms').value);
    if (!isNaN(rooms)) data.rooms = rooms;
    
    const floors = parseInt(document.getElementById('floors').value);
    if (!isNaN(floors)) data.floors = floors;
    
    const parkingSpaces = parseInt(document.getElementById('parkingSpaces').value);
    if (!isNaN(parkingSpaces)) data.parkingSpaces = parkingSpaces;
    
    // Veículo/Equipamento
    const brand = document.getElementById('brand').value;
    if (brand) data.brand = brand;
    
    const model = document.getElementById('model').value;
    if (model) data.model = model;
    
    const year = parseInt(document.getElementById('year').value);
    if (!isNaN(year)) data.year = year;
    
    const licensePlate = document.getElementById('licensePlate').value;
    if (licensePlate) data.licensePlate = licensePlate;
    
    const serialNumber = document.getElementById('serialNumber').value;
    if (serialNumber) data.serialNumber = serialNumber;
    
    // Adicionais
    const notes = document.getElementById('notes').value;
    if (notes) data.notes = notes;
    
    const tagsInput = document.getElementById('tags').value;
    if (tagsInput) {
        data.tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // Fotos
    if (uploadedPhotos.length > 0) {
        data.photos = uploadedPhotos;
    }
    
    // Documentos
    if (uploadedDocuments.length > 0) {
        data.documents = uploadedDocuments;
    }
    
    return data;
}

// Gerenciamento de fotos
let uploadedPhotos = [];

async function handlePhotoUpload(event) {
    const files = event.target.files;
    
    for (let file of files) {
        try {
            validateImageSize(file, 5);
            const base64 = await imageToBase64(file);
            uploadedPhotos.push(base64);
            renderPhotoPreview();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
    
    event.target.value = '';
}

function renderPhotoPreview() {
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = uploadedPhotos.map((photo, index) => `
        <div class="photo-preview-item">
            <img src="${photo}" alt="Foto ${index + 1}">
            <button type="button" class="remove-photo" onclick="removePhoto(${index})">×</button>
        </div>
    `).join('');
}

function removePhoto(index) {
    uploadedPhotos.splice(index, 1);
    renderPhotoPreview();
}

// Gerenciamento de documentos
let uploadedDocuments = [];

async function handleDocumentUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const name = document.getElementById('documentName').value;
    const type = document.getElementById('documentType').value;
    
    if (!name) {
        showToast('Digite o nome do documento', 'warning');
        return;
    }
    
    try {
        validateImageSize(file, 5);
        const base64 = await imageToBase64(file);
        
        const document = {
            name: name,
            type: type,
            url: base64
        };
        
        uploadedDocuments.push(document);
        renderDocumentList();
        
        // Limpar inputs
        document.getElementById('documentName').value = '';
        document.getElementById('documentFile').value = '';
        
        showToast('Documento adicionado!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function renderDocumentList() {
    const list = document.getElementById('documentList');
    list.innerHTML = uploadedDocuments.map((doc, index) => `
        <div class="document-item">
            <div class="document-info">
                <span class="document-icon">📄</span>
                <div class="document-details">
                    <h4>${doc.name}</h4>
                    <p>${translateDocumentType(doc.type)}</p>
                </div>
            </div>
            <div class="document-actions">
                <button type="button" class="btn btn-sm btn-danger" onclick="removeDocument(${index})">
                    Remover
                </button>
            </div>
        </div>
    `).join('');
}

function removeDocument(index) {
    uploadedDocuments.splice(index, 1);
    renderDocumentList();
}

function translateDocumentType(type) {
    const translations = {
        'contract': 'Contrato',
        'deed': 'Escritura',
        'invoice': 'Nota Fiscal',
        'other': 'Outro'
    };
    return translations[type] || type;
}
