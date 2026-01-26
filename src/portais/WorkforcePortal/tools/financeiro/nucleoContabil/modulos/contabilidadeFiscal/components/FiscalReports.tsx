import React, { useState } from 'react';
import './styles/FiscalReports.css';

const FiscalReports = () => {
    const [reports] = useState([
        {
            id: 'apuracao-icms',
            name: 'Apuração de ICMS',
            description: 'Relatório de apuração mensal do ICMS',
            category: 'Impostos',
            icon: '📊',
            formats: ['PDF', 'Excel', 'XML']
        },
        {
            id: 'apuracao-iss',
            name: 'Apuração de ISS',
            description: 'Relatório de apuração mensal do ISS',
            category: 'Impostos',
            icon: '📈',
            formats: ['PDF', 'Excel']
        },
        {
            id: 'livro-fiscal',
            name: 'Livro Fiscal Digital',
            description: 'Registro completo de operações fiscais',
            category: 'Livros',
            icon: '📚',
            formats: ['PDF', 'XML']
        },
        {
            id: 'sped-fiscal',
            name: 'SPED Fiscal',
            description: 'Sistema Público de Escrituração Digital',
            category: 'Obrigações',
            icon: '🗂️',
            formats: ['TXT', 'XML']
        },
        {
            id: 'dctf',
            name: 'DCTF',
            description: 'Declaração de Débitos e Créditos Tributários Federais',
            category: 'Obrigações',
            icon: '📋',
            formats: ['PDF', 'XML']
        },
        {
            id: 'resumo-tributario',
            name: 'Resumo Tributário',
            description: 'Consolidação de todos os impostos do período',
            category: 'Resumos',
            icon: '📑',
            formats: ['PDF', 'Excel']
        }
    ]);

    return (
    <div className="fiscal-reports">

        {/* Header */}
        <div className="fiscal-reports-header">
        <h3>Relatórios Fiscais</h3>
        <p>
            Gere relatórios fiscais, apurações e livros contábeis em diversos formatos.
        </p>
        </div>

        {/* Filtros */}
        <div className="fiscal-reports-filters">
        <div className="filters-group">

            <div className="filter-period">
            <label>Período</label>
            <div className="period-inputs">
                <input type="date" />
                <span>até</span>
                <input type="date" />
            </div>
            </div>

            <div className="filter-category">
            <select>
                <option value="">Todas as Categorias</option>
                <option value="impostos">Impostos</option>
                <option value="livros">Livros</option>
                <option value="obrigacoes">Obrigações</option>
                <option value="resumos">Resumos</option>
            </select>
            </div>

        </div>
        </div>

        {/* Grid de Relatórios */}
        <div className="fiscal-reports-grid">
        {reports.map(report => (
            <div key={report.id} className="fiscal-report-card">

            <div className="report-header">
                <span className="report-icon">{report.icon}</span>
                <div className="report-info">
                <h4>{report.name}</h4>
                <p>{report.description}</p>
                </div>
            </div>

            <div className="report-category">
                <span>{report.category}</span>
            </div>

            <div className="report-formats">
                <p>Formatos disponíveis</p>
                <div className="formats-list">
                {report.formats.map(format => (
                    <span key={format}>{format}</span>
                ))}
                </div>
            </div>

            <div className="report-actions">
                <button>Gerar</button>
                <button>👁️</button>
            </div>

            </div>
        ))}
        </div>

        {/* Relatórios Recentes */}
        <div className="fiscal-reports-recent">
        <h4>Relatórios Gerados Recentemente</h4>

        <div className="recent-list">
            {[
            { name: 'Apuração de ICMS - Janeiro 2026', date: '25/01/2026', format: 'PDF', size: '2.3 MB' },
            { name: 'SPED Fiscal - Dezembro 2025', date: '20/01/2026', format: 'XML', size: '5.1 MB' },
            { name: 'Resumo Tributário - Q4 2025', date: '15/01/2026', format: 'Excel', size: '1.8 MB' }
            ].map((recent, idx) => (
            <div key={idx} className="recent-item">
                <div className="recent-info">
                <span className="recent-icon">📄</span>
                <div>
                    <p>{recent.name}</p>
                    <span>
                    {recent.date} • {recent.format} • {recent.size}
                    </span>
                </div>
                </div>
                <button>Download</button>
            </div>
            ))}
        </div>
        </div>

    </div>
    );

};

export default FiscalReports;
