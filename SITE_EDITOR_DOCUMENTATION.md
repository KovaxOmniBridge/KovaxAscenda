# 🎨 Sistema de Edição de Sites Modular - Ascenda

## 📋 Visão Geral

O Ascenda agora possui um **sistema modular de criação de sites** com dois modos distintos para atender diferentes necessidades:

### 🔷 Modo Simples
Editor visual com templates pré-definidos e personalizações rápidas. Ideal para quem quer um site profissional em minutos.

### 🔶 Modo Avançado (Low-Code)
Editor low-code completo estilo **Wix/WordPress** com drag-and-drop de componentes. Controle total sobre design e layout.

---

## 🚀 Fluxo de Uso

```
CompanyManagement (index.html)
         ↓
    Clicar "Meu Site"
         ↓
site-editor-selector.html (Escolher Modo)
         ↓
    ┌────────┴────────┐
    ↓                 ↓
Modo Simples    Modo Avançado
site-editor.html  site-editor-advanced.html
    ↓                 ↓
    └────────┬────────┘
             ↓
     Salvar no Backend
             ↓
    IndividualMarket renderiza
```

---

## 📁 Estrutura de Arquivos

### Frontend - CompanyManagement/

#### Seleção de Modo
- **site-editor-selector.html** - Tela de escolha entre Simples e Avançado
- **site-editor-selector.css** - Estilização com cards comparativos
- **site-editor-selector.js** - Lógica de redirecionamento

#### Modo Simples
- **site-editor.html** - Editor com 7 abas (tema, imagens, conteúdo, etc)
- **site-editor.css** - Estilos responsivos
- **site-editor.js** - Lógica de personalização

#### Modo Avançado
- **site-editor-advanced.html** - Editor low-code completo
- **site-editor-advanced.css** - Interface drag-and-drop
- **site-editor-advanced.js** - Engine de componentes

### Backend - servidor/src/

#### Interfaces
- **interfaces/ICompanySite.ts**
  - `editorType: 'simple' | 'advanced'`
  - `customLayout?: string` (HTML customizado)
  - Todos os campos de personalização

#### Repositório
- **repositories/CompanySiteRepository.ts**
  - Tabela `company_sites` com 24 colunas
  - Métodos CRUD com suporte aos dois modos

#### Migrations
- **migrations/add-editor-type-fields.ts**
  - Adiciona `editorType` e `customLayout`

---

## 🎯 Modo Simples

### Características
- ✅ **10 Temas Pré-Definidos**: blue, green, purple, red, orange, pink, teal, indigo, yellow, dark
- ✅ **8 Gradientes Hero**: Combinações visuais prontas
- ✅ **3 Layouts**: modern, classic, minimal
- ✅ **3 Fontes**: modern, classic, playful
- ✅ **Cores Personalizadas**: Primary, Secondary, Accent (hex picker)
- ✅ **Imagens Base64**: Logo, Banner, Favicon (até 5MB cada)
- ✅ **Conteúdo Editável**: Títulos, descrições, textos sobre
- ✅ **Seções Arrastar/Soltar**: Reordenar Hero, Produtos, Serviços, Sobre, Contato
- ✅ **Redes Sociais**: Facebook, Instagram, WhatsApp, LinkedIn, Twitter, YouTube, TikTok
- ✅ **CSS Customizado**: Campo avançado para desenvolvedores
- ✅ **Slug Personalizado**: URL amigável (ex: `minha-empresa`)

### Fluxo de Edição
1. Selecionar tema base
2. Personalizar cores com color pickers
3. Upload de logo/banner/favicon
4. Editar textos do hero e sobre
5. Configurar layout e fonte
6. Adicionar links de redes sociais
7. Reordenar seções
8. (Opcional) Adicionar CSS customizado
9. Preview e Salvar

---

## 🚀 Modo Avançado (Low-Code)

### Características
- 🎨 **25+ Componentes Prontos**:
  - **Estrutura**: Container, Seção, Colunas, Grid
  - **Conteúdo**: Título, Texto, Botão, Imagem, Vídeo, Ícone
  - **Blocos**: Hero, Header, Navbar, Features, Testimonials, Pricing, CTA, Footer
  - **Formulários**: Form, Input, Textarea, Select

- 🖱️ **Drag & Drop Engine**:
  - Arrastar componentes da biblioteca
  - Soltar no canvas visual
  - Reordenar componentes livremente
  - Mover para cima/baixo
  - Duplicar componentes
  - Excluir com confirmação

- 🎛️ **Sistema de Propriedades**:
  - Painel lateral direito
  - Editar propriedades de cada componente
  - Background, cores, tamanhos, textos
  - Preview em tempo real

- 📱 **Preview Responsivo**:
  - Desktop (100%)
  - Tablet (768px)
  - Mobile (375px)

- ⏮️ **Undo/Redo**:
  - Histórico completo de ações
  - Botões na toolbar superior

- 💾 **Salvamento**:
  - Salva HTML completo em `customLayout`
  - Salva CSS em `customCSS`
  - Armazena em banco de dados

### Interface

```
┌─────────────────────────────────────────────────────────┐
│  Toolbar: [Voltar] [Modo] [Desktop/Tablet/Mobile]       │
│           [Undo] [Redo] [Preview] [Salvar]              │
├──────────┬─────────────────────────────┬────────────────┤
│ Biblioteca│       Canvas Visual         │  Propriedades  │
│           │                             │                │
│ 📦 Estrutura│  [Arraste componentes]     │  ⚙️ Nenhum     │
│ ✏️ Conteúdo │   [aqui para construir]   │  componente    │
│ 🎨 Blocos  │   [seu site]               │  selecionado   │
│ 📋 Formulários│                           │                │
└──────────┴─────────────────────────────┴────────────────┘
```

### Fluxo de Edição
1. Arrastar componente (ex: Hero Banner)
2. Soltar no canvas
3. Clicar para selecionar
4. Editar propriedades no painel direito
5. Adicionar mais componentes
6. Reordenar conforme necessário
7. Preview em diferentes dispositivos
8. Salvar layout customizado

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `company_sites`

```sql
CREATE TABLE company_sites (
    id TEXT PRIMARY KEY,
    companyId TEXT UNIQUE NOT NULL,
    
    -- Modo de Edição
    editorType TEXT NOT NULL DEFAULT 'simple', -- 'simple' ou 'advanced'
    
    -- Modo Simples
    theme TEXT NOT NULL DEFAULT 'blue',
    primaryColor TEXT,
    secondaryColor TEXT,
    accentColor TEXT,
    heroGradient TEXT NOT NULL DEFAULT 'hero-gradient-1',
    layout TEXT NOT NULL DEFAULT 'modern',
    font TEXT NOT NULL DEFAULT 'modern',
    logo TEXT,
    banner TEXT,
    favicon TEXT,
    heroTitle TEXT,
    heroDescription TEXT,
    aboutText TEXT,
    socialLinks TEXT, -- JSON: { facebook, instagram, whatsapp, ... }
    sections TEXT, -- JSON: [{ id, name, visible, order }]
    
    -- Modo Avançado
    customLayout TEXT, -- HTML completo do layout
    customCSS TEXT,
    
    -- Geral
    slug TEXT UNIQUE,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
);
```

### Exemplos de Dados

#### Modo Simples
```json
{
  "editorType": "simple",
  "theme": "blue",
  "primaryColor": "#4F46E5",
  "layout": "modern",
  "heroTitle": "Bem-vindo à Minha Empresa",
  "sections": [
    { "id": "hero", "name": "Hero", "visible": true, "order": 1 },
    { "id": "products", "name": "Produtos", "visible": true, "order": 2 }
  ]
}
```

#### Modo Avançado
```json
{
  "editorType": "advanced",
  "customLayout": "<div class=\"hero\">...</div><div class=\"features\">...</div>",
  "customCSS": ".hero { background: linear-gradient(...); padding: 6rem 2rem; }",
  "primaryColor": "#8B5CF6"
}
```

---

## 🎭 IndividualMarket - Renderização Dinâmica

### Lógica de Detecção

```javascript
async function loadCompanyData(companyId) {
    const siteConfig = await getCompanySettings(companyId);
    
    if (siteConfig.editorType === 'advanced' && siteConfig.customLayout) {
        renderAdvancedLayout(siteConfig); // Injeta HTML/CSS customizado
    } else {
        renderSimpleLayout(siteConfig); // Usa templates padrão
    }
}
```

### Modo Simples (Template)
- Usa estrutura HTML fixa
- Aplica tema e cores
- Popula com dados da empresa
- Renderiza produtos/serviços

### Modo Avançado (Custom)
- Oculta estrutura padrão
- Injeta `customLayout` (HTML)
- Injeta `customCSS` (estilos)
- Aplica cores do tema
- Layout 100% personalizado

---

## 🔌 API Endpoints

### GET `/api/companies/:id/site`
Retorna configurações do site da empresa

**Response:**
```json
{
  "id": "uuid",
  "companyId": "uuid",
  "editorType": "simple" | "advanced",
  "theme": "blue",
  "customLayout": "...",
  "customCSS": "...",
  ...
}
```

### POST `/api/companies/:id/site`
Cria ou atualiza configurações

**Request Body:**
```json
{
  "editorType": "advanced",
  "customLayout": "<div>...</div>",
  "customCSS": ".my-class { ... }",
  "primaryColor": "#4F46E5"
}
```

### DELETE `/api/companies/:id/site`
Remove configurações do site

### GET `/api/sites/:slug`
Busca site por slug personalizado

### GET `/api/sites`
Lista todos os sites ativos

---

## 🎨 Componentes Disponíveis (Modo Avançado)

### Estrutura
- **Container** - Wrapper com padding e max-width
- **Section** - Seção com padding vertical
- **Columns** - Grid de 2 colunas
- **Grid** - Grid de 3 colunas

### Conteúdo
- **Heading** - Título (h2) customizável
- **Text** - Parágrafo de texto
- **Button** - Botão com gradiente
- **Image** - Imagem responsiva
- **Video** - Embed de vídeo (YouTube)
- **Icon** - Ícone emoji grande

### Blocos Prontos
- **Hero Banner** - Hero com título, descrição e CTA
- **Header** - Cabeçalho com logo e menu
- **Navbar** - Menu de navegação horizontal
- **Features** - Grid de recursos com ícones
- **Testimonials** - Depoimentos de clientes
- **Pricing** - Tabela de preços (2 planos)
- **CTA** - Call-to-action com gradiente
- **Footer** - Rodapé com múltiplas colunas

### Formulários
- **Form** - Formulário completo com validação
- **Input** - Campo de entrada
- **Textarea** - Área de texto multi-linha
- **Select** - Dropdown com opções

---

## 🛠️ Desenvolvimento Futuro

### Melhorias Planejadas
- [ ] Sistema de templates prontos (modo avançado)
- [ ] Editor de propriedades completo por componente
- [ ] Sistema de animações e transições
- [ ] Integração com biblioteca de ícones
- [ ] Sistema de fontes do Google Fonts
- [ ] Biblioteca de gradientes e padrões
- [ ] Sistema de backup e restauração
- [ ] Versionamento de layouts
- [ ] Publicação com um clique
- [ ] Analytics integrado
- [ ] SEO tools
- [ ] Modo escuro/claro

### Componentes Futuros
- [ ] Slider/Carousel de imagens
- [ ] Tabs/Accordion
- [ ] Modal/Dialog
- [ ] Countdown Timer
- [ ] Progress Bar
- [ ] Timeline
- [ ] Map Integration
- [ ] Social Feed
- [ ] Live Chat Widget
- [ ] E-commerce Components

---

## 📊 Comparação dos Modos

| Recurso | Modo Simples | Modo Avançado |
|---------|-------------|---------------|
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Flexibilidade** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Tempo Setup** | 5-15 min | 30-60 min |
| **Conhecimento** | Nenhum | Básico |
| **Templates** | 10 prontos | Ilimitado |
| **Componentes** | Fixos | 25+ arrastavéis |
| **Customização CSS** | ✅ | ✅ |
| **Drag & Drop** | Seções | Tudo |
| **Preview Responsivo** | ❌ | ✅ |
| **Undo/Redo** | ❌ | ✅ |

---

## 🎯 Casos de Uso

### Use Modo Simples quando:
- ✅ Precisa de um site rápido e profissional
- ✅ Não tem conhecimento técnico
- ✅ O template atende suas necessidades
- ✅ Quer apenas personalizar cores e textos
- ✅ Site corporativo padrão

### Use Modo Avançado quando:
- ✅ Precisa de design único e exclusivo
- ✅ Tem necessidades específicas de layout
- ✅ Quer controle total sobre a estrutura
- ✅ Precisa de componentes customizados
- ✅ Site de marketing/landing page complexa

---

## 🚀 Como Testar

1. **Iniciar o servidor**:
```bash
cd servidor
npm run dev
```

2. **Acessar CompanyManagement**:
```
http://localhost:8080/CompanyManagement/index.html
```

3. **Criar/editar empresa** e clicar em "Meu Site"

4. **Escolher modo** na tela de seleção

5. **Criar site**:
   - **Simples**: Personalizar tema, cores, imagens e salvar
   - **Avançado**: Arrastar componentes, montar layout e salvar

6. **Visualizar no IndividualMarket**:
```
http://localhost:8080/IndividualMarket/index.html?company=<ID>
```

---

## 📝 Notas Técnicas

### Sanitização CSS
O sistema sanitiza CSS customizado removendo:
- `javascript:`
- `expression()`
- Tags `<script>`
- `@import`
- Outras potenciais vulnerabilidades

### Validação de Slug
- Apenas letras minúsculas, números e hífens
- Único no sistema
- Gera automaticamente se não fornecido

### Limites
- **Imagens Base64**: 5MB por imagem
- **Payload JSON**: 50MB (Express)
- **Componentes**: Ilimitado (modo avançado)

---

## 🎓 Créditos

Sistema desenvolvido para o projeto **Ascenda** - Plataforma de gestão empresarial completa.

**Versão**: 2.0.0  
**Data**: Novembro 2025  
**Tecnologias**: Node.js, Express, TypeScript, SQLite, Vanilla JS, HTML5, CSS3

---

*Documentação atualizada em 04/11/2025*
