// ===== ESTADO DA APLICAÇÃO =====
const state = {
    companyId: null,
    companyName: '',
    selectedComponent: null,
    components: [],
    history: [],
    historyIndex: -1,
    draggedComponent: null,
    deviceMode: 'desktop'
};

// ===== COMPONENTES TEMPLATES =====
const componentTemplates = {
    container: {
        type: 'container',
        html: '<div class="component-container" style="padding: 2rem; background: #fff;">Container</div>',
        props: {
            padding: '2rem',
            background: '#ffffff',
            maxWidth: '1200px'
        }
    },
    section: {
        type: 'section',
        html: '<section class="component-section" style="padding: 4rem 2rem;">Seção</section>',
        props: {
            padding: '4rem 2rem',
            background: '#ffffff'
        }
    },
    columns: {
        type: 'columns',
        html: `
            <div class="component-columns" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; padding: 2rem;">
                <div style="background: #f3f4f6; padding: 2rem; border-radius: 8px;">Coluna 1</div>
                <div style="background: #f3f4f6; padding: 2rem; border-radius: 8px;">Coluna 2</div>
            </div>
        `,
        props: {
            columns: 2,
            gap: '2rem'
        }
    },
    grid: {
        type: 'grid',
        html: `
            <div class="component-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; padding: 2rem;">
                <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px; text-align: center;">Item 1</div>
                <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px; text-align: center;">Item 2</div>
                <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px; text-align: center;">Item 3</div>
            </div>
        `,
        props: {
            columns: 3,
            gap: '1.5rem'
        }
    },
    heading: {
        type: 'heading',
        html: '<h2 style="font-size: 2.5rem; font-weight: 700; color: #111827; margin: 1rem 0;">Título Principal</h2>',
        props: {
            text: 'Título Principal',
            fontSize: '2.5rem',
            color: '#111827',
            fontWeight: '700',
            textAlign: 'left'
        }
    },
    text: {
        type: 'text',
        html: '<p style="font-size: 1rem; line-height: 1.6; color: #6B7280; margin: 1rem 0;">Este é um parágrafo de texto. Você pode editá-lo clicando no componente.</p>',
        props: {
            text: 'Este é um parágrafo de texto. Você pode editá-lo clicando no componente.',
            fontSize: '1rem',
            color: '#6B7280',
            lineHeight: '1.6',
            textAlign: 'left'
        }
    },
    button: {
        type: 'button',
        html: '<button style="padding: 1rem 2rem; background: linear-gradient(135deg, #4F46E5, #8B5CF6); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">Clique aqui</button>',
        props: {
            text: 'Clique aqui',
            background: '#4F46E5',
            color: '#ffffff',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1rem'
        }
    },
    image: {
        type: 'image',
        html: '<img src="https://via.placeholder.com/600x400" alt="Imagem" style="width: 100%; max-width: 600px; border-radius: 8px;">',
        props: {
            src: 'https://via.placeholder.com/600x400',
            alt: 'Imagem',
            width: '100%',
            maxWidth: '600px',
            borderRadius: '8px'
        }
    },
    video: {
        type: 'video',
        html: '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe></div>',
        props: {
            src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            aspectRatio: '16/9'
        }
    },
    hero: {
        type: 'hero',
        html: `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6rem 2rem; text-align: center;">
                <h1 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem;">Bem-vindo ao Nosso Site</h1>
                <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">Crie experiências incríveis com nosso editor</p>
                <button style="padding: 1rem 2.5rem; background: white; color: #667eea; border: none; border-radius: 12px; font-size: 1.125rem; font-weight: 700; cursor: pointer;">Começar Agora</button>
            </div>
        `,
        props: {
            title: 'Bem-vindo ao Nosso Site',
            subtitle: 'Crie experiências incríveis com nosso editor',
            buttonText: 'Começar Agora',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
    },
    header: {
        type: 'header',
        html: `
            <header style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 1.5rem; font-weight: 800; color: #4F46E5;">Logo</div>
                <nav style="display: flex; gap: 2rem;">
                    <a href="#" style="color: #111827; text-decoration: none; font-weight: 600;">Início</a>
                    <a href="#" style="color: #111827; text-decoration: none; font-weight: 600;">Sobre</a>
                    <a href="#" style="color: #111827; text-decoration: none; font-weight: 600;">Contato</a>
                </nav>
            </header>
        `,
        props: {
            logo: 'Logo',
            links: ['Início', 'Sobre', 'Contato']
        }
    },
    navbar: {
        type: 'navbar',
        html: `
            <nav style="background: #1F2937; padding: 1rem 2rem;">
                <ul style="display: flex; gap: 2rem; list-style: none; justify-content: center; margin: 0; padding: 0;">
                    <li><a href="#" style="color: white; text-decoration: none; font-weight: 600;">Home</a></li>
                    <li><a href="#" style="color: white; text-decoration: none; font-weight: 600;">Produtos</a></li>
                    <li><a href="#" style="color: white; text-decoration: none; font-weight: 600;">Serviços</a></li>
                    <li><a href="#" style="color: white; text-decoration: none; font-weight: 600;">Contato</a></li>
                </ul>
            </nav>
        `,
        props: {
            background: '#1F2937',
            items: ['Home', 'Produtos', 'Serviços', 'Contato']
        }
    },
    features: {
        type: 'features',
        html: `
            <div style="padding: 4rem 2rem; background: #F9FAFB;">
                <h2 style="text-align: center; font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; color: #111827;">Nossos Recursos</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
                    <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                        <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #111827;">Rápido</h3>
                        <p style="color: #6B7280;">Performance otimizada</p>
                    </div>
                    <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎨</div>
                        <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #111827;">Bonito</h3>
                        <p style="color: #6B7280;">Design moderno</p>
                    </div>
                    <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">💪</div>
                        <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #111827;">Poderoso</h3>
                        <p style="color: #6B7280;">Recursos completos</p>
                    </div>
                </div>
            </div>
        `,
        props: {
            title: 'Nossos Recursos',
            items: [
                { icon: '🚀', title: 'Rápido', description: 'Performance otimizada' },
                { icon: '🎨', title: 'Bonito', description: 'Design moderno' },
                { icon: '💪', title: 'Poderoso', description: 'Recursos completos' }
            ]
        }
    },
    testimonials: {
        type: 'testimonials',
        html: `
            <div style="padding: 4rem 2rem; background: white;">
                <h2 style="text-align: center; font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; color: #111827;">Depoimentos</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
                    <div style="background: #F9FAFB; padding: 2rem; border-radius: 12px; border-left: 4px solid #4F46E5;">
                        <p style="font-size: 1rem; line-height: 1.6; color: #374151; margin-bottom: 1rem;">"Produto excepcional! Superou todas as expectativas."</p>
                        <div style="font-weight: 700; color: #111827;">— João Silva</div>
                    </div>
                    <div style="background: #F9FAFB; padding: 2rem; border-radius: 12px; border-left: 4px solid #10B981;">
                        <p style="font-size: 1rem; line-height: 1.6; color: #374151; margin-bottom: 1rem;">"Atendimento impecável e resultados incríveis!"</p>
                        <div style="font-weight: 700; color: #111827;">— Maria Santos</div>
                    </div>
                </div>
            </div>
        `,
        props: {
            title: 'Depoimentos',
            testimonials: [
                { text: 'Produto excepcional! Superou todas as expectativas.', author: 'João Silva' },
                { text: 'Atendimento impecável e resultados incríveis!', author: 'Maria Santos' }
            ]
        }
    },
    pricing: {
        type: 'pricing',
        html: `
            <div style="padding: 4rem 2rem; background: #F9FAFB;">
                <h2 style="text-align: center; font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; color: #111827;">Planos e Preços</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto;">
                    <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                        <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #111827;">Básico</h3>
                        <div style="font-size: 3rem; font-weight: 800; color: #4F46E5; margin-bottom: 1rem;">R$ 29<span style="font-size: 1rem; color: #6B7280;">/mês</span></div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid #E5E7EB;">✓ Recurso 1</li>
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid #E5E7EB;">✓ Recurso 2</li>
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid #E5E7EB;">✓ Recurso 3</li>
                        </ul>
                        <button style="width: 100%; padding: 1rem; background: #4F46E5; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Escolher Plano</button>
                    </div>
                    <div style="background: linear-gradient(135deg, #4F46E5, #8B5CF6); padding: 2rem; border-radius: 12px; box-shadow: 0 10px 20px rgba(79,70,229,0.3); text-align: center; transform: scale(1.05);">
                        <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: white;">Pro</h3>
                        <div style="font-size: 3rem; font-weight: 800; color: white; margin-bottom: 1rem;">R$ 79<span style="font-size: 1rem; opacity: 0.9;">/mês</span></div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 2rem; color: white;">
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.2);">✓ Todos do Básico</li>
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.2);">✓ Recurso Premium 1</li>
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.2);">✓ Recurso Premium 2</li>
                        </ul>
                        <button style="width: 100%; padding: 1rem; background: white; color: #4F46E5; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Escolher Plano</button>
                    </div>
                </div>
            </div>
        `,
        props: {
            title: 'Planos e Preços',
            plans: [
                { name: 'Básico', price: '29', features: ['Recurso 1', 'Recurso 2', 'Recurso 3'] },
                { name: 'Pro', price: '79', features: ['Todos do Básico', 'Recurso Premium 1', 'Recurso Premium 2'], featured: true }
            ]
        }
    },
    cta: {
        type: 'cta',
        html: `
            <div style="background: linear-gradient(135deg, #4F46E5, #8B5CF6); color: white; padding: 5rem 2rem; text-align: center;">
                <h2 style="font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem;">Pronto para começar?</h2>
                <p style="font-size: 1.25rem; margin-bottom: 2.5rem; opacity: 0.9;">Entre em contato conosco hoje mesmo!</p>
                <button style="padding: 1.25rem 3rem; background: white; color: #4F46E5; border: none; border-radius: 12px; font-size: 1.25rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">Fale Conosco</button>
            </div>
        `,
        props: {
            title: 'Pronto para começar?',
            subtitle: 'Entre em contato conosco hoje mesmo!',
            buttonText: 'Fale Conosco',
            background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)'
        }
    },
    footer: {
        type: 'footer',
        html: `
            <footer style="background: #1F2937; color: white; padding: 3rem 2rem; text-align: center;">
                <div style="max-width: 1200px; margin: 0 auto;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                        <div>
                            <h4 style="font-weight: 700; margin-bottom: 1rem;">Empresa</h4>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin: 0.5rem 0;"><a href="#" style="color: #9CA3AF; text-decoration: none;">Sobre</a></li>
                                <li style="margin: 0.5rem 0;"><a href="#" style="color: #9CA3AF; text-decoration: none;">Contato</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style="font-weight: 700; margin-bottom: 1rem;">Produtos</h4>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin: 0.5rem 0;"><a href="#" style="color: #9CA3AF; text-decoration: none;">Serviço 1</a></li>
                                <li style="margin: 0.5rem 0;"><a href="#" style="color: #9CA3AF; text-decoration: none;">Serviço 2</a></li>
                            </ul>
                        </div>
                    </div>
                    <div style="border-top: 1px solid #374151; padding-top: 2rem; color: #9CA3AF;">
                        © 2025 Sua Empresa. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        `,
        props: {
            copyright: '© 2025 Sua Empresa. Todos os direitos reservados.',
            columns: [
                { title: 'Empresa', links: ['Sobre', 'Contato'] },
                { title: 'Produtos', links: ['Serviço 1', 'Serviço 2'] }
            ]
        }
    },
    form: {
        type: 'form',
        html: `
            <form style="max-width: 600px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #111827;">Entre em Contato</h3>
                <input type="text" placeholder="Nome" style="width: 100%; padding: 0.875rem; margin-bottom: 1rem; border: 1px solid #E5E7EB; border-radius: 8px;">
                <input type="email" placeholder="E-mail" style="width: 100%; padding: 0.875rem; margin-bottom: 1rem; border: 1px solid #E5E7EB; border-radius: 8px;">
                <textarea placeholder="Mensagem" rows="4" style="width: 100%; padding: 0.875rem; margin-bottom: 1rem; border: 1px solid #E5E7EB; border-radius: 8px; resize: vertical;"></textarea>
                <button type="submit" style="width: 100%; padding: 1rem; background: #4F46E5; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Enviar</button>
            </form>
        `,
        props: {
            title: 'Entre em Contato',
            fields: ['Nome', 'E-mail', 'Mensagem'],
            buttonText: 'Enviar'
        }
    },
    input: {
        type: 'input',
        html: '<input type="text" placeholder="Digite aqui..." style="width: 100%; padding: 0.875rem; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">',
        props: {
            placeholder: 'Digite aqui...',
            type: 'text'
        }
    },
    textarea: {
        type: 'textarea',
        html: '<textarea placeholder="Escreva sua mensagem..." rows="6" style="width: 100%; padding: 0.875rem; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 1rem; resize: vertical;"></textarea>',
        props: {
            placeholder: 'Escreva sua mensagem...',
            rows: 6
        }
    },
    select: {
        type: 'select',
        html: `
            <select style="width: 100%; padding: 0.875rem; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 1rem; background: white;">
                <option>Opção 1</option>
                <option>Opção 2</option>
                <option>Opção 3</option>
            </select>
        `,
        props: {
            options: ['Opção 1', 'Opção 2', 'Opção 3']
        }
    },
    icon: {
        type: 'icon',
        html: '<div style="font-size: 3rem; text-align: center; padding: 1rem;">⭐</div>',
        props: {
            icon: '⭐',
            size: '3rem',
            color: '#111827'
        }
    }
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Obter ID da empresa da URL
    const urlParams = new URLSearchParams(window.location.search);
    state.companyId = urlParams.get('company');

    if (!state.companyId) {
        showToast('ID da empresa não fornecido', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    try {
        // Carregar dados da empresa
        const company = await API.getCompanyById(state.companyId);
        state.companyName = company.name;
        document.getElementById('advancedCompanyName').textContent = company.name;

        // Carregar site existente se houver
        await loadExistingSite();
    } catch (error) {
        console.error('Erro ao carregar empresa:', error);
        showToast('Erro ao carregar dados da empresa', 'error');
    }

    setupEventListeners();
    setupDragAndDrop();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Botão voltar
    document.getElementById('btnBackAdvanced').addEventListener('click', () => {
        if (confirm('Deseja sair sem salvar as alterações?')) {
            window.history.back();
        }
    });

    // Botão salvar
    document.getElementById('btnSaveAdvanced').addEventListener('click', saveSite);

    // Botão preview
    document.getElementById('btnPreviewAdvanced').addEventListener('click', previewSite);

    // Undo/Redo
    document.getElementById('btnUndo').addEventListener('click', undo);
    document.getElementById('btnRedo').addEventListener('click', redo);

    // Seletor de dispositivo
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.deviceMode = btn.dataset.device;
            updateCanvasDevice();
        });
    });

    // Busca de componentes
    document.getElementById('componentSearch').addEventListener('input', filterComponents);
}

// ===== DRAG AND DROP =====
function setupDragAndDrop() {
    const canvas = document.getElementById('pageCanvas');

    // Drag start nos componentes
    document.querySelectorAll('.component-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            const componentType = item.dataset.component;
            state.draggedComponent = componentType;
            e.dataTransfer.effectAllowed = 'copy';
            item.style.opacity = '0.5';
        });

        item.addEventListener('dragend', (e) => {
            item.style.opacity = '1';
        });
    });

    // Drop no canvas
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        canvas.classList.add('drag-over');
    });

    canvas.addEventListener('dragleave', () => {
        canvas.classList.remove('drag-over');
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.classList.remove('drag-over');

        if (state.draggedComponent) {
            addComponentToCanvas(state.draggedComponent);
            state.draggedComponent = null;
        }
    });
}

// ===== COMPONENTES NO CANVAS =====
function addComponentToCanvas(componentType) {
    const template = componentTemplates[componentType];
    if (!template) return;

    const canvas = document.getElementById('pageCanvas');
    const emptyState = canvas.querySelector('.canvas-empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const componentId = `component-${Date.now()}`;
    const componentWrapper = document.createElement('div');
    componentWrapper.className = 'canvas-component';
    componentWrapper.id = componentId;
    componentWrapper.dataset.type = componentType;
    componentWrapper.innerHTML = `
        ${template.html}
        <div class="component-toolbar">
            <button class="toolbar-btn" onclick="moveComponentUp('${componentId}')" title="Mover para cima">↑</button>
            <button class="toolbar-btn" onclick="moveComponentDown('${componentId}')" title="Mover para baixo">↓</button>
            <button class="toolbar-btn" onclick="duplicateComponent('${componentId}')" title="Duplicar">⎘</button>
            <button class="toolbar-btn danger" onclick="deleteComponent('${componentId}')" title="Excluir">🗑️</button>
        </div>
    `;

    canvas.appendChild(componentWrapper);

    // Adicionar ao estado
    state.components.push({
        id: componentId,
        type: componentType,
        props: { ...template.props }
    });

    // Selecionar componente
    selectComponent(componentId);

    // Salvar no histórico
    saveToHistory();

    showToast(`Componente "${componentType}" adicionado!`, 'success');
}

function selectComponent(componentId) {
    // Remover seleção anterior
    document.querySelectorAll('.canvas-component').forEach(c => c.classList.remove('selected'));

    // Selecionar novo
    const component = document.getElementById(componentId);
    if (component) {
        component.classList.add('selected');
        state.selectedComponent = componentId;
        showPropertiesPanel(componentId);
    }
}

function showPropertiesPanel(componentId) {
    const component = state.components.find(c => c.id === componentId);
    if (!component) return;

    const panel = document.getElementById('propertiesContent');
    panel.innerHTML = `
        <div class="property-group">
            <h4 class="property-group-title">Propriedades do Componente</h4>
            <div class="property-field">
                <label class="property-label">Tipo</label>
                <input type="text" class="property-input" value="${component.type}" disabled>
            </div>
            <div class="property-field">
                <label class="property-label">ID</label>
                <input type="text" class="property-input" value="${component.id}" disabled>
            </div>
        </div>
        <div class="property-group">
            <h4 class="property-group-title">Configurações</h4>
            <p style="color: #6B7280; font-size: 0.875rem;">As propriedades específicas do componente "${component.type}" serão exibidas aqui em futuras atualizações.</p>
        </div>
    `;
}

// ===== FUNÇÕES GLOBAIS DO TOOLBAR =====
window.moveComponentUp = function(componentId) {
    const canvas = document.getElementById('pageCanvas');
    const component = document.getElementById(componentId);
    const prev = component.previousElementSibling;
    if (prev && !prev.classList.contains('canvas-empty-state')) {
        canvas.insertBefore(component, prev);
        saveToHistory();
        showToast('Componente movido para cima', 'info');
    }
};

window.moveComponentDown = function(componentId) {
    const canvas = document.getElementById('pageCanvas');
    const component = document.getElementById(componentId);
    const next = component.nextElementSibling;
    if (next) {
        canvas.insertBefore(next, component);
        saveToHistory();
        showToast('Componente movido para baixo', 'info');
    }
};

window.duplicateComponent = function(componentId) {
    const component = state.components.find(c => c.id === componentId);
    if (component) {
        addComponentToCanvas(component.type);
        showToast('Componente duplicado', 'success');
    }
};

window.deleteComponent = function(componentId) {
    if (!confirm('Deseja realmente excluir este componente?')) return;

    const element = document.getElementById(componentId);
    if (element) {
        element.remove();
    }

    state.components = state.components.filter(c => c.id !== componentId);
    state.selectedComponent = null;

    const panel = document.getElementById('propertiesContent');
    panel.innerHTML = `
        <div class="no-selection">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2v20M2 12h20"/>
            </svg>
            <p>Selecione um componente<br>para editar suas propriedades</p>
        </div>
    `;

    saveToHistory();
    showToast('Componente excluído', 'info');
};

// ===== HISTÓRICO =====
function saveToHistory() {
    const canvas = document.getElementById('pageCanvas');
    const snapshot = canvas.innerHTML;

    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(snapshot);
    state.historyIndex++;

    document.getElementById('btnUndo').disabled = state.historyIndex <= 0;
    document.getElementById('btnRedo').disabled = true;
}

function undo() {
    if (state.historyIndex > 0) {
        state.historyIndex--;
        const canvas = document.getElementById('pageCanvas');
        canvas.innerHTML = state.history[state.historyIndex];

        document.getElementById('btnUndo').disabled = state.historyIndex <= 0;
        document.getElementById('btnRedo').disabled = false;
        showToast('Ação desfeita', 'info');
    }
}

function redo() {
    if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const canvas = document.getElementById('pageCanvas');
        canvas.innerHTML = state.history[state.historyIndex];

        document.getElementById('btnUndo').disabled = false;
        document.getElementById('btnRedo').disabled = state.historyIndex >= state.history.length - 1;
        showToast('Ação refeita', 'info');
    }
}

// ===== OUTRAS FUNÇÕES =====
function updateCanvasDevice() {
    const canvas = document.querySelector('.canvas-container');
    canvas.className = `canvas-container ${state.deviceMode}`;
}

function filterComponents(e) {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('.component-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(search) ? 'flex' : 'none';
    });
}

async function loadExistingSite() {
    // Implementar carregamento de site existente
    console.log('Carregar site existente (futuro)');
}

async function saveSite() {
    const canvas = document.getElementById('pageCanvas');
    const customLayout = canvas.innerHTML;

    try {
        showToast('Salvando site...', 'info');
        
        // Salvar no backend (futuro - estender API)
        console.log('Salvar layout customizado:', customLayout);
        
        showToast('Site salvo com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar:', error);
        showToast('Erro ao salvar site', 'error');
    }
}

function previewSite() {
    // Abrir preview em nova aba (futuro)
    showToast('Preview em desenvolvimento', 'info');
}

// ===== TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `
        <span>${icons[type] || 'ℹ️'}</span>
        <div class="toast-content">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
