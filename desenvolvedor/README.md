# 🛠️ Painel do Desenvolvedor - Ascenda Flex

## 📋 Visão Geral

O **Painel do Desenvolvedor** é uma ferramenta completa que permite acesso total ao sistema Ascenda Flex para desenvolvimento e testes, incluindo o poderoso **Interface Explorer** com God Mode.

⚠️ **IMPORTANTE:** Este painel NÃO deve estar disponível em produção!

## 🚀 Como Acessar

1. Certifique-se de que o servidor está rodando:
   ```bash
   cd servidor
   node server.js
   ```

2. Acesse via navegador:
   ```
   http://localhost:3000/desenvolvedor/dev-login.html
   ```

3. Crie uma conta de desenvolvedor ou faça login

## 🎯 Funcionalidades Principais

### 📊 Dashboard com Estatísticas
- **Total de Empresas** cadastradas
- **Total de Usuários** em todas as empresas
- **Total de Squads** ativos
- **Total de Chapters** criados

### 🏢 Gestão de Empresas
- Listar todas as empresas
- Criar novas empresas rapidamente
- Ver detalhes completos (templates, usuários)
- Deletar empresas (com confirmação)

### 👥 Gestão de Usuários
- Listar TODOS os usuários de TODAS as empresas
- Filtrar por empresa e nível hierárquico (0-7)
- Ver credenciais completas (email, chave de acesso)
- Login rápido como qualquer usuário

### 🚀 Login Rápido (SEM SENHA)
**A funcionalidade mais útil para testes!**

- Cards visuais com todos os usuários
- Login instantâneo como qualquer usuário (sem senha)
- Redireciona automaticamente para o dashboard correto
- Perfeito para testar diferentes níveis de acesso

### 🎨 Interface Explorer ⭐ NOVO
**God Mode para Explorar Todas as Interfaces**

- **13 Interfaces mapeadas** em grid visual
- Seletor de empresa (testa com diferentes companyId)
- Acesso direto a todas interfaces do sistema:
  - **Nível 0:** Presidentes (+ aprovacoes, relatorios, estrutura)
  - **Nível 1:** Admin Dashboard, Templates, Squads, Chapters, Usuários
  - **Níveis 2-7:** Diretores, Gerentes, Coordenadores, Supervisores, Especialistas, Operacional

- **Opções de abertura:**
  - Clique normal: Abre na mesma aba (troca contexto)
  - Ctrl+Clique: Abre em nova aba (mantém painel aberto)

### 💾 Gestão de Banco de Dados
- Visualizar estrutura do banco
- Testar queries SQL
- Limpar dados de teste

### 🔌 Teste de API
- Testar endpoints diretamente
- Ver respostas JSON
- Depurar erros de API

### 🌱 Dados de Teste (Seed)
- Popular banco com dados demo
- Criar empresas, usuários, squads e chapters
- Resetar ambiente de desenvolvimento

## 📁 Estrutura de Arquivos

```
desenvolvedor/
├── dev-login.html ................... Login de desenvolvedores
├── dev-dashboard.html ............... Painel principal
├── dev-dashboard.css ................ Estilos completos
├── dev-dashboard.js ................. Toda lógica (incluindo Interface Explorer)
├── README.md ........................ Este arquivo (guia principal)
├── AUTENTICACAO.md .................. Sistema de autenticação dev
├── EXPLORADOR_INTERFACES.md ......... Guia do Interface Explorer
├── GUIA_TESTES.md ................... Como testar funcionalidades
└── ACESSO_RAPIDO.md ................. Atalhos e dicas rápidas
```

### 🎨 Explorar Interfaces ⭐ NOVO!
**God Mode: Acesse qualquer interface sem restrições!**

- Selecione uma empresa
- Veja TODAS as 13 interfaces disponíveis (Níveis 0-7)
- Abra na mesma aba ou em nova aba
- Sem necessidade de login ou permissões
- Perfeito para:
  - Testar fluxos completos
  - Comparar interfaces lado a lado
  - Desenvolvimento rápido
  - Validação de features

📖 **Documentação completa:** `EXPLORADOR_INTERFACES.md`

**Como usar:**
1. Vá na aba "🚀 Login Rápido"
2. Clique em qualquer card de usuário
3. Você será logado automaticamente como aquele usuário

### 💾 Visualização do Banco de Dados
- Ver todas as tabelas:
  - companies
  - users
  - countries
  - organization_templates
  - squads
  - squad_members
  - chapters
  - chapter_members
  - squad_goals
- Dados exibidos em JSON formatado
- Útil para debug

### 🔌 Testar API
- Ferramenta de teste de endpoints
- Suporta GET, POST, PUT, DELETE
- Editor de JSON para body
- Toggle de autenticação
- Visualização da resposta formatada

**Como usar:**
1. Selecione o método HTTP
2. Digite o endpoint (ex: `/api/companies`)
3. Se POST/PUT, adicione o JSON no body
4. Clique "Enviar Requisição"
5. Veja a resposta

### 🌱 Dados de Teste
Gere empresas completas com um clique:

#### 🚀 Startup de Tecnologia
- 1 empresa tech
- 15 funcionários
- 3 squads ativos
- Template: Startup (3 níveis)

#### 🏢 Grande Corporação
- 1 empresa tradicional
- 50 funcionários
- Todos os 8 níveis hierárquicos
- 8 squads, 5 chapters
- Template: Corporate

#### 🎨 Agência de Marketing
- 1 agência
- 20 funcionários
- Estrutura por projetos
- Template: Scale-up

#### 🗑️ Limpar Tudo
- Remove TODOS os dados
- Mantém apenas empresa demonstrativa
- Útil para resetar testes

## 🎮 Fluxos de Teste Recomendados

### Teste 1: Novo Sistema do Zero
```
1. Limpar Todos os Dados
2. Criar nova empresa (Ex: "TechCorp")
3. Login Rápido como Administrador dessa empresa
4. Configurar Template Organizacional (Scale-up)
5. Criar usuários nos níveis configurados
6. Criar squads
7. Adicionar membros aos squads
8. Testar navegação entre dashboards
```

### Teste 2: Sistema Completo
```
1. Gerar "Startup de Tecnologia"
2. Login Rápido como CEO (Nível 0)
3. Ver visão estratégica
4. Login Rápido como Diretor (Nível 2)
5. Ver visão tática
6. Login Rápido como Analista (Nível 6)
7. Ver visão operacional
```

### Teste 3: Múltiplas Empresas
```
1. Gerar Startup de Tecnologia
2. Gerar Grande Corporação
3. Gerar Agência de Marketing
4. Alternar entre empresas usando Login Rápido
5. Verificar isolamento de dados
```

### Teste 4: Templates Organizacionais
```
1. Login Rápido como Admin
2. Testar Template Startup (3 níveis)
3. Criar usuários nos níveis ativos
4. Mudar para Template Corporate (8 níveis)
5. Criar usuários nos novos níveis
6. Verificar roteamento correto
```

### Teste 5: Squads e Colaboração
```
1. Login Rápido como Gerente
2. Criar Squad "Feature X"
3. Adicionar membros de diferentes níveis
4. Definir alocações (60%, 100%, etc)
5. Login Rápido como membro do squad
6. Verificar visibilidade
```

## 🔒 Segurança

### ⚠️ AVISOS IMPORTANTES

1. **NÃO usar em produção**
   - Este painel bypassa toda autenticação
   - Qualquer pessoa com acesso pode fazer qualquer coisa

2. **Token Fake**
   - O login rápido gera tokens falsos
   - Não são validados pelo backend
   - Serve apenas para testes locais

3. **Sem validação**
   - Não há verificação de permissões
   - Não há logs de auditoria
   - Use apenas em ambiente de desenvolvimento

### ✅ Boas Práticas

1. **Delete antes de deploy**
   - Remova a pasta `desenvolvedor/` antes de fazer deploy
   - Ou bloqueie acesso via `.htaccess` ou configuração do servidor

2. **Use apenas localmente**
   - localhost ou rede local de desenvolvimento
   - Nunca exponha na internet

3. **Backup antes de limpar**
   - Sempre faça backup do banco antes de usar "Limpar Tudo"
   - Ou copie `servidor/ascenda.db` para local seguro

## 📝 Casos de Uso

### Desenvolvimento de Novas Features
```javascript
// 1. Preparar ambiente
- Limpar dados antigos
- Gerar dados de teste
- Login rápido no contexto desejado

// 2. Desenvolver
- Fazer mudanças no código
- Recarregar página
- Testar funcionalidade

// 3. Testar em múltiplos contextos
- Login rápido como diferentes usuários
- Verificar permissões
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
