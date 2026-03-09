/**
 * @file App.tsx
 * @description Root Component for CDIF Interactive Topology Dashboard V2
 * Injects routing Context and defines global motion variants.
 * @author Mission Control
 */

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/Dashboard';
import ArchitecturePage from './pages/Architecture';
import AuditPage from './pages/Audit';
import './index.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/telemetry" replace />} />
          <Route path="telemetry" element={<DashboardPage />} />
          <Route path="topology" element={<ArchitecturePage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="*" element={<Navigate to="/telemetry" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
