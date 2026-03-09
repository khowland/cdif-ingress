/**
 * @file App.tsx
 * @module CDIF/App
 * @description Root component for the Clinical Data Ingress Fabric (CDIF) interactive dashboard.
 *
 * Injects the HashRouter context and defines all top-level route mappings.
 * Uses hash-based routing so the built static bundle is served correctly from
 * GitHub Pages without server-side rewrite rules.
 *
 * [Lo] Logic invariants:
 *   - All routes are children of the single AppLayout outlet — no route renders outside the shell.
 *   - The index route redirects to '/overview' so the app is never rendered in a blank state.
 *   - Wildcard ('*') also redirects to '/overview', guaranteeing every unknown hash resolves.
 *   - Import paths for page components must stay in sync with filenames in src/pages/.
 */

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout     from './layouts/AppLayout';
import LandingPage   from './pages/Landing';
import DashboardPage from './pages/Dashboard';
import TopologyPage  from './pages/Topology';
import AuditPage     from './pages/Audit';
import './index.css';

/**
 * App root component.
 *
 * Wraps the entire application in a HashRouter and declares the route tree:
 * - /overview   → LandingPage   (Clinical Data Ingress Fabric overview)
 * - /telemetry  → DashboardPage (real-time telemetry stream)
 * - /topology   → TopologyPage  (five-vector pipeline topology)
 * - /audit      → AuditPage     (system audit log and cluster metrics)
 *
 * [Lo] Route path strings must exactly match the `path` values in AppLayout NAV_ITEMS
 *      to ensure nav link active-state highlighting is consistent with rendered content.
 *
 * @returns {JSX.Element} The fully routed CDIF application tree.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview"  element={<LandingPage />} />
          <Route path="telemetry" element={<DashboardPage />} />
          <Route path="topology"  element={<TopologyPage />} />
          <Route path="audit"     element={<AuditPage />} />
          <Route path="*"         element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
