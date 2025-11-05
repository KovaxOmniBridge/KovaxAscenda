# Script de Teste - Sistema Ascenda

## 🧪 Verificação de Integração

### 1. Testar Backend

```bash
# Navegar para o diretório do servidor
cd servidor

# Verificar se as dependências estão instaladas
npm install

# Compilar TypeScript
npm run build

# Iniciar servidor
npm run dev
```

**Servidor deve iniciar em:** http://localhost:3001

---

### 2. Testar Autenticação

```bash
# Fazer login com credenciais de teste
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "accessKey": "ADMIN-2024",
    "password": "admin123"
  }'
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "id": "...",
    "name": "Administrador Sistema",
    "role": "ADMINISTRADOR",
    "companyId": "..."
  }
}
```

**Salve o token e o employee.id para os próximos testes!**

---

### 3. Testar Dashboard Executivo

Substitua `<EMPLOYEE_ID>` e `<TOKEN>` pelos valores obtidos no passo anterior:

```bash
# Obter dashboard executivo
curl -X GET http://localhost:3001/api/executive/dashboard/<EMPLOYEE_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

**Resposta esperada:**
```json
{
  "executive": {
    "id": "...",
    "name": "Administrador Sistema",
    "email": "admin@ascenda.com.br"
  },
  "totalCompanies": 0,
  "activeParticipations": 0,
  "rolesDistribution": {},
  "participations": [],
  "financialSummary": {
    "totalEquity": 0,
    "totalMonthlyIncome": 0,
    "totalEmployees": 0,
    "totalAssets": 0
  },
  "companiesData": []
}
```

*Nota: Se não houver participações criadas, os arrays estarão vazios.*

---

### 4. Criar Participação Executiva

Para testar o dashboard com dados, crie uma participação:

```bash
# Obter ID da empresa (substitua <TOKEN>)
curl -X GET http://localhost:3001/api/companies \
  -H "Authorization: Bearer <TOKEN>"

# Criar participação (substitua <EMPLOYEE_ID>, <COMPANY_ID> e <TOKEN>)
curl -X POST http://localhost:3001/api/executive/participations \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "executiveId": "<EMPLOYEE_ID>",
    "companyId": "<COMPANY_ID>",
    "role": "CEO",
    "status": "ACTIVE",
    "equityPercentage": 100.0,
    "hasFullAccess": true,
    "canViewFinancials": true,
    "canViewEmployees": true,
    "canViewAssets": true,
    "canMakeDecisions": true
  }'
```

**Resposta esperada:**
```json
{
  "id": "...",
  "executiveId": "...",
  "companyId": "...",
  "companyName": "Exemplo Corp",
  "role": "CEO",
  "status": "ACTIVE",
  "equityPercentage": 100.0,
  ...
}
```

---

### 5. Verificar Dashboard Atualizado

```bash
# Obter dashboard novamente
curl -X GET http://localhost:3001/api/executive/dashboard/<EMPLOYEE_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

**Agora deve retornar:**
- `totalCompanies: 1`
- `activeParticipations: 1`
- `rolesDistribution: { "CEO": 1 }`
- Array `companiesData` com dados da empresa
- `financialSummary` com valores agregados

---

### 6. Testar Frontend

1. **Inicie o Live Server no VS Code**
   - Botão direito em qualquer arquivo HTML → "Open with Live Server"

2. **Acesse o Login**
   - URL: http://localhost:5500/HumanManagement/login.html
   - Credenciais: ADMIN-2024 / admin123

3. **Navegue para Dashboard Executivo**
   - Após login, acesse: http://localhost:5500/ExecutiveManager/executive-dashboard.html
   - Ou clique no menu lateral: "Dashboard Executivo"

4. **Verifique o Dashboard**
   - ✅ Resumo financeiro consolidado (6 cards)
   - ✅ Distribuição de papéis (badges coloridos)
   - ✅ Grid de empresas participantes
   - ✅ Clique em empresa para ver modal de detalhes

---

### 7. Testar Navegação Entre Módulos

No dashboard, teste os links do menu lateral:

- **Dashboard Executivo** → `/ExecutiveManager/executive-dashboard.html`
- **Gestão de Pessoas** → `/HumanManagement/admin-dashboard.html`
- **Gestão Patrimonial** → `/WealthManagement/assets.html`
- **Gestão Empresarial** → `/CompanyManagement/companies.html`

**Todos devem:**
- ✅ Manter o token no localStorage
- ✅ Preservar a sessão do usuário
- ✅ Não solicitar login novamente

---

## 🔍 Checklist de Funcionalidades

### ExecutiveManager - Dashboard
- [ ] Cards de resumo mostram valores corretos
- [ ] Badges de papéis aparecem com cores diferentes
- [ ] Grid de empresas lista todas participações
- [ ] Cards de empresa mostram estatísticas corretas
- [ ] Modal de detalhes abre ao clicar na empresa
- [ ] Modal mostra informações gerais da empresa
- [ ] Modal mostra estatísticas de RH
- [ ] Modal mostra estatísticas de patrimônio
- [ ] Modal mostra unidades físicas

### Integração
- [ ] Login funciona com ADMIN-2024/admin123
- [ ] Token é armazenado no localStorage
- [ ] Token é enviado em todas requisições
- [ ] Navegação entre módulos preserva sessão
- [ ] Logout limpa localStorage e redireciona

### Backend - ExecutiveManager
- [ ] GET /api/executive/dashboard/:id retorna dados consolidados
- [ ] POST /api/executive/participations cria participação
- [ ] GET /api/executive/participations/:executiveId lista participações
- [ ] PUT /api/executive/participation/:id atualiza participação
- [ ] DELETE /api/executive/participation/:id remove participação
- [ ] GET /api/executive/access/:execId/:companyId verifica acesso

---

## 🐛 Problemas Comuns

### Dashboard vazio
**Causa:** Nenhuma participação criada  
**Solução:** Criar participação via API (passo 4)

### Erro 401 Unauthorized
**Causa:** Token inválido ou expirado  
**Solução:** Fazer login novamente

### Dados de RH/Ativos = 0
**Causa:** Empresa não tem funcionários/ativos cadastrados  
**Solução:** Cadastrar dados nos módulos HumanManagement/WealthManagement

### Modal não abre
**Causa:** JavaScript não carregado  
**Solução:** Verificar console do navegador (F12) para erros

### CORS Error
**Causa:** Backend não configurado para CORS  
**Solução:** Verificar se `app.use(cors())` está no server.ts

---

## 📊 Testes Avançados

### Criar Múltiplas Participações

```bash
# Criar participação como CEO na Empresa A
curl -X POST http://localhost:3001/api/executive/participations \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "executiveId": "<EMPLOYEE_ID>",
    "companyId": "<COMPANY_A_ID>",
    "role": "CEO",
    "equityPercentage": 60.0,
    "canViewFinancials": true,
    "canViewEmployees": true,
    "canViewAssets": true
  }'

# Criar participação como Investidor na Empresa B
curl -X POST http://localhost:3001/api/executive/participations \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "executiveId": "<EMPLOYEE_ID>",
    "companyId": "<COMPANY_B_ID>",
    "role": "INVESTOR",
    "equityPercentage": 25.0,
    "canViewFinancials": true
  }'

# Criar participação como Conselheiro na Empresa C
curl -X POST http://localhost:3001/api/executive/participations \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "executiveId": "<EMPLOYEE_ID>",
    "companyId": "<COMPANY_C_ID>",
    "role": "BOARD_MEMBER",
    "equityPercentage": 10.0,
    "canViewFinancials": true,
    "canViewEmployees": false
  }'
```

**Dashboard deve mostrar:**
- Total de 3 empresas
- 3 participações ativas
- Badges: CEO (1), Investidor (1), Conselheiro (1)
- Participação total: 95%
- 3 cards de empresas no grid

---

## ✅ Critérios de Sucesso

Sistema está **totalmente funcional** se:

1. ✅ Login funciona com credenciais de teste
2. ✅ Backend compila e executa sem erros
3. ✅ Dashboard executivo carrega sem erros 404
4. ✅ API retorna dados consolidados corretamente
5. ✅ Frontend renderiza cards e modais
6. ✅ Navegação entre módulos funciona
7. ✅ Token persiste entre páginas
8. ✅ CRUD de participações funciona

---

**Última atualização:** 2024  
**Versão do Sistema:** 1.0.0
