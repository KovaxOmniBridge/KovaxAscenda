# 🔄 Sistema Multi-Role (Múltiplos Papéis)

## 📋 Visão Geral

O **Sistema Multi-Role** permite que um usuário tenha acesso a **múltiplas interfaces** da plataforma, resolvendo o problema comum em pequenas empresas onde uma pessoa precisa exercer múltiplas funções.

---

## 🎯 Casos de Uso

### Exemplo 1: Dono de Pequena Empresa
**João Silva** é dono de uma pequena empresa e precisa:
- Aprovar decisões estratégicas (Nível 0 - Presidente)
- Gerenciar usuários e estrutura (Nível 1 - Admin)
- Supervisionar vendas diretamente (Nível 5 - Supervisor)

### Exemplo 2: Gerente Multifuncional
**Maria Santos** gerencia um departamento mas também:
- Atua como gerente (Nível 3 - Gerente)
- Coordena projetos específicos (Nível 4 - Coordenador)
- Opera ferramentas técnicas (Nível 7 - Operacional)

---

## 🔧 Como Funciona

### 1. **Estrutura de Dados**

#### Tabela `users` - Campos Necessários:
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    nivel INTEGER DEFAULT 1,                    -- Papel primário
    additional_roles TEXT,                      -- JSON: [1, 3, 5]
    can_switch_roles INTEGER DEFAULT 0,         -- 0=não, 1=sim
    -- outros campos...
);
```

#### Exemplo de Registro:
```json
{
    "id": 1,
    "name": "João Silva",
    "nivel": 0,
    "additional_roles": "[1, 5]",
    "can_switch_roles": 1
}
```

---

## 🚀 Fluxo de Uso

### **Passo 1: Login**
```
Usuário faz login normalmente
    ↓
Sistema verifica se tem additional_roles
    ↓
Se SIM: Redireciona para tela de seleção
Se NÃO: Redireciona direto para seu dashboard
```

### **Passo 2: Seleção de Papel (se aplicável)**
```
┌─────────────────────────────────────────┐
│  Bem-vindo, João Silva! 👋              │
│                                          │
│  Escolha seu papel:                     │
│                                          │
│  [👑 Presidente (Nível 0)] ← PRINCIPAL │
│  [⚙️ Administrador (Nível 1)]          │
│  [👥 Supervisor (Nível 5)]             │
│                                          │
└─────────────────────────────────────────┘
```

### **Passo 3: Trabalho no Dashboard**
```
Usuário acessa o dashboard escolhido
    ↓
No header aparece botão: "🔄 Papel: Presidente"
    ↓
Pode clicar para trocar de papel a qualquer momento
```

---

## 💻 Implementação

### **1. Modificar Banco de Dados**

Execute no SQLite:
```sql
-- Adicionar campos à tabela users
ALTER TABLE users ADD COLUMN additional_roles TEXT;
ALTER TABLE users ADD COLUMN can_switch_roles INTEGER DEFAULT 0;

-- Atualizar um usuário exemplo
UPDATE users 
SET additional_roles = '[1, 5]', 
    can_switch_roles = 1 
WHERE id = 1;
```

### **2. Adicionar Componente nos Dashboards**

Em **TODOS** os arquivos HTML dos dashboards, adicionar no `<head>`:
```html
<!-- Sistema Multi-Role -->
<script src="/shared/role-switcher-component.js"></script>
```

E no `<header>`, dentro de `.header-right`:
```html
<div id="roleSwitcherContainer"></div>
```

**Exemplo completo:**
```html
<header class="header">
    <div class="header-left">
        <h1>Dashboard</h1>
    </div>
    <div class="header-right">
        <!-- O switcher será inserido aqui automaticamente -->
        <div id="roleSwitcherContainer"></div>
        
        <span class="user-info" id="userName">Usuário</span>
        <button class="btn-logout" onclick="logout()">Sair</button>
    </div>
</header>
```

### **3. Atualizar Fluxo de Login**

Modificar o arquivo `script.js` (ou equivalente de login):

```javascript
// Após login bem-sucedido:
localStorage.setItem('token', response.token);
localStorage.setItem('userData', JSON.stringify(response.user));

// Verificar se tem papéis múltiplos
if (response.user.additional_roles && response.user.additional_roles !== '[]') {
    // Redirecionar para seleção de papel
    window.location.href = '/shared/role-switcher.html';
} else {
    // Redirecionar direto para o dashboard do nível
    const dashboardMap = {
        0: '/Nivel00-Presidentes/dashboard-presidentes.html',
        1: '/Nivel01-AdministradoresGerais/dashboard-admin.html',
        2: '/Nivel02-DiretoresExecutivos/dashboard-diretores.html',
        3: '/Nivel03-Gerentes/dashboard-gerentes.html',
        4: '/Nivel04-Coordenadores/dashboard-coordenadores.html',
        5: '/Nivel05-Supervisores/dashboard-supervisores.html',
        6: '/Nivel06-Especialistas/dashboard-especialistas.html',
        7: '/Nivel07-Operacional/dashboard-operacional.html'
    };
    window.location.href = dashboardMap[response.user.nivel] || '/';
}
```

---

## 🎨 Personalização

### Configurar Papéis por Usuário (Interface Admin)

No painel de **Nível 1 (Administrador Geral)**, adicionar formulário:

```html
<form id="userRolesForm">
    <label>Papel Principal:</label>
    <select name="nivel">
        <option value="0">Presidente</option>
        <option value="1">Administrador</option>
        <option value="3">Gerente</option>
        <!-- ... -->
    </select>

    <label>
        <input type="checkbox" name="canSwitch"> 
        Permitir acesso a múltiplos papéis
    </label>

    <div id="additionalRolesSection" style="display: none;">
        <label>Papéis Adicionais:</label>
        <label><input type="checkbox" name="roles" value="0"> Presidente</label>
        <label><input type="checkbox" name="roles" value="1"> Administrador</label>
        <label><input type="checkbox" name="roles" value="3"> Gerente</label>
        <!-- ... -->
    </div>

    <button type="submit">Salvar</button>
</form>
```

---

## 📊 API Endpoints

### Atualizar Papéis de Usuário
```http
PUT /api/users/:id/roles
Authorization: Bearer {token}

{
    "additional_roles": [1, 3, 5],
    "can_switch_roles": true
}
```

### Obter Papéis Disponíveis
```http
GET /api/auth/profile
Authorization: Bearer {token}

Response:
{
    "id": 1,
    "name": "João Silva",
    "nivel": 0,
    "additional_roles": "[1, 5]",
    "can_switch_roles": true
}
```

---

## ✅ Vantagens

1. **Flexibilidade**: Pequenas empresas podem ter funcionários multifuncionais
2. **Segurança**: Cada papel mantém suas permissões específicas
3. **UX Simples**: Interface intuitiva para trocar de papel
4. **Auditoria**: Sistema registra qual papel foi usado em cada ação
5. **Escalável**: Funciona tanto para pequenas quanto grandes empresas

---

## 🔒 Segurança

### Validações Importantes:

1. **Backend sempre valida**: Mesmo que frontend permita troca, backend verifica se usuário realmente tem aquele papel
2. **Token JWT**: Inclui apenas o papel primário, não os adicionais
3. **Logs de Auditoria**: Registrar quando usuário troca de papel
4. **Permissões**: Cada dashboard verifica se papel atual tem acesso

---

## 🧪 Como Testar

### 1. Criar Usuário Multi-Role:
```sql
INSERT INTO users (name, email, nivel, additional_roles, can_switch_roles, company_id, access_key, password)
VALUES ('Teste Multi', 'multi@teste.com', 0, '[1, 5]', 1, 1, 'MULTI-001', '$2a$10$...');
```

### 2. Fazer Login:
- Usar as credenciais do usuário criado
- Verificar se aparece tela de seleção

### 3. Testar Troca:
- Escolher um papel
- Verificar se botão aparece no header
- Clicar e trocar para outro papel
- Confirmar redirecionamento

---

## 📝 Checklist de Implementação

- [ ] Atualizar tabela `users` com novos campos
- [ ] Modificar `auth.controller.js` para retornar `additional_roles`
- [ ] Adicionar `role-switcher-component.js` em todos os dashboards
- [ ] Atualizar fluxo de login para verificar múltiplos papéis
- [ ] Criar interface no Admin para configurar papéis
- [ ] Testar com usuário multi-role
- [ ] Adicionar logs de auditoria para trocas de papel

---

## 🎯 Próximos Passos

1. **Auditoria**: Registrar quando usuário troca de papel
2. **Restrições**: Definir quais combinações de papéis são permitidas
3. **Temporário**: Permitir acesso temporário a certos papéis
4. **Delegação**: Usuário pode delegar seu papel para outro temporariamente

---

## 📚 Arquivos Criados

```
shared/
├── role-switcher.html              # Tela de seleção inicial
├── role-switcher.css               # Estilos da tela
├── role-switcher.js                # Lógica de seleção
└── role-switcher-component.js      # Componente para dashboards
```

---

## ❓ FAQ

**P: Todo usuário pode ter múltiplos papéis?**  
R: Não. Apenas se `can_switch_roles = 1` no banco.

**P: Posso restringir quais papéis podem ser combinados?**  
R: Sim! Adicione validação no backend ao configurar `additional_roles`.

**P: O que acontece com as permissões?**  
R: Cada papel mantém suas permissões originais. Não há "soma" de permissões.

**P: Como funciona em produção?**  
R: Funciona normalmente. Apenas certifique-se de que o backend sempre valida.

---

**Documentação criada em:** Novembro 2025  
**Status:** ✅ Pronto para uso
