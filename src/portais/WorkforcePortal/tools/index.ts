//import Settings from "./settings/settings";
import OperationsHub from "./AtendimentoCliente/gestao/gestaoGeral/OperationsHub";
//import FinanceHub from "./financeiro/FincanceHub";
import OperationsHubRH from "./RH/painel";
import NucleoContabilPanel from "./financeiro/nucleoContabil/painel";


export const tools: Record<string, React.FC> = {
  //settings: Settings,
  operationsHub: OperationsHub,
  //financeHub: FinanceHub,
  nucleoContabil: NucleoContabilPanel,
  operationsHubRH: OperationsHubRH,
};
