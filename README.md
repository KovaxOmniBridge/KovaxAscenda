# Ascenda Flex - Plataforma de Gestão Organizacional Híbrida

Plataforma completa para gestão organizacional que combina hierarquia tradicional, squads multifuncionais e chapters (comunidades de prática).

## 🎯 Visão Geral

**Ascenda Flex** é uma plataforma inovadora que implementa um modelo híbrido de gestão organizacional, permitindo que empresas trabalhem simultaneamente com:

- **Hierarquia Tradicional:** 8 níveis do Presidente ao Operacional
- **Squads Multifuncionais:** Equipes temporárias cross-hierárquicas
- **Chapters:** Comunidades de prática por especialidade técnica

## 📁 Estrutura do Projeto

```
Ascenda/
├── index.html                          # Página inicial (login e registro)
├── styles.css                          # Estilos da página inicial
├── script.js                           # JavaScript da página inicial
│
├── desenvolvedor/                      # Painel do Desenvolvedor
│   ├── dev-login.html                 # Autenticação dev
│   ├── dev-dashboard.html             # Painel principal
│   ├── dev-dashboard.js               # Interface Explorer (God Mode)
│   └── ...
│
├── Nivel00-Presidentes/                # Nível 0 - Presidentes
│   ├── dashboard-presidentes.html     # Dashboard estratégico
│   ├── aprovacoes.html                # Aprovações executivas
│   ├── relatorios.html                # Relatórios e BI
│   └── estrutura.html                 # Estrutura organizacional
│
├── Nivel01-AdministradoresGerais/      # Nível 1 - Administradores Gerais
│   ├── dashboard-admin.html           # Dashboard administrativo
│   ├── templates.html                 # Templates organizacionais
│   ├── squads.html                    # Gestão de squads
│   ├── chapters.html                  # Gestão de chapters
│   └── usuarios.html                  # Gestão de usuários
│
├── Nivel02-DiretoresExecutivos/        # Nível 2 - Diretores Executivos
│   └── dashboard-diretores.html       # Dashboard departamental
│
├── Nivel03-Gerentes/                   # Nível 3 - Gerentes
│   └── dashboard-gerentes.html        # Dashboard de gerência
│
├── Nivel04-Coordenadores/              # Nível 4 - Coordenadores
│   └── dashboard-coordenadores.html   # Dashboard de coordenação
│
├── Nivel05-Supervisores/               # Nível 5 - Supervisores
│   └── dashboard-supervisores.html    # Dashboard de supervisão
│
├── Nivel06-Especialistas/              # Nível 6 - Especialistas
│   └── dashboard-especialistas.html   # Dashboard de especialistas
│
├── Nivel07-Operacional/                # Nível 7 - Operacional
│   └── dashboard-operacional.html     # Dashboard operacional
│
└── servidor/                           # Backend Node.js
    ├── server.js                       # API REST + Autenticação
    ├── database.js                     # Schema SQLite (10 tabelas)
    ├── ascenda.db                      # Banco de dados
    └── package.json                    # Dependências
```

## 🚀 Como Iniciar

### 1. Configurar o Backend

```bash
# Navegar para a pasta do servidor
cd servidor

# Instalar dependências
npm install

# Iniciar o servidor
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### 2. Abrir o Frontend

Abra o arquivo `index.html` no navegador ou use um servidor local:

```bash
# Opção 1: Abrir diretamente
start index.html

# Opção 2: Usar Live Server (VS Code)
# Clique com botão direito em index.html > Open with Live Server
```

### 3. Fazer Login

Use as credenciais de teste:
- **Empresa:** Ascenda Demo
- **Nome de Usuário:** admin
- **Senha:** 123456

Após o login, você será redirecionado para o dashboard administrativo.

## 🎨 Funcionalidades Principais

### 📝 Página Inicial (index.html)
- **Apresentação da Empresa:** Hero section com informações sobre a Ascenda
- **Registro de Empresas:** Formulário multi-etapas para cadastro
  - Etapa 1: Dados da empresa
  - Etapa 2: Cadastro de administradores
  - Etapa 3: Revisão e confirmação
- **Login:** Autenticação com seleção de empresa

### 👑 Dashboard Administrativo (AdministradorGeral/)
- **Visão Geral:** Estatísticas e ações rápidas
- **Gerenciamento de Usuários:** CRUD completo de usuários
- **Informações da Empresa:** Visualização e edição de dados corporativos
- **Países de Atuação:** Gestão de localizações da empresa
- **Configurações:** Edição de perfil e alteração de senha

### 🔧 Backend API (servidor/)
- **Autenticação JWT:** Tokens seguros com 24h de validade
- **Gestão de Empresas:** Cadastro e consulta de empresas
- **Gestão de Usuários:** CRUD completo com validações
- **Gestão de Países:** Gerenciamento de localizações
- **Segurança:** Senhas criptografadas com bcrypt

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3 (com CSS Variables para temas)
- JavaScript (Vanilla JS)
- Fetch API para requisições

### Backend
- Node.js
- Express.js
- SQLite3 (banco de dados local)
- bcryptjs (criptografia de senhas)
- jsonwebtoken (JWT para autenticação)
- CORS habilitado

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt (10 salt rounds)
- ✅ Autenticação JWT com tokens de 24 horas
- ✅ Validação de dados no frontend e backend
- ✅ Proteção de rotas com middleware de autenticação
- ✅ Isolamento de dados por empresa
- ✅ Prevenção de nomes de usuário duplicados
- ✅ Proteção contra exclusão de administradores principais

## 📊 Banco de Dados

### Tabela: companies
Armazena informações das empresas cadastradas:
- id, name, legal_name, founded_year, size, industry, website, description

### Tabela: users
Armazena usuários e administradores:
- id, company_id, name, email, phone, department, access_key, password, role, is_primary

### Tabela: countries
Armazena países de atuação das empresas:
- id, company_id, country, tax_id, city, address, phone, is_headquarters

## 🎯 Níveis de Acesso

### Administrador Geral
- Acesso total ao dashboard
- Gerenciamento de usuários
- Edição de informações da empresa
- Gestão de países
- Configurações

### Administrador Principal
- Mesmo acesso que Administrador Geral
- **Proteção especial:** Não pode ser excluído
- Definido no momento do cadastro da empresa

## 📚 Documentação Adicional

- **Dashboard:** Consulte [`AdministradorGeral/GUIA_DASHBOARD.md`](./AdministradorGeral/GUIA_DASHBOARD.md)
- **Servidor:** Consulte [`servidor/README.md`](./servidor/README.md)

## 🔄 Fluxo de Uso

1. **Cadastro de Empresa:**
   - Acesse `index.html`
   - Clique em "Cadastrar Empresa"
   - Preencha os dados em 3 etapas
   - Defina pelo menos um administrador principal

2. **Login:**
   - Selecione a empresa
   - Digite nome de usuário e senha
   - Clique em "Entrar"

3. **Dashboard:**
   - Acesse automaticamente após login
   - Gerencie usuários, países e informações
   - Visualize estatísticas em tempo real

## 🐛 Troubleshooting

### Servidor não inicia
```bash
cd servidor
npm install
npm run dev
```

### Erro ao conectar com API
- Verifique se o servidor está rodando na porta 3000
- Confirme que não há firewall bloqueando
- Veja os logs do servidor no terminal

### Não redireciona após login
- Verifique o console do navegador (F12)
- Confirme que o token foi salvo no localStorage
- Tente limpar o cache do navegador

## 🚧 Próximas Funcionalidades

- [ ] Gestão de permissões granulares
- [ ] Níveis hierárquicos adicionais (Gerentes, Supervisores)
- [ ] Upload de logo da empresa
- [ ] Relatórios e analytics
- [ ] Auditoria de ações
- [ ] Notificações em tempo real
- [ ] Suporte a múltiplos idiomas

## 👨‍💻 Desenvolvimento

### Requisitos
- Node.js v18 ou superior
- npm ou yarn
- Navegador moderno (Chrome, Firefox, Edge)

### Instalação para Desenvolvimento
```bash
# Clonar repositório
git clone https://github.com/Davi658/Ascenda.git
cd Ascenda

# Instalar dependências do servidor
cd servidor
npm install

# Iniciar servidor em modo desenvolvimento
npm run dev
```

## 📄 Licença

Este projeto é privado e de uso interno.

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação em cada pasta
2. Verifique os logs do servidor
3. Revise o console do navegador

---

**Desenvolvido com ❤️ para Ascenda Platform**  
**Última atualização:** Novembro 2025
