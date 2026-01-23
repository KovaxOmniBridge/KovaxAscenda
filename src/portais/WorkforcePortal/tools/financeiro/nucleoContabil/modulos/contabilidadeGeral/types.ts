export type NaturezaConta = "D" | "C"; // Devedora | Credora
export type TipoConta = "SINTETICA" | "ANALITICA";

export interface ContaContabil {
    id: string;
    codigo: string; // ex: "1.1.01.0001"
    descricao: string;
    natureza: NaturezaConta;
    tipo: TipoConta;
    nivel: number;
    saldoAtual: number;
    paiId?: string | null;
    filhos?: ContaContabil[];
}

export interface LancamentoContabil {
    id: string;
    data: string;
    contaDebitoId: string;
    contaCreditoId: string;
    valor: number;
    historico: string;
}
