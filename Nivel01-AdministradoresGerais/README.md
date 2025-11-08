# ⚙️ Nível 1 - Administradores Gerais# Nível 1 - Administradores Gerais



## 📋 Visão GeralEsta pasta contém todos os arquivos da interface dos **Administradores Gerais** da plataforma Ascenda Flex.



Interfaces de administração completa da plataforma para o segundo nível hierárquico mais alto.## 📁 Estrutura



**Acesso:** Restrito a usuários com `nivel = 1````

Nivel01-AdministradoresGerais/

---├── dashboard-admin.html     # Interface principal do dashboard

├── dashboard-admin.css      # Estilos do dashboard

## 📄 Arquivos├── dashboard-admin.js       # Lógica e funcionalidades

├── templates.html           # Configuração de templates organizacionais

### Dashboards e Gestão├── squads.html              # Gestão de squads ágeis

- `dashboard-admin.*` - Dashboard administrativo principal├── chapters.html            # Gestão de chapters (comunidades)

- `usuarios.*` - Gerenciamento completo de usuários├── usuarios.html            # CRUD de usuários

- `squads.*` - Gestão de squads (times ágeis)└── README.md                # Este arquivo

- `chapters.*` - Gestão de chapters (comunidades de prática)```

- `templates.*` - Templates e configurações do sistema

## 🎯 Funcionalidades

**Total:** 5 interfaces × 3 arquivos (HTML, CSS, JS) = 15 arquivos

### 📊 Dashboard Principal (dashboard-admin.html)

---- Estatísticas em tempo real da empresa

- Visão geral de usuários, squads e chapters

## 🎯 Funcionalidades- Ações rápidas para gerenciamento



### 📊 Dashboard Principal### 🏢 Templates Organizacionais (templates.html)

- KPIs administrativos (usuários, squads, chapters, países)- Configurar estrutura hierárquica

- Estatísticas em tempo real- Tipos: Startup, Scale-up, Corporate, Custom

- Distribuição de usuários por nível hierárquico- Personalizar níveis ativos

- Visão geral de squads e chapters ativos

- Acesso rápido às áreas de gestão### 🚀 Gestão de Squads (squads.html)

- Criar e gerenciar squads ágeis multifuncionais

### 👥 Gestão de Usuários- Tipos: Feature, Project, Problem, Innovation

- Criar, editar e remover usuários- Alocação de membros com porcentagem

- Atribuir níveis hierárquicos (0-7)

- Configurar papéis e permissões### 📚 Gestão de Chapters (chapters.html)

- Gerenciar chaves de acesso- Criar comunidades de prática

- Visualizar hierarquia organizacional- Gerenciar especialidades técnicas

- Definir líderes de chapter

### 🚀 Gestão de Squads

- Criar e configurar squads### 👥 Gestão de Usuários (usuarios.html)

- Adicionar/remover membros- Listar todos os usuários

- Definir metas e KPIs- Adicionar novos usuários

- Monitorar performance- Filtrar por nível hierárquico

- Gerenciar status (ativo/inativo)- Editar e excluir usuários



### 📚 Gestão de Chapters## 🚀 Acesso

- Criar chapters por especialidade

- Gerenciar membros e líderesPara acessar o dashboard:

- Acompanhar atividades

- Compartilhar conhecimento1. Faça login na página principal (`../index.html`)

2. Após o login, você será redirecionado para o dashboard correspondente

### 📋 Templates3. Administradores Gerais (Nível 1) têm acesso completo ao sistema

- Criar templates de squad

- Configurar estruturas padrão## 🔐 Permissões

- Reutilizar configurações

**Nível 1 - Administradores Gerais** têm:

---- ✅ Acesso total ao sistema

- ✅ Gestão de todos os usuários

## 🔧 Dependências- ✅ Configuração de estrutura organizacional

- ✅ Criação e gerenciamento de squads/chapters

Todos os dashboards dependem dos arquivos compartilhados em `/shared`:- ✅ God Mode no sistema



```html## 🔐 Segurança

<script src="../shared/session-manager.js"></script>

<script src="../shared/dev-session-handler.js"></script>- ✅ Acesso protegido por JWT (token válido por 24h)

<script src="../shared/dashboard-common.js"></script>- ✅ Redirecionamento automático ao index se não autenticado

<script src="../shared/dev-mode-indicator.js"></script>- ✅ Validação de permissões no backend

```- ✅ Isolamento por empresa (cada admin vê apenas sua empresa)



---## 📚 Documentação



## 🔐 Proteção de AcessoPara guia completo de uso, consulte [`GUIA_DASHBOARD.md`](./GUIA_DASHBOARD.md)



Acesso protegido em múltiplas camadas:## 🔗 Integração



1. **Verificação de nível:** Apenas `nivel = 1`### Redirecionamentos

2. **Token JWT:** Validado no backend- **Login:** `../index.html` → `AdministradorGeral/dashboard.html`

3. **God Mode:** Desenvolvedores acessam via impersonation- **Logout:** `AdministradorGeral/dashboard.html` → `../index.html`

4. **FOUC Prevention:** Loader enquanto CSS carrega

### API

---Todos os endpoints estão documentados em `../servidor/README.md`



## 📊 Estatísticas de Código## 💡 Credenciais de Teste



| Arquivo | Linhas | Tamanho |**Empresa:** Ascenda Demo  

|---------|--------|---------|**Nome de Usuário:** admin  

| dashboard-admin.js | ~300 | ~11 KB |**Senha:** 123456

| usuarios.js | ~250 | ~8 KB |

| squads.js | ~370 | ~11 KB |---

| chapters.js | ~430 | ~13 KB |

| templates.js | ~330 | ~10 KB |**Última atualização:** Novembro 2025

| **Total JS** | **~1.680** | **~53 KB** |

---

## ✅ Otimizações Aplicadas (Nov 2025)

- ✅ Removidos arquivos desnecessários (dashboard-admin-old.css, docs temporários)
- ✅ Console.logs otimizados (apenas erros mantidos)
- ✅ Sistema de loader para prevenir FOUC
- ✅ Delay de inicialização para garantir CSS carregado
- ✅ Código padronizado com Nivel00

---

## 👨‍💻 Desenvolvido por

Equipe Ascenda Flex  
Última atualização: Novembro 2025
