import Settings from "./settings/settings";
import  OperationPanel from "./callCenter/operationalPainel";

export const tools: Record<string, React.FC> = {
  settings: Settings,
  operationalPanel: OperationPanel,
};
