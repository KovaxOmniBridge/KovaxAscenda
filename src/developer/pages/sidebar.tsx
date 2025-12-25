import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style/sidebar.css';


const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`dashboard-sidebar sidebar-capsule ${collapsed ? 'collapsed' : ''}`}
    >
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          ☰
        </button>

        {!collapsed && (
          <div className="sidebar-brand">
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/developer/dashboard"
          className={isActive('/developer/dashboard') ? 'active' : ''}
        >
          <span className="icon">🏠</span>
          {!collapsed && <span className="label">Dashboard</span>}
        </Link>

        <Link
          to="/developer/dashboard/data"
          className={isActive('/developer/dashboard/data') ? 'active' : ''}
        >
          <span className="icon">📊</span>
          {!collapsed && <span className="label">Dados</span>}
        </Link>

        <Link
          to="/developer/dashboard/profile"
          className={isActive('/developer/dashboard/profile') ? 'active' : ''}
        >
          <span className="icon">👤</span>
          {!collapsed && <span className="label">Perfil</span>}
        </Link>

        <Link
          to="/developer/dashboard/settings"
          className={isActive('/developer/dashboard/settings') ? 'active' : ''}
        >
          <span className="icon">⚙️</span>
          {!collapsed && <span className="label">Configurações</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
