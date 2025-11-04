// Obter ID da empresa da URL
const urlParams = new URLSearchParams(window.location.search);
const companyId = urlParams.get('company');

// Verificar se o ID da empresa foi fornecido
if (!companyId) {
    showError('ID da empresa não foi fornecido');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

/**
 * Seleciona o modo de edição e redireciona para o editor apropriado
 */
function selectMode(mode) {
    if (!companyId) {
        showError('ID da empresa não encontrado');
        return;
    }

    // Animação de transição
    const selectedCard = document.querySelector(`.${mode}-mode`);
    selectedCard.style.transform = 'scale(1.05)';
    selectedCard.style.opacity = '0.7';

    setTimeout(() => {
        if (mode === 'simple') {
            // Redirecionar para o editor simples (atual)
            window.location.href = `site-editor.html?company=${companyId}&mode=simple`;
        } else if (mode === 'advanced') {
            // Redirecionar para o editor avançado (low-code)
            window.location.href = `site-editor-advanced.html?company=${companyId}&mode=advanced`;
        }
    }, 300);
}

/**
 * Mostra mensagem de erro
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: #FEE2E2;
        color: #991B1B;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    errorDiv.textContent = `❌ ${message}`;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Salvar preferência de modo no localStorage
window.addEventListener('beforeunload', () => {
    const selectedMode = new URLSearchParams(window.location.search).get('mode');
    if (selectedMode) {
        localStorage.setItem(`siteEditorMode_${companyId}`, selectedMode);
    }
});
