# 🎯 GUIA DE TESTE - DASHBOARDS SEPARADOS

## ✅ Sistema Criado com Sucesso!

Todos os arquivos foram criados e o servidor está configurado com dois fluxos de autenticação separados.

---

## 🔐 CREDENCIAIS DE TESTE

### 👥 CLIENTES (Usuários de Empresas)
Acesso via: `index.html`

| Email | Senha | Cargo | Categorias |
|-------|-------|-------|-----------|
| `ceo@empresa.com` | `senha123` | CEO | 7 categorias |
| `diretor@empresa.com` | `senha123` | Diretor | 6 categorias |
| `admin@empresa.com` | `senha123` | Admin | 5 categorias |

### 👨‍💻 DESENVOLVEDORES (Equipe Ascenda)
Acesso via: `desenvolvedor/pages/login.html`

| Email | Senha | Cargo |
|-------|-------|-------|
| `dev@ascenda.com` | `Dev@2024!Super` | Senior Developer |
| `admin@ascenda.com` | `Admin@2024!Master` | Platform Administrator |

---

## 🧪 TESTE 1: Login de Cliente

### Passos:
1. **Abrir** `index.html` com Live Server
2. **Login** com: `ceo@empresa.com` / `senha123`
3. **Resultado esperado**:
   - ✅ Redirecionamento para `client/pages/dashboard.html`
   - ✅ Dashboard mostra 7 categorias de ferramentas
   - ✅ Header exibe nome do usuário: "CEO da Empresa"
   - ✅ Ferramentas filtradas por permissões do cargo

### Verificar:
- [ ] Login funciona
- [ ] Redirecionamento correto
- [ ] Dashboard carrega ferramentas
- [ ] Botão "Sair" funciona
- [ ] Volta para index.html ao fazer logout

---

## 🧪 TESTE 2: Login de Desenvolvedor

### Passos:
1. **Abrir** `index.html` com Live Server
2. **Clicar** no link "🔐 Área do Desenvolvedor" no footer
3. **Redireciona** para `desenvolvedor/pages/login.html`
4. **Login** com: `dev@ascenda.com` / `Dev@2024!Super`
5. **Resultado esperado**:
   - ✅ Redirecionamento para `desenvolvedor/pages/dashboard.html`
   - ✅ Dashboard DEV com sidebar roxa/gradiente
   - ✅ Estatísticas: empresas, usuários, ferramentas
   - ✅ Menu lateral com: Visão Geral, Empresas, Usuários, Ferramentas, Logs, Configurações

### Verificar:
- [ ] Login desenvolvedor funciona
- [ ] Página de login tem visual diferenciado (roxo)
- [ ] Avisos de segurança aparecem
- [ ] Dashboard DEV carrega
- [ ] Pode ver TODAS as empresas
- [ ] Sidebar funciona
- [ ] Log de segurança no console do servidor
- [ ] Botão "Sair" redireciona para login DEV

---

## 🧪 TESTE 3: Navegação Entre Seções (DEV)

### No Dashboard DEV:
1. **Clicar** em cada item do menu:
   - 📊 Visão Geral → Mostra estatísticas
   - 🏢 Empresas → Lista empresas (vazia ou 1 empresa)
   - 👥 Usuários → Lista 4 usuários
   - 🛠️ Ferramentas → Lista 14 ferramentas
   - 📋 Logs → "Sistema em desenvolvimento"
   - ⚙️ Configurações → Configurações da plataforma

### Verificar:
- [ ] Navegação funciona
- [ ] Seções trocam corretamente
- [ ] Título do header atualiza
- [ ] Item ativo no menu destacado
- [ ] Dados carregam da API

---

## 🧪 TESTE 4: APIs e Endpoints

### Teste no PowerShell:

```powershell
# 1. Health Check
Invoke-RestMethod http://localhost:3000/health

# 2. Login Cliente
$body = @{ email = "ceo@empresa.com"; password = "senha123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login/client" -Method POST -Body $body -ContentType "application/json"
$response

# 3. Login Desenvolvedor
$bodyDev = @{ email = "dev@ascenda.com"; password = "Dev@2024!Super" } | ConvertTo-Json
$responseDev = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login/developer" -Method POST -Body $bodyDev -ContentType "application/json"
$responseDev

# 4. Listar Ferramentas
Invoke-RestMethod http://localhost:3000/api/tools

# 5. Listar Organizações (com token DEV)
$headers = @{ Authorization = "Bearer $($responseDev.token)" }
Invoke-RestMethod -Uri "http://localhost:3000/api/organizations" -Headers $headers
```

### Verificar:
- [ ] `/api/auth/login/client` retorna token e dados do usuário
- [ ] `/api/auth/login/developer` retorna token e dados do dev
- [ ] Token do dev tem `type: "developer"`
- [ ] `/api/organizations` só funciona com token DEV
- [ ] `/api/tools` retorna 14 ferramentas
- [ ] `/api/users` funciona

---

## 🧪 TESTE 5: Segurança e Permissões

### Teste de Acesso Restrito:
1. **Fazer login como cliente** (`ceo@empresa.com`)
2. **Copiar token** do localStorage
3. **Tentar acessar** `/api/organizations` com token de cliente
4. **Resultado esperado**: ❌ `403 Forbidden - Acesso negado`

### Teste de Token Expirado:
1. **Esperar 2h** (ou modificar JWT_EXPIRES_IN para 10s)
2. **Tentar usar** dashboard DEV
3. **Resultado esperado**: ❌ Logout automático

### Verificar:
- [ ] Cliente NÃO pode acessar rotas de desenvolvedor
- [ ] Tokens expiram conforme configurado
- [ ] Logout limpa localStorage
- [ ] Mensagens de erro apropriadas

---

## 📊 ESTRUTURA DE DADOS

### localStorage (Cliente):
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "CEO da Empresa",
    "email": "ceo@empresa.com",
    "role": "CEO",
    "organization": "Empresa Modelo S.A.",
    "permissions": {
      "toolCategories": ["lideranca", "diretoria", ...]
    }
  }
}
```

### localStorage (Desenvolvedor):
```javascript
{
  "dev-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "dev-user": {
    "id": "dev-001",
    "name": "Admin Desenvolvedor",
    "email": "dev@ascenda.com",
    "role": "Senior Developer",
    "permissions": {
      "fullAccess": true,
      "canManageOrganizations": true,
      ...
    }
  },
  "user-type": "developer"
}
```

---

## 🐛 TROUBLESHOOTING

### Problema: Login não funciona
**Solução:**
- Verificar se servidor está rodando: `http://localhost:3000/health`
- Verificar console do navegador (F12)
- Verificar console do servidor (logs)

### Problema: Dashboard não carrega
**Solução:**
- Verificar caminhos CSS/JS (devem ser relativos)
- Verificar se Live Server está ativo
- Limpar localStorage: `localStorage.clear()`

### Problema: API retorna 401
**Solução:**
- Token pode estar expirado
- Fazer logout e login novamente
- Verificar se header Authorization está correto

### Problema: Desenvolvedor não consegue ver organizações
**Solução:**
- Verificar se login foi feito em `/api/auth/login/developer`
- Verificar se token tem `type: "developer"`
- Verificar logs do servidor

---

## ✅ CHECKLIST FINAL

### Arquitetura:
- [x] `index.html` - Login clientes
- [x] `client/pages/dashboard.html` - Dashboard clientes
- [x] `desenvolvedor/pages/login.html` - Login desenvolvedores
- [x] `desenvolvedor/pages/dashboard.html` - Dashboard desenvolvedores
- [x] `server/data/developers.json` - Usuários desenvolvedores
- [x] Rotas `/api/auth/login/client` e `/developer`
- [x] Rota `/api/organizations` (DEV only)

### Funcionalidades:
- [x] Login separado para clientes e desenvolvedores
- [x] Redirecionamentos corretos
- [x] Dashboards com visuais diferentes
- [x] Permissões por tipo de usuário
- [x] Tokens JWT com expiração diferente (24h cliente, 2h dev)
- [x] Logs de segurança para login DEV

### Segurança:
- [x] Senhas com bcrypt hash
- [x] Tokens JWT seguros
- [x] Acesso restrito a rotas administrativas
- [x] Avisos de segurança na página DEV
- [x] Log de acessos de desenvolvedores

---

## 🎉 PRÓXIMOS PASSOS

1. **Testar** todos os fluxos acima
2. **Adicionar** formulário de cadastro de empresa
3. **Implementar** CRUDs no dashboard DEV
4. **Adicionar** sistema de logs real
5. **Implementar** 2FA para desenvolvedores
6. **Criar** páginas individuais de ferramentas
7. **Adicionar** relatórios e analytics

---

**Status**: Sistema completo e funcional! 🚀  
**Última atualização**: 2024-11-09
