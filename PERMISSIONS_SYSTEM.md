# 🔐 Sistema de Permissões Granulares

## 📋 Visão Geral

Sistema que controla **o que cada nível hierárquico pode VER e FAZER** na plataforma. Elementos sem permissão ficam **visíveis mas bloqueados e opacos**, mantendo a consistência da interface.

---

## 🎯 Conceitos

### **View Permissions (Visualização)**
Controla **quais seções/dados** o usuário pode ver:
- ✅ Tem permissão → Conteúdo visível e legível
- ❌ Sem permissão → Seção oculta ou borrada

### **Action Permissions (Ações)**
Controla **quais ações** o usuário pode executar:
- ✅ Tem permissão → Botão ativo e clicável
- ❌ Sem permissão → Botão bloqueado (opaco + cursor not-allowed + 🔒)

### **Sensitive Data (Dados Sensíveis)**
Informações restritas por nível:
- ✅ Nível suficiente → Dado visível
- ❌ Nível insuficiente → Mascara com `•••••`

---

## 🔧 Como Usar

### **1. Incluir Scripts no HTML**

```html
<head>
    <!-- Sistema de Permissões -->
    <script src="/shared/permissions.js"></script>
    <script src="/shared/ui-permissions.js"></script>
</head>
```

### **2. Marcar Elementos com Atributos**

#### **Botões de Ação:**
```html
<button 
    data-action="criar_usuarios"
    data-required-level="1"
    data-block-reason="Apenas Administradores podem criar usuários">
    ➕ Criar Usuário
</button>
```

#### **Seções de Visualização:**
```html
<div 
    data-view="relatorios_financeiros" 
    data-hide-mode="blur">
    <!-- Conteúdo financeiro -->
</div>
```

#### **Dados Sensíveis:**
```html
<span 
    data-sensitive 
    data-required-level="2">
    R$ 125.000,00
</span>
```

#### **Campos de Formulário:**
```html
<input 
    type="text" 
    data-action="editar_dados_empresa"
    data-required-level="1">
```

---

## 📊 Matriz de Permissões

### **Nível 0 - Presidente/C-Level**

| Permissão | Ver | Fazer |
|-----------|-----|-------|
| Dashboard Executivo | ✅ | ✅ |
| KPIs Corporativos | ✅ | ✅ |
| Estrutura Completa | ✅ | ❌ (delega) |
| Todos os Usuários | ✅ | ❌ (delega) |
| Relatórios Financeiros | ✅ | ✅ |
| Aprovar Orçamentos | ✅ | ✅ |
| Aprovar Investimentos | ✅ | ✅ |
| Criar/Editar Usuários | ❌ | ❌ |
| Criar Squads | ❌ | ❌ |

**Filosofia:** Visão completa, decisões estratégicas, execução delegada.

---

### **Nível 1 - Administrador Geral**

| Permissão | Ver | Fazer |
|-----------|-----|-------|
| Todos os Módulos | ✅ | ✅ |
| Criar Usuários | ✅ | ✅ |
| Editar Estrutura | ✅ | ✅ |
| Deletar Usuários | ✅ | ✅ |
| Configurar Templates | ✅ | ✅ |
| Gerenciar Squads | ✅ | ✅ |
| Dados da Empresa | ✅ | ✅ |

**Filosofia:** Controle total operacional da empresa.

---

### **Nível 2 - Diretor Executivo**

| Permissão | Ver | Fazer |
|-----------|-----|-------|
| Dashboard Setor | ✅ | ✅ |
| Usuários do Setor | ✅ | ✅ |
| Criar Usuários (3-7) | ✅ | ✅ |
| Editar Usuários | ✅ | ✅ (só do setor) |
| Deletar Usuários | ❌ | ❌ |
| Aprovar Orçamento Setor | ✅ | ✅ |
| Relatórios do Setor | ✅ | ✅ |

**Filosofia:** Autonomia no setor, sem poderes destrutivos.

---

### **Nível 3 - Gerente**

| Permissão | Ver | Fazer |
|-----------|-----|-------|
| Dashboard Departamento | ✅ | ✅ |
| Usuários Departamento | ✅ | ✅ |
| Criar Usuários (4-7) | ✅ | ✅ |
| Editar Estrutura | ❌ | ❌ |
| Alocar Recursos | ✅ | ✅ |
| Definir Metas | ✅ | ✅ |
| Exportar Relatórios | ✅ | ✅ |
| Dados Financeiros | ❌ | ❌ |

**Filosofia:** Gestão do departamento, sem acesso financeiro.

---

### **Nível 4 - Coordenador**

| Permissão | Ver | Fazer |
|-----------|-----|-------|
| Projetos | ✅ | ✅ |
| Criar Projetos | ✅ | ✅ |
| Atribuir Tarefas | ✅ | ✅ |
| Alocar Recursos Projeto | ✅ | ✅ |
| Criar Usuários | ❌ | ❌ |
| Ver Salários | ❌ | ❌ |

**Filosofia:** Coordenação de projetos, sem gestão de pessoas.

---

### **Nível 5 - Supervisor**

| Permissão | Ver | Fazer |
|-----------|-----|-------|
| Equipe Direta | ✅ | ✅ |
| Atribuir Tarefas | ✅ | ✅ |
| Avaliar Performance | ✅ | ✅ |
| Aprovar Timesheet | ✅ | ✅ |
| Criar Usuários | ❌ | ❌ |
| Exportar Relatórios | ❌ | ❌ |

**Filosofia:** Supervisão direta, sem poderes administrativos.

---

### **Nível 6 - Especialista**

| Permissão | Ver | Fazer |
|-----------|-----|-------|
| Tarefas Pessoais | ✅ | ✅ |
| Projetos Atribuídos | ✅ | ✅ |
| Executar Tarefas | ✅ | ✅ |
| Solicitar Recursos | ✅ | ✅ |
| Ver Outras Áreas | ❌ | ❌ |

**Filosofia:** Foco na execução técnica especializada.

---

### **Nível 7 - Operacional**

| Permissão | Ver | Fazer |
|-----------|-----|-------|
| Tarefas Pessoais | ✅ | ✅ |
| Executar Tarefas | ✅ | ✅ |
| Registrar Atividades | ✅ | ✅ |
| Ver Estrutura | ❌ | ❌ |
| Acessar Relatórios | ❌ | ❌ |

**Filosofia:** Execução operacional básica.

---

## 🎨 Estados Visuais

### **Botão Ativo (Com Permissão)**
```css
opacity: 1
cursor: pointer
background: #667eea (colorido)
hover: transform: translateY(-2px)
```

### **Botão Bloqueado (Sem Permissão)**
```css
opacity: 0.5
cursor: not-allowed
background: #667eea (desbotado)
disabled: true
Ícone: 🔒
Tooltip: "Ação não permitida"
```

### **Campo Bloqueado**
```css
opacity: 0.4
cursor: not-allowed
pointer-events: none
disabled: true
```

### **Seção Oculta**
```css
Mode "remove": display: none
Mode "blur": filter: blur(8px) + opacity: 0.3
```

### **Dado Sensível**
```
Com permissão: "R$ 125.000,00"
Sem permissão: "•••••"
```

---

## 💻 API JavaScript

### **Verificar Permissões**
```javascript
// Verificar se pode fazer ação
if (PermissionManager.canDo('criar_usuarios')) {
    criarUsuario();
}

// Verificar se pode ver seção
if (PermissionManager.canView('relatorios_financeiros')) {
    mostrarRelatorios();
}
```

### **Aplicar Permissões Dinamicamente**
```javascript
// Após carregar conteúdo dinâmico
PermissionManager.applyPermissions();

// Mascarar dados sensíveis
PermissionManager.maskSensitiveData();
```

---

## 🔄 Fluxo de Funcionamento

```
Página Carrega
    ↓
ui-permissions.js inicializa
    ↓
Lê localStorage:
  - userData
  - selectedRole (papel atual)
    ↓
Carrega permissões do nível:
  permissions.js → PERMISSIONS[nivel]
    ↓
Escaneia DOM em busca de:
  - [data-action]
  - [data-view]
  - [data-sensitive]
  - [data-permission]
    ↓
Para cada elemento:
  ├─ Tem permissão? → Mantém normal
  └─ Sem permissão? → Bloqueia/Oculta
        ↓
    Aplica estilos:
      - opacity: 0.4-0.5
      - cursor: not-allowed
      - disabled: true
      - Adiciona 🔒
      - Tooltip explicativo
```

---

## 🧪 Exemplo de Uso Completo

```html
<!DOCTYPE html>
<html>
<head>
    <script src="/shared/permissions.js"></script>
    <script src="/shared/ui-permissions.js"></script>
</head>
<body>
    <!-- Seção visível apenas para Admin -->
    <div data-view="configuracoes_empresa">
        <h2>⚙️ Configurações</h2>
        
        <!-- Botão ativo apenas para Admin -->
        <button 
            data-action="editar_dados_empresa"
            data-required-level="1"
            data-block-reason="Apenas Admin pode editar">
            Salvar
        </button>
        
        <!-- Dado visível apenas para Diretores+ -->
        <p>
            Faturamento: 
            <span data-sensitive data-required-level="2">
                R$ 500.000,00
            </span>
        </p>
    </div>
</body>
</html>
```

---

## 🎯 Casos de Uso

### **1. Pequena Empresa**
```
Dono (Nível 0+1):
  - Ver tudo
  - Aprovar decisões estratégicas
  - Não edita diretamente (mantém integridade)

Gerente (Nível 3):
  - Ver apenas seu departamento
  - Criar tarefas e alocar recursos
  - Dados financeiros bloqueados (•••••)
```

### **2. Média Empresa**
```
CEO (Nível 0):
  - Dashboard executivo completo
  - Botões de gestão bloqueados (delega ao Admin)
  - Aprovações estratégicas ativas

Admin (Nível 1):
  - Todas as ações administrativas
  - Botões de criação/edição ativos
  
Supervisor (Nível 5):
  - Apenas sua equipe
  - Botões de gestão bloqueados
  - Pode atribuir tarefas
```

---

## 🔒 Segurança

### **Validações**

1. **Frontend:**
   - Bloqueia UI baseado em `selectedRole`
   - Impede cliques em elementos bloqueados
   - Mostra feedback visual

2. **Backend (OBRIGATÓRIO):**
   ```javascript
   // Sempre validar no servidor
   if (!canUserDoAction(userId, action)) {
       return res.status(403).json({ 
           error: 'Sem permissão' 
       });
   }
   ```

3. **Token JWT:**
   - Contém `nivel` primário
   - Backend valida contra banco
   - Frontend é apenas UX

---

## 📁 Estrutura de Arquivos

```
shared/
├── permissions.js              # Matriz de permissões
├── ui-permissions.js           # Gerenciador de UI
└── permission-example.html     # Exemplo completo
```

---

## ✅ Checklist de Implementação

- [ ] Incluir `permissions.js` e `ui-permissions.js` em todos os dashboards
- [ ] Marcar botões com `data-action`
- [ ] Marcar seções com `data-view`
- [ ] Marcar dados sensíveis com `data-sensitive`
- [ ] Adicionar validações no backend
- [ ] Testar com diferentes níveis
- [ ] Documentar permissões personalizadas

---

## 🎨 Customização

### **Modificar Permissões**

Edite `shared/permissions.js`:

```javascript
const PERMISSIONS = {
    3: {  // Nível 3 - Gerente
        view: {
            dashboard: true,
            relatorios_financeiros: false // ← Altere aqui
        },
        actions: {
            criar_usuarios: false, // ← Ou aqui
            exportar_relatorios: true
        }
    }
};
```

### **Adicionar Nova Permissão**

1. Adicione em `permissions.js`:
```javascript
actions: {
    minha_nova_acao: true
}
```

2. Use no HTML:
```html
<button data-action="minha_nova_acao">
    Minha Ação
</button>
```

---

## 🐛 Troubleshooting

**Elementos não estão sendo bloqueados:**
- Verifique se scripts estão incluídos
- Confira se `localStorage` tem `selectedRole`
- Abra Console e veja erros

**Dados sensíveis aparecem:**
- Confirme atributo `data-sensitive`
- Verifique `data-required-level`
- Teste com nível inferior

**Botões ficam bloqueados mas deveriam estar ativos:**
- Revise `permissions.js` para o nível
- Confirme `data-action` correto
- Teste alterando `selectedRole`

---

**Criado em:** Novembro 2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para Produção
