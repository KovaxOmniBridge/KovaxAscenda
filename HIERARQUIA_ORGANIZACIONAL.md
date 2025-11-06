# 🏢 HIERARQUIA ORGANIZACIONAL - ASCENDA

## 📋 Visão Geral

Sistema hierárquico em cascata onde cada nível possui autonomia para gerenciar o nível imediatamente inferior.

---

## 🎯 ESTRUTURA DE CADASTROS

### **Fluxo de Cadastros em Cascata:**

```
EMPRESA
    ↓
ADMINISTRADORES GERAIS (Super Admin da Empresa)
    ↓
EXECUTIVOS + DIRETORES (por Setor)
    ↓
GERENTES (por Departamento)
    ↓
SUPERVISORES (por Equipe)
    ↓
FUNCIONÁRIOS
```

---

## 👥 NÍVEIS HIERÁRQUICOS DETALHADOS

### **NÍVEL 0: EMPRESA** 🏢
**Cadastrada por:** Sistema Developer (Painel Developer)
- **Entidade:** Pessoa Jurídica (CNPJ)
- **Dados:** Razão Social, CNPJ, Endereço, Tipo de Negócio, Fonte de Renda
- **Status:** Ativa, Inativa, Suspensa
- **Módulos:** Todos os módulos Ascenda disponíveis

**Ações:**
- ✅ Criação da empresa no sistema
- ✅ Definição de Administradores Gerais iniciais
- ✅ Configuração de módulos ativos
- ✅ Definição de fonte de renda principal

---

### **NÍVEL 1: ADMINISTRADOR GERAL** 👑
**Cadastrado por:** Sistema Developer ou outro Admin Geral
- **Role:** `COMPANY_ADMIN`
- **AccessLevel:** `SUPERADMIN` (dentro da sua empresa)
- **Permissões:** `['ALL']` (escopo: empresa específica)

**Responsabilidades:**
- ✅ **Acesso total** a todos os módulos da empresa
- ✅ Visualizar e editar **todas as informações** da empresa
- ✅ Cadastrar e gerenciar **Executivos**
- ✅ Cadastrar e gerenciar **Diretores de Setor**
- ✅ Aprovar decisões críticas (contratações, demissões, investimentos)
- ✅ Definir estratégia corporativa
- ✅ Configurar permissões personalizadas
- ✅ Acessar relatórios financeiros completos
- ✅ Gerenciar estrutura organizacional

**Pode cadastrar:**
- ✅ Executivos (CEO, CFO, COO, CTO)
- ✅ Diretores de todos os setores
- ✅ Outros Administradores Gerais (se necessário)

**Não pode:**
- ❌ Excluir a empresa
- ❌ Transferir propriedade (somente Developer pode)
- ❌ Acessar outras empresas

---

### **NÍVEL 2: EXECUTIVOS** 👔
**Cadastrados por:** Administrador Geral
- **Roles:** `CEO`, `CFO`, `COO`, `CTO`, `BOARD_MEMBER`
- **AccessLevel:** `EXECUTIVE`
- **Permissões:** Visão estratégica e consolidada

**Responsabilidades:**
- ✅ Definir estratégia corporativa
- ✅ Tomada de decisões críticas
- ✅ Visão consolidada de todos os setores
- ✅ Análise de performance executiva
- ✅ Governança e compliance
- ✅ Aprovar orçamentos e investimentos

**Pode visualizar:**
- ✅ Todos os setores e departamentos
- ✅ Relatórios consolidados
- ✅ Métricas financeiras
- ✅ KPIs de toda a empresa

**Pode cadastrar:**
- ✅ Outros Executivos (com aprovação do Admin Geral)
- ✅ Diretores (com recomendação)

**Não pode:**
- ❌ Alterar configurações da empresa
- ❌ Excluir Administradores Gerais
- ❌ Modificar estrutura fundamental

---

### **NÍVEL 2: DIRETORES DE SETOR** 🎯
**Cadastrados por:** Administrador Geral ou Executivos
- **Roles:** `DIRECTOR_OPERATIONS`, `DIRECTOR_SALES`, `DIRECTOR_HR`, `DIRECTOR_FINANCE`, `DIRECTOR_IT`, `DIRECTOR_MARKETING`, etc.
- **AccessLevel:** `DIRECTOR`
- **Permissões:** Gestão completa do setor específico

**Setores Principais:**
1. **Diretor de Operações** - Produção, Logística, Qualidade
2. **Diretor Comercial** - Vendas, Marketing, Clientes
3. **Diretor de RH** - Pessoas, Cultura, Benefícios
4. **Diretor Financeiro** - Finanças, Contabilidade, Auditoria
5. **Diretor de TI** - Tecnologia, Infraestrutura, Segurança
6. **Diretor Jurídico** - Legal, Compliance, Contratos
7. **Diretor de P&D** - Inovação, Desenvolvimento, Pesquisa

**Responsabilidades:**
- ✅ Gestão estratégica do setor
- ✅ Definir metas e KPIs do setor
- ✅ Cadastrar e gerenciar **Gerentes**
- ✅ Aprovar orçamentos do setor
- ✅ Reportar aos Executivos
- ✅ Coordenar entre departamentos

**Pode cadastrar:**
- ✅ Gerentes do seu setor
- ✅ Departamentos dentro do setor

**Não pode:**
- ❌ Cadastrar Gerentes de outros setores
- ❌ Modificar estrutura da empresa
- ❌ Acessar dados confidenciais de outros setores

---

### **NÍVEL 3: GERENTES DE DEPARTAMENTO** 📊
**Cadastrados por:** Diretores de Setor
- **Roles:** `MANAGER_SALES`, `MANAGER_HR`, `MANAGER_PRODUCTION`, `MANAGER_FINANCE`, etc.
- **AccessLevel:** `MANAGER`
- **Permissões:** Gestão operacional do departamento

**Exemplos de Gerentes por Setor:**

**Setor Operações:**
- Gerente de Produção
- Gerente de Logística
- Gerente de Qualidade
- Gerente de Manutenção

**Setor Comercial:**
- Gerente de Vendas
- Gerente de Marketing
- Gerente de Atendimento

**Setor RH:**
- Gerente de Recrutamento
- Gerente de Desenvolvimento
- Gerente de Benefícios

**Responsabilidades:**
- ✅ Gestão operacional do departamento
- ✅ Cadastrar e gerenciar **Supervisores**
- ✅ Aprovar folgas e pequenas despesas
- ✅ Monitorar performance da equipe
- ✅ Reportar ao Diretor
- ✅ Implementar processos

**Pode cadastrar:**
- ✅ Supervisores do seu departamento
- ✅ Equipes dentro do departamento

**Não pode:**
- ❌ Cadastrar Supervisores de outros departamentos
- ❌ Alterar políticas do setor
- ❌ Acessar dados financeiros sensíveis

---

### **NÍVEL 4: SUPERVISORES DE EQUIPE** 👨‍💼
**Cadastrados por:** Gerentes
- **Roles:** `SUPERVISOR_TEAM`, `TEAM_LEAD`
- **AccessLevel:** `SUPERVISOR`
- **Permissões:** Gestão direta da equipe operacional

**Responsabilidades:**
- ✅ Gestão direta dos funcionários
- ✅ Cadastrar e gerenciar **Funcionários** da equipe
- ✅ Aprovar pequenas solicitações (folgas, materiais)
- ✅ Monitorar produtividade diária
- ✅ Reportar ao Gerente
- ✅ Treinar funcionários
- ✅ Resolver conflitos internos

**Pode cadastrar:**
- ✅ Funcionários da sua equipe
- ✅ Registrar ponto e presença

**Não pode:**
- ❌ Cadastrar Supervisores
- ❌ Alterar salários
- ❌ Demitir funcionários (apenas solicitar)
- ❌ Acessar dados de outras equipes

---

### **NÍVEL 5: FUNCIONÁRIOS** 👤
**Cadastrados por:** Supervisores de Equipe
- **Role:** `EMPLOYEE`
- **AccessLevel:** `BASIC`
- **Permissões:** Acesso limitado ao próprio perfil e funções

**Responsabilidades:**
- ✅ Executar tarefas designadas
- ✅ Registrar ponto
- ✅ Visualizar próprio perfil
- ✅ Solicitar folgas/férias
- ✅ Visualizar benefícios
- ✅ Acessar documentos pessoais

**Pode:**
- ✅ Ver próprios dados
- ✅ Editar informações básicas (contato, endereço)
- ✅ Baixar holerites
- ✅ Acessar treinamentos

**Não pode:**
- ❌ Ver dados de outros funcionários
- ❌ Cadastrar ninguém
- ❌ Alterar permissões
- ❌ Acessar dados financeiros da empresa

---

## 🔐 MATRIZ DE PERMISSÕES

| Ação | Admin Geral | Executivo | Diretor | Gerente | Supervisor | Funcionário |
|------|-------------|-----------|---------|---------|------------|-------------|
| **Cadastrar Empresa** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Cadastrar Admin Geral** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Cadastrar Executivo** | ✅ | ✅* | ❌ | ❌ | ❌ | ❌ |
| **Cadastrar Diretor** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Cadastrar Gerente** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Cadastrar Supervisor** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Cadastrar Funcionário** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Ver Dados Financeiros** | ✅ | ✅ | 🟡 | 🟡 | ❌ | ❌ |
| **Alterar Salários** | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ |
| **Demitir Funcionários** | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ |
| **Acessar Todos Módulos** | ✅ | ✅ | 🟡 | 🟡 | ❌ | ❌ |
| **Exportar Dados** | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ |

**Legenda:**
- ✅ = Permissão total
- 🟡 = Permissão parcial (apenas seu escopo)
- ❌ = Sem permissão
- \* = Necessita aprovação

---

## 📊 FLUXO DE CADASTRO NA PRÁTICA

### **Exemplo Prático: Empresa "Tech Solutions LTDA"**

```
1. Developer cadastra a EMPRESA:
   └─ Tech Solutions LTDA (CNPJ: 12.345.678/0001-90)

2. Developer cadastra ADMINISTRADOR GERAL:
   └─ João Silva (CEO/Founder) - [COMPANY_ADMIN]

3. João Silva (Admin Geral) cadastra EXECUTIVOS:
   ├─ Maria Santos (CFO) - [CFO]
   ├─ Pedro Costa (COO) - [COO]
   └─ Ana Oliveira (CTO) - [CTO]

4. João Silva cadastra DIRETORES:
   ├─ Carlos Lima (Diretor de TI) - [DIRECTOR_IT]
   ├─ Julia Rocha (Diretora de RH) - [DIRECTOR_HR]
   ├─ Roberto Dias (Diretor Comercial) - [DIRECTOR_SALES]
   └─ Fernanda Alves (Diretora Financeira) - [DIRECTOR_FINANCE]

5. Carlos Lima (Diretor TI) cadastra GERENTES:
   ├─ Lucas Martins (Gerente de Desenvolvimento) - [MANAGER_DEV]
   ├─ Beatriz Souza (Gerente de Infraestrutura) - [MANAGER_INFRA]
   └─ Rafael Cunha (Gerente de Suporte) - [MANAGER_SUPPORT]

6. Lucas Martins (Gerente Dev) cadastra SUPERVISORES:
   ├─ Gabriel Silva (Supervisor Frontend) - [SUPERVISOR_FRONTEND]
   ├─ Mariana Teixeira (Supervisora Backend) - [SUPERVISOR_BACKEND]
   └─ Bruno Pereira (Supervisor Mobile) - [SUPERVISOR_MOBILE]

7. Gabriel Silva (Supervisor Frontend) cadastra FUNCIONÁRIOS:
   ├─ Alice Costa (Desenvolvedora Frontend Jr) - [EMPLOYEE]
   ├─ Thiago Mendes (Desenvolvedor Frontend Pl) - [EMPLOYEE]
   └─ Camila Rodrigues (Desenvolvedora Frontend Sr) - [EMPLOYEE]
```

---

## 🎯 REGRAS DE NEGÓCIO

### **Regras de Cadastro:**

1. **Cascata Hierárquica**
   - Cada nível só pode cadastrar o nível **imediatamente inferior**
   - Exceção: Admin Geral pode cadastrar todos os níveis

2. **Escopo de Visibilidade**
   - Cada usuário vê apenas seu escopo para baixo
   - Admin Geral: vê toda a empresa
   - Diretor: vê apenas seu setor
   - Gerente: vê apenas seu departamento
   - Supervisor: vê apenas sua equipe

3. **Aprovações**
   - Demissões: requerem aprovação de 2 níveis acima
   - Contratações: aprovadas pelo nível superior
   - Promoções: aprovadas por 2 níveis acima
   - Mudanças salariais: aprovadas por Diretor ou superior

4. **Auditoria**
   - Todas as ações são registradas
   - Quem cadastrou, quando, e mudanças feitas
   - Log de acessos e modificações

5. **Transferências**
   - Funcionários podem ser transferidos entre equipes (Supervisor → Gerente)
   - Entre departamentos (Gerente → Diretor)
   - Entre setores (Diretor → Admin Geral)

---

## 🔧 IMPLEMENTAÇÃO NO SISTEMA

### **Estrutura de Dados (User):**

```javascript
{
  id: "uuid",
  name: "Nome Completo",
  email: "email@empresa.com",
  cpf: "123.456.789-00",
  companyId: "company-uuid", // Empresa à qual pertence
  role: "MANAGER_SALES", // Role específica
  accessLevel: "MANAGER", // Nível hierárquico
  department: "Vendas", // Departamento
  sector: "Comercial", // Setor
  team: "Vendas Sul", // Equipe (se aplicável)
  
  // Hierarquia
  managerId: "uuid-do-gerente", // Quem é o superior direto
  canManage: ["SUPERVISOR", "EMPLOYEE"], // Quem pode cadastrar
  createdBy: "uuid-do-criador", // Quem cadastrou
  
  // Permissões
  permissions: [...],
  customPermissions: {...}, // Permissões personalizadas
  
  // Informações
  hireDate: "2023-01-15",
  salary: 5000.00,
  status: "ACTIVE"
}
```

### **Validação no Backend:**

```javascript
// Exemplo: Verificar se usuário pode cadastrar outro usuário

function canCreateUser(creatorUser, newUserRole) {
  const hierarchyLevels = {
    'COMPANY_ADMIN': ['CEO', 'CFO', 'COO', 'CTO', 'DIRECTOR_*', 'MANAGER_*', 'SUPERVISOR_*', 'EMPLOYEE'],
    'EXECUTIVE': ['DIRECTOR_*', 'MANAGER_*', 'SUPERVISOR_*', 'EMPLOYEE'],
    'DIRECTOR': ['MANAGER_*', 'SUPERVISOR_*', 'EMPLOYEE'],
    'MANAGER': ['SUPERVISOR_*', 'EMPLOYEE'],
    'SUPERVISOR': ['EMPLOYEE'],
    'EMPLOYEE': []
  };
  
  const allowedRoles = hierarchyLevels[creatorUser.accessLevel] || [];
  
  return allowedRoles.some(pattern => {
    if (pattern.includes('*')) {
      return newUserRole.startsWith(pattern.replace('*', ''));
    }
    return pattern === newUserRole;
  });
}
```

---

## 📱 INTERFACE NO SISTEMA

### **Painel do Administrador Geral:**
```
┌─────────────────────────────────────┐
│ 👑 Painel Administrador Geral       │
├─────────────────────────────────────┤
│ ➕ Cadastrar                         │
│   ├─ Executivo                      │
│   ├─ Diretor                        │
│   ├─ Gerente                        │
│   ├─ Supervisor                     │
│   └─ Funcionário                    │
│                                     │
│ 📊 Visualizar                       │
│   ├─ Todos os Setores               │
│   ├─ Todos os Departamentos         │
│   ├─ Todas as Equipes               │
│   └─ Todos os Funcionários          │
│                                     │
│ ⚙️ Configurações                    │
│   ├─ Estrutura Organizacional       │
│   ├─ Permissões Personalizadas      │
│   └─ Módulos Ativos                 │
└─────────────────────────────────────┘
```

### **Painel do Diretor:**
```
┌─────────────────────────────────────┐
│ 🎯 Painel Diretor de TI             │
├─────────────────────────────────────┤
│ ➕ Cadastrar                         │
│   ├─ Gerente (Setor TI)             │
│   ├─ Supervisor (Setor TI)          │
│   └─ Funcionário (Setor TI)         │
│                                     │
│ 📊 Meu Setor - TI                   │
│   ├─ Desenvolvimento (15 pessoas)   │
│   ├─ Infraestrutura (8 pessoas)     │
│   └─ Suporte (12 pessoas)           │
│                                     │
│ 📈 Métricas do Setor                │
│   └─ KPIs, Orçamento, Performance   │
└─────────────────────────────────────┘
```

### **Painel do Supervisor:**
```
┌─────────────────────────────────────┐
│ 👨‍💼 Painel Supervisor Frontend        │
├─────────────────────────────────────┤
│ ➕ Cadastrar Funcionário             │
│                                     │
│ 👥 Minha Equipe (6 pessoas)         │
│   ├─ Alice Costa (Jr)               │
│   ├─ Thiago Mendes (Pl)             │
│   ├─ Camila Rodrigues (Sr)          │
│   └─ [...]                          │
│                                     │
│ 📋 Tarefas e Presença               │
│   └─ Ponto, Folgas, Performance     │
└─────────────────────────────────────┘
```

---

## ✅ VANTAGENS DESTA HIERARQUIA

1. **Clareza Organizacional**
   - Todos sabem seu lugar na hierarquia
   - Cadeia de comando bem definida

2. **Segurança**
   - Permissões em cascata
   - Ninguém tem acesso além do necessário
   - Auditoria completa

3. **Escalabilidade**
   - Fácil adicionar novos setores/departamentos
   - Estrutura cresce naturalmente

4. **Autonomia**
   - Cada nível gerencia seu escopo
   - Reduz dependência do topo

5. **Controle**
   - Admin Geral mantém controle total
   - Mas delega operações diárias

6. **Rastreabilidade**
   - Quem cadastrou quem
   - Histórico completo de mudanças

---

## 🚀 PRÓXIMOS PASSOS

1. **Implementar no Backend:**
   - [ ] Validações de hierarquia
   - [ ] Sistema de aprovações
   - [ ] Log de auditoria
   - [ ] API de transferências

2. **Implementar no Frontend:**
   - [ ] Formulários de cadastro por nível
   - [ ] Visualizações hierárquicas (organograma)
   - [ ] Dashboards por nível
   - [ ] Sistema de notificações

3. **Módulo Developer:**
   - [ ] Ferramenta de criação de empresas
   - [ ] Designação de Admins Gerais
   - [ ] Visualização de hierarquias completas
   - [ ] Simulação de usuários

---

**Documentação criada em:** 05/11/2025
**Sistema:** Ascenda Platform v1.0
**Autor:** Developer Team
