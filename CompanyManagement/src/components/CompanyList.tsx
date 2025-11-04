import React, { useEffect, useState } from 'react';
import { ICompany } from '../interfaces';
import { CompanyApiService } from '../api/CompanyApiService';
import './CompanyList.css';

interface CompanyListProps {
  onSelectCompany?: (company: ICompany) => void;
  onNewCompany?: () => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({ onSelectCompany, onNewCompany }) => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const apiService = new CompanyApiService();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await apiService.listAll();
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar empresas. Certifique-se de que o servidor está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj.includes(searchTerm)
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVA': return 'status-active';
      case 'SUSPENSA': return 'status-suspended';
      case 'INAPTA': return 'status-inactive';
      case 'BAIXADA': return 'status-closed';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Carregando empresas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="company-list-container">
      <div className="header">
        <h1>Gerenciamento de Empresas</h1>
        <button className="btn-new" onClick={onNewCompany}>
          + Nova Empresa
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nome fantasia, razão social ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="companies-grid">
        {filteredCompanies.length === 0 ? (
          <div className="no-results">
            {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
          </div>
        ) : (
          filteredCompanies.map(company => (
            <div
              key={company.id}
              className="company-card"
              onClick={() => onSelectCompany && onSelectCompany(company)}
            >
              <div className="card-header">
                <h3>{company.nomeFantasia}</h3>
                <span className={`status-badge ${getStatusColor(company.situacaoCadastral)}`}>
                  {company.situacaoCadastral}
                </span>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <span className="label">Razão Social:</span>
                  <span className="value">{company.razaoSocial}</span>
                </div>

                <div className="info-row">
                  <span className="label">CNPJ:</span>
                  <span className="value">{company.cnpj}</span>
                </div>

                <div className="info-row">
                  <span className="label">Porte:</span>
                  <span className="value">{company.porte}</span>
                </div>

                <div className="info-row">
                  <span className="label">Regime:</span>
                  <span className="value">{company.regimeTributario}</span>
                </div>

                <div className="info-row">
                  <span className="label">Cidade/UF:</span>
                  <span className="value">{company.endereco.cidade}/{company.endereco.estado}</span>
                </div>

                <div className="info-row">
                  <span className="label">Data Abertura:</span>
                  <span className="value">{formatDate(company.dataAbertura)}</span>
                </div>
              </div>

              <div className="card-footer">
                <small>Atualizado em: {formatDate(company.updatedAt)}</small>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="footer">
        <span>Total: {filteredCompanies.length} empresa(s)</span>
      </div>
    </div>
  );
};
