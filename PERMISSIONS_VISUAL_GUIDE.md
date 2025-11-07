# 🎨 Sistema de Permissões - Guia Visual

## 🖼️ Como Fica na Prática

### **Botão COM Permissão** ✅
```
┌────────────────────────┐
│  ➕ Criar Usuário      │  ← Colorido, clicável
│  [Cursor: pointer]     │
│  [Opacity: 1.0]        │
└────────────────────────┘
Hover: Eleva e destaca
```

### **Botão SEM Permissão** ❌
```
┌────────────────────────┐
│  ➕ Criar Usuário 🔒   │  ← Desbotado, bloqueado
│  [Cursor: not-allowed] │
│  [Opacity: 0.5]        │
│  [Disabled: true]      │
└────────────────────────┘
Tooltip: "Apenas Admin pode criar usuários"
```

---

## 📊 Comparação por Nível

### **Nível 0 (Presidente) vs Nível 5 (Supervisor)**

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD GERENCIAL                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  👑 NÍVEL 0 (PRESIDENTE)                                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ ✅ Aprovar   │  │ ❌ Criar     │  │ ✅ Exportar  │     │
│  │  Orçamento   │  │  Usuário 🔒  │  │  Relatório   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│     ATIVO           BLOQUEADO         ATIVO                │
│                                                              │
│  Faturamento: R$ 500.000,00  ← VISÍVEL                     │
│  EBITDA: R$ 125.000,00       ← VISÍVEL                     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  👥 NÍVEL 5 (SUPERVISOR)                                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ ❌ Aprovar   │  │ ❌ Criar     │  │ ❌ Exportar  │     │
│  │  Orçamento🔒 │  │  Usuário 🔒  │  │  Relatório🔒 │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│    BLOQUEADO       BLOQUEADO         BLOQUEADO             │
│                                                              │
│  Faturamento: •••••          ← MASCARADO                   │
│  EBITDA: •••••               ← MASCARADO                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Progressão de Acesso

```
NÍVEL 7 (Operacional)
  ├─ Ver: Apenas suas tarefas
  ├─ Fazer: Executar e registrar
  └─ Bloqueios: 90% dos botões
          ↓
NÍVEL 5 (Supervisor)
  ├─ Ver: Equipe direta
  ├─ Fazer: Atribuir tarefas
  └─ Bloqueios: 70% dos botões
          ↓
NÍVEL 3 (Gerente)
  ├─ Ver: Departamento completo
  ├─ Fazer: Criar usuários (4-7)
  └─ Bloqueios: 50% dos botões
          ↓
NÍVEL 1 (Admin)
  ├─ Ver: Empresa completa
  ├─ Fazer: TUDO operacional
  └─ Bloqueios: 10% dos botões
          ↓
NÍVEL 0 (Presidente)
  ├─ Ver: TUDO
  ├─ Fazer: Aprovações estratégicas
  └─ Bloqueios: Ações operacionais (delega)
```

---

## 📱 Exemplo de Tela Real

```
┌──────────────────────────────────────────────────────────┐
│  GESTÃO DE USUÁRIOS                                      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  [➕ Criar]  [✏️ Editar]  [🗑️ Deletar 🔒]              │
│    ATIVO      ATIVO       BLOQUEADO                      │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Nome          Cargo        Salário      Ações      │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ João Silva    Gerente      •••••       [Editar]   │ │
│  │ Maria Santos  Coord.       •••••       [Editar]   │ │
│  └────────────────────────────────────────────────────┘ │
│         ↑                      ↑             ↑          │
│      VISÍVEL              MASCARADO       ATIVO         │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Marcação no HTML

### **Exemplo Completo de Card:**

```html
<div class="card">
    <h2>👥 Gestão de Usuários</h2>
    
    <!-- Botões -->
    <div class="actions">
        <!-- Ativo para Admin/Diretor -->
        <button 
            class="btn btn-primary" 
            data-action="criar_usuarios">
            ➕ Criar
        </button>
        
        <!-- Ativo para Admin/Diretor -->
        <button 
            class="btn btn-secondary" 
            data-action="editar_usuarios">
            ✏️ Editar
        </button>
        
        <!-- Ativo APENAS para Admin -->
        <button 
            class="btn btn-danger" 
            data-action="deletar_usuarios"
            data-required-level="1">
            🗑️ Deletar
        </button>
    </div>
    
    <!-- Tabela -->
    <table>
        <thead>
            <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <!-- Coluna visível apenas para Diretor+ -->
                <th data-sensitive data-required-level="2">
                    Salário
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>João Silva</td>
                <td>Gerente</td>
                <!-- Dado visível apenas para Diretor+ -->
                <td data-sensitive data-required-level="2">
                    R$ 8.500,00
                </td>
            </tr>
        </tbody>
    </table>
</div>
```

---

## 🔍 Estados Visuais Detalhados

### **1. Botão Normal (Ativo)**
```css
background: #667eea (azul vibrante)
color: white
opacity: 1
cursor: pointer
transition: all 0.3s

hover:
  transform: translateY(-2px)
  box-shadow: 0 4px 12px rgba(0,0,0,0.15)
```

### **2. Botão Bloqueado**
```css
background: #667eea (azul desbotado)
color: white
opacity: 0.5
cursor: not-allowed
pointer-events: none (ou onclick bloqueado)

após texto: " 🔒"
title: "Ação não permitida para seu nível"

hover:
  Sem efeito
```

### **3. Input/Select Bloqueado**
```css
opacity: 0.4
cursor: not-allowed
pointer-events: none
disabled: true
background: #f7fafc (cinza claro)

title: "Apenas [Nível] pode editar"
```

### **4. Seção Oculta (mode: remove)**
```css
display: none
```

### **5. Seção Borrada (mode: blur)**
```css
filter: blur(8px)
opacity: 0.3
pointer-events: none
```

### **6. Dado Sensível Mascarado**
```css
content: "•••••"
opacity: 0.3
title: "Informação restrita"
background: #fff5f5 (rosa claro)
padding: 2px 6px
border-radius: 4px
```

---

## 💡 Dicas de UX

### **✅ Boas Práticas:**

1. **Mantenha elementos visíveis**: Não oculte completamente, bloqueie
   ```
   ✅ BOME: Botão visível mas opaco + 🔒
   ❌ RUIM: Botão sumiu (usuário não sabe que existe)
   ```

2. **Feedback claro**: Tooltip explicativo
   ```
   ✅ BOM: "Apenas Administradores podem deletar"
   ❌ RUIM: Sem explicação
   ```

3. **Consistência visual**: Mesma opacidade para todos os bloqueados
   ```
   ✅ BOM: Todos com opacity: 0.5
   ❌ RUIM: Uns 0.3, outros 0.7
   ```

4. **Ícones universais**: 🔒 = bloqueado
   ```
   ✅ BOM: Cadeado visível
   ❌ RUIM: Sem indicador visual
   ```

5. **Dados sensíveis**: Mascarar, não ocultar coluna
   ```
   ✅ BOM: Coluna existe, valor = •••••
   ❌ RUIM: Coluna desaparece (quebra layout)
   ```

---

## 🧪 Teste Rápido

### **Abra o Console:**
```javascript
// Ver nível atual
console.log(PermissionManager.userLevel);

// Ver permissões
console.log(PermissionManager.permissions);

// Testar permissão
console.log(PermissionManager.canDo('criar_usuarios'));
// true ou false

// Mudar nível para teste
localStorage.setItem('selectedRole', '0'); // Presidente
location.reload();
```

---

## 📊 Matriz Visual Rápida

```
PERMISSÃO         │ N0 │ N1 │ N2 │ N3 │ N4 │ N5 │ N6 │ N7 │
──────────────────┼────┼────┼────┼────┼────┼────┼────┼────┤
Criar Usuários    │ ❌ │ ✅ │ ✅ │ ✅ │ ❌ │ ❌ │ ❌ │ ❌ │
Deletar Usuários  │ ❌ │ ✅ │ ❌ │ ❌ │ ❌ │ ❌ │ ❌ │ ❌ │
Aprovar Orçamento │ ✅ │ ❌ │ ✅ │ ❌ │ ❌ │ ❌ │ ❌ │ ❌ │
Exportar Reports  │ ✅ │ ✅ │ ✅ │ ✅ │ ❌ │ ❌ │ ❌ │ ❌ │
Ver Salários      │ ✅ │ ✅ │ ✅ │ ❌ │ ❌ │ ❌ │ ❌ │ ❌ │
Criar Squads      │ ❌ │ ✅ │ ✅ │ ❌ │ ❌ │ ❌ │ ❌ │ ❌ │
Atribuir Tarefas  │ ❌ │ ✅ │ ✅ │ ✅ │ ✅ │ ✅ │ ❌ │ ❌ │
Executar Tarefas  │ ❌ │ ❌ │ ❌ │ ❌ │ ❌ │ ❌ │ ✅ │ ✅ │
```

---

## 🎬 Fluxo de Interação

```
Usuário clica em botão bloqueado
    ↓
onclick interceptado
    ↓
preventDefault()
    ↓
Toast aparece:
  ┌─────────────────────────────────────┐
  │ ⚠️ Você não tem permissão           │
  │                                      │
  │ Ação: Deletar Usuário                │
  │ Necessário: Administrador (Nível 1)  │
  │ Seu nível: Supervisor (Nível 5)     │
  └─────────────────────────────────────┘
    ↓
Toast desaparece após 4s
```

---

## 🚀 Implementação em 3 Passos

### **Passo 1: Incluir Scripts**
```html
<script src="/shared/permissions.js"></script>
<script src="/shared/ui-permissions.js"></script>
```

### **Passo 2: Marcar Elementos**
```html
<button data-action="criar_usuarios">
    ➕ Criar
</button>
```

### **Passo 3: Carregar Página**
```
Sistema automaticamente:
  ✅ Lê nível do usuário
  ✅ Aplica permissões
  ✅ Bloqueia elementos
  ✅ Mascara dados
```

---

**Simples assim!** 🎉

---

## 📝 Checklist Visual

Ao implementar, verifique:

- [ ] Botões sem permissão ficam opacos (0.5)
- [ ] Cursor muda para `not-allowed`
- [ ] Ícone 🔒 aparece
- [ ] Tooltip explicativo presente
- [ ] Dados sensíveis viram •••••
- [ ] Seções restritas ficam borradas/ocultas
- [ ] Feedback visual consistente
- [ ] Nenhum elemento desaparece completamente (só blur)

---

**Status:** ✅ Guia Visual Completo  
**Versão:** 1.0  
**Data:** Novembro 2025
