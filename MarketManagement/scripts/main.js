// ============================================
// GLOBAL STATE
// ============================================

let currentCompany = null;
let allCompanies = [];
let currentProducts = [];
let currentServices = [];
let editingProduct = null;
let editingService = null;

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
        const stockClass = product.stock <= (product.minStock || 0) ? 'low-stock' : '';
        const stockIcon = product.stock <= (product.minStock || 0) ? '⚠️' : '✓';
        
        return `
            <div class="item-card">
                <div class="item-info">
                    <div class="item-header">
                        <span class="item-name">${product.name}</span>
                        ${product.code ? `<span class="item-code">SKU: ${product.code}</span>` : ''}
                        <span class="item-category">${product.category}</span>
                        <span class="item-status ${product.status === 'ATIVO' ? 'active' : 'inactive'}">${product.status}</span>
                    </div>
                    ${product.description ? `<p class="item-description">${product.description}</p>` : ''}
                    <div class="item-details">
                        <div class="item-detail">
                            <span class="item-detail-label">Preço</span>
                            <span class="item-detail-value price">R$ ${parseFloat(product.price).toFixed(2)}</span>
                        </div>
                        <div class="item-detail">
                            <span class="item-detail-label">Estoque</span>
                            <span class="item-detail-value ${stockClass}">${stockIcon} ${product.stock} ${product.unit}</span>
                        </div>
                        ${product.cost ? `
                        <div class="item-detail">
                            <span class="item-detail-label">Custo</span>
                            <span class="item-detail-value">R$ ${parseFloat(product.cost).toFixed(2)}</span>
                        </div>
                        ` : ''}
                        ${product.cost && product.price ? `
                        <div class="item-detail">
                            <span class="item-detail-label">Margem</span>
                            <span class="item-detail-value">${calculateMargin(product.cost, product.price)}%</span>
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

function calculateMargin(cost, price) {
    const margin = ((price - cost) / price) * 100;
    return margin.toFixed(1);
}

function handleProductSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = currentProducts.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.code?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm)
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

    if (product) {
        title.textContent = 'Editar Produto';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCode').value = product.code || '';
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCost').value = product.cost || '';
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productMinStock').value = product.minStock || '';
        document.getElementById('productUnit').value = product.unit;
        document.getElementById('productStatus').value = product.status;
    } else {
        title.textContent = 'Novo Produto';
        form.reset();
        document.getElementById('productStatus').value = 'ATIVO';
    }

    document.getElementById('productCompanyId').value = currentCompany.id;
    openModal(document.getElementById('productFormModal'));
}

function closeProductForm() {
    closeModal(document.getElementById('productFormModal'));
    document.getElementById('productForm').reset();
    editingProduct = null;
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('productName').value,
        code: document.getElementById('productCode').value || null,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value || null,
        price: parseFloat(document.getElementById('productPrice').value),
        cost: parseFloat(document.getElementById('productCost').value) || null,
        stock: parseInt(document.getElementById('productStock').value),
        minStock: parseInt(document.getElementById('productMinStock').value) || null,
        unit: document.getElementById('productUnit').value,
        status: document.getElementById('productStatus').value
    };

    try {
        if (editingProduct) {
            await updateProduct(currentCompany.id, editingProduct.id, productData);
            alert('Produto atualizado com sucesso!');
        } else {
            await createProduct(currentCompany.id, productData);
            alert('Produto criado com sucesso!');
        }

        closeProductForm();
        await loadProducts(currentCompany.id);
    } catch (error) {
        alert('Erro: ' + error.message);
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
