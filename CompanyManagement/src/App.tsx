import React, { useState } from 'react';
import { CompanyList } from './components/CompanyList';
import { ICompany } from './interfaces';

export const App: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);

  const handleSelectCompany = (company: ICompany) => {
    console.log('Empresa selecionada:', company);
    setSelectedCompany(company);
    // Aqui você pode redirecionar para a tela de edição
  };

  const handleNewCompany = () => {
    console.log('Nova empresa');
    // Aqui você pode redirecionar para a tela de cadastro
  };

  return (
    <div className="app">
      <CompanyList 
        onSelectCompany={handleSelectCompany}
        onNewCompany={handleNewCompany}
      />
    </div>
  );
};
