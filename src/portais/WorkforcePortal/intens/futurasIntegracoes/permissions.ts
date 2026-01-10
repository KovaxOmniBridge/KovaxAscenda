import OperationsHub from "../../tools/AtendimentoCliente/gestao/gestaoGeral/OperationsHub";
//import settin from "../../tools/settings/settings";
//import FinanceHub from "../../tools/financeiro/FincanceHub";
import OperationsHubRH from "../../tools/RH/painel";

// Ferramentas disponíveis na plataforma
export type Ferramenta =
  | "settings"
  | "operationsHub"
  | "financeHub"
  | "operationsHubRH";


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
  administrador: ["settings", "operationsHub", "operationsHub", "financeHub", "operationsHubRH"],
  gerente: ["operationsHub", "operationsHubRH"],
  colaborador: [] // sem acesso por padrão
};

// Permissões individuais (override estratégico)
export const permissoesUsuario: PermissoesUsuario = {
  "123": ["settings", "operationsHub", "financeHub", "operationsHubRH"], // exceção explícita
};
