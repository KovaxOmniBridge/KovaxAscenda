# 🚀 Ascenda Flex - Estrutura Completa

## Visão Geral

O **Ascenda Flex** é um sistema híbrido de gestão organizacional que integra:
- ✅ Hierarquia Tradicional (8 níveis)
- ✅ Squads Multifuncionais (estrutura flexível)
- ✅ Chapters (comunidades de prática)

## 📊 Estrutura de Níveis

### Nível 0 - Presidentes 👑
**Pasta:** `Nivel00-Presidentes/`
**Interfaces:**
- `dashboard-presidentes.html` - Painel estratégico principal
- `aprovacoes.html` - Aprovações executivas (contratações, investimentos, projetos)
- `relatorios.html` - Business Intelligence com KPIs e gráficos Chart.js
- `estrutura.html` - Visualização da estrutura organizacional híbrida

**Responsabilidades:**
- Visão estratégica global da empresa
- Decisões corporativas críticas
- Aprovações de alto impacto (investimentos, aquisições, contratações C-level)
- Análise de indicadores macro (Receita, EBITDA, Margem, NPS)
- Definição de metas estratégicas

**Acesso:**
- Visualização completa de toda a organização
- Acesso a todos os squads estratégicos
- Aprovações de budget e mudanças estruturais
- Relatórios executivos consolidados

---

### Nível 1 - Administradores Gerais ⚙️
**Pasta:** `Nivel01-AdministradoresGerais/`
**Interfaces:**
- `dashboard-admin.html` - Painel administrativo principal
- `templates.html` - Configuração de estrutura organizacional
- `squads.html` - Gestão completa de squads
- `chapters.html` - Gestão de comunidades de prática
- `usuarios.html` - CRUD de usuários e permissões

**Responsabilidades:**
- Configuração do sistema organizacional
- Gestão de todos os usuários
- Criação e gerenciamento de squads/chapters
- Definição de templates (Startup, Scale-up, Corporate)

**Acesso:**
- **God Mode** - Acesso total ao sistema
- Gerenciamento de toda estrutura organizacional

---

### Nível 2 - Diretores Executivos 📊
**Pasta:** `Nivel02-DiretoresExecutivos/`
**Interface:** `dashboard-diretores.html`
**Responsabilidades:**
- Gestão departamental
- Controle de budget e KPIs
- Aprovações táticas
- Performance reviews
- Metas departamentais (OKRs)

**Acesso:**
- Visualização de departamento específico
- Squads sob sua gestão
- Equipe direta e subordinados

---

### Nível 3 - Gerentes 📈
**Pasta:** `Nivel03-Gerentes/`
**Interface:** `dashboard-gerentes.html`
**Responsabilidades:**
- Supervisão de operações
- Gestão de equipe direta
- Controle de projetos
- Sprint planning e reviews
- Métricas de performance

**Acesso:**
- Visualização de sua gerência
- Squads onde atua como líder
- Chapters onde participa
- Subordinados diretos

---

### Nível 4 - Coordenadores 🎯
**Pasta:** `Nivel04-Coordenadores/`
**Interface:** `dashboard-coordenadores.html`
**Responsabilidades:**
- Coordenação de projetos específicos
- Daily management
- Gestão de sprints
- Velocity e throughput
- Resolução de bloqueios

**Acesso:**
- Projetos sob coordenação
- Tasks do squad
- Métricas de sprint

---

### Nível 5 - Supervisores 👁️
**Pasta:** `Nivel05-Supervisores/`
**Interface:** `dashboard-supervisores.html`
**Responsabilidades:**
- Supervisão direta da equipe
- Controle de qualidade
- Escalação de issues
- Timesheet e horas
- Atividades do dia

**Acesso:**
- Equipe supervisionada
- Tasks operacionais
- Métricas de performance diária

---

### Nível 6 - Especialistas 💼
**Pasta:** `Nivel06-Especialistas/`
**Interface:** `dashboard-especialistas.html`
**Responsabilidades:**
- Execução técnica especializada
- Contribuição em chapters
- Mentoria em área de expertise
- Análises e relatórios técnicos
- Participação em múltiplos squads

**Acesso:**
- Minhas tasks
- Squads onde participo
- Chapters da minha especialidade
- Performance individual

---

### Nível 7 - Operacional 📝
**Pasta:** `Nivel07-Operacional/`
**Interface:** `dashboard-operacional.html`
**Responsabilidades:**
- Execução de tarefas operacionais
- Checklists diários
- Timesheet básico
- Suporte administrativo

**Acesso:**
- Minhas atividades do dia
- Registro de horas
- Métricas individuais básicas

---

## 🚀 Squads (Estrutura Flexível)

**Interface:** `Nivel01-AdministradoresGerais/squads.html`

### Características:
- ✅ Multifuncionais e cross-hierárquicos
- ✅ Temporários (projeto/feature/problema)
- ✅ Alocação percentual de tempo (30%, 50%, 100%)
- ✅ Papéis: Product Owner, Scrum Master, Dev, Designer, QA
- ✅ Sprints e metas definidas

### Tipos de Squad:
- **Feature Squad** - Desenvolvimento de nova funcionalidade
- **Project Squad** - Projeto específico com prazo
- **Problem Squad** - Resolução de problema complexo
- **Innovation Squad** - Exploração e inovação

### Dados Armazenados:
```sql
squads (id, name, description, type, status, start_date, end_date, company_id)
squad_members (squad_id, user_id, role, allocation_percentage)
squad_goals (squad_id, description, target_date, completed)
```

---

## 📚 Chapters (Comunidades de Prática)

**Interface:** `Nivel01-AdministradoresGerais/chapters.html`

### Características:
- ✅ Permanentes (duração indefinida)
- ✅ Baseados em especialidade técnica
- ✅ Cross-squad (membros de vários squads)
- ✅ Papéis: Lead, Member, Guest
- ✅ Foco em conhecimento e padrões

### Especialidades Disponíveis:
- Backend Development
- Frontend Development
- UX/UI Design
- Data Science
- DevOps
- QA Testing
- Product Management
- Business Analysis
- Mobile Development
- Security

### Dados Armazenados:
```sql
chapters (id, name, specialty, description, lead_id, company_id)
chapter_members (chapter_id, user_id, role)
```

---

## 🎯 Modelo Híbrido em Prática

### Exemplo: João, Desenvolvedor Backend (Nível 6)

**Posição Hierárquica:**
- Nível 6 - Especialista
- Reporta para: Maria (Gerente de Engenharia - Nível 3)

**Alocação em Squads:**
- Squad A "Nova API" - 60% do tempo (Developer)
- Squad B "Refactoring" - 30% do tempo (Tech Lead)

**Participação em Chapters:**
- Chapter Backend - Member
- Chapter DevOps - Guest

**Dashboard de João:**
- Visualiza suas 12 tasks ativas (dos 2 squads)
- Vê discussões dos chapters
- Acessa métricas de performance
- Registra horas trabalhadas
- Participa de eventos do chapter

---

## 🔐 Sistema de Permissões Contextuais

### Lógica de Permissões:
```javascript
permission_level = MAX(
    hierarchical_permission,
    squad_role_permission,
    chapter_role_permission
)
```

### Exemplo:
- **Nível Hierárquico:** 6 (Especialista) = Permissão básica
- **Papel no Squad:** Tech Lead = Permissão elevada
- **Papel no Chapter:** Lead = Permissão elevada
- **Resultado:** Permissão mais alta entre as três

---

## 🛠️ Ferramentas de Desenvolvimento

### Painel do Desenvolvedor
**Acesso:** `http://localhost:3000/desenvolvedor/dev-dashboard.html`
**Login requerido:** Sistema de autenticação JWT

#### Funcionalidades:
1. **📊 Estatísticas** - Overview do sistema
2. **🏢 Empresas** - Gerenciar empresas
3. **👥 Usuários** - Ver todos os usuários
4. **🔐 Login Rápido** - Logar como qualquer usuário
5. **💾 Banco de Dados** - Ver estrutura das tabelas
6. **🧪 API Test** - Testar endpoints
7. **🌱 Seed Data** - Popular dados de exemplo
8. **🔍 Explorar Interfaces** - God Mode: acessar qualquer interface

#### Interface Explorer:
- 13 interfaces mapeadas (8 níveis x múltiplas páginas)
- Acesso direto sem restrições de permissão
- Seleção de empresa para contexto
- Navegação rápida entre todos os níveis

---

## 📁 Estrutura de Arquivos

```
Ascenda/
├── servidor/
│   ├── server.js          # API REST + Autenticação
│   ├── database.js        # Schema SQLite
│   └── ascenda.db         # Banco de dados
│
├── desenvolvedor/
│   ├── dev-login.html     # Autenticação dev
│   ├── dev-dashboard.html # Painel principal
│   └── dev-dashboard.js   # Interface Explorer
│
├── Nivel00-Presidentes/
│   └── dashboard-presidentes.html
│
├── Nivel01-AdministradoresGerais/
│   ├── dashboard-admin.html
│   ├── templates.html
│   ├── squads.html
│   ├── chapters.html
│   └── usuarios.html
│
├── Nivel02-DiretoresExecutivos/
│   └── dashboard-diretores.html
│
├── Nivel03-Gerentes/
│   └── dashboard-gerentes.html
│
├── Nivel04-Coordenadores/
│   └── dashboard-coordenadores.html
│
├── Nivel05-Supervisores/
│   └── dashboard-supervisores.html
│
├── Nivel06-Especialistas/
│   └── dashboard-especialistas.html
│
└── Nivel07-Operacional/
    └── dashboard-operacional.html
```

---

## 🚀 Como Usar

### 1. Iniciar Servidor
```powershell
cd servidor
node server.js
```
**Servidor rodando em:** `http://localhost:3000`

### 2. Acessar Painel de Desenvolvedor
1. Abrir: `http://localhost:3000/desenvolvedor/dev-login.html`
2. Criar conta de desenvolvedor
3. Fazer login
4. Acessar: Interface Explorer (Tab 7)

### 3. Explorar Interfaces
- Selecionar empresa no dropdown
- Escolher interface desejada
- Clicar para abrir
- Navegação completa sem restrições

### 4. Gerenciar Sistema
- **Usuários:** Criar em Nivel01/usuarios.html
- **Squads:** Gerenciar em Nivel01/squads.html
- **Chapters:** Gerenciar em Nivel01/chapters.html
- **Templates:** Configurar em Nivel01/templates.html

---

## 🎯 Próximos Passos

### Implementar:
1. ✅ Dashboard de visualização híbrida
   - Mostrar hierarquia + squads + chapters simultaneamente
   - Gráfico de organograma dinâmico

2. ✅ Sistema de permissões contextuais
   - Middleware de verificação
   - Cálculo de permissão máxima

3. ✅ Relatórios e analytics
   - Utilização de squads
   - Atividade dos chapters
   - Performance por nível

4. ✅ Notificações e alertas
   - Mudanças de squad
   - Convites para chapters
   - Aprovações pendentes

---

## 📊 Banco de Dados

### Tabelas:
1. `companies` - Empresas
2. `users` - Usuários (com hierarchical_level)
3. `countries` - Países
4. `organization_templates` - Templates organizacionais
5. `squads` - Squads
6. `squad_members` - Membros dos squads
7. `chapters` - Chapters
8. `chapter_members` - Membros dos chapters
9. `squad_goals` - Metas dos squads
10. `dev_users` - Usuários do painel dev

### API Endpoints:
- `/api/companies/*`
- `/api/users/*`
- `/api/squads/*`
- `/api/chapters/*`
- `/api/dev/auth/*` - Autenticação

---

## ✅ Status do Projeto

### Completo (100%):
- ✅ 8 níveis hierárquicos implementados
- ✅ Sistema de squads funcional
- ✅ Sistema de chapters funcional
- ✅ Gestão de usuários completa
- ✅ Templates organizacionais
- ✅ Painel do desenvolvedor
- ✅ Interface Explorer (God Mode)
- ✅ Autenticação JWT
- ✅ API REST completa
- ✅ Banco de dados SQLite

### Sistema 100% Operacional! 🎉
