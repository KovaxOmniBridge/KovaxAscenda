# Guia de Integração - Sistema Ascenda

## 📋 Visão Geral

O sistema Ascenda é composto por 4 módulos integrados:

1. **CompanyManagement** - Gestão Empresarial (Empresas, Produtos, Serviços)
2. **WealthManagement** - Gestão Patrimonial (Ativos, Unidades Físicas)
3. **HumanManagement** - Gestão de Pessoas (Funcionários, Cargos, Autenticação)
4. **ExecutiveManager** - Dashboard Executivo (Visão Consolidada Multi-empresas)

---

## 🔐 Credenciais de Teste

### Acesso Padrão
- **Chave de Acesso:** `ADMIN-2024`
- **Senha:** `admin123`
- **Cargo:** Administrador
- **Nome:** Administrador Sistema
- **E-mail:** admin@ascenda.com.br

### URLs de Acesso
- **Login:** http://localhost:5500/HumanManagement/login.html
- **Dashboard RH:** http://localhost:5500/HumanManagement/dashboard.html
- **Dashboard Executivo:** http://localhost:5500/ExecutiveManager/executive-dashboard.html
- **Gestão Patrimonial:** http://localhost:5500/WealthManagement/assets.html
- **Gestão Empresarial:** http://localhost:5500/CompanyManagement/companies.html

---

## 🏗️ Arquitetura do Sistema

### Backend (Servidor Node.js)
```
servidor/
├── src/
│   ├── controllers/          # Controladores HTTP
│   │   ├── AuthController.ts
│   │   ├── EmployeeController.ts
│   │   └── ExecutiveController.ts
│   ├── services/             # Lógica de Negócio
│   │   ├── AuthService.ts
│   │   ├── EmployeeService.ts
│   │   └── ExecutiveService.ts
│   ├── repositories/         # Camada de Dados
│   │   ├── EmployeeRepository.ts
│   │   ├── ExecutiveParticipationRepository.ts
│   │   └── ... (outros repositórios)
│   ├── routes/               # Definição de Rotas
│   │   ├── authRoutes.ts
│   │   ├── employeeRoutes.ts
│   │   └── executiveRoutes.ts
│   ├── interfaces/           # Tipos TypeScript
│   │   ├── IEmployee.ts
│   │   ├── IExecutive.ts
│   │   └── ... (outras interfaces)
│   ├── scripts/
│   │   └── seed.ts          # Script de População do Banco
│   └── server.ts            # Servidor Principal
└── ascenda.db               # Banco SQLite
```

### Frontend (Aplicações Web)
```
CompanyManagement/           # Gestão de Empresas
├── companies.html
├── products.html
├── services.html
└── styles/
    └── companies.css

WealthManagement/            # Gestão Patrimonial
├── assets.html
├── physical-units.html
└── styles/
    └── assets.css

HumanManagement/             # Gestão de Pessoas
├── login.html
├── dashboard.html
├── employees.html
└── styles/
    └── dashboard.css

ExecutiveManager/            # Dashboard Executivo
├── executive-dashboard.html
└── styles/
    └── executive-dashboard.css
```

---

## 🔄 Fluxo de Integração

### 1. Autenticação Centralizada

Todos os módulos compartilham o mesmo sistema de autenticação:

```javascript
// Login (HumanManagement/login.html)
POST /api/auth/login
{
  "accessKey": "ADMIN-2024",
  "password": "admin123"
}

// Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "id": "uuid",
    "name": "Administrador Sistema",
    "role": "ADMINISTRADOR",
    "companyId": "uuid"
  }
}
```

**Armazenamento:**
- `localStorage.setItem('token', token)` - Token JWT
- `localStorage.setItem('userData', JSON.stringify(employee))` - Dados do usuário

**Uso em outros módulos:**
```javascript
const token = localStorage.getItem('token');
fetch(`${API_URL}/endpoint`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 2. Navegação Entre Módulos

Adicione navegação no header/sidebar de cada módulo:

```html
<nav class="main-nav">
    <a href="../HumanManagement/dashboard.html" class="nav-link">Gestão de Pessoas</a>
    <a href="../WealthManagement/assets.html" class="nav-link">Gestão Patrimonial</a>
    <a href="../CompanyManagement/companies.html" class="nav-link">Gestão Empresarial</a>
    <a href="../ExecutiveManager/executive-dashboard.html" class="nav-link">Dashboard Executivo</a>
</nav>
```

### 3. Sistema de Participações Executivas

**Criando Participação:**
```javascript
POST /api/executive/participations
{
  "executiveId": "employee-uuid",
  "companyId": "company-uuid",
  "role": "INVESTOR",
  "equityPercentage": 25.5,
  "canViewFinancials": true,
  "canViewEmployees": true,
  "canViewAssets": true
}
```

**Tipos de Papéis:**
- `OWNER` - Proprietário (👑)
- `CEO` - CEO (💼)
- `BOARD_MEMBER` - Conselheiro (🎯)
- `INVESTOR` - Investidor (💰)
- `ADVISOR` - Consultor (🧠)
- `PARTNER` - Sócio (🤝)

**Permissões por Empresa:**
- `hasFullAccess` - Acesso total
- `canViewFinancials` - Ver dados financeiros
- `canViewEmployees` - Ver dados de RH
- `canViewAssets` - Ver patrimônio
- `canMakeDecisions` - Tomar decisões estratégicas

---

## 📊 API Endpoints

### Autenticação
```
POST   /api/auth/login              # Login
POST   /api/auth/logout             # Logout
GET    /api/auth/verify             # Verificar token
```

### Funcionários
```
GET    /api/employees               # Listar funcionários
GET    /api/employees/:id           # Detalhes do funcionário
POST   /api/employees               # Criar funcionário
PUT    /api/employees/:id           # Atualizar funcionário
DELETE /api/employees/:id           # Deletar funcionário
```

### Dashboard Executivo
```
GET    /api/executive/dashboard/:executiveId              # Dashboard consolidado
GET    /api/executive/participations/:executiveId         # Listar participações
GET    /api/executive/participation/:id                   # Detalhes da participação
POST   /api/executive/participations                      # Criar participação
PUT    /api/executive/participation/:id                   # Atualizar participação
DELETE /api/executive/participation/:id                   # Remover participação
GET    /api/executive/access/:executiveId/:companyId     # Verificar acesso
```

### Empresas
```
GET    /api/companies               # Listar empresas
GET    /api/companies/:id           # Detalhes da empresa
POST   /api/companies               # Criar empresa
PUT    /api/companies/:id           # Atualizar empresa
DELETE /api/companies/:id           # Deletar empresa
```

### Ativos
```
GET    /api/assets                  # Listar ativos
GET    /api/assets/:id              # Detalhes do ativo
POST   /api/assets                  # Criar ativo
PUT    /api/assets/:id              # Atualizar ativo
DELETE /api/assets/:id              # Deletar ativo
```

### Unidades Físicas
```
GET    /api/units                   # Listar unidades
GET    /api/units/:id               # Detalhes da unidade
POST   /api/units                   # Criar unidade
PUT    /api/units/:id               # Atualizar unidade
DELETE /api/units/:id               # Deletar unidade
```

---

## 🚀 Inicialização do Sistema

### 1. Configurar Banco de Dados
```bash
cd servidor
npm install
npm run seed
```

Isso criará:
- ✅ Banco de dados SQLite
- ✅ Empresa exemplo "Exemplo Corp"
- ✅ Administrador com credenciais ADMIN-2024/admin123

### 2. Iniciar Servidor
```bash
npm run dev
```

Servidor rodará em: http://localhost:3001

### 3. Iniciar Frontend (Live Server)
Abra o VS Code na pasta raiz e use Live Server:
- Clique com botão direito em qualquer arquivo HTML
- Selecione "Open with Live Server"
- Acesse: http://localhost:5500

---

## 🎯 Casos de Uso

### Caso 1: Funcionário Comum
1. Login em `/HumanManagement/login.html`
2. Acesso ao dashboard pessoal
3. Visualização de dados próprios
4. Acesso limitado a outros módulos

### Caso 2: Gerente de RH
1. Login com credenciais de gerente
2. Acesso total ao módulo HumanManagement
3. CRUD de funcionários
4. Relatórios de RH
5. Acesso aos dados de patrimônio da empresa

### Caso 3: Administrador
1. Login com ADMIN-2024/admin123
2. Acesso total a todos os módulos
3. Gerenciamento de empresas, funcionários, ativos
4. Criação de participações executivas

### Caso 4: Executivo Multi-empresas
1. Login como funcionário/executivo
2. Administrador cria participações para o executivo em várias empresas:
   ```javascript
   // Empresa A - CEO
   POST /api/executive/participations
   { "executiveId": "exec-uuid", "companyId": "company-a", "role": "CEO" }
   
   // Empresa B - Investidor
   POST /api/executive/participations
   { "executiveId": "exec-uuid", "companyId": "company-b", "role": "INVESTOR" }
   
   // Empresa C - Conselheiro
   POST /api/executive/participations
   { "executiveId": "exec-uuid", "companyId": "company-c", "role": "BOARD_MEMBER" }
   ```
3. Executivo acessa `/ExecutiveManager/executive-dashboard.html`
4. Visualiza dashboard consolidado com dados de todas as empresas
5. Clica em empresa específica para ver detalhes
6. Compara performance entre empresas

---

## 🔒 Segurança

### JWT Token
- Gerado no login
- Válido por 24 horas
- Deve ser enviado em todas as requisições autenticadas
- Header: `Authorization: Bearer <token>`

### Níveis de Acesso
1. **Funcionário** - Acesso aos próprios dados
2. **Gerente** - Acesso à gestão de equipe
3. **Administrador** - Acesso total ao sistema
4. **Executivo** - Acesso multi-empresas com permissões específicas

### Validação de Permissões
```javascript
// Exemplo: Verificar se executivo tem acesso à empresa
GET /api/executive/access/:executiveId/:companyId
// Retorna: { hasAccess: true/false }
```

---

## 🧪 Testes

### Teste Completo do Fluxo

1. **Login:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"accessKey":"ADMIN-2024","password":"admin123"}'
   ```

2. **Dashboard Executivo:**
   ```bash
   curl -X GET http://localhost:3001/api/executive/dashboard/<employee-id> \
     -H "Authorization: Bearer <token>"
   ```

3. **Criar Participação:**
   ```bash
   curl -X POST http://localhost:3001/api/executive/participations \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "executiveId": "<employee-id>",
       "companyId": "<company-id>",
       "role": "INVESTOR",
       "equityPercentage": 15.0,
       "canViewFinancials": true
     }'
   ```

---

## 🐛 Troubleshooting

### Erro: Token inválido
- Verifique se o token está armazenado no localStorage
- Token expira em 24h, faça login novamente
- Certifique-se que o header Authorization está correto

### Erro: CORS
- Servidor backend deve ter CORS habilitado
- Verifique se `app.use(cors())` está no server.ts

### Erro: Banco de dados não encontrado
- Execute `npm run seed` no diretório servidor
- Verifique se ascenda.db foi criado

### Dashboard executivo vazio
- Crie participações para o executivo usando POST /api/executive/participations
- Verifique se o executiveId corresponde ao ID do funcionário logado

---

## 📈 Próximos Passos

### Funcionalidades Futuras
- [ ] Sistema de notificações em tempo real
- [ ] Relatórios comparativos entre empresas
- [ ] Exportação de dados (PDF, Excel)
- [ ] Gráficos de performance
- [ ] Sistema de aprovações multi-nível
- [ ] Integração com APIs externas (contabilidade, bancos)
- [ ] App mobile

### Melhorias Técnicas
- [ ] Testes automatizados (Jest, Cypress)
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Migração para PostgreSQL
- [ ] Cache com Redis
- [ ] API rate limiting
- [ ] Logs estruturados

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este guia de integração
2. Consulte a documentação das APIs
3. Revise os logs do servidor (`npm run dev`)
4. Verifique o console do navegador (F12)

---

**Versão:** 1.0.0  
**Data:** 2024  
**Desenvolvido para:** Ascenda - Sistema de Gestão Empresarial Integrado
