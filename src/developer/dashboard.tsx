import React from 'react';

import DashboardHeader from './pages/header';
import Sidebar from './pages/sidebar';

import './dashboard.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import DataPage from './pages/data';

const Dashboard: React.FC = () => (
  <div className="dashboard-container">
    <Sidebar />
    <div className="dashboard-content">
      <DashboardHeader />
      <Routes>
        <Route path="" element={<div>Bem-vindo ao Dashboard!</div>} />
        <Route path="data" element={<DataPage />} />
        {/* Outras rotas internas do dashboard podem ser adicionadas aqui */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </div>
  </div>
);

export default Dashboard;
