import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import ClientList from "./pages/clients/ClientList";
import ClientForm from "./pages/clients/ClientForm";
import UnitList from "./pages/clients/UnitList";
import UnitForm from "./pages/clients/UnitForm";
import ReportClientList from "./pages/reportClients/ReportClientList";
import ReportClientForm from "./pages/reportClients/ReportClientForm";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/:clientId" element={<ClientForm />} />
          <Route path="/clients/:clientId/units" element={<UnitList />} />
          <Route path="/clients/:clientId/units/new" element={<UnitForm />} />
          <Route path="/clients/:clientId/units/:unitId" element={<UnitForm />} />
          <Route path="/report-clients" element={<ReportClientList />} />
          <Route path="/report-clients/new" element={<ReportClientForm />} />
          <Route path="/report-clients/:id" element={<ReportClientForm />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
