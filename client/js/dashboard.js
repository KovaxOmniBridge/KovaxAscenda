// =====================================================/**

// DASHBOARD DO CLIENTE - ASCENDA * =====================================================

// ===================================================== * DASHBOARD - ASCENDA PLATFORM

 * =====================================================

const API_URL = 'http://localhost:3000/api'; */



// Estado Globalconst API_URL = 'http://localhost:3000/api';

const state = {

  loaded: false,// Estado Global

  user: null,const state = {

  myTools: [],  loaded: false,

  toolsByCategory: []  user: null,

};  myTools: [],

  toolsByCategory: []

// =====================================================};

// INICIALIZAÇÃO

// =====================================================/**

 * Inicialização

async function init() { */

  if (state.loaded) return;async function init() {

  state.loaded = true;  if (state.loaded) return;

  state.loaded = true;

  console.log('🚀 Inicializando dashboard do cliente...');

  console.log('🚀 Inicializando dashboard...');

  // Verificar autenticação

  const token = localStorage.getItem('token');  // Verificar autenticação

  if (!token) {  const token = localStorage.getItem('token');

    window.location.href = '../public/login.html';  if (!token) {

    return;    window.location.href = '../public/login.html';

  }    return;

  }

  // Carregar dados

  await loadUserInfo();  // Carregar dados

  await loadMyTools();  await loadUserInfo();

  await loadMyTools();

  // Event listeners

  setupEventListeners();  // Event listeners

  setupEventListeners();

  console.log('✅ Dashboard inicializado');

}  console.log('✅ Dashboard inicializado');

}

function setupEventListeners() {

  // Logoutfunction setupEventListeners() {

  document.getElementById('logout-btn')?.addEventListener('click', logout);  // Logout

}  document.getElementById('logout-btn')?.addEventListener('click', logout);

}

// =====================================================

// CARREGAR DADOS/**

// ===================================================== * Carregar informações do usuário

 */

async function loadUserInfo() {async function loadUserInfo() {

  try {  try {

    const token = localStorage.getItem('token');    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/auth/verify`, {    const response = await fetch(`${API_URL}/auth/verify`, {

      headers: {      headers: {

        'Authorization': `Bearer ${token}`        'Authorization': `Bearer ${token}`

      }      }

    });    });



    const data = await response.json();    const data = await response.json();

        

    if (data.success && data.user) {    if (data.success && data.user) {

      state.user = data.user;      state.user = data.user;

      displayUserInfo(data.user);      displayUserInfo(data.user);

    } else {    } else {

      logout();      logout();

    }    }

  } catch (error) {  } catch (error) {

    console.error('Erro ao carregar informações do usuário:', error);    console.error('Erro ao carregar informações do usuário:', error);

    logout();    logout();

  }  }

}}



async function loadMyTools() {/**

  try { * Carregar ferramentas ativas do usuário

    const token = localStorage.getItem('token'); */

    const response = await fetch(`${API_URL}/user/my-tools`, {async function loadMyTools() {

      headers: {  try {

        'Authorization': `Bearer ${token}`    const token = localStorage.getItem('token');

      }    const response = await fetch(`${API_URL}/user/my-tools`, {

    });      headers: {

        'Authorization': `Bearer ${token}`

    const data = await response.json();      }

        });

    if (data.success) {

      state.myTools = data.tools || [];    const data = await response.json();

      state.toolsByCategory = data.toolsByCategory || [];    

      renderDashboard();    if (data.success) {

    } else {      state.myTools = data.tools || [];

      showEmptyState(data.message);      state.toolsByCategory = data.toolsByCategory || [];

    }      renderDashboard();

  } catch (error) {    } else {

    console.error('Erro ao carregar ferramentas:', error);      showEmptyState(data.message);

    showError('Erro ao carregar ferramentas');    }

  }  } catch (error) {

}    console.error('Erro ao carregar ferramentas:', error);

    showError('Erro ao carregar ferramentas');

// =====================================================  }

// EXIBIÇÃO}

// =====================================================

/**

function displayUserInfo(user) { * Exibir informações do usuário

  const userInfoEl = document.getElementById('user-info'); */

  const welcomeMsg = document.getElementById('welcome-message');function displayUserInfo(user) {

    const userInfoEl = document.getElementById('user-info');

  if (userInfoEl) {  const welcomeMsg = document.getElementById('welcome-message');

    userInfoEl.innerHTML = `  

      <span class="user-name">${user.name}</span>  if (userInfoEl) {

      <span class="user-org">${user.organization?.name || ''}</span>    userInfoEl.innerHTML = `

    `;      <span class="user-name">${user.name}</span>

  }      <span class="user-org">${user.organization?.name || ''}</span>

      `;

  if (welcomeMsg) {  }

    const greeting = getGreeting();  

    welcomeMsg.textContent = `${greeting}, ${user.name}! ${  if (welcomeMsg) {

      state.myTools.length > 0     const greeting = getGreeting();

        ? 'Aqui estão suas ferramentas.'     welcomeMsg.textContent = `${greeting}, ${user.name}! ${

        : 'Configure suas ferramentas para começar.'      state.myTools.length > 0 

    }`;        ? 'Aqui estão suas ferramentas.' 

  }        : 'Configure suas ferramentas para começar.'

}    }`;

  }

function getGreeting() {}

  const hour = new Date().getHours();

  if (hour < 12) return 'Bom dia';function getGreeting() {

  if (hour < 18) return 'Boa tarde';  const hour = new Date().getHours();

  return 'Boa noite';  if (hour < 12) return 'Bom dia';

}  if (hour < 18) return 'Boa tarde';

  return 'Boa noite';

// =====================================================}

// RENDERIZAÇÃO

// =====================================================/**

 * Renderizar dashboard

function renderDashboard() { */

  const dashboardContent = document.getElementById('dashboard-content');function renderDashboard() {

    const dashboardContent = document.getElementById('dashboard-content');

  if (!dashboardContent) return;  

  if (!dashboardContent) return;

  // Se não tem ferramentas, mostrar empty state

  if (state.myTools.length === 0) {  // Se não tem ferramentas, mostrar empty state

    dashboardContent.innerHTML = `  if (state.myTools.length === 0) {

      <div class="empty-state">    dashboardContent.innerHTML = `

        <div class="empty-icon">🛠️</div>      <div class="empty-state">

        <h3>Nenhuma ferramenta ativa</h3>        <div class="empty-icon">🛠️</div>

        <p>Vá em "Minhas Ferramentas" para selecionar as ferramentas que deseja usar</p>        <h3>Nenhuma ferramenta ativa</h3>

        <a href="minhas-ferramentas.html" class="btn btn-primary">        <p>Vá em "Minhas Ferramentas" para selecionar as ferramentas que deseja usar</p>

          ⚙️ Configurar Ferramentas        <a href="minhas-ferramentas.html" class="btn btn-primary">

        </a>          ⚙️ Configurar Ferramentas

      </div>        </a>

    `;      </div>

    return;    `;

  }    return;

  }

  // Limpar conteúdo

  dashboardContent.innerHTML = '';  // Limpar conteúdo

  dashboardContent.innerHTML = '';

  // Renderizar cada categoria

  state.toolsByCategory.forEach(category => {  // Renderizar cada categoria

    const categorySection = createCategorySection(category);  state.toolsByCategory.forEach(category => {

    dashboardContent.appendChild(categorySection);    const categorySection = createCategorySection(category);

  });    dashboardContent.appendChild(categorySection);

}  });

}

function createCategorySection(category) {

  const section = document.createElement('div');/**

  section.className = 'category-section'; * Criar seção de categoria

   */

  section.innerHTML = `function createCategorySection(category) {

    <div class="category-header">  const section = document.createElement('div');

      <h2>  section.className = 'category-section';

        <span class="category-icon">${category.icon || '📦'}</span>  

        ${category.name}  section.innerHTML = `

      </h2>    <div class="category-header">

      <span class="category-count">${category.tools.length} ${      <h2>

        category.tools.length === 1 ? 'ferramenta' : 'ferramentas'        <span class="category-icon">${category.icon || '📦'}</span>

      }</span>        ${category.name}

    </div>      </h2>

    <div class="tools-grid"></div>      <span class="category-count">${category.tools.length} ${

  `;        category.tools.length === 1 ? 'ferramenta' : 'ferramentas'

      }</span>

  const grid = section.querySelector('.tools-grid');    </div>

      <div class="tools-grid"></div>

  category.tools.forEach(tool => {  `;

    const toolCard = createToolCard(tool);

    grid.appendChild(toolCard);  const grid = section.querySelector('.tools-grid');

  });  

  category.tools.forEach(tool => {

  return section;    const toolCard = createToolCard(tool);

}    grid.appendChild(toolCard);

  });

function createToolCard(tool) {

  const card = document.createElement('div');  return section;

  card.className = 'tool-card';}

  

  card.innerHTML = `/**

    <div class="tool-icon">${tool.icon || '🔧'}</div> * Criar card de ferramenta

    <h3 class="tool-name">${tool.name}</h3> */

    ${tool.description ? `function createToolCard(tool) {

      <p class="tool-description">${tool.description}</p>  const card = document.createElement('div');

    ` : ''}  card.className = 'tool-card';

    ${tool.url ? `  

      <a href="${tool.url}" target="_blank" class="tool-link btn btn-primary" rel="noopener noreferrer">  card.innerHTML = `

        Acessar →    <div class="tool-icon">${tool.icon || '🔧'}</div>

      </a>    <h3 class="tool-name">${tool.name}</h3>

    ` : ''}    ${tool.description ? `

  `;      <p class="tool-description">${tool.description}</p>

    ` : ''}

  return card;    ${tool.url ? `

}      <a href="${tool.url}" target="_blank" class="tool-link btn btn-primary">

        Acessar →

// =====================================================      </a>

// ESTADOS    ` : ''}

// =====================================================  `;



function showEmptyState(message = 'Nenhuma ferramenta disponível') {  return card;

  const dashboardContent = document.getElementById('dashboard-content');}

  if (!dashboardContent) return;

/**

  dashboardContent.innerHTML = ` * Mostrar estado vazio

    <div class="empty-state"> */

      <div class="empty-icon">🛠️</div>function showEmptyState(message = 'Nenhuma ferramenta disponível') {

      <h3>${message}</h3>  const dashboardContent = document.getElementById('dashboard-content');

      <p>Entre em contato com o administrador da sua empresa</p>  if (!dashboardContent) return;

    </div>

  `;  dashboardContent.innerHTML = `

}    <div class="empty-state">

      <div class="empty-icon">🛠️</div>

function showError(message) {      <h3>${message}</h3>

  const dashboardContent = document.getElementById('dashboard-content');      <p>Entre em contato com o administrador da sua empresa</p>

  if (!dashboardContent) return;    </div>

  `;

  dashboardContent.innerHTML = `}

    <div class="alert alert-error">

      ❌ ${message}/**

    </div> * Mostrar erro

  `; */

}function showError(message) {

  const dashboardContent = document.getElementById('dashboard-content');

// =====================================================  if (!dashboardContent) return;

// LOGOUT

// =====================================================  dashboardContent.innerHTML = `

    <div class="alert alert-error">

function logout() {      ❌ ${message}

  localStorage.removeItem('token');    </div>

  window.location.href = '../public/login.html';  `;

}}



// =====================================================/**

// INICIAR * Logout

// ===================================================== */

function logout() {

if (document.readyState === 'loading') {  localStorage.removeItem('token');

  document.addEventListener('DOMContentLoaded', init);  window.location.href = '../public/login.html';

} else {}

  init();

}/**

 * Iniciar quando DOM estiver pronto
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
      <p class="category-description">${category.description}</p>
    </div>
    <div class="tools-grid">
      ${tools.map(tool => createToolCard(tool)).join('')}
    </div>
  `;
  
  return section;
}

/**
 * Criar card de ferramenta
 */
function createToolCard(tool) {
  return `
    <div class="tool-card" onclick="openTool('${tool.id}', '${tool.name}')">
      <div class="tool-icon">${tool.icon || '📦'}</div>
      <h3 class="tool-name">${tool.name}</h3>
      <p class="tool-description">${tool.description}</p>
    </div>
  `;
}

/**
 * Abrir ferramenta (global para onclick)
 */
window.openTool = function(toolId, toolName) {
  console.log(`Abrindo ferramenta: ${toolName} (ID: ${toolId})`);
  
  // Por enquanto, apenas mostrar alerta
  // Futuramente, navegar para página da ferramenta
  alert(`Ferramenta "${toolName}" em desenvolvimento.\n\nID: ${toolId}`);
  
  // TODO: Implementar navegação para ferramentas
  // window.location.href = `tools/${toolId}.html`;
};
