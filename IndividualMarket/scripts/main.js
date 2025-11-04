// ============================================
// GLOBAL STATE
// ============================================

let currentCompany = null;
let companyProducts = [];
let companyServices = [];
let filteredItems = [];
let currentFilter = 'all';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const companyId = getCompanyIdFromURL();
    
    if (!companyId) {
        showError('ID da empresa não fornecido');
        return;
    }

    setupEventListeners();
    loadCompanyData(companyId);
});

function getCompanyIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('company');
}

function setupEventListeners() {
    // Back button
    document.getElementById('btnBackToGeneral').addEventListener('click', () => {
        window.location.href = '../GeneralMarket/index.html';
    });

    document.getElementById('btnBackToGeneralFromError')?.addEventListener('click', () => {
        window.location.href = '../GeneralMarket/index.html';
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('btnSearch').addEventListener('click', handleSearch);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            applyFilters();
        });
    });

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            scrollToSection(target);
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}

// ============================================
// DATA LOADING
// ============================================

async function loadCompanyData(companyId) {
    showLoading(true);

    try {
        // Load company, products, services, and site configuration in parallel
        const [company, products, services, siteConfig] = await Promise.all([
            getCompanyById(companyId),
            getProductsByCompany(companyId),
            getServicesByCompany(companyId),
            getCompanySettings(companyId)
        ]);

        currentCompany = company;
        companyProducts = products;
        companyServices = services;

        // Apply site configuration
        if (siteConfig) {
            applySiteConfiguration(siteConfig);
        } else {
            // Apply default theme
            applyDefaultConfiguration();
        }

        // Update UI
        updateCompanyInfo(siteConfig);
        updateStatistics();
        renderProducts();
        renderServices();
        combineAndRenderAll();

        showLoading(false);

    } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error);
        showLoading(false);
        showError('Empresa não encontrada');
    }
}

function updateCompanyInfo(siteConfig) {
    // Use custom texts if available
    const heroTitle = siteConfig?.heroTitle || `Bem-vindo à ${currentCompany.name}`;
    const heroDescription = siteConfig?.heroDescription || currentCompany.address || 'Conheça nossos produtos e serviços';
    const aboutText = siteConfig?.aboutText || `${currentCompany.name} é uma empresa comprometida em oferecer os melhores produtos e serviços para você.`;

    // Header
    document.getElementById('companyName').textContent = currentCompany.name;
    document.getElementById('pageTitle').textContent = `${currentCompany.name} - Ascenda`;
    
    // Apply logo if available
    if (siteConfig?.logo) {
        document.getElementById('companyLogoImg').innerHTML = `<img src="${siteConfig.logo}" alt="${currentCompany.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    }
    
    // Hero
    document.getElementById('heroTitle').textContent = heroTitle;
    document.getElementById('heroDescription').textContent = heroDescription;

    // Apply banner if available
    if (siteConfig?.banner) {
        const hero = document.getElementById('siteHero');
        hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${siteConfig.banner})`;
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center';
    }

    // About
    document.getElementById('aboutTitle').textContent = currentCompany.name;
    document.getElementById('aboutDescription').textContent = aboutText;
    document.getElementById('companyCnpj').textContent = currentCompany.cnpj || '-';
    document.getElementById('companyAddress').textContent = currentCompany.address || '-';
    document.getElementById('companyPhone').textContent = currentCompany.phone || '-';
    document.getElementById('companyEmail').textContent = currentCompany.email || '-';

    // Footer
    document.getElementById('footerCompanyName').textContent = currentCompany.name;
    document.getElementById('footerCompanyDescription').textContent = `Obrigado por visitar a loja online de ${currentCompany.name}`;
    document.getElementById('footerContact').textContent = currentCompany.phone || currentCompany.email || 'Entre em contato conosco';
    document.getElementById('footerYear').textContent = currentCompany.name;

    // Apply social links if available
    if (siteConfig?.socialLinks) {
        addSocialLinks(siteConfig.socialLinks);
    }

    // Configure sections visibility
    if (siteConfig?.sections) {
        configureSections(siteConfig.sections);
    }
}

function updateStatistics() {
    document.getElementById('heroProductCount').textContent = companyProducts.length;
    document.getElementById('heroServiceCount').textContent = companyServices.length;
}

// ============================================
// RENDERING
// ============================================

function renderProducts() {
    const container = document.getElementById('productsList');
    
    const activeProducts = companyProducts.filter(p => p.status === 'active');

    if (activeProducts.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum produto disponível no momento</p>';
        return;
    }

    container.innerHTML = activeProducts.map(product => renderItemCard(product, 'product')).join('');
}

function renderServices() {
    const container = document.getElementById('servicesList');
    
    const activeServices = companyServices.filter(s => s.status === 'active');

    if (activeServices.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum serviço disponível no momento</p>';
        return;
    }

    container.innerHTML = activeServices.map(service => renderItemCard(service, 'service')).join('');
}

function renderItemCard(item, type) {
    // Get first image if available
    let imageHtml = `<div class="item-image">${type === 'product' ? '📦' : '🛠️'}</div>`;
    if (item.images && item.images.length > 0) {
        imageHtml = `<div class="item-image"><img src="${item.images[0]}" alt="${item.name}"></div>`;
    }

    // Format price
    const price = item.price ? `R$ ${parseFloat(item.price).toFixed(2)}` : 'Sob consulta';

    return `
        <div class="item-card">
            ${imageHtml}
            <div class="item-content">
                <h3 class="item-title">${item.name}</h3>
                ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                ${item.category ? `<span class="item-category">${item.category}</span>` : ''}
                <div class="item-footer">
                    <div class="item-price">${price}</div>
                    <span class="item-status active">Disponível</span>
                </div>
            </div>
        </div>
    `;
}

function combineAndRenderAll() {
    const productsWithType = companyProducts.map(p => ({ ...p, type: 'product' }));
    const servicesWithType = companyServices.map(s => ({ ...s, type: 'service' }));
    
    filteredItems = [...productsWithType, ...servicesWithType].filter(item => item.status === 'active');
}

function renderFilteredItems(items) {
    // Update products section
    const products = items.filter(i => i.type === 'product');
    const productsContainer = document.getElementById('productsList');
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum produto encontrado</p>';
    } else {
        productsContainer.innerHTML = products.map(p => renderItemCard(p, 'product')).join('');
    }

    // Update services section
    const services = items.filter(i => i.type === 'service');
    const servicesContainer = document.getElementById('servicesList');
    
    if (services.length === 0) {
        servicesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum serviço encontrado</p>';
    } else {
        servicesContainer.innerHTML = services.map(s => renderItemCard(s, 'service')).join('');
    }
}

// ============================================
// FILTERS & SEARCH
// ============================================

function handleSearch() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filtered = filteredItems.filter(item => {
        // Type filter
        const matchesType = currentFilter === 'all' || item.type === currentFilter;

        // Search filter
        const matchesSearch = !searchTerm || 
            item.name.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm)) ||
            (item.category && item.category.toLowerCase().includes(searchTerm));

        return matchesType && matchesSearch;
    });

    renderFilteredItems(filtered);
}

// ============================================
// CONTACT FORM
// ============================================

function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    // Here you would typically send this to your backend
    console.log('Contact form submitted:', { name, email, message, companyId: currentCompany.id });

    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    e.target.reset();
}

// ============================================
// UI HELPERS
// ============================================

function scrollToSection(sectionId) {
    const section = document.getElementById(`${sectionId}Section`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    const mainContent = document.querySelectorAll('.hero, .filters-section, .products-section, .services-section, .about-section, .contact-section, .footer');
    
    loading.style.display = show ? 'flex' : 'none';
    mainContent.forEach(el => {
        el.style.display = show ? 'none' : 'block';
    });
}

function showError(message) {
    const errorState = document.getElementById('errorState');
    const mainContent = document.querySelectorAll('.header, .hero, .filters-section, .products-section, .services-section, .about-section, .contact-section, .footer');
    
    errorState.style.display = 'flex';
    mainContent.forEach(el => {
        el.style.display = 'none';
    });
}

// ============================================
// SITE CONFIGURATION
// ============================================

function applySiteConfiguration(config) {
    console.log('Applying site configuration:', config);

    // Apply theme
    if (config.theme) {
        window.themeManager.applyTheme({
            theme: config.theme,
            heroGradient: config.heroGradient,
            layout: config.layout,
            font: config.font
        });
    }

    // Apply custom colors
    if (config.primaryColor || config.secondaryColor || config.accentColor) {
        applyCustomColors({
            primary: config.primaryColor,
            secondary: config.secondaryColor,
            accent: config.accentColor
        });
    }

    // Apply custom CSS
    if (config.customCSS) {
        applyCustomCSS(config.customCSS);
    }

    // Apply favicon
    if (config.favicon) {
        applyFavicon(config.favicon);
    }
}

function applyDefaultConfiguration() {
    // Apply random theme for companies without configuration
    const randomTheme = window.themeManager.getRandomTheme();
    const randomGradient = window.themeManager.getRandomHeroGradient();

    window.themeManager.applyTheme({
        theme: randomTheme,
        heroGradient: randomGradient,
        layout: 'modern',
        font: 'modern'
    });
}

function applyCustomColors(colors) {
    const root = document.documentElement;

    if (colors.primary) {
        root.style.setProperty('--primary-color', colors.primary);
    }
    if (colors.secondary) {
        root.style.setProperty('--secondary-color', colors.secondary);
    }
    if (colors.accent) {
        root.style.setProperty('--accent-color', colors.accent);
    }
}

function applyCustomCSS(css) {
    // Create style element and inject custom CSS
    const styleId = 'custom-company-css';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
}

function applyFavicon(favicon) {
    let link = document.querySelector("link[rel~='icon']");
    
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    
    link.href = favicon;
}

function addSocialLinks(socialLinks) {
    // Find or create social links container in footer
    const footerSection = document.querySelector('.footer-section:last-child');
    
    if (!footerSection || !socialLinks) return;

    const socialHTML = [];

    if (socialLinks.facebook) {
        socialHTML.push(`<a href="${socialLinks.facebook}" target="_blank">📘 Facebook</a>`);
    }
    if (socialLinks.instagram) {
        socialHTML.push(`<a href="${socialLinks.instagram}" target="_blank">📷 Instagram</a>`);
    }
    if (socialLinks.whatsapp) {
        socialHTML.push(`<a href="https://wa.me/${socialLinks.whatsapp}" target="_blank">💬 WhatsApp</a>`);
    }
    if (socialLinks.linkedin) {
        socialHTML.push(`<a href="${socialLinks.linkedin}" target="_blank">💼 LinkedIn</a>`);
    }
    if (socialLinks.twitter) {
        socialHTML.push(`<a href="${socialLinks.twitter}" target="_blank">🐦 Twitter</a>`);
    }
    if (socialLinks.youtube) {
        socialHTML.push(`<a href="${socialLinks.youtube}" target="_blank">📺 YouTube</a>`);
    }
    if (socialLinks.tiktok) {
        socialHTML.push(`<a href="${socialLinks.tiktok}" target="_blank">🎵 TikTok</a>`);
    }

    if (socialHTML.length > 0) {
        const socialContainer = document.createElement('div');
        socialContainer.style.marginTop = '1rem';
        socialContainer.innerHTML = `
            <h4 style="margin-bottom: 0.5rem;">Redes Sociais</h4>
            ${socialHTML.join('')}
        `;
        footerSection.appendChild(socialContainer);
    }
}

function configureSections(sections) {
    if (!sections || !Array.isArray(sections)) return;

    // Sort sections by order
    const sortedSections = sections.sort((a, b) => a.order - b.order);

    sortedSections.forEach(section => {
        const sectionElement = document.getElementById(`${section.id}Section`);
        
        if (sectionElement) {
            // Set visibility
            if (!section.visible) {
                sectionElement.style.display = 'none';
            } else {
                sectionElement.style.display = 'block';
            }

            // Set order
            sectionElement.style.order = section.order;
        }
    });

    // Make main content use flexbox for ordering
    const mainContent = document.querySelector('body');
    if (mainContent) {
        mainContent.style.display = 'flex';
        mainContent.style.flexDirection = 'column';
    }
}
