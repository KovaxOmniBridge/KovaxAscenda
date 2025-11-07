# 🔄 Sistema Multi-Role - Fluxo Visual

## 📊 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         BANCO DE DADOS                          │
├─────────────────────────────────────────────────────────────────┤
│  users                                                          │
│  ├─ id: 1                                                       │
│  ├─ name: "João Silva"                                         │
│  ├─ nivel: 0                    ← PAPEL PRIMÁRIO              │
│  ├─ additional_roles: "[1, 5]"  ← PAPÉIS EXTRAS               │
│  └─ can_switch_roles: 1         ← HABILITA TROCA              │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                            LOGIN                                 │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/auth/login                                           │
│  {                                                               │
│    companyId: 1,                                                │
│    accessKey: "JOAO-001",                                       │
│    password: "senha123"                                         │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      RESPOSTA DO SERVIDOR                        │
├─────────────────────────────────────────────────────────────────┤
│  {                                                               │
│    token: "eyJhbGc...",                                         │
│    user: {                                                       │
│      id: 1,                                                      │
│      name: "João Silva",                                        │
│      nivel: 0,                                                   │
│      additional_roles: "[1, 5]",  ← ENVIADO PARA FRONTEND      │
│      can_switch_roles: true                                     │
│    }                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                               ↓
              ┌────────────────┴────────────────┐
              │                                  │
    additional_roles != null         additional_roles == null
    can_switch_roles == true         ou can_switch_roles == false
              │                                  │
              ↓                                  ↓
┌──────────────────────────────┐   ┌──────────────────────────────┐
│  TELA DE SELEÇÃO DE PAPEL    │   │   DASHBOARD DIRETO           │
│  role-switcher.html          │   │   (nivel primário)           │
├──────────────────────────────┤   ├──────────────────────────────┤
│  Escolha seu papel:          │   │   Redireciona para:          │
│                              │   │   dashboard-supervisores.html│
│  ┌────────────────────────┐ │   └──────────────────────────────┘
│  │ 👑 Presidente (0)      │ │
│  └────────────────────────┘ │
│  ┌────────────────────────┐ │
│  │ ⚙️ Administrador (1)   │ │
│  └────────────────────────┘ │
│  ┌────────────────────────┐ │
│  │ 👥 Supervisor (5)      │ │
│  └────────────────────────┘ │
└──────────────────────────────┘
              ↓
      [Usuário seleciona]
              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    DASHBOARD SELECIONADO                         │
│                    (ex: dashboard-presidentes.html)              │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Header                                                     │ │
│  │  ┌──────────────────────────────────┐                     │ │
│  │  │ 🔄 Papel: Presidente ▼           │  ← BOTÃO DE TROCA  │ │
│  │  └──────────────────────────────────┘                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [Conteúdo do Dashboard Presidentes]                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
              ↓
      [Clica no botão 🔄]
              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    MODAL DE TROCA                                │
├──────────────────────────────────────────────────────────────────┤
│  🔄 Trocar de Papel                                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 👑 Presidente (Nível 0)                            ✓ ATUAL │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ⚙️ Administrador (Nível 1)                     [Clicar]   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 👥 Supervisor (Nível 5)                        [Clicar]   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Cancelar]                                                     │
└──────────────────────────────────────────────────────────────────┘
              ↓
      [Seleciona Administrador]
              ↓
┌──────────────────────────────────────────────────────────────────┐
│              REDIRECIONA PARA NOVO DASHBOARD                     │
│              dashboard-admin.html                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

```
┌──────────┐    Login    ┌──────────┐   Valida   ┌──────────┐
│ Frontend │ ─────────→  │ Backend  │ ─────────→ │   DB     │
│          │             │          │            │          │
└──────────┘             └──────────┘            └──────────┘
     ↑                         │                       │
     │                         │                       │
     │                         ↓                       │
     │                   ┌──────────┐                 │
     │                   │  Token   │                 │
     │                   │   JWT    │                 │
     │                   └──────────┘                 │
     │                         │                       │
     │      Response           │                       │
     │  ←──────────────────────┘                      │
     │   {token, user}                                 │
     │                                                 │
     │                                                 │
     ↓                                                 ↓
┌────────────────────────────────────────────────────────┐
│              localStorage                              │
├────────────────────────────────────────────────────────┤
│  - token: "eyJhbGc..."                                │
│  - userData: {                                         │
│      nivel: 0,                                         │
│      additional_roles: "[1, 5]",                      │
│      can_switch_roles: true                           │
│    }                                                   │
│  - selectedRole: 0  ← PAPEL ATUAL SELECIONADO         │
└────────────────────────────────────────────────────────┘
            ↓
    [role-switcher.js]
    Verifica additional_roles
            ↓
    ┌───────┴────────┐
    │                │
  TEM           NÃO TEM
    │                │
    ↓                ↓
[Seleção]      [Dashboard]
```

---

## 🎯 Casos de Uso por Tipo de Empresa

### 🏢 MICROEMPRESA (1-10 funcionários)
```
FUNDADOR
├─ Nível 0: Decisões estratégicas
├─ Nível 1: Gestão de tudo
├─ Nível 3: Gerencia vendas
└─ Nível 5: Supervisiona atendimento

FUNCIONÁRIO-CHAVE
├─ Nível 3: Gerente de operações
├─ Nível 5: Supervisor de equipe
└─ Nível 7: Operações práticas
```

### 🏬 PEQUENA EMPRESA (11-50 funcionários)
```
CEO
├─ Nível 0: Visão estratégica
└─ Nível 1: Gestão corporativa

GERENTE REGIONAL
├─ Nível 2: Diretor de região
├─ Nível 3: Gerente local
└─ Nível 5: Supervisão direta

COORDENADOR
├─ Nível 4: Coordenação
└─ Nível 7: Operações eventuais
```

### 🏭 MÉDIA EMPRESA (51-250 funcionários)
```
EXECUTIVO
├─ Nível 0: C-Level
└─ Nível 2: Diretor de área

GERENTE SÊNIOR
├─ Nível 3: Gestão de departamento
└─ Nível 4: Coordenação de projetos

SUPERVISOR
├─ Nível 5: Supervisão
└─ Nível 6: Especialização técnica
```

---

## 🔐 Segurança e Validação

```
Frontend                    Backend                   Database
────────                   ────────                   ────────

Seleciona Papel
     │
     ├─ Valida localmente
     │  (userData.additional_roles)
     │
     ↓
Redireciona
     │
     ↓
Dashboard carrega
     │
     ├─ Token JWT no header
     │
     ↓
API Request              Middleware Auth
     │    ────────────→      │
     │                        ├─ Verifica token
     │                        │
     │                        ↓
     │                   Extrai userId
     │                        │
     │                        ↓
     │                   Busca no DB
     │                        │  ────────→  SELECT *
     │                        │                FROM users
     │                        │                WHERE id = ?
     │                        │             ←────────────
     │                        │
     │                        ├─ Valida papel solicitado
     │                        │  está em (nivel ou
     │                        │  additional_roles)
     │                        │
     │                        ↓
     │                   ┌─────┴─────┐
     │                   │           │
     │                VÁLIDO     INVÁLIDO
     │                   │           │
     │   ←───────────────┘           │
     │   200 OK                      ↓
     │                           403 Forbidden
     ↓
Renderiza dados
```

---

## 📱 Componentes e Responsabilidades

```
┌─────────────────────────────────────────────────────────────┐
│                    role-switcher.html                       │
├─────────────────────────────────────────────────────────────┤
│  Responsabilidade: Tela inicial de seleção                 │
│  Quando: Logo após login (se tem multiple roles)           │
│  Ação: Usuário clica em um papel → Redireciona            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              role-switcher-component.js                     │
├─────────────────────────────────────────────────────────────┤
│  Responsabilidade: Botão de troca nos dashboards           │
│  Quando: Dashboard carrega (verifica additional_roles)     │
│  Ação: Injeta botão no header + Modal de troca            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 auth.controller.js                          │
├─────────────────────────────────────────────────────────────┤
│  Responsabilidade: Retornar additional_roles no login       │
│  Quando: POST /api/auth/login                              │
│  Ação: Busca user.additional_roles do banco                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    schema.js / DB                           │
├─────────────────────────────────────────────────────────────┤
│  Responsabilidade: Armazenar papéis do usuário             │
│  Campos:                                                    │
│    - nivel: INTEGER (papel primário)                       │
│    - additional_roles: TEXT (JSON array)                   │
│    - can_switch_roles: INTEGER (0/1)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Estados do Sistema

```
USUÁRIO SEM MÚLTIPLOS PAPÉIS
─────────────────────────────
Login → Dashboard Direto (sem seleção)
Header → SEM botão de troca

USUÁRIO COM MÚLTIPLOS PAPÉIS
─────────────────────────────
Login → Tela de Seleção → Escolhe Papel → Dashboard
Header → COM botão de troca → Modal → Escolhe outro → Redirect

DESENVOLVEDOR (God Mode)
────────────────────────
Interface Explorer → Pode ver TODAS as interfaces
Independente de configuração de papéis
```

---

**Criado em:** Novembro 2025  
**Versão:** 1.0  
**Status:** ✅ Documentação Completa
