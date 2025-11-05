# 👥 HumanManagement - Portal de Gerenciamento de Funcionários

Sistema completo de gestão de recursos humanos integrado ao Ascenda.

## 🚀 Funcionalidades

### Autenticação e Segurança
- ✅ Login com chave de acesso e senha
- ✅ Seleção de cargo no login (opcional)
- ✅ JWT tokens para sessões seguras
- ✅ Renovação automática de tokens
- ✅ Logout com limpeza de sessão
- ✅ Validação de força de senha
- ✅ Remember me (lembrar usuário)

### Gestão de Funcionários
- ✅ CRUD completo de funcionários
- ✅ 15 tipos de cargos diferentes
- ✅ Sistema de permissões por cargo
- ✅ Geração automática de chave de acesso
- ✅ Hash de senhas com bcrypt
- ✅ Histórico de cargos
- ✅ Avaliações de desempenho
- ✅ Advertências e elogios
- ✅ Gestão de dependentes
- ✅ Informações bancárias
- ✅ Contatos de emergência

### Dashboards
- ✅ Dashboard de Administrador (estatísticas completas)
- ✅ Dashboard de Gerente (gestão de equipe)
- ✅ Dashboard de Funcionário (informações pessoais)
- ✅ Gráficos de funcionários por cargo
- ✅ Gráficos de funcionários por status
- ✅ Tabela de funcionários recentes

### Recursos Adicionais
- ✅ 5 tipos de contratos (CLT, PJ, Estágio, etc)
- ✅ 5 status de funcionário (Ativo, Férias, Afastado, etc)
- ✅ Horário de trabalho personalizado
- ✅ Folha de pagamento calculada
- ✅ Estatísticas de RH completas
- ✅ Tempo médio de casa
- ✅ Taxa de rotatividade

## 📂 Estrutura de Arquivos

```
HumanManagement/
├── login.html                      # Tela de login
├── employee-dashboard.html         # Dashboard do funcionário
├── admin-dashboard.html            # Dashboard do administrador
├── manager-dashboard.html          # Dashboard do gerente (alias)
├── hr-dashboard.html               # Dashboard do RH (alias)
├── accountant-dashboard.html       # Dashboard do contador (alias)
├── styles/
│   ├── login.css                   # Estilos do login
│   ├── dashboard.css               # Estilos base dos dashboards
│   └── admin-dashboard.css         # Estilos específicos do admin
└── scripts/
    ├── api.js                      # Cliente API
    ├── login.js                    # Lógica do login
    ├── employee-dashboard.js       # Lógica do dashboard funcionário
    └── admin-dashboard.js          # Lógica do dashboard admin
```

## 🔧 Backend

```
servidor/src/
├── interfaces/
│   └── IEmployee.ts                # Interfaces TypeScript
├── repositories/
│   └── EmployeeRepository.ts       # Operações de banco de dados
├── services/
│   ├── AuthService.ts              # Serviço de autenticação
│   └── EmployeeService.ts          # Serviço de funcionários
├── controllers/
│   ├── AuthController.ts           # Controller de autenticação
│   └── EmployeeController.ts       # Controller de funcionários
└── routes/
    ├── authRoutes.ts               # Rotas de autenticação
    └── employeeRoutes.ts           # Rotas de funcionários
```

## 📡 Endpoints da API

### Autenticação (`/api/auth`)
- `POST /login` - Faz login
- `POST /logout` - Faz logout
- `POST /refresh` - Renova token
- `POST /validate-token` - Valida token
- `GET /me` - Retorna usuário atual
- `POST /change-password` - Altera senha

### Funcionários (`/api/employees`)
- `GET /` - Lista todos os funcionários
- `GET /active` - Lista funcionários ativos
- `GET /generate-access-key` - Gera nova chave de acesso
- `GET /company/:companyId` - Lista por empresa
- `GET /company/:companyId/stats` - Estatísticas de RH
- `GET /unit/:unitId` - Lista por unidade
- `GET /role/:role` - Lista por cargo
- `GET /status/:status` - Lista por status
- `GET /manager/:managerId/subordinates` - Lista subordinados
- `GET /:id` - Busca por ID
- `POST /` - Cria funcionário
- `PUT /:id` - Atualiza funcionário
- `POST /:id/transfer` - Transfere para outra unidade
- `POST /:id/promote` - Promove funcionário
- `POST /:id/assign-manager` - Atribui gerente
- `POST /:id/activate` - Ativa funcionário
- `POST /:id/deactivate` - Desativa funcionário
- `DELETE /:id` - Desliga funcionário (soft delete)
- `DELETE /:id/permanent` - Deleta permanentemente

## 👥 Cargos Disponíveis

1. **ADMIN** - 👑 Administrador
2. **MANAGER** - 📊 Gerente
3. **SUPERVISOR** - 🎯 Supervisor
4. **HR** - 👥 Recursos Humanos
5. **ACCOUNTANT** - 💰 Contador
6. **SALES** - 🛍️ Vendedor
7. **STOCK_KEEPER** - 📦 Estoquista
8. **CASHIER** - 💵 Caixa
9. **ATTENDANT** - 🤝 Atendente
10. **SECURITY** - 🛡️ Segurança
11. **CLEANER** - 🧹 Limpeza
12. **MAINTENANCE** - 🔧 Manutenção
13. **DRIVER** - 🚗 Motorista
14. **ASSISTANT** - 📋 Assistente
15. **INTERN** - 🎓 Estagiário

## 🔐 Sistema de Permissões

Cada cargo tem permissões específicas:

**Administrador**
- ✅ Todos os acessos
- ✅ Gerenciar empresa
- ✅ Gerenciar funcionários
- ✅ Gerenciar financeiro
- ✅ Ver e exportar relatórios

**Gerente**
- ✅ Gerenciar equipe
- ✅ Ver financeiro
- ✅ Aprovar compras
- ✅ Gerenciar estoque
- ✅ Ver relatórios

**RH**
- ✅ Gerenciar funcionários
- ✅ Ver financeiro
- ✅ Ver relatórios
- ✅ Exportar dados

**Funcionário**
- ✅ Ver dados pessoais
- ✅ Ver horário
- ✅ Ver documentos

## 💾 Banco de Dados

Tabela `employees` com 40+ campos:

```sql
- id, companyId, unitId
- fullName, email, phone, birthDate, gender, photo
- documents (JSON: CPF, RG, CTPS, etc)
- address (JSON completo)
- role, department, jobTitle, contractType
- hireDate, terminationDate, status
- salary, paymentDay, benefits
- bankInfo (JSON)
- accessKey, passwordHash (bcrypt)
- accessLevel, permissions (JSON)
- workSchedule (JSON)
- managerId, dependents (JSON)
- roleHistory, performanceReviews, warningsAndPraises
- emergencyContact (JSON)
- notes, tags, timestamps
```

## 🎨 Interface

### Login
- Design moderno com glassmorphism
- Formas animadas no fundo
- Toggle mostrar/ocultar senha
- Remember me
- Validação em tempo real
- Mensagens de erro animadas

### Dashboards
- Sidebar fixa com navegação
- Cards de estatísticas coloridos
- Gráficos de barras interativos
- Tabelas responsivas
- Ações rápidas
- Design responsivo (mobile-first)

## 🚦 Como Usar

### 1. Criar Primeiro Funcionário Admin

```javascript
// Via API (POST /api/employees)
{
  "companyId": "sua-empresa-id",
  "fullName": "Admin Sistema",
  "email": "admin@empresa.com",
  "phone": "11999999999",
  "birthDate": "1990-01-01",
  "documents": {
    "cpf": "12345678901"
  },
  "address": {
    "street": "Rua Principal",
    "number": "123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01000000",
    "country": "Brasil"
  },
  "role": "ADMIN",
  "jobTitle": "Administrador",
  "contractType": "CLT",
  "hireDate": "2024-01-01",
  "status": "ACTIVE",
  "salary": 10000,
  "paymentDay": 5,
  "hasBenefits": true,
  "password": "Senha@123",
  "accessLevel": "FULL",
  "_creatorId": "system",
  "_creatorName": "Sistema"
}
```

### 2. Fazer Login

1. Acesse `http://localhost:5500/HumanManagement/login.html`
2. Digite a chave de acesso gerada (ex: `EMP-A1B2C3D4`)
3. Selecione o cargo (opcional)
4. Digite a senha
5. Clique em "Entrar"

### 3. Adicionar Novos Funcionários

No dashboard de admin:
1. Clique em "Novo Funcionário"
2. Preencha os dados
3. Sistema gera chave de acesso automaticamente
4. Define senha temporária
5. Funcionário pode trocar senha no primeiro login

## 🔄 Fluxo de Autenticação

```
1. Usuário faz login → POST /api/auth/login
2. Backend valida credenciais
3. Gera JWT token (válido por 8 horas)
4. Retorna token + dados do usuário
5. Frontend salva no localStorage
6. Todas as requisições incluem token no header
7. Backend valida token em cada requisição
8. Token expira → Frontend redireciona para login
```

## 📊 Estatísticas Disponíveis

- Total de funcionários
- Funcionários ativos vs inativos
- Distribuição por cargo
- Distribuição por status
- Distribuição por tipo de contrato
- Salário médio
- Folha de pagamento total
- Tempo médio de casa
- Taxa de rotatividade

## 🔜 Próximas Implementações

- [ ] Página de gerenciamento de funcionários completa
- [ ] Modal de cadastro/edição de funcionários
- [ ] Sistema de pontos (entrada/saída)
- [ ] Gestão de férias
- [ ] Gestão de atestados
- [ ] Cálculo automático de horas extras
- [ ] Integração com folha de pagamento
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Upload de documentos dos funcionários
- [ ] Notificações de aniversários
- [ ] Avaliações de desempenho 360°

## 🛡️ Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ JWT tokens com expiração
- ✅ Validação de força de senha
- ✅ Chaves de acesso únicas
- ✅ Proteção contra SQL injection (prepared statements)
- ✅ CORS configurado
- ✅ Validação de permissões em cada endpoint
- ✅ Tokens invalidados no logout
- ✅ Sessões expiram automaticamente

## 📝 Notas Técnicas

- Backend: Node.js + Express + TypeScript
- Database: SQLite com better-sqlite3
- Frontend: HTML5 + CSS3 + Vanilla JS
- Autenticação: JWT (jsonwebtoken)
- Senhas: bcrypt
- Validações: Joi ou validações manuais
- API: RESTful

## 💡 Dicas

1. **Primeiro acesso**: Use o endpoint `/api/employees/generate-access-key` para gerar chaves únicas
2. **Permissões**: Edite as permissões padrão em `ROLE_PERMISSIONS` no `IEmployee.ts`
3. **Token expira**: Configure `JWT_EXPIRES_IN` no `.env`
4. **Personalização**: Altere cores em `:root` nos arquivos CSS
5. **Mobile**: Todos os dashboards são responsivos
