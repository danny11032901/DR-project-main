import { Route, Routes } from "react-router-dom";
import { AnalyzePage } from "./pages/Analyze";
import { DashboardPage } from "./pages/Dashboard";
import { LandingPage } from "./pages/Landing";
import { LoginPage } from "./pages/Login";
import { PatientDetailPage } from "./pages/PatientDetail";
import { PatientsPage } from "./pages/Patients";
import { ReportsPage } from "./pages/Reports";
import { SettingsPage } from "./pages/Settings";

export function App(): JSX.Element {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}
