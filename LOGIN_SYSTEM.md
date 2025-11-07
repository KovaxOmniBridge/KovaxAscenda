# 🔐 Sistema de Login - Ascenda Flex

## 📋 Visão Geral

Sistema de autenticação otimizado com suporte a múltiplos papéis e validação em tempo real.

---

## ✨ Melhorias Implementadas

### 1. **Interface Aprimorada**
- ✅ Design moderno e intuitivo
- ✅ Ícones visuais para cada campo
- ✅ Dicas contextuais (hints) em cada campo
- ✅ Animações suaves de entrada
- ✅ Feedback visual aprimorado

### 2. **Validação em Tempo Real**
- ✅ Formatação automática da chave de acesso (maiúsculas)
- ✅ Validação de formato (XX-0000)
- ✅ Feedback imediato de erros
- ✅ Estados de foco aprimorados
- ✅ Prevenção de envios duplicados

### 3. **Fluxo de Login Otimizado**
- ✅ Detecção automática de multi-roles
- ✅ Redirecionamento inteligente baseado no nível
- ✅ Suporte a role-switcher para usuários com múltiplos papéis
- ✅ Persistência de sessão via localStorage
- ✅ Mensagens de status claras

### 4. **Segurança**
- ✅ Desabilitação de botão durante processamento
- ✅ Proteção contra múltiplos cliques
- ✅ Tratamento robusto de erros
- ✅ Validação de dados no frontend e backend

---

## 🎯 Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────────┐
│                    PÁGINA DE LOGIN                          │
│                                                             │
│  1. Selecionar Empresa     [Dropdown]                      │
│  2. Chave de Acesso       [TS-0001]  ← Auto uppercase      │
│  3. Senha                 [********]                        │
│                                                             │
│           [🚀 Entrar na Plataforma]                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    [Validação]
                            ↓
                ┌───────────────────────┐
                │   Backend Verifica    │
                │   - Empresa existe    │
                │   - Usuário existe    │
                │   - Senha correta     │
                └───────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  Retorna Dados User   │
                │  + Token JWT          │
                │  + additional_roles   │
                │  + can_switch_roles   │
                └───────────────────────┘
                            ↓
            ┌───────────────────────────────┐
            │  Usuário tem múltiplos roles? │
            └───────────────────────────────┘
                    ↓              ↓
                [SIM]           [NÃO]
                    ↓              ↓
        ┌─────────────────┐   ┌──────────────────┐
        │  Role Switcher  │   │  Dashboard Nível │
        │  (Escolher)     │   │  Principal       │
        └─────────────────┘   └──────────────────┘
```

---

## 🔑 Campos do Formulário

### **1. Empresa**
- **Tipo**: Select dropdown
- **Obrigatório**: Sim
- **Descrição**: Empresa à qual o usuário pertence
- **Fonte**: Carregado dinamicamente via API `/api/companies`

### **2. Chave de Acesso**
- **Tipo**: Text input
- **Obrigatório**: Sim
- **Formato**: `XX-0000` (2-3 letras + hífen + 4 dígitos)
- **Exemplos**: 
  - `TS-0001` (TechStart)
  - `MC-0150` (MediumCorp)
  - `MG-0500` (MegaCorporation)
- **Auto-formatação**: Converte para maiúsculas automaticamente
- **Validação**: Formato validado em tempo real

### **3. Senha**
- **Tipo**: Password input
- **Obrigatório**: Sim
- **Padrão de Teste**: `senha123` (todas as contas de teste)

---

## 📦 localStorage - Dados Salvos

Após login bem-sucedido, os seguintes dados são armazenados:

```javascript
// Token de autenticação (JWT - 24h)
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIs...');

// Dados completos do usuário
localStorage.setItem('userData', JSON.stringify({
    id: 1,
    name: "João Silva",
    email: "joao.silva@techstart.com",
    role: "Presidente",
    nivel: 0,
    additional_roles: [1, 2],        // Roles adicionais (pode ser null)
    can_switch_roles: true,           // Pode trocar de papel
    department: "Presidência",
    company: {
        id: 6,
        name: "TechStart",
        website: "https://techstart.com"
    }
}));

// Papel selecionado atualmente
localStorage.setItem('selectedRole', '0');
```

---

## 🗺️ Mapeamento de Níveis → Dashboards

| Nível | Nome                     | URL do Dashboard                                    |
|-------|--------------------------|-----------------------------------------------------|
| 0     | Presidentes              | `/Nivel00-Presidentes/dashboard-presidentes.html`   |
| 1     | Administradores Gerais   | `/Nivel01-AdministradoresGerais/dashboard-admin.html` |
| 2     | Diretores Executivos     | `/Nivel02-DiretoresExecutivos/dashboard-diretores.html` |
| 3     | Gerentes                 | `/Nivel03-Gerentes/dashboard-gerentes.html`         |
| 4     | Coordenadores            | `/Nivel04-Coordenadores/dashboard-coordenadores.html` |
| 5     | Supervisores             | `/Nivel05-Supervisores/dashboard-supervisores.html` |
| 6     | Especialistas            | `/Nivel06-Especialistas/dashboard-especialistas.html` |
| 7     | Operacional              | `/Nivel07-Operacional/dashboard-operacional.html`   |

---

## 🔄 Multi-Role System

### Quando o usuário tem múltiplos papéis:
1. **Login** → Autentica e carrega dados
2. **Verificação** → Checa `can_switch_roles === true` e `additional_roles !== null`
3. **Redirecionamento** → Envia para `/shared/role-switcher.html`
4. **Seleção** → Usuário escolhe o papel desejado
5. **Dashboard** → Redireciona para o dashboard correspondente

### Quando o usuário tem papel único:
1. **Login** → Autentica e carrega dados
2. **Redirecionamento Direto** → Envia para dashboard do seu nível
3. **Dashboard** → Acesso direto à interface

---

## 🎨 Estilos CSS Aplicados

### Classes principais:
- `.login-header` - Cabeçalho do formulário
- `.label-icon` - Ícones nos labels
- `.form-hint` - Dicas de preenchimento
- `.form-actions` - Container de botões
- `.login-footer` - Rodapé com ajuda
- `.field-error` - Mensagens de erro em campos

### Animações:
- `fadeInUp` - Entrada suave do formulário
- Transições em foco de campos
- Feedback visual de loading no botão

---

## 🧪 Credenciais de Teste

### TechStart (50 funcionários)
- Nível 0: `TS-0001` / senha123
- Nível 1: `TS-0002` / senha123
- Nível 2: `TS-0003` / senha123
- ...

### MediumCorp (200 funcionários)
- Nível 0: `MC-0001` / senha123
- Nível 1: `MC-0003` / senha123
- Nível 2: `MC-0005` / senha123
- ...

### MegaCorporation (1000 funcionários)
- Nível 0: `MG-0001` / senha123
- Nível 1: `MG-0011` / senha123
- Nível 2: `MG-0031` / senha123
- ...

---

## 🐛 Tratamento de Erros

### Erros de Conexão:
```javascript
showMessage('Erro ao conectar com o servidor. Verifique sua conexão.', 'error');
```

### Credenciais Inválidas:
```javascript
showMessage('Credenciais inválidas', 'error');
```

### Empresa não selecionada:
```javascript
showMessage('Por favor, selecione uma empresa.', 'error');
```

### Campos vazios:
```javascript
showMessage('Por favor, preencha todos os campos.', 'error');
```

---

## 🔧 Arquivos Modificados

1. **index.html**
   - Melhorias na estrutura do formulário
   - Adição de ícones e hints
   - Rodapé de ajuda

2. **script.js**
   - Função `handleLogin()` otimizada
   - Função `getDashboardUrl()` adicionada
   - Validação em tempo real
   - Formatação automática de campos
   - Suporte a multi-roles

3. **styles.css**
   - Estilos para `.login-header`
   - Estilos para hints e ícones
   - Animações aprimoradas
   - Estados de foco melhorados

---

## 📝 Próximos Passos (Futuro)

- [ ] Recuperação de senha
- [ ] Autenticação de dois fatores (2FA)
- [ ] Login com biometria
- [ ] Histórico de logins
- [ ] Sessões simultâneas em múltiplos dispositivos
- [ ] Notificações de login suspeito
- [ ] Integração com SSO (Single Sign-On)

---

## 🆘 Suporte

Em caso de problemas:
1. Verifique se o servidor está rodando (`npm start` na pasta `servidor`)
2. Confirme que a empresa está cadastrada no banco de dados
3. Verifique se o formato da chave de acesso está correto
4. Consulte o console do navegador (F12) para logs detalhados

---

**Última atualização**: Novembro 2025
