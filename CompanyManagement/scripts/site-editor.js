// ============================================
// SITE EDITOR - MAIN LOGIC
// ============================================

let currentCompanyId = null;
let currentSiteConfig = null;
let hasUnsavedChanges = false;

// Default sections
const defaultSections = [
    { id: 'hero', name: 'Hero', visible: true, order: 1 },
    { id: 'products', name: 'Produtos', visible: true, order: 2 },
    { id: 'services', name: 'Serviços', visible: true, order: 3 },
    { id: 'about', name: 'Sobre', visible: true, order: 4 },
    { id: 'contact', name: 'Contato', visible: true, order: 5 }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Get company ID from URL
    const params = new URLSearchParams(window.location.search);
    currentCompanyId = params.get('company');

    if (!currentCompanyId) {
        alert('ID da empresa não fornecido');
        window.location.href = 'index.html';
        return;
    }

    setupEventListeners();
    loadData();
});

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Theme selection
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => selectTheme(btn.dataset.theme));
    });

    // Color pickers
    setupColorPicker('primaryColor');
    setupColorPicker('secondaryColor');
    setupColorPicker('accentColor');

    // Gradient selection
    document.querySelectorAll('.gradient-btn').forEach(btn => {
        btn.addEventListener('click', () => selectGradient(btn.dataset.gradient));
    });

    // Image uploads
    setupImageUpload('logo', 'logoInput', 'logoPreview', 'btnRemoveLogo');
    setupImageUpload('banner', 'bannerInput', 'bannerPreview', 'btnRemoveBanner');
    setupImageUpload('favicon', 'faviconInput', 'faviconPreview', 'btnRemoveFavicon');

    // Content inputs
    document.getElementById('heroTitle').addEventListener('input', markAsUnsaved);
    document.getElementById('heroDescription').addEventListener('input', markAsUnsaved);
    document.getElementById('aboutText').addEventListener('input', markAsUnsaved);
    document.getElementById('slug').addEventListener('input', updateSlugPreview);

    // Layout and font
    document.querySelectorAll('input[name="layout"]').forEach(radio => {
        radio.addEventListener('change', markAsUnsaved);
    });
    document.querySelectorAll('input[name="font"]').forEach(radio => {
        radio.addEventListener('change', markAsUnsaved);
    });

    // Social links
    ['facebook', 'instagram', 'whatsapp', 'linkedin', 'twitter', 'youtube', 'tiktok'].forEach(social => {
        document.getElementById(social).addEventListener('input', markAsUnsaved);
    });

    // Advanced
    document.getElementById('customCSS').addEventListener('input', markAsUnsaved);
    document.getElementById('isActive').addEventListener('change', markAsUnsaved);

    // Actions
    document.getElementById('btnSave').addEventListener('click', saveConfiguration);
    document.getElementById('btnPreview').addEventListener('click', openPreview);
    document.getElementById('btnReset').addEventListener('click', resetConfiguration);
    document.getElementById('btnBack').addEventListener('click', goBack);

    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// ============================================
// DATA LOADING
// ============================================

async function loadData() {
    showLoading(true);

    try {
        // Load company data
        const company = await getCompanyById(currentCompanyId);
        document.getElementById('editorCompanyName').textContent = company.name || company.nomeFantasia;

        // Try to load existing site configuration
        try {
            currentSiteConfig = await getCompanySettings(currentCompanyId);
            if (currentSiteConfig) {
                populateForm(currentSiteConfig);
            } else {
                // No configuration yet, use defaults
                populateDefaultValues();
            }
        } catch (error) {
            console.log('No site configuration found, using defaults');
            populateDefaultValues();
        }

        // Render sections list
        renderSectionsList();

        showLoading(false);
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Erro ao carregar dados da empresa');
        showLoading(false);
    }
}

function populateForm(config) {
    // Theme
    if (config.theme) {
        const themeBtn = document.querySelector(`[data-theme="${config.theme}"]`);
        if (themeBtn) {
            themeBtn.classList.add('active');
        }
    }

    // Colors
    if (config.primaryColor) {
        setColorPicker('primaryColor', config.primaryColor);
    }
    if (config.secondaryColor) {
        setColorPicker('secondaryColor', config.secondaryColor);
    }
    if (config.accentColor) {
        setColorPicker('accentColor', config.accentColor);
    }

    // Gradient
    if (config.heroGradient) {
        const gradientBtn = document.querySelector(`[data-gradient="${config.heroGradient}"]`);
        if (gradientBtn) {
            gradientBtn.classList.add('active');
        }
    }

    // Images
    if (config.logo) {
        displayImage('logoPreview', config.logo);
    }
    if (config.banner) {
        displayImage('bannerPreview', config.banner);
    }
    if (config.favicon) {
        displayImage('faviconPreview', config.favicon);
    }

    // Content
    if (config.heroTitle) {
        document.getElementById('heroTitle').value = config.heroTitle;
    }
    if (config.heroDescription) {
        document.getElementById('heroDescription').value = config.heroDescription;
    }
    if (config.aboutText) {
        document.getElementById('aboutText').value = config.aboutText;
    }
    if (config.slug) {
        document.getElementById('slug').value = config.slug;
        updateSlugPreview();
    }

    // Layout
    if (config.layout) {
        document.getElementById(`layout${capitalize(config.layout)}`).checked = true;
    }

    // Font
    if (config.font) {
        document.getElementById(`font${capitalize(config.font)}`).checked = true;
    }

    // Social links
    if (config.socialLinks) {
        Object.keys(config.socialLinks).forEach(key => {
            const input = document.getElementById(key);
            if (input && config.socialLinks[key]) {
                input.value = config.socialLinks[key];
            }
        });
    }

    // Advanced
    if (config.customCSS) {
        document.getElementById('customCSS').value = config.customCSS;
    }
    if (config.isActive !== undefined) {
        document.getElementById('isActive').checked = config.isActive;
    }

    // Sections
    if (config.sections) {
        renderSectionsList(config.sections);
    }
}

function populateDefaultValues() {
    // Set default theme
    document.querySelector('[data-theme="blue"]').classList.add('active');
    document.querySelector('[data-gradient="hero-gradient-1"]').classList.add('active');
    
    // Set default layout and font
    document.getElementById('layoutModern').checked = true;
    document.getElementById('fontModern').checked = true;

    // Sections
    renderSectionsList();
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tabName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// ============================================
// THEME & COLORS
// ============================================

function selectTheme(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    markAsUnsaved();
}

function setupColorPicker(id) {
    const colorInput = document.getElementById(id);
    const textInput = document.getElementById(`${id}Text`);

    colorInput.addEventListener('input', () => {
        textInput.value = colorInput.value;
        markAsUnsaved();
    });

    textInput.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(textInput.value)) {
            colorInput.value = textInput.value;
        }
        markAsUnsaved();
    });
}

function setColorPicker(id, value) {
    document.getElementById(id).value = value;
    document.getElementById(`${id}Text`).value = value;
}

function selectGradient(gradient) {
    document.querySelectorAll('.gradient-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-gradient="${gradient}"]`).classList.add('active');
    markAsUnsaved();
}

// ============================================
// IMAGE UPLOAD
// ============================================

function setupImageUpload(type, inputId, previewId, removeButtonId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const removeBtn = document.getElementById(removeButtonId);

    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Arquivo muito grande! Tamanho máximo: 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione uma imagem válida');
            return;
        }

        // Convert to Base64
        const base64 = await fileToBase64(file);
        displayImage(previewId, base64);
        markAsUnsaved();
    });

    removeBtn.addEventListener('click', () => {
        preview.innerHTML = '<span class="preview-placeholder">🏢</span>';
        input.value = '';
        markAsUnsaved();
    });
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function displayImage(previewId, base64) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = `<img src="${base64}" alt="Preview">`;
}

// ============================================
// SLUG
// ============================================

function updateSlugPreview() {
    const slug = document.getElementById('slug').value;
    const preview = document.getElementById('slugPreview');
    
    if (slug) {
        preview.textContent = `ascenda.com/loja/${slug}`;
    } else {
        preview.textContent = 'ascenda.com/loja/minha-empresa';
    }
}

// ============================================
// SECTIONS
// ============================================

function renderSectionsList(sections = defaultSections) {
    const container = document.getElementById('sectionsList');
    
    // Sort by order
    const sorted = [...sections].sort((a, b) => a.order - b.order);

    container.innerHTML = sorted.map(section => `
        <div class="section-item" draggable="true" data-id="${section.id}">
            <span class="section-drag">☰</span>
            <div class="section-info">
                <div class="section-name">${section.name}</div>
            </div>
            <div class="section-actions">
                <button class="btn-visibility ${section.visible ? '' : 'hidden'}" 
                        onclick="toggleSectionVisibility('${section.id}')">
                    ${section.visible ? '👁️' : '👁️‍🗨️'}
                </button>
            </div>
        </div>
    `).join('');

    // Setup drag and drop
    setupDragAndDrop();
}

function toggleSectionVisibility(sectionId) {
    const sections = getCurrentSections();
    const section = sections.find(s => s.id === sectionId);
    
    if (section) {
        section.visible = !section.visible;
        renderSectionsList(sections);
        markAsUnsaved();
    }
}

function getCurrentSections() {
    const items = document.querySelectorAll('.section-item');
    return Array.from(items).map((item, index) => {
        const id = item.dataset.id;
        const btn = item.querySelector('.btn-visibility');
        const visible = !btn.classList.contains('hidden');
        const section = defaultSections.find(s => s.id === id);
        
        return {
            id,
            name: section?.name || id,
            visible,
            order: index + 1
        };
    });
}

function setupDragAndDrop() {
    const items = document.querySelectorAll('.section-item');
    
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    
    if (draggedElement !== this) {
        const container = this.parentNode;
        const allItems = [...container.children];
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(this);

        if (draggedIndex < targetIndex) {
            this.after(draggedElement);
        } else {
            this.before(draggedElement);
        }

        markAsUnsaved();
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedElement = null;
}

// ============================================
// SAVE CONFIGURATION
// ============================================

async function saveConfiguration() {
    const saveBtn = document.getElementById('btnSave');
    const statusEl = document.querySelector('.save-status');
    
    saveBtn.disabled = true;
    statusEl.className = 'save-status saving';
    statusEl.querySelector('.status-text').textContent = 'Salvando...';

    try {
        // Gather all configuration data
        const config = {
            theme: document.querySelector('.theme-btn.active')?.dataset.theme || 'blue',
            primaryColor: document.getElementById('primaryColor').value || null,
            secondaryColor: document.getElementById('secondaryColor').value || null,
            accentColor: document.getElementById('accentColor').value || null,
            heroGradient: document.querySelector('.gradient-btn.active')?.dataset.gradient || 'hero-gradient-1',
            layout: document.querySelector('input[name="layout"]:checked').value,
            font: document.querySelector('input[name="font"]:checked').value,
            logo: getImageData('logoPreview'),
            banner: getImageData('bannerPreview'),
            favicon: getImageData('faviconPreview'),
            heroTitle: document.getElementById('heroTitle').value || null,
            heroDescription: document.getElementById('heroDescription').value || null,
            aboutText: document.getElementById('aboutText').value || null,
            slug: document.getElementById('slug').value || null,
            socialLinks: {
                facebook: document.getElementById('facebook').value || null,
                instagram: document.getElementById('instagram').value || null,
                whatsapp: document.getElementById('whatsapp').value || null,
                linkedin: document.getElementById('linkedin').value || null,
                twitter: document.getElementById('twitter').value || null,
                youtube: document.getElementById('youtube').value || null,
                tiktok: document.getElementById('tiktok').value || null
            },
            sections: getCurrentSections(),
            customCSS: document.getElementById('customCSS').value || null,
            isActive: document.getElementById('isActive').checked
        };

        // Save to API
        const response = await fetch(`http://localhost:3001/api/companies/${currentCompanyId}/site`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao salvar configurações');
        }

        currentSiteConfig = await response.json();
        hasUnsavedChanges = false;

        statusEl.className = 'save-status saved';
        statusEl.querySelector('.status-text').textContent = 'Salvo com sucesso!';

        setTimeout(() => {
            statusEl.className = 'save-status';
            statusEl.querySelector('.status-text').textContent = 'Todas as alterações salvas';
        }, 3000);

    } catch (error) {
        console.error('Error saving configuration:', error);
        alert(`Erro ao salvar: ${error.message}`);
        
        statusEl.className = 'save-status unsaved';
        statusEl.querySelector('.status-text').textContent = 'Erro ao salvar';
    } finally {
        saveBtn.disabled = false;
    }
}

function getImageData(previewId) {
    const preview = document.getElementById(previewId);
    const img = preview.querySelector('img');
    return img ? img.src : null;
}

// ============================================
// ACTIONS
// ============================================

function openPreview() {
    const url = `../IndividualMarket/index.html?company=${currentCompanyId}`;
    window.open(url, '_blank');
}

async function resetConfiguration() {
    if (!confirm('Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita.')) {
        return;
    }

    try {
        await fetch(`http://localhost:3001/api/companies/${currentCompanyId}/site`, {
            method: 'DELETE'
        });

        alert('Configurações resetadas com sucesso!');
        location.reload();
    } catch (error) {
        console.error('Error resetting configuration:', error);
        alert('Erro ao resetar configurações');
    }
}

function goBack() {
    if (hasUnsavedChanges) {
        if (!confirm('Você tem alterações não salvas. Deseja sair mesmo assim?')) {
            return;
        }
    }
    window.location.href = 'index.html';
}

// ============================================
// HELPERS
// ============================================

function markAsUnsaved() {
    hasUnsavedChanges = true;
    const statusEl = document.querySelector('.save-status');
    statusEl.className = 'save-status unsaved';
    statusEl.querySelector('.status-text').textContent = 'Alterações não salvas';
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
