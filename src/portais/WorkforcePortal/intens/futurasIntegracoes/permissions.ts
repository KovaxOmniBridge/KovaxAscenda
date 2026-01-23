import OperationsHub from "../../tools/AtendimentoCliente/gestao/gestaoGeral/OperationsHub";
import OperationsHubRH from "../../tools/RH/painel";
import NucleoContabilPanel from "../../tools/financeiro/nucleoContabil/painel";

// Ferramentas disponíveis na plataforma
export type Ferramenta =
  | "operationsHub"
  | "operationsHubRH"
  | "nucleoContabil";


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
  administrador: [ "operationsHub", "operationsHub", "nucleoContabil"],
  gerente: ["operationsHub", "operationsHubRH", "nucleoContabil"],
  colaborador: [] // sem acesso por padrão
};

// Permissões individuais (override estratégico)
export const permissoesUsuario: PermissoesUsuario = {
  "123": [ "operationsHub", "operationsHubRH", "nucleoContabil"], // exceção explícita
};
