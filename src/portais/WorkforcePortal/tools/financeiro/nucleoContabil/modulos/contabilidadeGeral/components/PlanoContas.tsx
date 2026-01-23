import React, { useState } from "react";
import { ContaContabil } from "../types";

// Mock Data
const MOCK_PLANO_CONTAS: ContaContabil[] = [
    {
        id: "1", codigo: "1", descricao: "ATIVO", natureza: "D", tipo: "SINTETICA", nivel: 1, saldoAtual: 1000000, filhos: [
            {
                id: "1.1", codigo: "1.1", descricao: "ATIVO CIRCULANTE", natureza: "D", tipo: "SINTETICA", nivel: 2, saldoAtual: 500000, filhos: [
                    {
                        id: "1.1.1", codigo: "1.1.1", descricao: "Disponibilidades", natureza: "D", tipo: "SINTETICA", nivel: 3, saldoAtual: 100000, filhos: [
                            { id: "1.1.1.01", codigo: "1.1.1.01", descricao: "Caixa Geral", natureza: "D", tipo: "ANALITICA", nivel: 4, saldoAtual: 20000 }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2", codigo: "2", descricao: "PASSIVO", natureza: "C", tipo: "SINTETICA", nivel: 1, saldoAtual: 1000000, filhos: []
    }
];

const RowConta = ({ conta, level }: { conta: ContaContabil; level: number }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = conta.filhos && conta.filhos.length > 0;
    const isSynthetic = conta.tipo === 'SINTETICA';

    return (
        <>
            <tr className={isSynthetic ? 'conta-row-synthetic' : ''}>
                <td className="conta-code">
                    {conta.codigo}
                </td>
                <td>
                    <div style={{ paddingLeft: `${(level - 1) * 20}px` }} className="flex items-center gap-2">
                        {hasChildren ? (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="w-5 h-5 flex items-center justify-center text-[10px] text-gray-500 hover:bg-gray-200 rounded transition-colors"
                            >
                                {expanded ? "▼" : "▶"}
                            </button>
                        ) : (
                            <span className="w-5" />
                        )}
                        <span className={level === 1 ? 'uppercase tracking-wide' : ''}>
                            {conta.descricao}
                        </span>
                    </div>
                </td>
                <td className="text-center">
                    <span className={`natureza-badge ${conta.natureza === 'D' ? 'natureza-d' : 'natureza-c'}`}>
                        {conta.natureza}
                    </span>
                </td>
                <td className="conta-value">
                    {conta.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
            </tr>
            {expanded && hasChildren && conta.filhos!.map(filho => (
                <RowConta key={filho.id} conta={filho} level={level + 1} />
            ))}
        </>
    );
};

const PlanoContas = () => {
    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Plano de Contas</h3>
                    <p className="text-sm text-slate-500">Mantenha a hierarquia das contas contábeis da organização.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:border-slate-300 font-medium shadow-sm transition-all">
                        Exportar Excel
                    </button>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium shadow-sm transition-all flex items-center gap-1">
                        <span>+</span> Nova Conta
                    </button>
                </div>
            </div>

            <div className="conta-table-container flex-1 overflow-auto">
                <table className="conta-table">
                    <thead className="sticky top-0 z-10">
                        <tr>
                            <th className="w-40">Código</th>
                            <th>Descrição</th>
                            <th className="w-24 text-center">Natureza</th>
                            <th className="w-40 text-right">Saldo (BRL)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_PLANO_CONTAS.map(conta => (
                            <RowConta key={conta.id} conta={conta} level={1} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PlanoContas;
