import React from 'react';

const FiscalDashboard = () => {
    return (
        <div className="fiscal-dashboard-grid">
            {/* Calendar / Next Obligations */}
            <div className="fiscal-card-simple">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="bg-slate-100 p-1.5 rounded-md text-slate-500 text-sm">🗓️</span>
                        Próximos 7 Dias
                    </h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <span className="block font-bold text-slate-700 text-lg leading-none mb-1">25</span>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Jan</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm font-semibold text-slate-800">PIS/COFINS</span>
                                <span className="text-xs text-red-500 font-medium">Vence Hoje</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors">
                            <div>
                                <span className="block font-bold text-slate-400 text-lg leading-none mb-1">28</span>
                                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Jan</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm font-medium text-slate-600">Fechamento ISS</span>
                                <span className="text-xs text-slate-400">Interno</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <button className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors">Ver Calendário Completo &rarr;</button>
                </div>
            </div>

            {/* Estimated Liabilities */}
            <div className="fiscal-card-simple">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="bg-slate-100 p-1.5 rounded-md text-slate-500 text-sm">💰</span>
                    Provisão de Impostos
                </h3>
                <div className="space-y-5">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-600">IRPJ / CSLL</span>
                            <span className="font-bold text-slate-900">R$ 42.500,00</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: '70%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-600">PIS / COFINS</span>
                            <span className="font-bold text-slate-900">R$ 18.200,00</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-violet-500 h-full rounded-full" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-600">ISSQN Global</span>
                            <span className="font-bold text-slate-900">R$ 5.100,00</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '25%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Access Obligations */}
            <div className="fiscal-card-simple">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-slate-100 p-1.5 rounded-md text-slate-500 text-sm">📂</span>
                    Obrigações Acessórias
                </h3>
                <ul className="space-y-3">
                    <li className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg border border-green-100/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white text-green-600 flex items-center justify-center font-bold text-xs shadow-sm border border-green-100">DCTF</div>
                            <div>
                                <span className="block text-sm font-bold text-slate-800">DCTF Mensal</span>
                                <span className="text-xs text-slate-500">Ref: Dez/2024</span>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-green-700 bg-white px-2 py-1 rounded-full border border-green-100 shadow-sm">Enviada</span>
                    </li>
                    <li className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-100/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white text-amber-600 flex items-center justify-center font-bold text-xs shadow-sm border border-amber-100">EFD</div>
                            <div>
                                <span className="block text-sm font-bold text-slate-800">EFD Contrib.</span>
                                <span className="text-xs text-slate-500">Ref: Dez/2024</span>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-amber-700 bg-white px-3 py-1 rounded-full border border-amber-200 shadow-sm hover:bg-amber-50">Gerar</button>
                    </li>
                    <li className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs group-hover:bg-white group-hover:shadow-sm transition-all">+</div>
                            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-800">Nova Apuração</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default FiscalDashboard;
