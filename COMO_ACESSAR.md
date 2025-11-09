# 🌐 Acessar a Aplicação pelo Navegador

## ✅ Configuração Atualizada

O servidor agora serve arquivos estáticos! Você pode acessar a aplicação diretamente pelo navegador.

---

## 🚀 Como Acessar

### 1. Certifique-se que o servidor está rodando

```powershell
cd C:\Users\diniz\OneDrive\Área de Trabalho\Projetos\Ascenda1\server
node server
```

Você verá:
```
✓ Servidor rodando na porta 3000
📁 Servindo arquivos estáticos de: C:\Users\diniz\OneDrive\Área de Trabalho\Projetos\Ascenda1
```

### 2. Abra o navegador

**Acesse qualquer um desses links:**

- **Página Principal (Login Cliente):**
  ```
  http://localhost:3000/
  http://localhost:3000/index.html
  ```

- **Dashboard Cliente:**
  ```
  http://localhost:3000/client/pages/dashboard.html
  ```

- **Login Desenvolvedor:**
  ```
  http://localhost:3000/desenvolvedor/pages/login.html
  ```

- **Dashboard Desenvolvedor:**
  ```
  http://localhost:3000/desenvolvedor/pages/dashboard.html
  ```

---

## 📝 Credenciais

### Login Cliente (http://localhost:3000/)
| Email | Senha |
|-------|-------|
| ceo@empresa.com | senha123 |
| diretor@empresa.com | senha123 |
| admin@empresa.com | senha123 |

### Login Desenvolvedor (http://localhost:3000/desenvolvedor/pages/login.html)
| Email | Senha |
|-------|-------|
| dev@ascenda.com | Dev@2024!Super |
| admin@ascenda.com | Admin@2024!Master |

---

## 🔄 Reiniciar Servidor

Se o servidor já estava rodando, **você precisa reiniciá-lo** para aplicar as mudanças:

1. **Parar o servidor:**
   - Pressione `Ctrl + C` no terminal onde está rodando

2. **Iniciar novamente:**
   ```powershell
   node server
   ```

Ou feche a janela do PowerShell e execute:
```powershell
cd server
npm start
```

---

## 📁 Estrutura de Arquivos Servidos

Todos os arquivos do projeto estão acessíveis:

```
http://localhost:3000/
├── index.html                          # Login cliente
├── dashboard.html                      # Dashboard antigo
├── style/
│   ├── index.css
│   └── dashboard.css
├── script/
│   └── index.js
├── client/
│   └── pages/
│       └── dashboard.html
├── desenvolvedor/
│   ├── pages/
│   │   ├── login.html
│   │   └── dashboard.html
│   ├── style/
│   └── script/
└── ... (todos os outros arquivos)
```

---

## ✅ Checklist

- [x] Servidor configurado para servir arquivos estáticos
- [x] Rota raiz (/) aponta para index.html
- [x] Todas as pastas acessíveis (client, desenvolvedor, style, script)
- [ ] **Reiniciar servidor** (você precisa fazer isso!)
- [ ] Abrir http://localhost:3000/ no navegador
- [ ] Fazer login e testar

---

## 🎯 Fluxo Completo

1. **Iniciar servidor:**
   ```powershell
   cd server
   node server
   ```

2. **Abrir navegador:**
   - URL: `http://localhost:3000/`

3. **Fazer login:**
   - Email: `ceo@empresa.com`
   - Senha: `senha123`

4. **Será redirecionado para:**
   - `http://localhost:3000/client/pages/dashboard.html`

5. **Dashboard carrega:**
   - API: `http://localhost:3000/api/...`
   - SQLite conectado
   - Dados carregados

---

## ⚠️ Importante

### REINICIE O SERVIDOR!

As mudanças só terão efeito após reiniciar o servidor:

```powershell
# No terminal onde o servidor está rodando:
Ctrl + C

# Depois:
node server
```

---

**Pronto! Acesse http://localhost:3000/ e faça login!** 🚀
