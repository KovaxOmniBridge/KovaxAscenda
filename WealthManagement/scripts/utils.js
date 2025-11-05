// Formatação de moeda
function formatCurrency(value) {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Formatação de data
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
}

// Toast notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Tradução de tipos de ativos
function translateAssetType(type) {
    const translations = {
        'STORE': '🏪 Loja',
        'WAREHOUSE': '📦 Estoque/Depósito',
        'REAL_ESTATE': '🏢 Imóvel',
        'CLINIC': '🏥 Clínica',
        'VEHICLE': '🚗 Veículo',
        'EQUIPMENT': '⚙️ Equipamento',
        'FURNITURE': '🪑 Mobília',
        'OTHER': '📋 Outro'
    };
    return translations[type] || type;
}

// Tradução de status
function translateAssetStatus(status) {
    const translations = {
        'ACTIVE': '✅ Ativo',
        'INACTIVE': '⏸️ Inativo',
        'MAINTENANCE': '🔧 Manutenção',
        'RENTED': '🔑 Alugado',
        'FOR_SALE': '💰 À Venda',
        'SOLD': '✔️ Vendido'
    };
    return translations[status] || status;
}

// Tradução de tipo de propriedade
function translateOwnershipType(type) {
    const translations = {
        'OWNED': 'Próprio',
        'RENTED': 'Alugado',
        'LEASED': 'Arrendado',
        'FINANCED': 'Financiado'
    };
    return translations[type] || type;
}

// Ícones por tipo
function getAssetIcon(type) {
    const icons = {
        'STORE': '🏪',
        'WAREHOUSE': '📦',
        'REAL_ESTATE': '🏢',
        'CLINIC': '🏥',
        'VEHICLE': '🚗',
        'EQUIPMENT': '⚙️',
        'FURNITURE': '🪑',
        'OTHER': '📋'
    };
    return icons[type] || '📦';
}

// Converter imagem para Base64
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Validar tamanho de imagem
function validateImageSize(file, maxSizeMB = 5) {
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error(`Imagem muito grande. Tamanho máximo: ${maxSizeMB}MB`);
    }
    return true;
}

// Confirmar ação
function confirmAction(message) {
    return confirm(message);
}
