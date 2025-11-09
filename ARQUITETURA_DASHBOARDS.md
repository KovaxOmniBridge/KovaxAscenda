# 🏗️ ARQUITETURA DE DASHBOARDS SEPARADOS

## 📁 Estrutura Completa

```
Ascenda1/
├── index.html                          # Login CLIENTES + Cadastro Empresa
├── client/                             # Área dos CLIENTES
│   ├── pages/
│   │   └── dashboard.html             # Dashboard CLIENTES
│   ├── css/
│   └── js/
│       ├── auth.js                    # Auth CLIENTES
│       └── dashboard.js               # Dashboard CLIENTES
├── desenvolvedor/                      # Área dos DESENVOLVEDORES
│   ├── pages/
│   │   ├── login.html                # Login DESENVOLVEDORES (Segurança Alta)
│   │   └── dashboard.html            # Dashboard DESENVOLVEDORES
│   ├── style/
│   │   └── dev-dashboard.css
│   └── script/
│       ├── dev-auth.js               # Auth DESENVOLVEDORES
│       └── dev-dashboard.js          # Dashboard DESENVOLVEDORES
└── server/
    ├── server.js                      # Backend
    └── data/
        ├── organizations.json
        ├── users.json                # Usuários CLIENTES
        ├── developers.json           # Usuários DESENVOLVEDORES
        └── tools.json
```

## 🔄 Fluxo de Autenticação

### CLIENTES (Usuários de Empresas)
```
index.html
  ├─► Login Cliente → POST /api/auth/login/client
  │   └─► Success → client/pages/dashboard.html
  │
  └─► Cadastro Empresa → POST /api/organizations/register
      └─► Success → Login automático → client/pages/dashboard.html
```

### DESENVOLVEDORES (Gerenciam a Plataforma)
```
index.html (footer link)
  └─► desenvolvedor/pages/login.html
      └─► Login Dev → POST /api/auth/login/developer
          ├─► Verificação 2FA (Futuro)
          ├─► IP Whitelist (Opcional)
          └─► Success → desenvolvedor/pages/dashboard.html
```

## 🔐 Diferenças de Segurança

| Aspecto | CLIENTE | DESENVOLVEDOR |
|---------|---------|---------------|
| **Acesso** | Dados da própria empresa | Dados de TODAS as empresas |
| **Autenticação** | Email + Senha | Email + Senha + 2FA (futuro) |
| **Sessão** | 24h | 2h (renovável) |
| **Permissões** | Baseadas em cargo | Acesso total |
| **Logs** | Básico | Detalhado com auditoria |
| **IP** | Qualquer | Whitelist (opcional) |

## 📊 Dashboards

### Dashboard CLIENTE (client/pages/dashboard.html)
- Ver ferramentas da **sua empresa**
- Permissões baseadas em **cargo do usuário**
- Categorias filtradas por **nível hierárquico**
- **Não** pode ver outras empresas

### Dashboard DESENVOLVEDOR (desenvolvedor/pages/dashboard.html)
- Ver **TODAS as empresas**
- Gerenciar **todos os usuários**
- Criar/editar **ferramentas**
- Configurar **permissões globais**
- Logs e **auditoria completa**
- Estatísticas da plataforma

## 🛠️ APIs Necessárias

### Autenticação
- `POST /api/auth/login/client` - Login de clientes
- `POST /api/auth/login/developer` - Login de desenvolvedores
- `POST /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Logout

### Organizações
- `POST /api/organizations/register` - Cadastrar nova empresa
- `GET /api/organizations` - Listar empresas (DEV only)
- `GET /api/organizations/:id` - Detalhes empresa

### Usuários
- `GET /api/users` - Usuários da empresa (CLIENT) ou Todos (DEV)
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário (DEV only)

### Ferramentas
- `GET /api/tools` - Ferramentas disponíveis (filtradas por usuário)
- `POST /api/tools` - Criar ferramenta (DEV only)
- `PUT /api/tools/:id` - Atualizar ferramenta (DEV only)
- `DELETE /api/tools/:id` - Deletar ferramenta (DEV only)

## 🎨 Diferenças Visuais

### CLIENTE
- Tema: Azul/Verde (corporativo)
- Logo: "Ascenda"
- Foco: Simplicidade e clareza
- Menu: Ferramentas próprias

### DESENVOLVEDOR
- Tema: Roxo/Laranja (tech)
- Logo: "Ascenda DEV"
- Foco: Informação densa
- Menu: Empresas, Usuários, Ferramentas, Logs, Config

## 📝 Implementação

### Ordem de Criação
1. ✅ index.html (login clientes)
2. ⏳ desenvolvedor/pages/login.html
3. ⏳ Atualizar server.js (rotas separadas)
4. ⏳ Criar developers.json
5. ⏳ Atualizar client/js/auth.js
6. ⏳ Criar desenvolvedor/script/dev-auth.js
7. ⏳ client/pages/dashboard.html (já existe, ajustar)
8. ⏳ desenvolvedor/pages/dashboard.html
9. ⏳ Testar fluxo completo

## 🔑 Usuários Iniciais

### Clientes (users.json)
- ceo@empresa.com / senha123
- diretor@empresa.com / senha123
- admin@empresa.com / senha123

### Desenvolvedores (developers.json - NOVO)
- dev@ascenda.com / Dev@2024!Super
- admin@ascenda.com / Admin@2024!Master

---

**Status**: Planejamento concluído ✅
**Próximo passo**: Criar desenvolvedor/pages/login.html
