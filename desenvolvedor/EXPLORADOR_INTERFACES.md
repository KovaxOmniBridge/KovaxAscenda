# 🎨 Explorador de Interfaces - God Mode

## 🚀 Visão Geral

O **Explorador de Interfaces** é uma ferramenta poderosa no Painel do Desenvolvedor que permite acessar **qualquer interface de qualquer empresa sem restrições de nível hierárquico**.

---

## 💡 Para Que Serve?

### Problemas que Resolve:
1. ❌ **Antes**: Precisava fazer login como usuário específico para ver cada interface
2. ❌ **Antes**: Demorava muito para testar diferentes níveis hierárquicos
3. ❌ **Antes**: Impossível comparar interfaces lado a lado
4. ❌ **Antes**: Precisava criar usuários em todos os níveis para testar

### Solução:
✅ **Agora**: Acessa qualquer interface com 2 cliques  
✅ **Agora**: Explora todos os 8 níveis hierárquicos instantaneamente  
✅ **Agora**: Abre múltiplas interfaces em abas diferentes  
✅ **Agora**: God Mode completo para desenvolvimento e teste  

---

## 📋 Interfaces Disponíveis

### Nível 0 - Presidentes 👑
- **Dashboard Presidência**
  - Visão estratégica global
  - Análise de indicadores macro
  - Decisões corporativas

### Nível 1 - Administradores Gerais ⚙️
- **Dashboard Administrativo** - Painel completo de gestão
- **Templates Organizacionais** - Configurar estrutura (Startup/Scale-up/Corporate)
- **Gestão de Squads** - Criar e gerenciar squads multifuncionais
- **Gestão de Chapters** - Comunidades de prática por especialidade
- **Gestão de Usuários** - CRUD completo de usuários

### Nível 2 - Diretores Executivos 📊
- **Dashboard Diretoria**
  - Gestão de departamentos
  - KPIs e orçamentos
  - Estratégia

### Nível 3 - Gerentes 📈
- **Dashboard Gerência**
  - Supervisão de operações
  - Gestão de equipe
  - Metas

### Nível 4 - Coordenadores 🎯
- **Dashboard Coordenação**
  - Coordenação de projetos
  - Atividades e recursos

### Nível 5 - Supervisores 👁️
- **Dashboard Supervisão**
  - Supervisão direta de equipe
  - Tarefas operacionais

### Nível 6 - Analistas 💼
- **Dashboard Analista**
  - Execução de tarefas especializadas
  - Análises e relatórios

### Nível 7 - Assistentes 📝
- **Dashboard Assistente**
  - Suporte operacional
  - Tarefas administrativas

---

## 🎯 Como Usar

### Passo 1: Acessar o Explorador
```
1. Abra o Painel do Desenvolvedor (dev-dashboard.html)
2. Clique na aba "🎨 Explorar Interfaces"
```

### Passo 2: Selecionar Empresa
```
1. No dropdown "🏢 Selecionar Empresa"
2. Escolha a empresa que deseja explorar
3. As interfaces aparecerão automaticamente
```

### Passo 3: Explorar Interfaces
Você verá cards visuais para cada interface com:
- **Ícone** colorido identificando a área
- **Nome** da interface
- **Badge de Nível** (Nível 0-7)
- **Descrição** do que a interface faz
- **Caminho** do arquivo (para referência)
- **2 Botões de ação**:
  - 🚀 **Abrir** - Abre na mesma aba
  - 🔗 **Nova Aba** - Abre em nova aba do navegador

### Passo 4: Abrir Interface
**Opção A - Mesma Aba:**
```
- Clique no card inteiro OU
- Clique no botão "🚀 Abrir"
- A interface abrirá na mesma aba
```

**Opção B - Nova Aba:**
```
- Clique no botão "🔗 Nova Aba"
- A interface abrirá em nova aba
- Útil para comparar interfaces lado a lado
```

---

## 🔥 Casos de Uso

### Caso 1: Testar Fluxo Completo
```
1. Selecionar empresa "TechStartup Inovadora"
2. Abrir "Templates Organizacionais" (Nível 1)
3. Configurar template Startup
4. Abrir "Dashboard Presidência" (Nível 0) em nova aba
5. Verificar se configurações aparecem
6. Abrir "Dashboard Analista" (Nível 6) em nova aba
7. Comparar visibilidade de dados
```

### Caso 2: Comparar Níveis Hierárquicos
```
1. Selecionar empresa "Corporação Global SA"
2. Abrir "Dashboard Diretoria" (Nível 2) em nova aba
3. Abrir "Dashboard Gerência" (Nível 3) em nova aba
4. Abrir "Dashboard Coordenação" (Nível 4) em nova aba
5. Comparar lado a lado: quais dados cada nível vê
```

### Caso 3: Testar Sistema Híbrido
```
1. Selecionar empresa com squads configurados
2. Abrir "Gestão de Squads" (Nível 1)
3. Criar novo squad
4. Abrir "Dashboard Analista" (Nível 6) em nova aba
5. Verificar se analista vê squads que participa
6. Testar alocações e visibilidade
```

### Caso 4: Desenvolvimento de Nova Feature
```
1. Selecionar empresa de teste
2. Abrir todas as interfaces do mesmo nível em abas diferentes
3. Implementar nova feature em uma interface
4. Testar consistência visual entre interfaces
5. Verificar comportamento em diferentes contextos
```

---

## 💻 Detalhes Técnicos

### Como Funciona Internamente

**1. Estrutura de Dados:**
```javascript
const INTERFACES_MAP = [
    {
        level: 1,
        icon: '⚙️',
        name: 'Dashboard Administrativo',
        description: 'Painel administrativo completo',
        path: '../Nivel01-AdministradoresGerais/dashboard-admin.html'
    },
    // ... outras interfaces
];
```

**2. Salvamento de Contexto:**
```javascript
// Ao abrir uma interface, salva ID da empresa no localStorage
localStorage.setItem('devModeCompanyId', companyId);

// As interfaces podem ler esse valor para saber qual empresa carregar
const companyId = localStorage.getItem('devModeCompanyId');
```

**3. Navegação:**
```javascript
// Mesma aba
window.location.href = path;

// Nova aba
window.open(path, '_blank');
```

### Integração com Interfaces

Para que as interfaces funcionem corretamente com o Explorador:

**1. Ler CompanyId do Dev Mode:**
```javascript
// No início do script da interface
let companyId = localStorage.getItem('token') 
    ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).company_id
    : localStorage.getItem('devModeCompanyId');

if (!companyId) {
    alert('⚠️ Acesso não autorizado. Faça login primeiro.');
    window.location.href = '../index.html';
}
```

**2. Usar CompanyId nas Requisições:**
```javascript
// Todas as requisições usam o companyId detectado
fetch(`/api/users/company/${companyId}`)
fetch(`/api/squads/company/${companyId}`)
```

---

## ⚠️ Avisos Importantes

### 🔒 Segurança
- ⚠️ Esta ferramenta é SOMENTE para desenvolvimento
- ⚠️ Bypassa completamente autenticação e permissões
- ⚠️ NUNCA fazer deploy em produção com esta funcionalidade
- ⚠️ Deletar pasta `desenvolvedor/` antes do deploy

### 🐛 Troubleshooting

**Problema: Interfaces não carregam dados**
```
Solução:
1. Verifique se servidor está rodando (porta 3000)
2. Abra DevTools (F12) e veja erros no Console
3. Confirme que companyId está salvo no localStorage:
   localStorage.getItem('devModeCompanyId')
```

**Problema: "Acesso não autorizado"**
```
Solução:
1. A interface pode estar verificando token JWT
2. Use "Login Rápido" antes de abrir a interface
3. Ou modifique a interface para aceitar devModeCompanyId
```

**Problema: Dados de outra empresa aparecem**
```
Solução:
1. Limpe localStorage: localStorage.clear()
2. Volte ao Explorador de Interfaces
3. Selecione a empresa correta novamente
```

---

## 🎨 Personalização

### Adicionar Nova Interface

**1. Edite `dev-dashboard.js`:**
```javascript
const INTERFACES_MAP = [
    // ... interfaces existentes
    {
        level: 1,
        icon: '🆕',
        name: 'Minha Nova Interface',
        description: 'Descrição do que faz',
        path: '../Nivel01-AdministradoresGerais/minha-interface.html'
    }
];
```

**2. Crie o arquivo HTML:**
```html
<!-- minha-interface.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Minha Interface</title>
</head>
<body>
    <h1>Minha Nova Interface</h1>
    <script>
        // Ler companyId do dev mode
        const companyId = localStorage.getItem('devModeCompanyId') 
            || JSON.parse(atob(localStorage.getItem('token').split('.')[1])).company_id;
        
        console.log('Empresa ID:', companyId);
        // ... resto do código
    </script>
</body>
</html>
```

### Personalizar Visual dos Cards

**Edite `dev-dashboard.css`:**
```css
.interface-card {
    /* Alterar cor de fundo */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    /* Alterar efeito hover */
    transition: all 0.5s ease;
}

.interface-card:hover {
    /* Aumentar elevação */
    transform: translateY(-10px) scale(1.05);
}
```

---

## 📊 Estatísticas de Uso

### Interfaces Totais: **13**
- Nível 0: 1 interface
- Nível 1: 5 interfaces (mais completo)
- Nível 2: 1 interface
- Nível 3: 1 interface
- Nível 4: 1 interface
- Nível 5: 1 interface
- Nível 6: 1 interface
- Nível 7: 1 interface

### Economia de Tempo:
- **Antes**: ~5 min para testar cada nível (criar usuário, login, navegar)
- **Agora**: ~10 segundos (selecionar empresa, clicar no card)
- **Economia**: 96% mais rápido! ⚡

---

## 🚀 Próximos Passos

### Features Planejadas:
- [ ] Filtro por nível hierárquico
- [ ] Busca por nome de interface
- [ ] Histórico de interfaces visitadas
- [ ] Favoritos para acesso rápido
- [ ] Preview da interface em miniatura
- [ ] Comparador lado a lado integrado
- [ ] Exportar lista de interfaces como JSON

---

## ✅ Conclusão

O **Explorador de Interfaces** transforma o desenvolvimento e teste do sistema Ascenda:

✨ **Acesso instantâneo** a qualquer interface  
✨ **Exploração completa** de todos os níveis  
✨ **Comparação fácil** abrindo múltiplas abas  
✨ **God Mode total** sem restrições de permissões  

**Aproveite o poder do desenvolvimento sem limites!** 🎉

---

**Data:** 5 de Novembro de 2025  
**Status:** ✅ IMPLEMENTADO E FUNCIONAL
