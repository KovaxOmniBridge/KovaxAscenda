// ============================================
// GLOBAL STATE
// ============================================

let allCompanies = [];
let allProducts = [];
let allServices = [];
let filteredItems = [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadData();
});

function setupEventListeners() {
    // Search
    document.getElementById('globalSearch').addEventListener('input', handleSearch);
    document.getElementById('btnSearch').addEventListener('click', handleSearch);

    // Filters
    document.getElementById('filterType').addEventListener('change', applyFilters);
    document.getElementById('filterCategory').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
    document.getElementById('btnClearFilters').addEventListener('click', clearFilters);
}

// ============================================
// DATA LOADING
// ============================================

async function loadData() {
    showLoading(true);
    
    try {
        // Load all data in parallel
        const [companies, products, services] = await Promise.all([
            getAllCompanies(),
            getAllProducts(),
            getAllServices()
        ]);

        allCompanies = companies;
        allProducts = products;
        allServices = services;

        // Update statistics
        updateStatistics();

        // Populate categories filter
        populateCategories();

        // Render companies
        renderCompanies();

        // Combine and render items
        combineAndRenderItems();

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showError('Erro ao carregar os dados. Por favor, tente novamente.');
    } finally {
        showLoading(false);
    }
}

function updateStatistics() {
    document.getElementById('totalProducts').textContent = allProducts.length;
    document.getElementById('totalServices').textContent = allServices.length;
    document.getElementById('totalCompanies').textContent = allCompanies.length;

    // Count unique categories
    const categories = new Set();
    allProducts.forEach(p => p.category && categories.add(p.category));
    allServices.forEach(s => s.category && categories.add(s.category));
    document.getElementById('totalCategories').textContent = categories.size;
}

function populateCategories() {
    const categorySelect = document.getElementById('filterCategory');
    const categories = new Set();

    allProducts.forEach(p => p.category && categories.add(p.category));
    allServices.forEach(s => s.category && categories.add(s.category));

    const sortedCategories = Array.from(categories).sort();
    
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function combineAndRenderItems() {
    // Combine products and services
    const productsWithType = allProducts.map(p => ({ ...p, type: 'product' }));
    const servicesWithType = allServices.map(s => ({ ...s, type: 'service' }));
    
    filteredItems = [...productsWithType, ...servicesWithType];
    
    applyFilters();
}

// ============================================
// RENDERING
// ============================================

function renderCompanies() {
    const container = document.getElementById('companiesList');
    
    if (allCompanies.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhuma empresa cadastrada</p>';
        return;
    }

    container.innerHTML = allCompanies.map(company => {
        const productCount = allProducts.filter(p => p.companyId === company.id).length;
        const serviceCount = allServices.filter(s => s.companyId === company.id).length;

        return `
            <a href="../IndividualMarket/index.html?company=${company.id}" class="company-card">
                <div class="company-header">
                    <div class="company-logo">🏢</div>
                    <div class="company-info">
                        <h3>${company.name}</h3>
                        <p>${company.cnpj || 'CNPJ não informado'}</p>
                    </div>
                </div>
                <div class="company-stats">
                    <div class="company-stat">
                        📦 <strong>${productCount}</strong> produtos
                    </div>
                    <div class="company-stat">
                        🛠️ <strong>${serviceCount}</strong> serviços
                    </div>
                </div>
            </a>
        `;
    }).join('');
}

function renderItems(items) {
    const container = document.getElementById('itemsList');
    
    if (items.length === 0) {
        showEmptyState(true);
        container.innerHTML = '';
        return;
    }

    showEmptyState(false);

    container.innerHTML = items.map(item => {
        const company = allCompanies.find(c => c.id === item.companyId);
        const companyName = company ? company.name : 'Empresa não encontrada';
        
        // Get first image if available
        let imageHtml = '<div class="item-image">📦</div>';
        if (item.images && item.images.length > 0) {
            imageHtml = `<div class="item-image"><img src="${item.images[0]}" alt="${item.name}"></div>`;
        }

        // Format price
        const price = item.price ? `R$ ${parseFloat(item.price).toFixed(2)}` : 'Sob consulta';

        return `
            <div class="item-card">
                ${imageHtml}
                <span class="item-type-badge">${item.type === 'product' ? '📦 Produto' : '🛠️ Serviço'}</span>
                <div class="item-content">
                    <div class="item-company">🏢 ${companyName}</div>
                    <h3 class="item-title">${item.name}</h3>
                    ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                    ${item.category ? `<span class="item-category">${item.category}</span>` : ''}
                    <div class="item-footer">
                        <div class="item-price">${price}</div>
                        <span class="item-status ${item.status === 'active' ? 'active' : 'inactive'}">
                            ${item.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// FILTERS & SEARCH
// ============================================

function handleSearch() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('globalSearch').value.toLowerCase();
    const typeFilter = document.getElementById('filterType').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const sortBy = document.getElementById('sortBy').value;

    // Filter items
    let filtered = filteredItems.filter(item => {
        // Search filter
        const matchesSearch = !searchTerm || 
            item.name.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm)) ||
            (item.category && item.category.toLowerCase().includes(searchTerm));

        // Type filter
        const matchesType = !typeFilter || item.type === typeFilter;

        // Category filter
        const matchesCategory = !categoryFilter || item.category === categoryFilter;

        return matchesSearch && matchesType && matchesCategory;
    });

    // Sort items
    filtered = sortItems(filtered, sortBy);

    renderItems(filtered);
}

function sortItems(items, sortBy) {
    const sorted = [...items];

    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        case 'price-asc':
            return sorted.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        case 'price-desc':
            return sorted.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

function clearFilters() {
    document.getElementById('globalSearch').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('sortBy').value = 'newest';
    applyFilters();
}

// ============================================
// UI HELPERS
// ============================================

function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'block' : 'none';
}

function showEmptyState(show) {
    const emptyState = document.getElementById('emptyState');
    emptyState.style.display = show ? 'block' : 'none';
}

function showError(message) {
    alert(message);
}
