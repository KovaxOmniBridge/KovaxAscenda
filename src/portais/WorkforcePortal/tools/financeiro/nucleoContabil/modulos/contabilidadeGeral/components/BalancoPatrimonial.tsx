import React from "react";

const BalancoPatrimonial = () => {
    const totalAtivo = 1500000;
    const totalPassivo = 800000;
    const totalPL = 700000;
    const isBalanced = totalAtivo === (totalPassivo + totalPL);

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Balanço Patrimonial</h3>
                    <p className="text-sm text-slate-500">Posição financeira consolidada em 31/12/2026</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${isBalanced ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                    <span className="text-lg">{isBalanced ? '✓' : '⚠'}</span>
                    {isBalanced ? 'Balanço Fechado' : 'Diferença Encontrada'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 h-full overflow-hidden">
                {/* ATIVO */}
                <div className="balanco-card">
                    <div className="balanco-header ativo">
                        <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">Ativo Total</span>
                        <span className="balanco-total">{totalAtivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="balanco-body">
                        <div className="balanco-group">
                            <div className="balanco-group-title">Ativo Circulante</div>
                            <div className="balanco-item">
                                <span>Caixa e Equivalentes</span>
                                <span>R$ 200.000,00</span>
                            </div>
                            <div className="balanco-item">
                                <span>Contas a Receber</span>
                                <span>R$ 300.000,00</span>
                            </div>
                            <div className="balanco-item">
                                <span>Estoques</span>
                                <span>R$ 0,00</span>
                            </div>
                        </div>

                        <div className="balanco-group">
                            <div className="balanco-group-title">Ativo Não Circulante</div>
                            <div className="balanco-item">
                                <span>Imobilizado</span>
                                <span>R$ 800.000,00</span>
                            </div>
                            <div className="balanco-item">
                                <span>Intangível</span>
                                <span>R$ 200.000,00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PASSIVO + PL */}
                <div className="balanco-card">
                    <div className="balanco-header passivo">
                        <span className="text-sm font-bold text-red-700 uppercase tracking-wide">Passivo + PL</span>
                        <span className="balanco-total">{(totalPassivo + totalPL).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="balanco-body">
                        <div className="balanco-group">
                            <div className="balanco-group-title">Passivo Circulante</div>
                            <div className="balanco-item">
                                <span>Fornecedores</span>
                                <span>R$ 150.000,00</span>
                            </div>
                            <div className="balanco-item">
                                <span>Obrigações Fiscais</span>
                                <span>R$ 50.000,00</span>
                            </div>
                            <div className="balanco-item">
                                <span>Empréstimos CP</span>
                                <span>R$ 0,00</span>
                            </div>
                        </div>

                        <div className="balanco-group">
                            <div className="balanco-group-title">Patrimônio Líquido</div>
                            <div className="balanco-item">
                                <span>Capital Social</span>
                                <span>R$ 500.000,00</span>
                            </div>
                            <div className="balanco-item">
                                <span>Reservas de Lucros</span>
                                <span>R$ 200.000,00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalancoPatrimonial;
