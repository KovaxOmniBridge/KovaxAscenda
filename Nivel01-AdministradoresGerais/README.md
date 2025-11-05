# Nível 1 - Administradores Gerais

Esta pasta contém todos os arquivos da interface dos **Administradores Gerais** da plataforma Ascenda Flex.

## 📁 Estrutura

```
Nivel01-AdministradoresGerais/
├── dashboard-admin.html     # Interface principal do dashboard
├── dashboard-admin.css      # Estilos do dashboard
├── dashboard-admin.js       # Lógica e funcionalidades
├── templates.html           # Configuração de templates organizacionais
├── squads.html              # Gestão de squads ágeis
├── chapters.html            # Gestão de chapters (comunidades)
├── usuarios.html            # CRUD de usuários
└── README.md                # Este arquivo
```

## 🎯 Funcionalidades

### 📊 Dashboard Principal (dashboard-admin.html)
- Estatísticas em tempo real da empresa
- Visão geral de usuários, squads e chapters
- Ações rápidas para gerenciamento

### 🏢 Templates Organizacionais (templates.html)
- Configurar estrutura hierárquica
- Tipos: Startup, Scale-up, Corporate, Custom
- Personalizar níveis ativos

### 🚀 Gestão de Squads (squads.html)
- Criar e gerenciar squads ágeis multifuncionais
- Tipos: Feature, Project, Problem, Innovation
- Alocação de membros com porcentagem

### 📚 Gestão de Chapters (chapters.html)
- Criar comunidades de prática
- Gerenciar especialidades técnicas
- Definir líderes de chapter

### 👥 Gestão de Usuários (usuarios.html)
- Listar todos os usuários
- Adicionar novos usuários
- Filtrar por nível hierárquico
- Editar e excluir usuários

## 🚀 Acesso

Para acessar o dashboard:

1. Faça login na página principal (`../index.html`)
2. Após o login, você será redirecionado para o dashboard correspondente
3. Administradores Gerais (Nível 1) têm acesso completo ao sistema

## 🔐 Permissões

**Nível 1 - Administradores Gerais** têm:
- ✅ Acesso total ao sistema
- ✅ Gestão de todos os usuários
- ✅ Configuração de estrutura organizacional
- ✅ Criação e gerenciamento de squads/chapters
- ✅ God Mode no sistema

## 🔐 Segurança

- ✅ Acesso protegido por JWT (token válido por 24h)
- ✅ Redirecionamento automático ao index se não autenticado
- ✅ Validação de permissões no backend
- ✅ Isolamento por empresa (cada admin vê apenas sua empresa)

## 📚 Documentação

Para guia completo de uso, consulte [`GUIA_DASHBOARD.md`](./GUIA_DASHBOARD.md)

## 🔗 Integração

### Redirecionamentos
- **Login:** `../index.html` → `AdministradorGeral/dashboard.html`
- **Logout:** `AdministradorGeral/dashboard.html` → `../index.html`

### API
Todos os endpoints estão documentados em `../servidor/README.md`

## 💡 Credenciais de Teste

**Empresa:** Ascenda Demo  
**Nome de Usuário:** admin  
**Senha:** 123456

---

**Última atualização:** Novembro 2025
