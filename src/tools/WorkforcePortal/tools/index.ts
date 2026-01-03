import Settings from "./settings/settings";
import  OperationsHub from "./callCenter/tools/gestorTools/OperationsHub";

export const tools: Record<string, React.FC> = {
  settings: Settings,
  operationsHub: OperationsHub,
};
