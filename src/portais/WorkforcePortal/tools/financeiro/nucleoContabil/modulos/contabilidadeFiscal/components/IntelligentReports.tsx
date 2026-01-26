import React, { useState } from 'react';
import '../contabilidadeFiscal.css';

const IntelligentReports = () => {
    const [insights] = useState([
        {
            id: '1',
            type: 'optimization',
            title: 'Oportunidade de Economia Fiscal',
            description: 'Identificamos R$ 45.000 em potencial economia através da otimização de créditos de ICMS não aproveitados.',
            impact: 'high',
            confidence: 92,
            icon: '💡'
        },
        {
            id: '2',
            type: 'alert',
            title: 'Tendência de Aumento de Carga Tributária',
            description: 'A carga tributária aumentou 8% nos últimos 3 meses. Recomendamos revisão das operações.',
            impact: 'medium',
            confidence: 87,
            icon: '⚠️'
        },
        {
            id: '3',
            type: 'prediction',
            title: 'Previsão de Impostos - Próximo Trimestre',
            description: 'Baseado no histórico, estimamos R$ 280.000 em impostos para Q2/2026.',
            impact: 'low',
            confidence: 78,
            icon: '🔮'
        },
        {
            id: '4',
            type: 'recommendation',
            title: 'Sugestão de Regime Tributário',
            description: 'A mudança para Lucro Real pode resultar em economia de 12% anual.',
            impact: 'high',
            confidence: 85,
            icon: '🎯'
        }
    ]);

    const getImpactColor = (impact: string) => {
        const colors: Record<string, string> = {
            high: 'bg-red-100 text-red-700 border-red-200',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            low: 'bg-blue-100 text-blue-700 border-blue-200'
        };
        return colors[impact] || colors.low;
    };

    const getImpactLabel = (impact: string) => {
        const labels: Record<string, string> = {
            high: 'Alto Impacto',
            medium: 'Médio Impacto',
            low: 'Baixo Impacto'
        };
        return labels[impact] || 'Impacto Desconhecido';
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-6 p-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🤖</span>
                    <h3 className="text-2xl font-bold">Relatórios Inteligentes</h3>
                </div>
                <p className="text-violet-100">Insights automáticos, análises preditivas e recomendações personalizadas com IA.</p>
            </div>

            {/* KPIs Inteligentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Economia Potencial', value: 'R$ 45.000', trend: '+12%', icon: '💰', color: 'green' },
                    { label: 'Carga Tributária', value: '32.5%', trend: '+8%', icon: '📊', color: 'red' },
                    { label: 'Conformidade', value: '98%', trend: '+2%', icon: '✅', color: 'green' },
                    { label: 'Risco Fiscal', value: 'Baixo', trend: '-15%', icon: '🛡️', color: 'blue' }
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{kpi.icon}</span>
                            <span className={`text-xs font-semibold ${kpi.color === 'green' ? 'text-green-600' : kpi.color === 'red' ? 'text-red-600' : 'text-blue-600'}`}>
                                {kpi.trend}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
                        <p className="text-sm text-slate-500">{kpi.label}</p>
                    </div>
                ))}
            </div>

            {/* Insights e Recomendações */}
            <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Insights e Recomendações</h4>
                <div className="space-y-4">
                    {insights.map((insight) => (
                        <div
                            key={insight.id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                                    {insight.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h5 className="text-lg font-bold text-slate-800">{insight.title}</h5>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImpactColor(insight.impact)}`}>
                                            {getImpactLabel(insight.impact)}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 mb-4">{insight.description}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-500">Confiança:</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                                                        style={{ width: `${insight.confidence}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700">{insight.confidence}%</span>
                                            </div>
                                        </div>
                                        <button className="ml-auto px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Análise de Tendências */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4">Análise de Tendências</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">📈</span>
                            <h5 className="font-semibold text-slate-800">Evolução da Carga Tributária</h5>
                        </div>
                        <div className="h-32 bg-gradient-to-t from-violet-100 to-transparent rounded flex items-end justify-center">
                            <p className="text-sm text-slate-500 mb-2">Gráfico de tendência (mock)</p>
                        </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🎯</span>
                            <h5 className="font-semibold text-slate-800">Oportunidades por Categoria</h5>
                        </div>
                        <div className="space-y-2">
                            {[
                                { category: 'Créditos ICMS', value: 65 },
                                { category: 'Incentivos Fiscais', value: 45 },
                                { category: 'Planejamento Tributário', value: 30 }
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">{item.category}</span>
                                        <span className="font-semibold text-slate-800">{item.value}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntelligentReports;
