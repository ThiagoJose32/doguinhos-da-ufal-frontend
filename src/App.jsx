import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import AnimalsPage from "./pages/Animals/AnimalsPage";
import AnimalDetailsPage from "./pages/Animals/AnimalDetailsPage";
import FinancePage from "./pages/Finance/FinancePage";
import VolunteersPage from "./pages/Volunteers/VolunteersPage";
import SettingsPage from "./pages/Settings/SettingsPage";

function ProtectedRoute() {
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="animals" replace />} />
            <Route path="animals" element={<AnimalsPage />} />
            <Route path="animals/:id" element={<AnimalDetailsPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="volunteers" element={<VolunteersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}