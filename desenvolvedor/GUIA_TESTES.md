# 🧪 Guia de Teste - Painel do Desenvolvedor

## ✅ Painel Desenvolvedor - COMPLETO

Todas as funcionalidades do painel de desenvolvedor foram implementadas e estão prontas para uso!

---

## 🚀 Como Começar

### 1. Abrir o Painel
```
desenvolvedor/dev-dashboard.html
```

### 2. O que você verá
- 📊 **Estatísticas em tempo real** no topo
- 🎯 **6 abas funcionais** no menu lateral
- 🎨 **Interface visual moderna** com gradientes

---

## 📋 Funcionalidades Implementadas

### ✅ Tab 1: Empresas
**O que faz:**
- Lista todas as empresas cadastradas
- Mostra: ID, Nome, Razão Social, Setor, Tamanho
- Botão "Ver Template" para ver configuração organizacional
- Botão "👁️" para ver detalhes completos
- Botão "🗑️" para deletar empresa

**Como testar:**
1. Vá na aba "🏢 Empresas"
2. Clique "Ver Template" em qualquer empresa
3. Clique no ícone 👁️ para ver detalhes
4. Clique "+ Nova Empresa" para criar uma nova
5. Preencha o formulário e salve

**Teste de Deleção:**
- ⚠️ NÃO pode deletar empresa ID 1 (demo)
- Outras empresas: 3 confirmações de segurança
- Deleta todos os dados relacionados (CASCADE)

---

### ✅ Tab 2: Usuários
**O que faz:**
- Lista TODOS os usuários de TODAS as empresas
- Filtros por empresa e nível hierárquico
- Mostra: ID, Empresa, Nome, Email, Nível, Departamento, Chave
- Botão "Login" para login rápido

**Como testar:**
1. Vá na aba "👥 Usuários"
2. Use os filtros para filtrar por empresa ou nível
3. Clique "Login" em qualquer usuário
4. Você será logado como aquele usuário

---

### ✅ Tab 3: Login Rápido ⭐ MAIS IMPORTANTE
**O que faz:**
- **Login sem senha** como qualquer usuário
- Cards visuais com informações do usuário
- Redireciona automaticamente para dashboard correto

**Como testar:**
1. Vá na aba "🚀 Login Rápido"
2. Veja todos os cards de usuários
3. Clique "🚀 Login Rápido" em qualquer card
4. **BOOM!** Você está logado como aquele usuário
5. Teste funcionalidades do sistema
6. Volte ao painel dev para trocar de usuário

**Casos de Uso:**
- Testar como CEO (Nível 0)
- Testar como Diretor (Nível 2)
- Testar como Analista (Nível 6)
- Alternar rapidamente entre perfis

---

### ✅ Tab 4: Banco de Dados
**O que faz:**
- Visualiza dados de qualquer tabela
- Exibe JSON formatado
- 9 tabelas disponíveis

**Como testar:**
1. Vá na aba "💾 Banco de Dados"
2. Clique "Ver Dados" em qualquer tabela
3. Veja os dados em JSON formatado
4. Role para baixo para ver todos os registros

**Tabelas Disponíveis:**
- companies (empresas)
- users (usuários)
- countries (países)
- organization_templates (templates)
- squads (squads)
- squad_members (membros de squads)
- chapters (chapters)
- chapter_members (membros de chapters)
- squad_goals (metas de squads)

---

### ✅ Tab 5: Testar API
**O que faz:**
- Testa qualquer endpoint da API
- Suporta GET, POST, PUT, DELETE
- Editor de JSON para body
- Toggle de autenticação
- Visualização da resposta

**Como testar:**
1. Vá na aba "🔌 Testar API"
2. Selecione método (GET/POST/PUT/DELETE)
3. Digite endpoint (ex: `/api/companies`)
4. Se POST/PUT, adicione JSON no body
5. Toggle autenticação ON/OFF
6. Clique "Enviar Requisição"
7. Veja resposta formatada

**Exemplos de Teste:**

**GET - Listar Empresas:**
```
Método: GET
Endpoint: /api/companies
Auth: OFF
```

**POST - Criar Squad:**
```
Método: POST
Endpoint: /api/squads
Auth: ON
Body:
{
  "company_id": 1,
  "name": "Squad Teste API",
  "squad_type": "feature",
  "description": "Teste via API",
  "start_date": "2025-11-05",
  "created_by": 1
}
```

---

### ✅ Tab 6: Dados de Teste ⭐ SUPER ÚTIL
**O que faz:**
- Gera empresas completas com um clique
- 3 tipos de empresas pré-configuradas
- Opção de limpar todos os dados

---

#### 🚀 Seed 1: TechStartup Inovadora

**O que cria:**
- ✅ 1 empresa de tecnologia
- ✅ 15 funcionários completos:
  - Ana Silva (CEO - Nível 0)
  - Carlos Tech (CTO - Nível 1)
  - Beatriz Produto (Líder Produto - Nível 2)
  - Daniel Dev (Líder Engenharia - Nível 2)
  - 4 Desenvolvedores (Nível 6)
  - 2 Designers (Nível 6)
  - 1 PM, 1 QA, 1 Marketing, 1 Vendas (Nível 6)
  - 1 Assistente (Nível 7)
- ✅ 3 squads ativos:
  - Squad MVP (Feature)
  - Squad App Mobile (Project)
  - Squad Growth (Innovation)
- ✅ Template: Startup (níveis 0,1,2,6,7)
- ✅ Senha de todos: `123456`

**Como testar:**
1. Clique "Gerar" no card "🚀 Empresa Tech Startup"
2. Confirme a criação
3. Aguarde mensagem de sucesso
4. Vá na aba "🚀 Login Rápido"
5. Faça login como qualquer dos 15 usuários criados
6. Explore squads, templates, hierarquia

**Emails criados:**
- ana@techstartup.com
- carlos@techstartup.com
- beatriz@techstartup.com
- daniel@techstartup.com
- elena@techstartup.com
- felipe@techstartup.com
- ...e mais 9

---

#### 🏢 Seed 2: Corporação Global SA

**O que cria:**
- ✅ 1 grande corporação
- ✅ Template: Corporate (todos os 8 níveis)
- ✅ Estrutura hierárquica completa

**Como testar:**
1. Clique "Gerar" no card "🏢 Empresa Corporate"
2. Confirme a criação
3. Veja a estrutura completa com 8 níveis
4. Perfeito para testar hierarquia profunda

---

#### 🎨 Seed 3: Agência Criativa Plus

**O que cria:**
- ✅ 1 agência de marketing
- ✅ Template: Scale-up (5 níveis)
- ✅ Estrutura média

**Como testar:**
1. Clique "Gerar" no card "🎨 Agência de Marketing"
2. Confirme a criação
3. Template balanceado entre startup e corporate

---

#### 🗑️ Limpar Todos os Dados

**O que faz:**
- ❌ Deleta TODAS as empresas (exceto ID 1)
- ❌ Deleta todos usuários, squads, chapters
- ❌ Mantém apenas empresa demonstrativa
- ✅ Útil para resetar testes

**Como usar:**
1. Clique "Limpar" no card "🗑️ Limpar Tudo"
2. **3 confirmações** de segurança
3. Digite "OK" no prompt final
4. Banco resetado!

---

## 🎯 Fluxos de Teste Completos

### Teste 1: Sistema do Zero
```
1. Abrir painel dev
2. Limpar todos os dados
3. Gerar "TechStartup Inovadora"
4. Login Rápido como Ana Silva (CEO)
5. Configurar templates organizacionais
6. Login Rápido como Carlos Tech (CTO)
7. Gerenciar squads
8. Login Rápido como Elena Frontend (Dev)
9. Ver squads que participa
```

### Teste 2: Múltiplas Empresas
```
1. Gerar TechStartup Inovadora
2. Gerar Corporação Global SA
3. Gerar Agência Criativa Plus
4. Ver todas na aba "Empresas"
5. Alternar entre elas via Login Rápido
6. Verificar isolamento de dados
```

### Teste 3: CRUD Completo
```
1. Criar nova empresa (botão "+ Nova Empresa")
2. Ver detalhes (👁️)
3. Ver template (botão "Ver Template")
4. Testar API para adicionar usuários
5. Deletar empresa (🗑️)
```

### Teste 4: Hierarquia e Squads
```
1. Login como CEO da TechStartup
2. Ver dashboard administrativo
3. Criar novo squad
4. Adicionar membros
5. Login como membro do squad
6. Verificar visibilidade
```

### Teste 5: Visualização de Dados
```
1. Aba "Banco de Dados"
2. Ver tabela "users"
3. Ver tabela "squads"
4. Ver tabela "squad_members"
5. Analisar estrutura JSON
```

---

## 🐛 Solução de Problemas

### Problema: Dados não carregam
**Solução:**
- Verifique se servidor está rodando (porta 3000)
- Abra console do navegador (F12)
- Veja erros na aba "Console"

### Problema: Login rápido não funciona
**Solução:**
- Limpe localStorage: `localStorage.clear()`
- Recarregue página (Ctrl+R)
- Tente novamente

### Problema: Seed não cria usuários
**Solução:**
- Verifique console do servidor
- Pode haver conflito de emails duplicados
- Limpe dados e tente novamente

### Problema: "Erro ao buscar..."
**Solução:**
- Servidor provavelmente caiu
- Reinicie: `cd servidor && node server.js`

---

## 📊 Endpoints DEV Disponíveis

Todos funcionam SEM autenticação:

```javascript
GET    /api/dev/companies           // Todas empresas (completo)
DELETE /api/dev/companies/:id       // Deletar empresa
GET    /api/dev/table/:tableName    // Ver dados de tabela
POST   /api/dev/clear-all           // Limpar tudo
POST   /api/dev/seed/tech-startup   // Criar startup
POST   /api/dev/seed/corporate      // Criar corporação
POST   /api/dev/seed/agency         // Criar agência
```

---

## 🎉 Conclusão

O **Painel do Desenvolvedor está 100% funcional!**

Você agora tem:
- ✅ Controle total sobre todas as empresas
- ✅ Login sem senha como qualquer usuário
- ✅ Visualização completa do banco de dados
- ✅ Teste de API integrado
- ✅ Geração rápida de dados de teste
- ✅ Limpeza segura de dados

**Próximo passo:** Implementar Chapters! 🚀

---

**Data:** 5 de Novembro de 2025  
**Status:** ✅ COMPLETO E TESTADO
