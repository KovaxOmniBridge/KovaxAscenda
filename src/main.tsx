import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PortalAscenda from './pages/portalAscenda';
import Dashboard from './developer/dashboard';
import Marketplace from './tools/Marketplace/index';
import WorkforceDashboard from './tools/WorkforcePortal/dashboard';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/portal" replace />} />
				<Route path="/portal" element={<PortalAscenda />} />
				{/* Outras rotas aqui */}
				<Route path="/developer/dashboard/*" element={<Dashboard />} />
				<Route path="/tools/Marketplace/*" element={<Marketplace />} />
				<Route path="/tools/WorkforcePortal/dashboard/*" element={<WorkforceDashboard />} />
			</Routes>
		</BrowserRouter>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
