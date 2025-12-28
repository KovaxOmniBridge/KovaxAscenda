import OperationPanel from "../../tools/callCenter/operationalPainel";
import settin from "../../tools/callCenter/operationalPainel";

// Ferramentas disponíveis na plataforma
export type Ferramenta =
  | "settings"
  | "operationalPanel";

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
  administrador: ["settings", "operationalPanel", "operationalPanel"],
  gerente: ["operationalPanel"],
  colaborador: [] // sem acesso por padrão
};

// Permissões individuais (override estratégico)
export const permissoesUsuario: PermissoesUsuario = {
  "123": ["settings", "operationalPanel"], // exceção explícita
};
