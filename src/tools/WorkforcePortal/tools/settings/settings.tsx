import React, { useState } from "react";
import "./settings.css";

// Importando módulos existentes

// Módulos atuais implementados:

// Gestão Cargos
import ModCargos from "./ambiente/cargos/modCargos";
// Serve para o usuário gerenciar os cargos, permissões, etc.

// Gestão Campanhas Contratações
import ModCampanhas from "./contratacoes/campanhas/modCampanhas";
// Serve para o usuário gerenciar campanhas de contratações de novos profissionais para os cargos.



// Módulos futuros a serem implementados:

// Gestão de usuários WorkforcePortalUsers
// import ModGestaoUsuariosWorkforcePortal from "./gestaoUsuariosWorkforcePortal/modGestaoUsuariosWorkforcePortal";
// Serve para o usuário gerenciar os usuários do Workforce Portal, suas permissões, acessos, contratação, etc.

// Gestão de usuário StakeHolder
// import ModGestaoUsuarioStakeHolder from "./gestaoUsuarioStakeHolder/modGestaoUsuarioStakeHolder";
// Serve para o usuário gerenciar os usuários StakeHolders, suas permissões, acessos, etc.

// Gestão de produtos Marketplace
// import ModGestaoProdutosMarketplace from "./gestaoProdutosMarketplace/modGestaoProdutosMarketplace";
// Serve para o usuário gerenciar os produtos disponíveis no marketplace, adicionar, remover, editar produtos, etc.

// Gestão de campanhas Marketplace
// import ModGestaoCampanhasMarketplace from "./gestaoCampanhasMarketplace/modGestaoCampanhasMarketplace";
// Serve para o usuário gerenciar campanhas de marketing e promoções dentro do marketplace.

// Gestão de auomatizações
// import ModGestaoAutomatizacoes from "./gestaoAutomatizacoes/modGestaoAutomatizacoes";
// Serve para o usuário criar e gerenciar automatizações de processos dentro da plataforma.

// Módulo de integracões
// import ModIntegracoes from "./integracoes/modIntegracoes";
// Serve para o usuário gerenciar integrações com outras plataformas e serviços, como por exemplo integrações com bancos de dados externos.
// Nessa parte podemos fazer ele poder importar um banco de dados único ou por partes, assim como uma configuração mais fácil importando 
// o banco de dados e realizando a norrmalização dos dados automaticamente.

// Gestão da ferramenta de comunicação
// import ModComunicacao from "./comunicacao/modComunicacao";
// Serve para o usuário gerenciar a ferramenta de comunicação interna, como mensagens, notificações, etc.

// Gestão estrutural
// import ModEstrutural from "./estrutural/modEstrutural";
// Unidades, filiais, departamentos, centros de custo assim como patrimonio, envolve toda a parte fisica da empresa.

// Gestão Hirárquica
// import ModHierarquica from "./hierarquica/modHierarquica";
// Serve para o usuário gerenciar a arvore hierárquica da empresa, cargos, relações de subordinação, etc, quais cargos são subordinados a
// quais.

// Gestão de Regras
// import ModRegras from "./regras/modRegras";
// Serve para definir regras globais, como Política de senha, Sessões simultâneas, Tempo de expiração, Bloqueio por região/IP.

// ModAmbientes
// import ModAmbientes from "./ambientes/modAmbientes";
// Configuração por ambiente: Produção, Homologação, Treinamento, Regras diferentes por ambiente, Simulação segura.

// Operações
// import ModOperacoes from "./operacoes/modOperacoes";
// Para cada serviço oferecido podem ser organizadas operações com base nela, nas configurações é possível definir quais ferramentas 
// aquela operação terá acesso, uma operação também pode estar ligada a mais de um serviço e a mais de um produto uma operação pode estar
//  


//Estilização de portais:

// Marketplace
// import ModStyleMarketplace from "./styleMarketplace/modStyleMarketplace";
// Serve para o usuário definir a aparência do marketplace

// StakeHolder
// import ModStyleStakeHolder from "./styleStakeHolder/modStyleStakeHolder";
// Serve para o usuário definir a aparência dos portais dos StakeHolders de acordo com o stakeholder selecionado
// o que ele verá, ao que ele terá acesso, etc.

// ClientePortal
// import ModStyleClientePortal from "./styleClientePortal/modStyleClientePortal";
// Serve para o usuário definir a aparência do portal do cliente final, seus conteúdos e páginas.



// Tipos de páginas internas
type PageType = "dashboard" | "cargos" | "campanhas" | "styleMarketplace" | "produtosMarketplace";

// Interface de botão
interface NavButton {
  label: string;
  page: PageType;
  permissionKey: string; // chave para controle de permissão
  icon: JSX.Element; // ícone do card
}

// Mock de permissões do usuário
const userPermissions: string[] = ["dashboard", "cargos", "campanhas", "styleMarketplace", "produtosMarketplace"];

// Futuramente isso virá do backend ou banco de dados

// Componente Dashboard interno
const Dashboard: React.FC = () => <div>Bem-vindo ao Dashboard</div>;

// Exemplo de ícones simples (pode substituir por SVG ou biblioteca de ícones)
const DashboardIcon = () => <span role="img" aria-label="dashboard">📊</span>;
const CargosIcon = () => <span role="img" aria-label="cargos">👥</span>;
const CampanhasIcon = () => <span role="img" aria-label="campanhas">📣</span>;
const StyleMarketplaceIcon = () => <span role="img" aria-label="styleMarketplace">🎨</span>;
const ProdutosMarketplaceIcon = () => <span role="img" aria-label="produtosMarketplace">📦</span>;

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>("dashboard");

  const navButtons: NavButton[] = [
    { label: "Dashboard", page: "dashboard", permissionKey: "dashboard", icon: <DashboardIcon /> },
    { label: "Cargos", page: "cargos", permissionKey: "cargos", icon: <CargosIcon /> },
    { label: "Campanhas", page: "campanhas", permissionKey: "campanhas", icon: <CampanhasIcon /> },
    { label: "Style Marketplace", page: "styleMarketplace", permissionKey: "styleMarketplace", icon: <StyleMarketplaceIcon /> },
    { label: "Produtos Marketplace", page: "produtosMarketplace", permissionKey: "produtosMarketplace", icon: <ProdutosMarketplaceIcon /> },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "cargos":
        return <ModCargos />;
      case "campanhas":
        return <ModCampanhas />;
      default:
        return <div>Página não encontrada</div>;
    }
  };

  const hasPermission = (key: string) => userPermissions.includes(key);

  return (
    <div className="app-container">
      {/* Header como área de cards */}
      <header className="app-header-cards">
        {navButtons.map(
          (btn) =>
            hasPermission(btn.permissionKey) && (
              <div
                key={btn.page}
                className="card-button"
                onClick={() => setActivePage(btn.page)}
              >
                <div className="card-icon">{btn.icon}</div>
                <div className="card-label">{btn.label}</div>
              </div>
            )
        )}
      </header>

      {/* Área de renderização interna */}
      <main className="app-content">{renderPage()}</main>
    </div>
  );
};

export default App;
