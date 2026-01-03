import OperationsHub from "../../tools/callCenter/OperationsHub";
import settin from "../../tools/settings/settings";

// Ferramentas disponíveis na plataforma
export type Ferramenta =
  | "settings"
  | "operationsHub";

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
  administrador: ["settings", "operationsHub", "operationsHub"],
  gerente: ["operationsHub"],
  colaborador: [] // sem acesso por padrão
};

// Permissões individuais (override estratégico)
export const permissoesUsuario: PermissoesUsuario = {
  "123": ["settings", "operationsHub"], // exceção explícita
};
