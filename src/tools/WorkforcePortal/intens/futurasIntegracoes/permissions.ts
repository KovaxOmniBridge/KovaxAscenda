import OperationsHub from "../../tools/callCenter/OperationsHub";
import settin from "../../tools/settings/settings";
import FinanceHub from "../../Hubs/financeiro/FincanceHub";

// Ferramentas disponíveis na plataforma
export type Ferramenta =
  | "settings"
  | "operationsHub"
  | "financeHub";

// Contrato de permissões por cargo
export interface PermissoesCargo {
  [cargo: string]: Ferramenta[];
}

// Contrato de permissões por usuário
export interface PermissoesUsuario {
  [usuarioId: string]: Ferramenta[];
}

// Permissões por cargo (baseline institucional)
export const permissoesCargo: PermissoesCargo = {
  administrador: ["settings", "operationsHub", "operationsHub", "financeHub"],
  gerente: ["operationsHub"],
  colaborador: [] // sem acesso por padrão
};

// Permissões individuais (override estratégico)
export const permissoesUsuario: PermissoesUsuario = {
  "123": ["settings", "operationsHub", "financeHub"], // exceção explícita
};
