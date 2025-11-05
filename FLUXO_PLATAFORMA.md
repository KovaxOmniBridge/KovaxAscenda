# 🚀 Fluxo da Plataforma Ascenda

## 📊 Visão Geral dos Papéis

### 1. **Desenvolvedor (Você)** 🛠️
- **Acesso**: `/desenvolvedor/dev-login.html`
- **Papel**: Proprietário da plataforma, suporte técnico, manutenção
- **Funcionalidades**:
  - Visualizar todas as empresas cadastradas
  - Quick Login (impersonar usuários reais)
  - Explorador de Interfaces (usuário geral com acesso total)
  - Visualizar logs de auditoria
  - Gerenciar dados do banco
  - Seed de dados para testes

### 2. **Fundador/Dono da Empresa** 🏢
- **Acesso**: `index.html` → "Cadastrar Empresa"
- **Papel**: Pessoa que representa a empresa e inicia o cadastro
- **Processo**:
  1. Acessa a página inicial
  2. Clica em "Cadastrar Empresa"
  3. Preenche dados da empresa (nome, setor, porte, etc.)
  4. Cadastra Administradores Gerais (Nível 1)
  5. Finaliza cadastro
  6. Administradores recebem credenciais

### 3. **Administradores Gerais (Nível 1)** ⚙️
- **Acesso**: `index.html` → "Acessar Plataforma"
- **Papel**: Gerenciam toda a estrutura da empresa
- **Funcionalidades**:
  - Dashboard administrativo
  - Criar/editar usuários de todos os níveis
  - Configurar templates organizacionais
  - Gerenciar squads e chapters
  - Definir estrutura hierárquica
  - Acesso total à empresa

### 4. **Usuários dos Outros Níveis (0, 2-7)** 👥
- **Acesso**: `index.html` → "Acessar Plataforma"
- **Papel**: Colaboradores da empresa
- **Criados por**: Administradores Gerais
- **Acesso**: Limitado ao seu nível hierárquico

---

## 🔄 Fluxo de Cadastro de Empresa

### Etapa 1: Dados da Empresa
```
Fundador acessa index.html
  ↓
Clica em "Cadastrar Empresa"
  ↓
Preenche formulário:
  - Nome da empresa
  - Razão social
  - Ano de fundação
  - Porte (pequena, média, grande, corporação)
  - Setor de atuação
  - Descrição
  ↓
Clica em "Próximo"
```

### Etapa 2: Administradores Gerais
```
Adiciona pelo menos 1 administrador:
  - Nome completo
  - Email corporativo
  - Telefone
  - Departamento
  - Nome de usuário
  - Senha
  - Marcar se é administrador principal
  ↓
Pode adicionar múltiplos administradores
  ↓
Clica em "Próximo"
```

### Etapa 3: Revisão
```
Revisa todas as informações
  ↓
Clica em "Finalizar Cadastro"
  ↓
Sistema cria:
  1. Empresa no banco
  2. Administradores Gerais (Nível 1)
  3. Credenciais de acesso
  ↓
Administradores podem fazer login
```

---

## 🔐 Fluxo de Login

### Para Colaboradores da Empresa:
```
Acessa index.html
  ↓
Clica em "Acessar Plataforma"
  ↓
Seleciona a empresa no dropdown
  ↓
Digita nome de usuário
  ↓
Digita senha
  ↓
Sistema valida e redireciona para dashboard do nível
```

### Para Desenvolvedor:
```
Acessa index.html
  ↓
Clica em "🛠️ Painel do Desenvolvedor" (rodapé)
  ↓
Redireciona para /desenvolvedor/dev-login.html
  ↓
Faz login com credenciais de desenvolvedor
  ↓
Acessa painel completo com todas as empresas
```

---

## 🎯 Hierarquia de Níveis

| Nível | Papel | Quem Cria |
|-------|-------|-----------|
| **0** | Presidentes 👑 | Admin Geral |
| **1** | Administradores Gerais ⚙️ | Fundador (no cadastro da empresa) |
| **2** | Diretores Executivos 📊 | Admin Geral |
| **3** | Gerentes 📈 | Admin Geral ou Diretores |
| **4** | Coordenadores 🎯 | Admin Geral ou Gerentes |
| **5** | Supervisores 👁️ | Admin Geral ou Coordenadores |
| **6** | Analistas 💼 | Admin Geral ou Supervisores |
| **7** | Assistentes 📝 | Admin Geral ou Analistas |

---

## 💡 Casos de Uso

### Caso 1: Nova Empresa
```
João é fundador da TechStart
  ↓
Acessa Ascenda → "Cadastrar Empresa"
  ↓
Preenche dados da TechStart
  ↓
Cadastra:
  - Maria (Admin Principal - TI)
  - Pedro (Admin - Finanças)
  ↓
Sistema cria empresa e administradores
  ↓
Maria e Pedro recebem credenciais
  ↓
Maria e Pedro fazem login
  ↓
Criam estrutura: CEO, Diretores, Gerentes, etc.
  ↓
Criam squads e chapters
```

### Caso 2: Desenvolvedor Prestando Suporte
```
Empresa TechStart reporta problema
  ↓
Você acessa Painel do Desenvolvedor
  ↓
Busca empresa "TechStart"
  ↓
Usa Quick Login ou Explorador
  ↓
Visualiza o problema como usuário
  ↓
Resolve o problema
  ↓
Sai do modo desenvolvedor
```

### Caso 3: Administrador Gerenciando Equipe
```
Maria (Admin Geral) faz login
  ↓
Acessa Dashboard Administrativo
  ↓
Vai em "Gestão de Usuários"
  ↓
Cria novo usuário:
  - Nome: Carlos
  - Nível: 3 (Gerente)
  - Departamento: Vendas
  ↓
Carlos recebe credenciais
  ↓
Carlos faz login e acessa Dashboard de Gerentes
```

---

## 🔒 Segurança e Isolamento

- ✅ **Empresas isoladas**: Cada empresa vê apenas seus dados
- ✅ **Controle de acesso**: Níveis hierárquicos limitam funcionalidades
- ✅ **Auditoria**: Logs registram todas as ações (quando, quem, o quê)
- ✅ **JWT**: Tokens seguros com expiração de 24h
- ✅ **Desenvolvedor identificado**: Impersonation sempre marcado com banner

---

## 📍 Pontos de Entrada da Plataforma

| URL | Quem Acessa | Propósito |
|-----|-------------|-----------|
| `/index.html` | Fundadores e Colaboradores | Cadastrar empresa ou fazer login |
| `/desenvolvedor/dev-login.html` | Desenvolvedor (você) | Suporte e manutenção |
| `/Nivel00-Presidentes/` | Presidentes | Dashboard executivo |
| `/Nivel01-AdministradoresGerais/` | Admins Gerais | Gestão completa |
| `/Nivel02-DiretoresExecutivos/` | Diretores | Gestão departamental |
| (demais níveis...) | Outros níveis | Funcionalidades específicas |

---

## 🎨 Interface do Desenvolvedor vs Interface Pública

### Interface Pública (`index.html`):
- ✅ Cadastro de empresas (fundadores)
- ✅ Login de colaboradores
- ✅ Visual corporativo e profissional
- ✅ Formulários multi-etapa
- ✅ Link discreto para painel do desenvolvedor no rodapé

### Painel do Desenvolvedor (`/desenvolvedor/`):
- 🛠️ Acesso exclusivo para você
- 🛠️ Visualização de todas as empresas
- 🛠️ Quick Login e Explorador
- 🛠️ Ferramentas de debug e suporte
- 🛠️ Logs de auditoria
- 🛠️ Seed de dados para testes

---

## ✅ Recomendação Final

**Mantenha o fluxo atual**: É perfeito para uma plataforma B2B SaaS!

1. **Fundadores cadastram** suas empresas livremente
2. **Administradores Gerais** (criados no cadastro) gerenciam tudo
3. **Você (desenvolvedor)** acessa via painel separado para suporte

Esse é o padrão usado por plataformas como:
- Slack (alguém cria workspace, convida admins)
- Trello (alguém cria organização, convida membros)
- Notion (alguém cria workspace, convida equipe)

**Benefícios**:
- ✅ Self-service: Empresas se cadastram sozinhas
- ✅ Escalável: Você não precisa cadastrar cada empresa
- ✅ Seguro: Cada empresa gerencia seus próprios dados
- ✅ Suporte eficiente: Você acessa quando necessário via painel dev
