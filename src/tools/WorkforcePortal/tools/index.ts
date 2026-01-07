import Settings from "./settings/settings";
import  OperationsHub from "./callCenter/tools/gestorTools/OperationsHub";
import FinanceHub from "../Hubs/financeiro/FincanceHub";

export const tools: Record<string, React.FC> = {
  settings: Settings,
  operationsHub: OperationsHub,
  financeHub: FinanceHub,
};
