// ============================================
// GLOBAL STATE
// ============================================

let currentCompany = null;
let allCompanies = [];
let currentProducts = [];
let currentServices = [];
let editingProduct = null;
let editingService = null;
let productTags = [];
let productImages = [];
let currentScannerType = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    await loadCompanies();
}

function setupEventListeners() {
    // Search
    document.getElementById('searchCompany').addEventListener('input', handleCompanySearch);
    document.getElementById('searchProduct').addEventListener('input', handleProductSearch);
    document.getElementById('searchService').addEventListener('input', handleServiceSearch);

    // Tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', handleTabChange);
    });

    // Modals
    setupModalListeners();

    // Forms
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('serviceForm').addEventListener('submit', handleServiceSubmit);

    // Action buttons
    document.getElementById('btnAddProduct').addEventListener('click', () => openProductForm());
    document.getElementById('btnAddService').addEventListener('click', () => openServiceForm());
    document.getElementById('btnCancelProduct').addEventListener('click', closeProductForm);
    document.getElementById('btnCancelService').addEventListener('click', closeServiceForm);
    
    // Tags
    document.getElementById('productTags').addEventListener('keydown', handleTagInput);
    
    // Images
    document.getElementById('btnSelectImages').addEventListener('click', () => {
        document.getElementById('productImages').click();
    });
    document.getElementById('productImages').addEventListener('change', handleImageSelect);
    
    // Drag and drop images
    const uploadArea = document.querySelector('.images-upload-area');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Codes - Barcode
    document.getElementById('btnScanBarcode').addEventListener('click', () => scanCode('barcode'));
    document.getElementById('btnGenerateBarcode').addEventListener('click', handleGenerateBarcode);
    
    // Codes - QR Code
    document.getElementById('btnScanQrcode').addEventListener('click', () => scanCode('qrcode'));
    document.getElementById('btnGenerateQrcode').addEventListener('click', handleGenerateQrcode);
    
    // Scanner
    document.getElementById('btnCancelScanner').addEventListener('click', stopScanner);
}

function setupModalListeners() {
    // Close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

// ============================================
// COMPANIES
// ============================================

async function loadCompanies() {
    const companiesList = document.getElementById('companiesList');
    companiesList.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando empresas...</p></div>';

    try {
        allCompanies = await getCompanies();
        renderCompanies(allCompanies);
    } catch (error) {
        companiesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Erro ao carregar empresas</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function renderCompanies(companies) {
    const companiesList = document.getElementById('companiesList');

    if (companies.length === 0) {
        companiesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏢</div>
                <h3>Nenhuma empresa cadastrada</h3>
                <p>Cadastre empresas no módulo CompanyManagement primeiro</p>
            </div>
        `;
        return;
    }

    companiesList.innerHTML = companies.map(company => `
        <div class="company-card" onclick="openCompanyProducts('${company.id}')">
            <div class="company-card-header">
                <span class="company-icon">🏢</span>
                <span class="company-status ${company.situacaoCadastral === 'ATIVA' ? 'active' : ''}">${company.situacaoCadastral}</span>
            </div>
            <h3 class="company-name">${company.nomeFantasia || company.razaoSocial}</h3>
            <p class="company-cnpj">CNPJ: ${company.cnpj}</p>
            <div class="company-details">
                <div class="company-detail-item">
                    <span>📍</span>
                    <span>${company.endereco?.cidade || 'N/A'} - ${company.endereco?.estado || 'N/A'}</span>
                </div>
                <div class="company-detail-item">
                    <span>📊</span>
                    <span>${company.porte || 'N/A'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function handleCompanySearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allCompanies.filter(company => 
        company.nomeFantasia?.toLowerCase().includes(searchTerm) ||
        company.razaoSocial?.toLowerCase().includes(searchTerm) ||
        company.cnpj?.includes(searchTerm)
    );
    renderCompanies(filtered);
}

// ============================================
// PRODUCTS MODAL
// ============================================

async function openCompanyProducts(companyId) {
    currentCompany = allCompanies.find(c => c.id === companyId);
    if (!currentCompany) return;

    // Update modal header
    document.getElementById('modalCompanyName').textContent = currentCompany.nomeFantasia || currentCompany.razaoSocial;
    document.getElementById('modalCompanyInfo').textContent = `CNPJ: ${currentCompany.cnpj}`;

    // Load products and services
    await Promise.all([
        loadProducts(companyId),
        loadServices(companyId)
    ]);

    // Open modal
    openModal(document.getElementById('productsModal'));
}

async function loadProducts(companyId) {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        currentProducts = await getProductsByCompany(companyId);
        renderProducts(currentProducts);
    } catch (error) {
        productsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>Nenhum produto cadastrado</h3>
                <p>Adicione produtos para esta empresa</p>
            </div>
        `;
    }
}

function renderProducts(products) {
    const productsList = document.getElementById('productsList');

    if (products.length === 0) {
        productsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>Nenhum produto cadastrado</h3>
                <p>Clique em "Novo Produto" para adicionar</p>
            </div>
        `;
        return;
    }

    productsList.innerHTML = products.map(product => {
        const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
        const tagsHtml = product.tags && product.tags.length > 0 
            ? product.tags.map(tag => `<span class="item-category">${tag}</span>`).join(' ')
            : '';
        
        return `
            <div class="item-card">
                ${firstImage ? `
                    <div style="width: 100px; height: 100px; margin-right: 1rem; flex-shrink: 0;">
                        <img src="${firstImage}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    </div>
                ` : ''}
                <div class="item-info" style="flex: 1;">
                    <div class="item-header">
                        <span class="item-name">${product.name}</span>
                        ${product.code ? `<span class="item-code">SKU: ${product.code}</span>` : ''}
                        <span class="item-category">${product.category}</span>
                        <span class="item-status ${product.status === 'ATIVO' ? 'active' : 'inactive'}">${product.status}</span>
                    </div>
                    ${product.description ? `<p class="item-description">${product.description}</p>` : ''}
                    ${tagsHtml ? `<div style="margin: 0.5rem 0;">${tagsHtml}</div>` : ''}
                    <div class="item-details">
                        <div class="item-detail">
                            <span class="item-detail-label">Preço</span>
                            <span class="item-detail-value price">R$ ${parseFloat(product.price).toFixed(2)}</span>
                        </div>
                        ${product.barcode ? `
                        <div class="item-detail">
                            <span class="item-detail-label">Código de Barras</span>
                            <span class="item-detail-value">${product.barcode}</span>
                        </div>
                        ` : ''}
                        ${product.images ? `
                        <div class="item-detail">
                            <span class="item-detail-label">Imagens</span>
                            <span class="item-detail-value">📸 ${product.images.length}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editProduct('${product.id}')">✏️ Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteProduct('${product.id}', '${product.name}')">🗑️ Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

function handleProductSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = currentProducts.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.code?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    renderProducts(filtered);
}

// ============================================
// SERVICES
// ============================================

async function loadServices(companyId) {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        currentServices = await getServicesByCompany(companyId);
        renderServices(currentServices);
    } catch (error) {
        servicesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛠️</div>
                <h3>Nenhum serviço cadastrado</h3>
                <p>Adicione serviços para esta empresa</p>
            </div>
        `;
    }
}

function renderServices(services) {
    const servicesList = document.getElementById('servicesList');

    if (services.length === 0) {
        servicesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛠️</div>
                <h3>Nenhum serviço cadastrado</h3>
                <p>Clique em "Novo Serviço" para adicionar</p>
            </div>
        `;
        return;
    }

    servicesList.innerHTML = services.map(service => `
        <div class="item-card">
            <div class="item-info">
                <div class="item-header">
                    <span class="item-name">${service.name}</span>
                    ${service.code ? `<span class="item-code">Código: ${service.code}</span>` : ''}
                    <span class="item-category">${service.category}</span>
                    <span class="item-status ${service.status === 'ATIVO' ? 'active' : 'inactive'}">${service.status}</span>
                </div>
                ${service.description ? `<p class="item-description">${service.description}</p>` : ''}
                <div class="item-details">
                    <div class="item-detail">
                        <span class="item-detail-label">Preço</span>
                        <span class="item-detail-value price">R$ ${parseFloat(service.price).toFixed(2)}</span>
                    </div>
                    ${service.duration ? `
                    <div class="item-detail">
                        <span class="item-detail-label">Duração</span>
                        <span class="item-detail-value">${service.duration}h</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editService('${service.id}')">✏️ Editar</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteService('${service.id}', '${service.name}')">🗑️ Excluir</button>
            </div>
        </div>
    `).join('');
}

function handleServiceSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = currentServices.filter(service => 
        service.name?.toLowerCase().includes(searchTerm) ||
        service.code?.toLowerCase().includes(searchTerm) ||
        service.category?.toLowerCase().includes(searchTerm)
    );
    renderServices(filtered);
}

// ============================================
// PRODUCT FORM
// ============================================

function openProductForm(product = null) {
    editingProduct = product;
    const form = document.getElementById('productForm');
    const title = document.getElementById('productFormTitle');

    // Reset states
    productTags = [];
    productImages = [];

    if (product) {
        title.textContent = 'Editar Produto';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productCode').value = product.code || '';
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStatus').value = product.status;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productBarcode').value = product.barcode || '';
        document.getElementById('productQrcode').value = product.qrcode || '';
        
        // Load tags
        productTags = product.tags || [];
        renderTags();
        
        // Load images
        productImages = product.images || [];
        renderImages();
        
        // Preview codes if exist
        if (product.barcode) {
            generateBarcode(product.barcode, 'barcodePreview');
        }
        if (product.qrcode) {
            generateQRCode(product.qrcode, 'qrcodePreview');
        }
    } else {
        title.textContent = 'Novo Produto';
        form.reset();
        document.getElementById('productStatus').value = 'ATIVO';
        document.getElementById('tagsContainer').innerHTML = '';
        document.getElementById('imagesPreview').innerHTML = '';
        document.getElementById('barcodePreview').innerHTML = '';
        document.getElementById('qrcodePreview').innerHTML = '';
    }

    document.getElementById('productCompanyId').value = currentCompany.id;
    openModal(document.getElementById('productFormModal'));
}

function closeProductForm() {
    closeModal(document.getElementById('productFormModal'));
    document.getElementById('productForm').reset();
    editingProduct = null;
    productTags = [];
    productImages = [];
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value || null,
        code: document.getElementById('productCode').value || null,
        barcode: document.getElementById('productBarcode').value || null,
        qrcode: document.getElementById('productQrcode').value || null,
        category: document.getElementById('productCategory').value,
        tags: productTags.length > 0 ? productTags : null,
        price: parseFloat(document.getElementById('productPrice').value),
        status: document.getElementById('productStatus').value,
        images: productImages.length > 0 ? productImages : null
    };

    try {
        if (editingProduct) {
            await updateProduct(currentCompany.id, editingProduct.id, productData);
            alert('✅ Produto atualizado com sucesso!');
        } else {
            await createProduct(currentCompany.id, productData);
            alert('✅ Produto criado com sucesso!');
        }

        closeProductForm();
        await loadProducts(currentCompany.id);
    } catch (error) {
        alert('❌ Erro: ' + error.message);
    }
}

async function editProduct(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (product) {
        openProductForm(product);
    }
}

async function confirmDeleteProduct(productId, productName) {
    if (confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) {
        try {
            await deleteProduct(currentCompany.id, productId);
            alert('Produto excluído com sucesso!');
            await loadProducts(currentCompany.id);
        } catch (error) {
            alert('Erro ao excluir produto: ' + error.message);
        }
    }
}

// ============================================
// SERVICE FORM
// ============================================

function openServiceForm(service = null) {
    editingService = service;
    const form = document.getElementById('serviceForm');
    const title = document.getElementById('serviceFormTitle');

    if (service) {
        title.textContent = 'Editar Serviço';
        document.getElementById('serviceId').value = service.id;
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceCode').value = service.code || '';
        document.getElementById('serviceCategory').value = service.category;
        document.getElementById('serviceDescription').value = service.description || '';
        document.getElementById('servicePrice').value = service.price;
        document.getElementById('serviceDuration').value = service.duration || '';
        document.getElementById('serviceStatus').value = service.status;
    } else {
        title.textContent = 'Novo Serviço';
        form.reset();
        document.getElementById('serviceStatus').value = 'ATIVO';
    }

    document.getElementById('serviceCompanyId').value = currentCompany.id;
    openModal(document.getElementById('serviceFormModal'));
}

function closeServiceForm() {
    closeModal(document.getElementById('serviceFormModal'));
    document.getElementById('serviceForm').reset();
    editingService = null;
}

async function handleServiceSubmit(e) {
    e.preventDefault();

    const serviceData = {
        name: document.getElementById('serviceName').value,
        code: document.getElementById('serviceCode').value || null,
        category: document.getElementById('serviceCategory').value,
        description: document.getElementById('serviceDescription').value || null,
        price: parseFloat(document.getElementById('servicePrice').value),
        duration: parseFloat(document.getElementById('serviceDuration').value) || null,
        status: document.getElementById('serviceStatus').value
    };

    try {
        if (editingService) {
            await updateService(currentCompany.id, editingService.id, serviceData);
            alert('Serviço atualizado com sucesso!');
        } else {
            await createService(currentCompany.id, serviceData);
            alert('Serviço criado com sucesso!');
        }

        closeServiceForm();
        await loadServices(currentCompany.id);
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

async function editService(serviceId) {
    const service = currentServices.find(s => s.id === serviceId);
    if (service) {
        openServiceForm(service);
    }
}

async function confirmDeleteService(serviceId, serviceName) {
    if (confirm(`Tem certeza que deseja excluir o serviço "${serviceName}"?`)) {
        try {
            await deleteService(currentCompany.id, serviceId);
            alert('Serviço excluído com sucesso!');
            await loadServices(currentCompany.id);
        } catch (error) {
            alert('Erro ao excluir serviço: ' + error.message);
        }
    }
}

// ============================================
// TABS
// ============================================

function handleTabChange(e) {
    const tabName = e.target.dataset.tab;

    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// ============================================
// MODAL UTILITIES
// ============================================

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// TAGS MANAGEMENT
// ============================================

function handleTagInput(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(e.target.value.trim());
        e.target.value = '';
    }
}

function addTag(tagText) {
    if (!tagText || tagText === '' || tagText === ',') return;
    
    // Remover vírgula se existir
    tagText = tagText.replace(',', '').trim();
    
    if (productTags.includes(tagText)) {
        alert('Tag já adicionada');
        return;
    }
    
    productTags.push(tagText);
    renderTags();
}

function removeTag(tagText) {
    productTags = productTags.filter(t => t !== tagText);
    renderTags();
}

function renderTags() {
    const container = document.getElementById('tagsContainer');
    container.innerHTML = productTags.map(tag => `
        <span class="tag">
            ${tag}
            <span class="tag-remove" onclick="removeTag('${tag}')">×</span>
        </span>
    `).join('');
}

// ============================================
// IMAGES MANAGEMENT
// ============================================

function handleImageSelect(e) {
    const files = Array.from(e.target.files);
    addImages(files);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addImages(files);
}

function addImages(files) {
    if (productImages.length + files.length > 10) {
        alert('Máximo de 10 imagens permitidas');
        return;
    }
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            productImages.push(e.target.result);
            renderImages();
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(index) {
    productImages.splice(index, 1);
    renderImages();
}

function setMainImage(index) {
    const image = productImages[index];
    productImages.splice(index, 1);
    productImages.unshift(image);
    renderImages();
}

function renderImages() {
    const container = document.getElementById('imagesPreview');
    
    if (productImages.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = productImages.map((img, index) => `
        <div class="image-preview-item ${index === 0 ? 'image-preview-main' : ''}" 
             onclick="setMainImage(${index})" 
             title="${index === 0 ? 'Imagem principal' : 'Clique para definir como principal'}">
            <img src="${img}" alt="Imagem ${index + 1}">
            <button type="button" class="image-preview-remove" onclick="event.stopPropagation(); removeImage(${index})">
                ×
            </button>
        </div>
    `).join('');
}

// ============================================
// CODES MANAGEMENT
// ============================================

function handleGenerateBarcode() {
    const input = document.getElementById('productBarcode');
    const code = generateBarcode(input.value || '', 'barcodePreview');
    
    if (code) {
        input.value = code;
    }
}

function handleGenerateQrcode() {
    const input = document.getElementById('productQrcode');
    const productName = document.getElementById('productName').value;
    const code = document.getElementById('productCode').value;
    
    // Gerar QR Code com informações do produto
    const qrData = JSON.stringify({
        name: productName,
        code: code,
        timestamp: new Date().toISOString()
    });
    
    const generatedCode = generateQRCode(qrData, 'qrcodePreview');
    
    if (generatedCode) {
        input.value = generatedCode;
    }
}

function scanCode(type) {
    currentScannerType = type;
    
    startScanner(type, (scannedCode) => {
        if (type === 'barcode') {
            document.getElementById('productBarcode').value = scannedCode;
            generateBarcode(scannedCode, 'barcodePreview');
        } else {
            document.getElementById('productQrcode').value = scannedCode;
            generateQRCode(scannedCode, 'qrcodePreview');
        }
    });
}
