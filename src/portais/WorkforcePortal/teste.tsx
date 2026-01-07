// Dados simulados para uso no dashboard
export const userInitials = "DD";
export const companyName = "Workforce Portal";
export const logoUrl = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/grid.svg"; // ícone como logo
export const messagesCount = 3;
export const pontoStatus = "Disponível";

// Dados do usuário
export const userData = {
  name: "Davi Diniz",
  email: "usuario@email.com",
  role: "Administrador",
  department: "TI"
};

// Contato simulado
export const contact = {
  name: "João Silva",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  lastMessage: "Olá, tudo bem? Preciso de ajuda com o sistema.",
  time: "10:45"
};

// Utilidades simuladas (ferramentas estilo Google)
export const utilities = [
  { name: "Drive", icon: "🗂️" },
  { name: "Docs", icon: "📄" },
  { name: "Sheets", icon: "📊" },
  { name: "Slides", icon: "📽️" },
  { name: "Gmail", icon: "✉️" },
  { name: "Agenda", icon: "📅" },
  { name: "Keep", icon: "📝" },
  { name: "Meet", icon: "🎥" },
  { name: "Sites", icon: "🌐" }
];

// Ferramentas internas da empresa (diferente das utilidades)
export const tools = [
  {
    name: "Recursos Humanos",
    icon: "👥",
    route: "/tools/rh",
    hasPermission: true,
    description: "Gestão de colaboradores, folha de pagamento, benefícios."
  },
  {
    name: "Financeiro",
    icon: "💰",
    route: "/tools/financeiro",
    hasPermission: true,
    description: "Controle de contas, fluxo de caixa, relatórios financeiros."
  },
  {
    name: "Jurídico",
    icon: "⚖️",
    route: "/tools/juridico",
    hasPermission: false,
    description: "Gestão de contratos, processos e documentos jurídicos."
  },
  {
    name: "Projetos",
    icon: "📁",
    route: "/tools/projetos",
    hasPermission: true,
    description: "Acompanhamento de projetos, tarefas e entregas."
  },
  {
    name: "Marketing",
    icon: "📢",
    route: "/tools/marketing",
    hasPermission: false,
    description: "Gestão de campanhas, redes sociais e comunicação."
  }
];

// Conversa simulada
export const conversation = [
  { from: "João Silva", message: "Olá, tudo bem? Preciso de ajuda com o sistema.", time: "10:45" },
  { from: "UN", message: "Oi João! Claro, como posso ajudar?", time: "10:46" }
];
