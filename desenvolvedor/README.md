# 🛠️ Painel do Desenvolvedor - Ascenda Flex# 🛠️ Painel do Desenvolvedor - Ascenda Flex



## 📋 Visão Geral## 📋 Visão Geral



Ferramenta completa de desenvolvimento e testes com acesso total ao sistema Ascenda Flex.O **Painel do Desenvolvedor** é uma ferramenta completa que permite acesso total ao sistema Ascenda Flex para desenvolvimento e testes, incluindo o poderoso **Interface Explorer** com God Mode.



⚠️ **IMPORTANTE:** Este painel NÃO deve estar disponível em produção!⚠️ **IMPORTANTE:** Este painel NÃO deve estar disponível em produção!



---## 🚀 Como Acessar



## 🚀 Acesso Rápido1. Certifique-se de que o servidor está rodando:

   ```bash

### Iniciar Servidor   cd servidor

```bash   node server.js

cd servidor   ```

npm start

```2. Acesse via navegador:

   ```

### URLs   http://localhost:3000/desenvolvedor/dev-login.html

- **Login Dev:** http://localhost:3000/desenvolvedor/dev-login.html   ```

- **Dashboard:** http://localhost:3000/desenvolvedor/dev-dashboard.html

3. Crie uma conta de desenvolvedor ou faça login

### Credenciais Padrão

```## 🎯 Funcionalidades Principais

Email: admin@ascenda.dev

Senha: dev123### 📊 Dashboard com Estatísticas

```- **Total de Empresas** cadastradas

- **Total de Usuários** em todas as empresas

Para criar novo dev:- **Total de Squads** ativos

```bash- **Total de Chapters** criados

cd servidor

node add-dev.js### 🏢 Gestão de Empresas

```- Listar todas as empresas

- Criar novas empresas rapidamente

---- Ver detalhes completos (templates, usuários)

- Deletar empresas (com confirmação)

## 🎯 Funcionalidades

### 👥 Gestão de Usuários

### 1. Dashboard com Estatísticas- Listar TODOS os usuários de TODAS as empresas

- Total de empresas, usuários, squads e chapters- Filtrar por empresa e nível hierárquico (0-7)

- Visão geral do sistema em tempo real- Ver credenciais completas (email, chave de acesso)

- Login rápido como qualquer usuário

### 2. Gerenciamento de Empresas

- ✅ Listar todas as empresas### 🚀 Login Rápido (SEM SENHA)

- ✅ Criar novas empresas**A funcionalidade mais útil para testes!**

- ✅ Ver detalhes completos

- ✅ Alterar status (ativo/inativo/suspenso)- Cards visuais com todos os usuários

- ✅ Visualizar usuários por empresa- Login instantâneo como qualquer usuário (sem senha)

- ✅ Deletar empresas- Redireciona automaticamente para o dashboard correto

- Perfeito para testar diferentes níveis de acesso

### 3. Interface Explorer (God Mode)

- 🎭 **God Mode:** Acesso a qualquer interface como qualquer nível hierárquico### 🎨 Interface Explorer ⭐ NOVO

- 🔍 **Exploração:** Navegue por todas as interfaces sem limitações**God Mode para Explorar Todas as Interfaces**

- 🏢 **Multi-empresa:** Teste com diferentes empresas

- 🎚️ **Todos os níveis:** Do Presidente (N0) ao Operacional (N7)- **13 Interfaces mapeadas** em grid visual

- Seletor de empresa (testa com diferentes companyId)

### 4. Solicitações de Cadastro- Acesso direto a todas interfaces do sistema:

- Aprovar/rejeitar solicitações de novas empresas  - **Nível 0:** Presidentes (+ aprovacoes, relatorios, estrutura)

- Ver detalhes completos das solicitações  - **Nível 1:** Admin Dashboard, Templates, Squads, Chapters, Usuários

- Filtrar por status (pendente/aprovado/rejeitado)  - **Níveis 2-7:** Diretores, Gerentes, Coordenadores, Supervisores, Especialistas, Operacional



### 5. Banco de Dados- **Opções de abertura:**

- Limpar todos os dados  - Clique normal: Abre na mesma aba (troca contexto)

- Popular com dados de teste (3 seeds pré-configurados)  - Ctrl+Clique: Abre em nova aba (mantém painel aberto)

- Visualizar tabelas (em desenvolvimento)

### 💾 Gestão de Banco de Dados

### 6. Desenvolvedores- Visualizar estrutura do banco

- Listar todos os desenvolvedores- Testar queries SQL

- Ver informações e último login- Limpar dados de teste

- Gerenciar acessos

### 🔌 Teste de API

---- Testar endpoints diretamente

- Ver respostas JSON

## 🎭 God Mode - Interface Explorer- Depurar erros de API



### Como Usar### 🌱 Dados de Teste (Seed)

- Popular banco com dados demo

1. **Acesse o Dashboard Dev**- Criar empresas, usuários, squads e chapters

2. **Vá para aba "Explorador de Interfaces"**- Resetar ambiente de desenvolvimento

3. **Selecione uma empresa**

4. **Escolha a interface desejada**## 📁 Estrutura de Arquivos

5. **Clique em "Abrir Interface"**

```

### Níveis Disponíveisdesenvolvedor/

├── dev-login.html ................... Login de desenvolvedores

| Nível | Cargo | Interface |├── dev-dashboard.html ............... Painel principal

|-------|-------|-----------|├── dev-dashboard.css ................ Estilos completos

| **N0** | Presidentes | Dashboard executivo, aprovações, estrutura |├── dev-dashboard.js ................. Toda lógica (incluindo Interface Explorer)

| **N1** | Admins Gerais | Gestão completa, usuários, squads, chapters |├── README.md ........................ Este arquivo (guia principal)

| **N2** | Diretores | Dashboard departamental |├── AUTENTICACAO.md .................. Sistema de autenticação dev

| **N3** | Gerentes | Dashboard gerencial |├── EXPLORADOR_INTERFACES.md ......... Guia do Interface Explorer

| **N4** | Coordenadores | Dashboard de coordenação |└── GUIA_TESTES.md ................... Como testar funcionalidades

| **N5** | Supervisores | Dashboard de supervisão |```

| **N6** | Especialistas | Dashboard técnico |

| **N7** | Operacional | Dashboard operacional |### 🎨 Explorar Interfaces ⭐ NOVO!

**God Mode: Acesse qualquer interface sem restrições!**

### Recursos God Mode

- Selecione uma empresa

- ✅ Sem autenticação necessária- Veja TODAS as 13 interfaces disponíveis (Níveis 0-7)

- ✅ Acesso instantâneo a qualquer interface- Abra na mesma aba ou em nova aba

- ✅ Trocar entre empresas facilmente- Sem necessidade de login ou permissões

- ✅ Token temporário com 24h de validade- Perfeito para:

- ✅ Flag visual indicando modo explorador  - Testar fluxos completos

- ✅ Abrir em nova aba ou mesma aba  - Comparar interfaces lado a lado

  - Desenvolvimento rápido

---  - Validação de features



## 🗄️ Banco de Dados📖 **Documentação completa:** `EXPLORADOR_INTERFACES.md`



### Seeds Disponíveis**Como usar:**

1. Vá na aba "🚀 Login Rápido"

1. **TechStartup Inovadora**2. Clique em qualquer card de usuário

   - Empresa pequena de tecnologia3. Você será logado automaticamente como aquele usuário

   - 6 funcionários

   - Estrutura enxuta### 💾 Visualização do Banco de Dados

   - Foco em agilidade- Ver todas as tabelas:

  - companies

2. **Corporate Solutions**  - users

   - Empresa média de consultoria  - countries

   - 30 funcionários  - organization_templates

   - Squads e chapters  - squads

   - Estrutura híbrida  - squad_members

  - chapters

3. **Digital Agency**  - chapter_members

   - Agência digital criativa  - squad_goals

   - 15 funcionários- Dados exibidos em JSON formatado

   - Squads multifuncionais- Útil para debug

   - Projetos diversos

### 🔌 Testar API

### Limpar Dados- Ferramenta de teste de endpoints

```javascript- Suporta GET, POST, PUT, DELETE

// Remove TODAS as empresas e usuários- Editor de JSON para body

// Mantém desenvolvedores- Toggle de autenticação

clearAllData()- Visualização da resposta formatada

```

**Como usar:**

---1. Selecione o método HTTP

2. Digite o endpoint (ex: `/api/companies`)

## 🔐 Autenticação3. Se POST/PUT, adicione o JSON no body

4. Clique "Enviar Requisição"

### Sistema de Login5. Veja a resposta



O painel de desenvolvedor tem autenticação independente:### 🌱 Dados de Teste

Gere empresas completas com um clique:

1. **Tabela separada:** `dev_users`

2. **Token JWT:** Válido por 24h#### 🚀 Startup de Tecnologia

3. **Proteção:** `dev-protection.js` verifica autenticação- 1 empresa tech

4. **Storage:** Token salvo em `localStorage.devToken`- 15 funcionários

- 3 squads ativos

### Fluxo de Autenticação- Template: Startup (3 níveis)



```#### 🏢 Grande Corporação

Login Dev → JWT Token → dev-protection.js → Dashboard- 1 empresa tradicional

                ↓- 50 funcionários

          localStorage.devToken- Todos os 8 níveis hierárquicos

```- 8 squads, 5 chapters

- Template: Corporate

---

#### 🎨 Agência de Marketing

## 📊 API Endpoints (Dev)- 1 agência

- 20 funcionários

### Autenticação- Estrutura por projetos

```- Template: Scale-up

POST /api/dev/auth/register - Criar desenvolvedor

POST /api/dev/auth/login    - Login de desenvolvedor#### 🗑️ Limpar Tudo

POST /api/dev/auth/verify   - Verificar token- Remove TODOS os dados

```- Mantém apenas empresa demonstrativa

- Útil para resetar testes

### Empresas

```## 🎮 Fluxos de Teste Recomendados

GET    /api/dev/companies        - Listar empresas

DELETE /api/dev/companies/:id    - Deletar empresa### Teste 1: Novo Sistema do Zero

PUT    /api/dev/companies/:id/status - Alterar status```

```1. Limpar Todos os Dados

2. Criar nova empresa (Ex: "TechCorp")

### God Mode3. Login Rápido como Administrador dessa empresa

```4. Configurar Template Organizacional (Scale-up)

POST /api/dev/impersonate - Gerar token de impersonation5. Criar usuários nos níveis configurados

```6. Criar squads

7. Adicionar membros aos squads

### Dados8. Testar navegação entre dashboards

``````

POST /api/dev/seed/tech-startup  - Seed startup

POST /api/dev/seed/corporate     - Seed corporativa### Teste 2: Sistema Completo

POST /api/dev/seed/agency        - Seed agência```

DELETE /api/dev/clear-all        - Limpar tudo1. Gerar "Startup de Tecnologia"

```2. Login Rápido como CEO (Nível 0)

3. Ver visão estratégica

---4. Login Rápido como Diretor (Nível 2)

5. Ver visão tática

## 🎨 Estrutura de Arquivos6. Login Rápido como Analista (Nível 6)

7. Ver visão operacional

``````

desenvolvedor/

├── dev-login.html          # Página de login### Teste 3: Múltiplas Empresas

├── dev-login.css           # Estilos do login```

├── dev-login.js            # Lógica de login1. Gerar Startup de Tecnologia

├── dev-dashboard.html      # Dashboard principal2. Gerar Grande Corporação

├── dev-dashboard.css       # Estilos do dashboard3. Gerar Agência de Marketing

├── dev-dashboard.js        # Lógica do dashboard4. Alternar entre empresas usando Login Rápido

├── dev-protection.js       # Proteção de rotas5. Verificar isolamento de dados

└── README.md               # Esta documentação```

```

### Teste 4: Templates Organizacionais

---```

1. Login Rápido como Admin

## 🚧 Boas Práticas2. Testar Template Startup (3 níveis)

3. Criar usuários nos níveis ativos

### Desenvolvimento4. Mudar para Template Corporate (8 níveis)

- ✅ Sempre teste com dados de seed antes de criar manualmente5. Criar usuários nos novos níveis

- ✅ Use God Mode para testar todas as interfaces6. Verificar roteamento correto

- ✅ Limpe dados regularmente durante testes```

- ✅ Mantenha credenciais dev separadas

### Teste 5: Squads e Colaboração

### Segurança```

- ⚠️ **NUNCA** exponha `/desenvolvedor` em produção1. Login Rápido como Gerente

- ⚠️ Altere senha padrão em ambientes compartilhados2. Criar Squad "Feature X"

- ⚠️ Tokens expiram em 24h - refaça login se necessário3. Adicionar membros de diferentes níveis

- ⚠️ God Mode cria sessões temporárias sem persistência4. Definir alocações (60%, 100%, etc)

5. Login Rápido como membro do squad

### Performance6. Verificar visibilidade

- 💡 Use filtros para reduzir dados carregados```

- 💡 Evite abrir muitas abas simultâneas em God Mode

- 💡 Limpe localStorage periodicamente## 🔒 Segurança



---### ⚠️ AVISOS IMPORTANTES



## 🐛 Troubleshooting1. **NÃO usar em produção**

   - Este painel bypassa toda autenticação

### Erro 401 no Dashboard   - Qualquer pessoa com acesso pode fazer qualquer coisa

```bash

# Solução: Token expirado ou inválido2. **Token Fake**

# Faça logout e login novamente   - O login rápido gera tokens falsos

```   - Não são validados pelo backend

   - Serve apenas para testes locais

### Empresas não aparecem

```bash3. **Sem validação**

# Solução: Popule com seeds   - Não há verificação de permissões

# Vá em "Banco de Dados" → Escolha um seed → Gerar   - Não há logs de auditoria

```   - Use apenas em ambiente de desenvolvimento



### God Mode não funciona### ✅ Boas Práticas

```bash

# Solução: Verifique se há empresas cadastradas1. **Delete antes de deploy**

# Verifique se o servidor está rodando   - Remova a pasta `desenvolvedor/` antes de fazer deploy

# Limpe localStorage e tente novamente   - Ou bloqueie acesso via `.htaccess` ou configuração do servidor

```

2. **Use apenas localmente**

### CSS não carrega   - localhost ou rede local de desenvolvimento

```bash   - Nunca exponha na internet

# Solução: Reinicie o servidor

cd servidor3. **Backup antes de limpar**

npm start   - Sempre faça backup do banco antes de usar "Limpar Tudo"

```   - Ou copie `servidor/ascenda.db` para local seguro



---## 📝 Casos de Uso



## 📝 Changelog### Desenvolvimento de Novas Features

```javascript

### v2.0.0 (08/11/2025)// 1. Preparar ambiente

- ✅ Correção completa de UTF-8- Limpar dados antigos

- ✅ Otimização de middlewares Express- Gerar dados de teste

- ✅ Criação de desenvolvedor padrão- Login rápido no contexto desejado

- ✅ Logs detalhados de autenticação

- ✅ Limpeza e consolidação de documentação// 2. Desenvolver

- Fazer mudanças no código

---- Recarregar página

- Testar funcionalidade

## 👨‍💻 Desenvolvido por

// 3. Testar em múltiplos contextos

Equipe Ascenda Flex  - Login rápido como diferentes usuários

Data: Novembro 2025- Verificar permissões

- Validar comportamento
```

### Debug de Problemas
```javascript
// 1. Reproduzir cenário
- Usar dados de teste ou criar manualmente
- Login rápido no contexto do bug

// 2. Investigar
- Ver banco de dados
- Testar API diretamente
- Verificar console do navegador

// 3. Validar correção
- Aplicar fix
- Recarregar
- Testar novamente
```

### Demonstrações
```javascript
// 1. Preparar demo
- Limpar dados
- Gerar empresa completa
- Popular com dados realistas

// 2. Durante a demo
- Usar login rápido para alternar contextos
- Mostrar diferentes perspectivas
- Sem precisar lembrar senhas
```

## 🛠️ Customização

### Adicionar Novos Seeds
Edite `dev-dashboard.js`:

```javascript
async function seedCustomCompany() {
    // Sua lógica aqui
    const data = {
        company: { /* ... */ },
        admins: [ /* ... */ ]
    };
    
    await fetch(`${API_BASE}/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}
```

### Adicionar Novos Testes de API
```javascript
async function testCustomEndpoint() {
    const response = await fetch(`${API_BASE}/custom-endpoint`);
    const data = await response.json();
    console.log(data);
}
```

## 📚 Referência Rápida

### Atalhos Úteis
- `F12` - Abrir DevTools
- `Ctrl+R` - Recarregar página
- `Ctrl+Shift+R` - Recarregar sem cache

### URLs Importantes
- Painel Dev: `desenvolvedor/dev-dashboard.html`
- Login Normal: `index.html`
- API Base: `http://localhost:3000/api`

### Credenciais Padrão
```
Empresa: Empresa Demonstrativa
Email: admin@exemplo.com
Senha: 123456
Chave: admin
```

## 🐛 Troubleshooting

### Problema: "Erro ao carregar empresas"
**Solução:** Servidor não está rodando. Execute:
```bash
cd servidor
node server.js
```

### Problema: Login rápido não funciona
**Solução:** 
1. Limpe localStorage: `localStorage.clear()`
2. Recarregue a página
3. Tente novamente

### Problema: Dados não aparecem
**Solução:**
1. Verifique console do navegador (F12)
2. Verifique se há erros na aba Network
3. Confirme que API está respondendo

### Problema: CORS error
**Solução:** 
- O servidor já tem CORS habilitado
- Se persistir, verifique `servidor/server.js`
- Confirme que CORS middleware está ativo

## 🎨 Screenshots

```
┌─────────────────────────────────────────┐
│  🛠️ Painel do Desenvolvedor             │
│  [MODO DESENVOLVIMENTO]                  │
│                                          │
│  📊 4 Empresas  👥 127 Usuários         │
│  🚀 12 Squads  📚 8 Chapters            │
├─────────────────────────────────────────┤
│  🏢 Empresas                             │
│  👥 Usuários                             │
│  🚀 Login Rápido   ← MAIS USADO         │
│  💾 Banco de Dados                       │
│  🔌 Testar API                           │
│  🌱 Dados de Teste                       │
└─────────────────────────────────────────┘
```

---

**Desenvolvido para facilitar testes e desenvolvimento da Ascenda** 🚀

**Versão:** 1.0.0  
**Data:** 5 de Novembro de 2025
