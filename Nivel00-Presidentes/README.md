# 👑 Nível 0 - Presidentes

## 📋 Visão Geral

Interfaces executivas para o nível hierárquico mais alto da organização.

**Acesso:** Restrito a usuários com `nivel = 0`

---

## 📄 Arquivos

### Dashboards
- `dashboard-presidentes.*` - Dashboard executivo principal
- `aprovacoes.*` - Gestão de aprovações e solicitações
- `estrutura.*` - Visualização da estrutura organizacional
- `relatorios.*` - Relatórios, KPIs e análises executivas

**Total:** 4 interfaces × 3 arquivos (HTML, CSS, JS) = 12 arquivos

---

## 🎯 Funcionalidades

### 📊 Dashboard Principal
- KPIs executivos em tempo real
- Visão geral de squads ativos
- Metas estratégicas e progresso
- Aprovações urgentes
- Alertas e insights executivos

### ✅ Aprovações
- Visualizar solicitações pendentes
- Aprovar/rejeitar com justificativa
- Filtrar por tipo e prioridade
- Histórico completo de decisões

### 🏢 Estrutura Organizacional
- Visualização hierárquica completa
- Distribuição por níveis (0-7)
- Squads e chapters ativos
- Métricas organizacionais detalhadas

### 📈 Relatórios
- KPIs financeiros e operacionais
- Gráficos de performance
- Análise de departamentos
- Insights automatizados com IA
- Exportação em múltiplos formatos

---

## 🔧 Dependências

Todos os dashboards dependem dos arquivos compartilhados em `/shared`:

```html
<script src="../shared/session-manager.js"></script>
<script src="../shared/dev-session-handler.js"></script>
<script src="../shared/dashboard-common.js"></script>
<script src="../shared/dev-mode-indicator.js"></script>
```

---

## 🔐 Proteção de Acesso

Acesso protegido em múltiplas camadas:

1. **Verificação de nível:** Apenas `nivel = 0`
2. **Token JWT:** Validado no backend
3. **Session Manager:** Gerencia sessões e isolamento
4. **God Mode:** Desenvolvedores acessam via impersonation

---

## 📊 Estatísticas de Código

| Arquivo | Linhas | Tamanho |
|---------|--------|---------|
| dashboard-presidentes.js | 566 | 22 KB |
| aprovacoes.js | 441 | 17 KB |
| relatorios.js | 359 | 14 KB |
| estrutura.js | 243 | 10 KB |
| **Total JS** | **1.609** | **63 KB** |

---

## 👨‍💻 Desenvolvido por

Equipe Ascenda Flex  
Data: Novembro 2025
