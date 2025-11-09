// Constantes da aplicação
export const API_BASE_URL = 'http://localhost:3000/api'

// Categorias de ferramentas disponíveis
export const TOOL_CATEGORIES = {
  LIDERANCA: 'lideranca',
  DIRETORIA: 'diretoria',
  ADMINISTRACAO: 'administracao',
  COORDENACAO: 'coordenacao',
  GERENCIAMENTO: 'gerenciamento',
  SUPERVISAO: 'supervisao',
  OPERACIONAL: 'operacional'
}

export const CATEGORY_NAMES = {
  lideranca: 'Liderança',
  diretoria: 'Diretoria',
  administracao: 'Administração',
  coordenacao: 'Coordenação',
  gerenciamento: 'Gerenciamento',
  supervisao: 'Supervisão',
  operacional: 'Operacional'
}

// Ferramentas disponíveis por categoria
export const TOOLS = {
  lideranca: [
    {
      id: 'visao-estrategica',
      name: 'Visão Estratégica',
      description: 'Dashboard executivo com KPIs estratégicos',
      icon: '📊'
    },
    {
      id: 'planejamento-estrategico',
      name: 'Planejamento Estratégico',
      description: 'Ferramentas de planejamento de longo prazo',
      icon: '🎯'
    }
  ],
  diretoria: [
    {
      id: 'gestao-departamentos',
      name: 'Gestão de Departamentos',
      description: 'Organização e acompanhamento de departamentos',
      icon: '🏢'
    },
    {
      id: 'relatorios-gerenciais',
      name: 'Relatórios Gerenciais',
      description: 'Relatórios consolidados da empresa',
      icon: '📈'
    }
  ],
  administracao: [
    {
      id: 'gestao-equipes',
      name: 'Gestão de Equipes',
      description: 'Criar e gerenciar equipes de trabalho',
      icon: '👥'
    },
    {
      id: 'gestao-squads',
      name: 'Gestão de Squads',
      description: 'Criar e gerenciar squads ágeis',
      icon: '🚀'
    },
    {
      id: 'gestao-setores',
      name: 'Gestão de Setores',
      description: 'Organizar e administrar setores',
      icon: '🏗️'
    },
    {
      id: 'contabilidade',
      name: 'Ferramentas Contábeis',
      description: 'Gestão contábil e financeira',
      icon: '💰'
    },
    {
      id: 'juridico',
      name: 'Ferramentas Jurídicas',
      description: 'Gestão de documentos e processos jurídicos',
      icon: '⚖️'
    }
  ],
  coordenacao: [
    {
      id: 'coordenacao-projetos',
      name: 'Coordenação de Projetos',
      description: 'Gerenciar múltiplos projetos',
      icon: '📋'
    },
    {
      id: 'alocacao-recursos',
      name: 'Alocação de Recursos',
      description: 'Distribuir recursos entre projetos',
      icon: '🔄'
    }
  ],
  gerenciamento: [
    {
      id: 'gestao-tarefas',
      name: 'Gestão de Tarefas',
      description: 'Criar e acompanhar tarefas',
      icon: '✅'
    },
    {
      id: 'graficos-desempenho',
      name: 'Gráficos de Desempenho',
      description: 'Visualização de métricas e KPIs',
      icon: '📊'
    },
    {
      id: 'controle-prazos',
      name: 'Controle de Prazos',
      description: 'Timeline e cronogramas',
      icon: '⏱️'
    }
  ],
  supervisao: [
    {
      id: 'monitoramento-equipe',
      name: 'Monitoramento de Equipe',
      description: 'Acompanhar atividades da equipe',
      icon: '👀'
    },
    {
      id: 'aprovacoes',
      name: 'Sistema de Aprovações',
      description: 'Aprovar ou rejeitar solicitações',
      icon: '✓'
    }
  ],
  operacional: [
    {
      id: 'registro-atividades',
      name: 'Registro de Atividades',
      description: 'Registrar atividades diárias',
      icon: '📝'
    },
    {
      id: 'checklist-tarefas',
      name: 'Checklist de Tarefas',
      description: 'Tarefas operacionais do dia a dia',
      icon: '☑️'
    }
  ]
}
