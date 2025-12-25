import React from 'react';
import { Link } from 'react-router-dom';

import './style/header.css';

const DashboardHeader: React.FC = () => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="header-brand">
          <span className="brand-icon">🔥</span>
          <div className="brand-text">
            <strong>Ascenda</strong>
            <span>Developer Dashboard</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <nav className="header-nav">
          <Link to="/" className="header-link">Home</Link>
          <Link to="/logout" className="header-link logout">Sair</Link>
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
