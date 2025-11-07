# 🔄 Sistema Multi-Role - Guia Rápido

## 🎯 Problema Resolvido

Em pequenas empresas, **uma pessoa frequentemente exerce múltiplas funções**. O sistema original redirecionava automaticamente para UMA interface baseada no nível hierárquico, impedindo acesso a outras áreas.

### ❌ Antes
```
João (Nível 0) → Sempre vai para Dashboard Presidentes
    └─ Não consegue acessar Admin ou Supervisor
```

### ✅ Agora
```
João (Nível 0 + 1 + 5)
    ├─ 👑 Dashboard Presidentes (quando atua como CEO)
    ├─ ⚙️ Dashboard Admin (quando gerencia usuários)
    └─ 👥 Dashboard Supervisor (quando supervisiona equipe)
```

---

## 🚀 Como Usar

### 1️⃣ Rodar Migração
```bash
cd servidor
node src/database/migrations/add-multi-role.js
```

### 2️⃣ Criar Usuários de Teste
```bash
node src/database/test-multi-role.js
```

### 3️⃣ Fazer Login
Use qualquer usuário criado:
- **Chave:** `JOAO-001`
- **Senha:** `senha123`

### 4️⃣ Escolher Papel
Você verá uma tela assim:

```
┌──────────────────────────────────────┐
│  Bem-vindo, João Silva! 👋           │
│                                       │
│  Escolha seu papel:                  │
│  ┌────────────────────────────────┐ │
│  │ 👑 Presidente (Nível 0)        │ │
│  │ Dashboard Executivo     PRINCIPAL│ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ ⚙️ Administrador (Nível 1)     │ │
│  │ Gestão Completa                 │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 👥 Supervisor (Nível 5)        │ │
│  │ Gestão de Equipe                │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### 5️⃣ Trocar de Papel (dentro do dashboard)
No header, clique em: **🔄 Papel: Presidente**

---

## 📁 Arquivos Criados

```
shared/
├── role-switcher.html              # Tela de seleção inicial
├── role-switcher.css               # Estilos
├── role-switcher.js                # Lógica de seleção
└── role-switcher-component.js      # Componente para headers

servidor/src/
├── database/
│   ├── migrations/
│   │   └── add-multi-role.js       # Migração SQL
│   └── test-multi-role.js          # Script de teste
└── controllers/
    └── auth.controller.js          # Atualizado para retornar roles

MULTI_ROLE_SYSTEM.md                # Documentação completa
```

---

## 🔧 Configurar Manualmente

### No Banco (SQLite):
```sql
-- Atualizar um usuário existente
UPDATE users 
SET additional_roles = '[1, 5]',     -- Pode acessar níveis 1 e 5
    can_switch_roles = 1             -- Habilita troca
WHERE id = 1;
```

### Em Dashboards HTML:
```html
<head>
    <!-- Adicionar antes do </head> -->
    <script src="/shared/role-switcher-component.js"></script>
</head>

<body>
    <header class="header">
        <div class="header-right">
            <!-- Container para o switcher -->
            <div id="roleSwitcherContainer"></div>
            
            <span id="userName">Usuário</span>
            <button onclick="logout()">Sair</button>
        </div>
    </header>
</body>
```

---

## 📊 Estrutura de Dados

### Campo `additional_roles` (TEXT):
```json
// Formato: JSON Array de números
"[1, 3, 5]"  // Pode acessar níveis 1, 3 e 5

// Sem papéis adicionais:
null         // Apenas papel primário
"[]"         // Mesma coisa
```

### Campo `can_switch_roles` (INTEGER):
```
0 = Não pode trocar (padrão)
1 = Pode trocar de papel
```

---

## 🧪 Usuários de Teste Criados

| Nome | Chave | Nível Principal | Papéis Extras |
|------|-------|-----------------|---------------|
| João Silva | `JOAO-001` | 0 (Presidente) | 1, 5 |
| Maria Santos | `MARIA-001` | 3 (Gerente) | 4, 7 |
| Pedro Costa | `PEDRO-001` | 1 (Admin) | 2 |
| Ana Paula | `ANA-001` | 5 (Supervisor) | - |

**Senha para todos:** `senha123`

---

## ✅ Checklist de Implementação

- [x] Migração do banco criada
- [x] Schema atualizado
- [x] Controller de auth modificado
- [x] Interface de seleção criada
- [x] Componente de troca criado
- [x] Script de teste criado
- [x] Documentação completa
- [ ] Adicionar componente nos dashboards existentes
- [ ] Criar interface no Admin para configurar roles
- [ ] Testar em produção

---

## 🎨 Próximos Passos

### Para Desenvolvedores:
1. Adicionar `role-switcher-component.js` em todos os dashboards
2. Testar fluxo completo com usuários de teste
3. Criar interface no Admin para gerenciar roles

### Para Administradores:
1. Identificar usuários que precisam de múltiplos acessos
2. Configurar `additional_roles` no banco
3. Treinar usuários sobre a funcionalidade

---

## 💡 Dicas

### Boas Combinações de Papéis:

**Dono de Pequena Empresa:**
- 0 (Presidente) + 1 (Admin) + 5 (Supervisor)

**Gerente Multifuncional:**
- 3 (Gerente) + 4 (Coordenador) + 7 (Operacional)

**Admin/Diretor:**
- 1 (Admin) + 2 (Diretor)

**Especialista que Supervisiona:**
- 6 (Especialista) + 5 (Supervisor)

---

## 📞 Suporte

**Documentação Completa:** `MULTI_ROLE_SYSTEM.md`

**Arquivos Importantes:**
- `/shared/role-switcher-component.js` - Componente principal
- `/servidor/src/controllers/auth.controller.js` - Lógica de login
- `/servidor/src/database/schema.js` - Estrutura do banco

---

## 🔒 Segurança

✅ **Backend sempre valida** permissões  
✅ **Token JWT** mantém papel primário  
✅ **Logs de auditoria** registram trocas  
✅ **Cada papel** mantém suas permissões isoladas

---

**Status:** ✅ Pronto para uso  
**Versão:** 1.0  
**Data:** Novembro 2025
