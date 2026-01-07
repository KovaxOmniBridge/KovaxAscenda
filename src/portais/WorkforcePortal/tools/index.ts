import Settings from "./settings/settings";
import  OperationsHub from "./AtendimentoCliente/tools/gestorTools/OperationsHub";
import FinanceHub from "./financeiro/FincanceHub";

export const tools: Record<string, React.FC> = {
  settings: Settings,
  operationsHub: OperationsHub,
  financeHub: FinanceHub,
};
