# Estrutura de Arquivos e Pastas - Ascenda Platform (Web)

## 📐 Organização Geral

A plataforma Ascenda é uma aplicação web pura (HTML, CSS, JavaScript) organizada em duas partes principais:

### 1. Frontend (`client/`)
Interface web construída com HTML, CSS e JavaScript vanilla (ES6 Modules).

### 2. Backend (`server/`)
Servidor Node.js temporário para APIs.

---

## 📁 Estrutura Detalhada do Frontend

```
client/
├── index.html                # Página inicial (Login)
│
├── pages/                    # Páginas da aplicação
│   ├── dashboard.html       # Dashboard principal
│   └── desenvolvedor.html   # Área do desenvolvedor
│
├── css/                      # Estilos CSS
│   ├── global.css           # Estilos globais
│   ├── index.css            # Estilos da página inicial
│   ├── dashboard.css        # Estilos do dashboard
│   └── desenvolvedor.css    # Estilos da área do desenvolvedor
│
├── js/                       # JavaScript (ES6 Modules)
│   ├── app.js               # Script da página inicial
│   ├── dashboard.js         # Script do dashboard
│   ├── desenvolvedor.js     # Script da área do desenvolvedor
│   │
│   ├── services/            # Serviços de comunicação
│   │   └── authService.js   # Serviço de autenticação
│   │
│   ├── utils/               # Utilitários
│   │   └── constants.js     # Constantes da aplicação
│   │
│   ├── modules/             # Módulos específicos
│   │   └── (futuros módulos)
│   │
│   └── components/          # Componentes reutilizáveis
│       └── (futuros componentes)
│
└── public/                   # Arquivos públicos estáticos
    ├── favicon.ico
    └── assets/
        ├── images/          # Imagens
        └── icons/           # Ícones
```

---

## 🗂️ Estrutura Detalhada do Backend

```
server/
├── routes/                    # Rotas da API
│   ├── auth.js               # Rotas de autenticação
│   │   ├── POST /login
│   │   └── POST /logout
│   │
│   └── users.js              # Rotas de usuários
│       ├── GET /users
│       └── GET /users/:id
│
├── data/                      # Dados temporários (JSON)
│   ├── users.json            # Usuários mock
│   └── categories.json       # Categorias
│
├── src/
│   └── index.js              # Entry point do servidor
│
└── package.json              # Dependências
```

---

## 🎯 Páginas da Aplicação

### 1. Página Inicial - Login (`index.html`)
- Localização: `/client/index.html`
- Descrição: Página de entrada da aplicação
- Funcionalidades:
  - Formulário de login
  - Validação de credenciais
  - Redirecionamento para dashboard

### 2. Dashboard (`pages/dashboard.html`)
- Localização: `/client/pages/dashboard.html`
- Descrição: Interface principal após autenticação
- Funcionalidades:
  - Renderização condicional baseada em categorias
  - Painéis personalizados por categoria
  - Menu de navegação
  - Informações do usuário

### 3. Área do Desenvolvedor (`pages/desenvolvedor.html`)
- Localização: `/client/pages/desenvolvedor.html`
- Descrição: Área restrita para desenvolvedores
- Funcionalidades:
  - Ferramentas de desenvolvimento
  - Logs do sistema
  - Configurações avançadas
- Requer: Permissão `canAccessDev`

---

## 🏷️ Sistema de Categorias de Ferramentas

As categorias organizam **ferramentas e funcionalidades**, não hierarquia de usuários.

Cada usuário possui permissões para acessar uma ou mais categorias de ferramentas:

```javascript
// Estrutura de usuário
{
  id: "1",
  name: "João Silva",
  email: "joao@empresa.com",
  department: "Geral",
  permissions: {
    toolCategories: ["lideranca", "administracao", "gerenciamento"],
    canAccessDev: false
  }
}
```

### Categorias de Ferramentas

| Categoria | Ferramentas Principais |
|-----------|------------------------|
| **Liderança** | Visão Estratégica, Planejamento Estratégico |
| **Diretoria** | Gestão de Departamentos, Relatórios Gerenciais |
| **Administração** | Gestão de Equipes, Squads, Setores, Contabilidade, Jurídico |
| **Coordenação** | Coordenação de Projetos, Alocação de Recursos |
| **Gerenciamento** | Gestão de Tarefas, Gráficos de Desempenho, Controle de Prazos |
| **Supervisão** | Monitoramento de Equipe, Sistema de Aprovações |
| **Operacional** | Registro de Atividades, Checklist de Tarefas |

### Exemplos de Ferramentas por Categoria

#### 📊 Liderança
- **Visão Estratégica**: Dashboard executivo com KPIs estratégicos
- **Planejamento Estratégico**: Ferramentas de planejamento de longo prazo

#### 🏢 Diretoria
- **Gestão de Departamentos**: Organização e acompanhamento de departamentos
- **Relatórios Gerenciais**: Relatórios consolidados da empresa

#### 🏗️ Administração
- **Gestão de Equipes**: Criar e gerenciar equipes de trabalho
- **Gestão de Squads**: Criar e gerenciar squads ágeis
- **Gestão de Setores**: Organizar e administrar setores
- **Ferramentas Contábeis**: Gestão contábil e financeira
- **Ferramentas Jurídicas**: Gestão de documentos e processos jurídicos

#### 📋 Coordenação
- **Coordenação de Projetos**: Gerenciar múltiplos projetos
- **Alocação de Recursos**: Distribuir recursos entre projetos

#### ✅ Gerenciamento
- **Gestão de Tarefas**: Criar e acompanhar tarefas
- **Gráficos de Desempenho**: Visualização de métricas e KPIs
- **Controle de Prazos**: Timeline e cronogramas

#### 👀 Supervisão
- **Monitoramento de Equipe**: Acompanhar atividades da equipe
- **Sistema de Aprovações**: Aprovar ou rejeitar solicitações

#### 📝 Operacional
- **Registro de Atividades**: Registrar atividades diárias
- **Checklist de Tarefas**: Tarefas operacionais do dia a dia

---

## 📦 Organização de Código JavaScript

### Estrutura de um Módulo

```javascript
// constants.js - Exemplo de arquivo de constantes
export const API_BASE_URL = 'http://localhost:3000/api'

export const USER_CATEGORIES = {
  LIDERANCA: 'lideranca',
  DIRETORIA: 'diretoria',
  // ...
}
```

### Estrutura de um Service

```javascript
// authService.js - Exemplo de serviço
import { API_BASE_URL } from '../utils/constants.js'

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  if (!response.ok) throw new Error('Credenciais inválidas')
  
  return await response.json()
}
```

### Estrutura de um Script de Página

```javascript
// dashboard.js - Exemplo de script de página
import { getCurrentUser } from '../services/authService.js'

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser()
  renderDashboard(user)
})

function renderDashboard(user) {
  // Lógica de renderização
}
```

---

## 🔄 Fluxo de Dados

```
User Action → Event Listener → Function → Fetch API
                                             ↓
                                        Backend Route
                                             ↓
                                        Data (JSON)
                                             ↓
                                        Response → Update DOM
```

---

## 📝 Convenções de Nomenclatura

### Arquivos
- **Páginas HTML**: `nome-da-pagina.html` (ex: `dashboard.html`)
- **Estilos CSS**: `nome-do-arquivo.css` (ex: `global.css`)
- **Scripts JS**: `camelCase.js` (ex: `authService.js`, `dashboard.js`)
- **Constantes**: `constants.js` (minúsculo)

### JavaScript
- **Funções**: `camelCase` (ex: `getCurrentUser()`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `API_BASE_URL`)
- **Variáveis**: `camelCase` (ex: `userName`)

---

## 🛠️ Padrões de Desenvolvimento

### 1. ES6 Modules
- Use `import`/`export` para modularização
- Sempre use `type="module"` nos scripts HTML
- Extensão `.js` obrigatória nos imports

### 2. Fetch API
- Use para comunicação com backend
- Sempre trate erros com try/catch
- Headers apropriados para JSON

### 3. LocalStorage
- Armazene token e dados do usuário
- Limpe ao fazer logout
- Verifique autenticação antes de renderizar

### 4. DOM Manipulation
- Use `document.addEventListener('DOMContentLoaded', ...)`
- Acesse elementos com `getElementById` ou `querySelector`
- Atualize conteúdo com `innerHTML` ou `textContent`

### 5. Separação de Responsabilidades
- HTML para estrutura
- CSS para apresentação
- JavaScript para comportamento
- Serviços para comunicação com API

---

## 🔐 Gerenciamento de Acesso

O acesso a funcionalidades é controlado por:

1. **Permissões de Categorias**: Define quais ferramentas o usuário pode acessar
2. **Permissões Específicas**: Controle granular (ex: `canAccessDev`)
3. **Verificação de Autenticação**: Em cada página

```javascript
// Exemplo de proteção de rota
if (!isAuthenticated()) {
  window.location.href = '/index.html'
  return
}

// Exemplo de verificação de permissão de categoria
const user = getCurrentUser()
const allowedCategories = user.permissions?.toolCategories || []

if (!allowedCategories.includes('administracao')) {
  alert('Você não tem acesso a ferramentas administrativas')
  return
}

// Exemplo de verificação de permissão específica
if (!user.permissions?.canAccessDev) {
  alert('Acesso negado')
  window.location.href = '/pages/dashboard.html'
  return
}
```

### Como Funcionam as Permissões

```javascript
// Estrutura de permissões do usuário
permissions: {
  toolCategories: ['lideranca', 'administracao', 'gerenciamento'],
  canAccessDev: false
}

// O dashboard renderiza apenas as ferramentas das categorias permitidas
// Exemplo: usuário com toolCategories = ['administracao'] verá:
// - Gestão de Equipes
// - Gestão de Squads
// - Gestão de Setores
// - Ferramentas Contábeis
// - Ferramentas Jurídicas
```
if (!isAuthenticated()) {
  window.location.href = '/index.html'
  return
}

// Exemplo de verificação de permissão
if (!user.permissions?.canAccessDev) {
  alert('Acesso negado')
  window.location.href = '/pages/dashboard.html'
  return
}
```

---

## 📊 Dados Temporários

Durante o desenvolvimento inicial, os dados são armazenados em arquivos JSON no backend:

```
server/data/
├── users.json       # Usuários do sistema
└── categories.json  # Categorias disponíveis
```

Posteriormente, será migrado para banco de dados adequado.

---

Esta estrutura foi projetada para ser:
- ✅ **Escalável**: Fácil adicionar novas funcionalidades
- ✅ **Organizada**: Cada coisa em seu lugar
- ✅ **Compreensível**: Estrutura intuitiva
- ✅ **Manutenível**: Fácil encontrar e modificar código

## 📐 Arquitetura em Camadas

A plataforma segue uma arquitetura em três camadas principais:

### 1. Frontend (Client Layer)
Responsável pela interface do usuário e experiência visual.

### 2. Backend (Server Layer)
Responsável pela lógica de negócio, validações e comunicação com banco de dados.

### 3. Banco de Dados (Data Layer)
Armazena todos os dados da plataforma de forma estruturada e segura.

## 🎯 Sistema de Níveis Hierárquicos

### Nível 00 - Liderança
**Responsabilidade**: Definir objetivos e direcionamento estratégico da empresa.

**Funcionalidades**:
- Visualização de métricas estratégicas
- Definição de metas organizacionais
- Aprovação de grandes decisões
- Análise de performance geral

**Permissões**: Acesso total ao sistema

---

### Nível 01 - Diretoria
**Responsabilidade**: Gerenciar setores específicos (financeiro, cultura, RH, operações).

**Funcionalidades**:
- Dashboard de setor específico
- Gestão de orçamento departamental
- Definição de políticas setoriais
- Relatórios de performance do setor

**Permissões**: Acesso total ao seu setor + visualização geral

---

### Nível 02 - Administração
**Responsabilidade**: Cuidar das partes administrativas de setores específicos.

**Funcionalidades**:
- Gestão documental
- Controle de processos internos
- Gestão de contratos
- Organização de recursos

**Permissões**: Acesso administrativo ao setor designado

---

### Nível 03 - Coordenação
**Responsabilidade**: Coordenar setores, equipes e profissionais.

**Funcionalidades**:
- Gestão de equipes
- Distribuição de tarefas
- Acompanhamento de projetos
- Comunicação interdepartamental
- Resolução de conflitos

**Permissões**: Gestão de equipes e visualização de métricas

---

### Nível 04 - Gerenciamento
**Responsabilidade**: Gestão local (lojas, regiões, equipes específicas).

**Funcionalidades**:
- Gestão operacional local
- Controle de estoque (se aplicável)
- Gestão de equipe local
- Relatórios de performance local
- Escalas e turnos

**Permissões**: Gestão da unidade/equipe específica

---

### Nível 05 - Supervisão
**Responsabilidade**: Compliance, análise e tratamento de dados.

**Funcionalidades**:
- Auditoria de processos
- Análise de dados e KPIs
- Verificação de conformidade
- Elaboração de relatórios analíticos
- Monitoramento de qualidade

**Permissões**: Visualização ampla para análise + ferramentas analíticas

---

### Nível 06 - Operacional
**Responsabilidade**: Executar ações diretas (atendimento, vendas, casos específicos).

**Funcionalidades**:
- Execução de tarefas atribuídas
- Registro de atividades
- Atendimento ao cliente
- Inserção de dados operacionais
- Comunicação com supervisores

**Permissões**: Acesso às ferramentas necessárias para suas tarefas

---

## 🗂️ Módulos do Sistema

### 1. Módulo de Autenticação (`auth/`)
- Login/Logout
- Recuperação de senha
- Autenticação de dois fatores (2FA)
- Gestão de sessões

### 2. Módulo de Usuários (`users/`)
- CRUD de usuários
- Perfis de usuário
- Hierarquia organizacional
- Atribuição de níveis

### 3. Módulo de Dashboard (`dashboard/`)
- Dashboard personalizado por nível
- Widgets configuráveis
- Métricas em tempo real
- Gráficos e visualizações

### 4. Módulo de Tarefas (`tasks/`)
- Criação e atribuição de tarefas
- Acompanhamento de status
- Priorização
- Notificações

### 5. Módulo de Analytics (`analytics/`)
- KPIs por nível
- Análise de performance
- Relatórios customizados
- Exportação de dados

### 6. Módulo de Relatórios (`reports/`)
- Geração de relatórios
- Templates personalizáveis
- Agendamento de relatórios
- Exportação (PDF, Excel, CSV)

### 7. Módulo de Configurações (`settings/`)
- Configurações da empresa
- Personalização visual
- Integrações
- Notificações

### 8. Módulo de Permissões (`permissions/`)
- RBAC (Role-Based Access Control)
- Controle granular de acessos
- Grupos de permissões
- Auditoria de acessos

### 9. Módulo de Níveis (`levels/`)
- Gestão de níveis hierárquicos
- Workflows por nível
- Regras de aprovação
- Escalação automática

---

## 🔄 Padrões de Desenvolvimento

### Nomenclatura de Arquivos
- **Componentes**: PascalCase (ex: `UserCard.jsx`)
- **Utilitários**: camelCase (ex: `formatDate.js`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_ENDPOINTS.js`)
- **Páginas**: PascalCase (ex: `Dashboard.jsx`)

### Estrutura de Componentes
```javascript
// Importações
import React from 'react'

// Tipos/Interfaces
interface Props {}

// Componente
export function ComponentName({ props }: Props) {
  // Estados
  // Efeitos
  // Funções
  // Render
  return <div></div>
}
```

### Estrutura de API Routes
```
/api/v1/auth/
/api/v1/users/
/api/v1/tasks/
/api/v1/analytics/
```

---

## 🗄️ Modelo de Dados Conceitual

### Principais Entidades

**Users (Usuários)**
- id, name, email, password
- level (nível hierárquico)
- department, position
- permissions

**Departments (Departamentos)**
- id, name, description
- director_id, parent_department_id

**Tasks (Tarefas)**
- id, title, description, status
- assigned_to, created_by
- priority, due_date

**Reports (Relatórios)**
- id, title, type
- created_by, created_at
- data, filters

**Permissions (Permissões)**
- id, resource, action
- level_required

**Audit Logs (Logs de Auditoria)**
- id, user_id, action
- resource, timestamp

---

## 🔐 Sistema de Permissões

### Matriz de Permissões Base

| Nível | Visualizar | Criar | Editar | Deletar | Aprovar |
|-------|-----------|-------|--------|---------|---------|
| 00 - Liderança | ✓ | ✓ | ✓ | ✓ | ✓ |
| 01 - Diretoria | ✓ | ✓ | ✓ | ✓ | ✓* |
| 02 - Administração | ✓ | ✓ | ✓ | ✓* | ✗ |
| 03 - Coordenação | ✓ | ✓ | ✓ | ✗ | ✗ |
| 04 - Gerenciamento | ✓ | ✓ | ✓* | ✗ | ✗ |
| 05 - Supervisão | ✓ | ✓* | ✗ | ✗ | ✗ |
| 06 - Operacional | ✓* | ✓* | ✗ | ✗ | ✗ |

*✓ = Permitido | ✓* = Permitido com restrições | ✗ = Não permitido*

---

## 📱 Responsive Design

- **Desktop**: 1920px, 1440px, 1024px
- **Tablet**: 768px, 834px
- **Mobile**: 375px, 414px

---

## 🎨 Design System

### Cores Base
- Primary: Sistema de níveis (gradiente)
- Secondary: Ações e interações
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Neutral: Escala de cinzas

### Tipografia
- Headings: Inter Bold
- Body: Inter Regular
- Monospace: Fira Code

---

## 📊 Fluxo de Dados

```
User Action → Frontend (React) → API Request (Axios)
                                       ↓
                              Backend (Express)
                                       ↓
                              Validation (Zod)
                                       ↓
                              Business Logic
                                       ↓
                              Database (PostgreSQL)
                                       ↓
                              Response ← Frontend
```

---

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
├── e2e/           # Testes end-to-end
└── fixtures/      # Dados de teste
```

### Cobertura Esperada
- Funções críticas: 100%
- Componentes: 80%+
- API Endpoints: 90%+

---

## 🚀 Deploy

### Ambientes
- **Development**: Local/Docker
- **Staging**: Servidor de testes
- **Production**: Servidor de produção

### CI/CD Pipeline
1. Commit → GitHub
2. Testes automatizados
3. Build
4. Deploy (se testes passarem)

---

## 📞 Contato e Suporte

Para dúvidas sobre a estrutura, consulte a documentação completa ou entre em contato com a equipe de desenvolvimento.
