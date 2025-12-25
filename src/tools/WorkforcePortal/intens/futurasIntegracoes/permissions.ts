export type Ferramenta = "settings";

export interface PermissoesCargo {
  [cargo: string]: Ferramenta[];
}

export interface PermissoesUsuario {
  [usuarioId: string]: Ferramenta[];
}

// Apenas a ferramenta settings por enquanto
export const permissoesCargo: PermissoesCargo = {
  administrador: ["settings"],
  gerente: ["settings"],
  colaborador: [] // sem acesso
};

// Permissões individuais
export const permissoesUsuario: PermissoesUsuario = {
  "123": ["settings"], // usuário específico com permissão extra
};
